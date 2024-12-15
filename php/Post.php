<?php
class Post {
    private $conn;
    private $table_name = "posts";

    public $id;
    public $title;
    public $content;
    public $user_id;
    public $categories;

    public function __construct($db) {
        $this->conn = $db;
    }

    private function create() {
        try {
            $this->conn->beginTransaction();

            $query = "INSERT INTO " . $this->table_name . " SET title=:title, content=:content, user_id=:user_id";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":content", $this->content);
            $stmt->bindParam(":user_id", $this->user_id);

            if (!$stmt->execute()) {
                throw new Exception("Error al crear el post.");
            }

            $postId = $this->conn->lastInsertId();

            $categories = explode(",", $this->categories);
            $categories = array_map('trim', $categories);

            foreach ($categories as $category) {
                if (empty($category)) continue;

                $query = "SELECT name FROM categories WHERE name = :name";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":name", $category);
                $stmt->execute();

                if ($stmt->rowCount() === 0) {
                    $query = "INSERT INTO categories (name) VALUES (:name)";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(":name", $category);

                    if (!$stmt->execute()) {
                        throw new Exception("Error al crear la categoría '$category'.");
                    }
                }

                $query = "INSERT INTO post_categories (post_id, category_id) VALUES (:post_id, :category_id)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":post_id", $postId);
                $stmt->bindParam(":category_id", $category);

                if (!$stmt->execute()) {
                    throw new Exception("Error al relacionar el post con la categoría '$category'.");
                }
            }

            $this->conn->commit();

            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            error_log("Error al crear el post: " . $e->getMessage());
            throw new Exception($e);
            return false;
        }
    }

    public function readAll() {
        $query = "SELECT p.id, p.title, p.content, u.username 
                  FROM " . $this->table_name . " p 
                  JOIN users u ON p.user_id = u.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create_post(){
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Debe iniciar sesión para publicar.']);
            exit;
        }

        $this->title = $_POST['title'];
        $this->content = $_POST['content'];
        $this->user_id = $_SESSION['user_id'];
        $this->categories = $_POST['categorias'];

        if ($this->create()) {
            echo json_encode(['status' => 'success', 'message' => 'Publicación creada.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al crear publicación.']);
        }
        exit;
    }

    public function like_post(){
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Debe iniciar sesión para dar like.']);
            exit;
        }

        $postId = $_POST['post_id'];
        $userId = $_SESSION['user_id'];

        $queryCheck = "SELECT * FROM votes WHERE post_id = :post_id AND user_id = :user_id";
        $stmtCheck = $this->conn->prepare($queryCheck);
        $stmtCheck->bindParam(':post_id', $postId);
        $stmtCheck->bindParam(':user_id', $userId);
        $stmtCheck->execute();

        if ($stmtCheck->rowCount() > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Ya diste like a esta publicación.']);
            exit;
        }

        $queryInsert = "INSERT INTO votes (post_id, user_id) VALUES (:post_id, :user_id)";
        $stmtInsert = $this->conn->prepare($queryInsert);
        $stmtInsert->bindParam(':post_id', $postId);
        $stmtInsert->bindParam(':user_id', $userId);

        if ($stmtInsert->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Like añadido.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se ha añadido el like']);
        }
        exit;
    }

    public function fetch_post() {
        $categories = isset($_POST['categories']) ? $_POST['categories'] : '';

        $query = "
            SELECT DISTINCT p.id, p.title, p.content, u.username
            FROM posts p
            INNER JOIN users u ON p.user_id = u.id
        ";

        $categoriesArray = [];
        if (!empty($categories)) {
            $categoriesArray = array_map('trim', explode(',', $categories));
            $placeholders = implode(',', array_fill(0, count($categoriesArray), '?'));

            $query .= "
                INNER JOIN post_categories pc ON p.id = pc.post_id
                INNER JOIN categories c ON pc.category_id = c.id
                WHERE c.name IN ($placeholders)
            ";
        }

        $query .= " 
            GROUP BY p.id 
            ORDER BY p.id DESC
        ";

        $stmt = $this->conn->prepare($query);

        if (!empty($categoriesArray)) {
            foreach ($categoriesArray as $index => $category) {
                $stmt->bindValue($index + 1, $category);
            }
        }
        $stmt->execute();

        $posts = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $posts[] = [
                'id' => $row['id'],
                'title' => htmlspecialchars($row['title']),
                'content' => htmlspecialchars($row['content']),
                'username' => htmlspecialchars($row['username']),
            ];
        }

        echo json_encode(['status' => 'success', 'posts' => $posts]);
        exit;
    }

}
