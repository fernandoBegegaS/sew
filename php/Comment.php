<?php
class Comment {
    private $conn;
    private $table_name = "comments";

    

    public function __construct($db) {
        $this->conn = $db;
    }

    public function fetchComments() {
        $postId = $_POST['post_id'];
            $query = "
                    SELECT c.content, u.username 
                    FROM comments c 
                    INNER JOIN users u ON c.user_id = u.id 
                    WHERE c.post_id = :post_id
            ";
            $stmt =  $this->conn->prepare($query);
            $stmt->bindParam(':post_id', $postId);
            $stmt->execute();

            $comments = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $comments[] = [
                    'content' => htmlspecialchars($row['content']),
                    'username' => htmlspecialchars($row['username']),
                ];
            }

            echo json_encode(['status' => 'success', 'comments' => $comments]);
    }

    public function createComment() {
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Debe iniciar sesión para comentar.']);
            exit;
        }

        $postId = $_POST['post_id'];
        $commentText = $_POST['comment'];

        if (empty($commentText)) {
            echo json_encode(['status' => 'error', 'message' => 'El comentario no puede estar vacío.']);
            exit;
        }

        
        $query = "INSERT INTO comments (content, post_id, user_id) VALUES (:content, :post_id, :user_id)";
        $stmt =  $this->conn->prepare($query);
        $stmt->bindParam(':content', $commentText);
        $stmt->bindParam(':post_id', $postId);
        $stmt->bindParam(':user_id', $_SESSION['user_id']);

        if ($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Comentario publicado.',
                'comment' => [
                    'content' => htmlspecialchars($commentText),
                    'username' => $_SESSION['username'],
                ],
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al publicar el comentario.']);
        }

        exit;
    }
}