<?php
session_start();
require_once 'db.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['csv_file']) && $_FILES['csv_file']['error'] === UPLOAD_ERR_OK) {
        $csvFile = $_FILES['csv_file']['tmp_name'];

        if (($handle = fopen($csvFile, 'r')) !== false) {
            $headers = fgetcsv($handle, 1000, ';');

            while (($data = fgetcsv($handle, 1000, ';')) !== false) {
                if (count($data) < 4) {
                    echo "Fila incompleta o mal formateada, omitiendo: " . implode(';', $data) . "<br>";
                    continue;
                }

                if (empty($data[0]) || empty($data[1]) || empty($data[2])) {
                    echo "Fila vacía detectada, omitiendo.<br>";
                    continue;
                }

                $title = $data[0];
                $content = $data[1];
                $username = $data[2];
                $categories = explode(',', $data[3]);
                $comments = isset($data[4]) ? explode(',', $data[4]) : [];

                $query = "SELECT id FROM users WHERE username = :username LIMIT 1";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':username', $username);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$user) {
                    $password = "";
                    $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
                    $stmt = $db->prepare($query);
                    $stmt->bindParam(':username', $username);
                    $stmt->bindParam(':password', $password);
                    $stmt->execute();
                    $userId = $db->lastInsertId();
                } else {
                    $userId = $user['id'];
                }

                $query = "INSERT INTO posts (title, content, user_id) VALUES (:title, :content, :user_id)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':title', $title);
                $stmt->bindParam(':content', $content);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
                $postId = $db->lastInsertId();

                foreach ($categories as $category) {
                    $category = trim($category);
                
                    $query = "INSERT IGNORE INTO categories (name) VALUES (:name)";
                    $stmt = $db->prepare($query);
                    $stmt->bindParam(':name', $category);
                    $stmt->execute();
                
                    $query = "INSERT INTO post_categories (post_id, category_id) VALUES (:post_id, :category_id)";
                    $stmt = $db->prepare($query);
                    $stmt->bindParam(':post_id', $postId);
                    $stmt->bindParam(':category_id', $category);
                    $stmt->execute();
                }

                foreach ($comments as $comment) {
                    $commentParts = explode(':', $comment, 2);
                    if (count($commentParts) === 2) {
                        $commentUser = trim($commentParts[0]);
                        $commentText = trim($commentParts[1]);

                        $query = "SELECT id FROM users WHERE username = :username LIMIT 1";
                        $stmt = $db->prepare($query);
                        $stmt->bindParam(':username', $commentUser);
                        $stmt->execute();
                        $commentUserResult = $stmt->fetch(PDO::FETCH_ASSOC);

                        if (!$commentUserResult) {
                            $password = "";
                            $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
                            $stmt = $db->prepare($query);
                            $stmt->bindParam(':username', $commentUser);
                            $stmt->bindParam(':password', $password);
                            $stmt->execute();
                            $commentUserId = $db->lastInsertId();
                        } else {
                            $commentUserId = $commentUserResult['id'];
                        }

                        $query = "INSERT INTO comments (content, post_id, user_id) VALUES (:content, :post_id, :user_id)";
                        $stmt = $db->prepare($query);
                        $stmt->bindParam(':content', $commentText);
                        $stmt->bindParam(':post_id', $postId);
                        $stmt->bindParam(':user_id', $commentUserId);
                        $stmt->execute();
                    }
                }
            }
            fclose($handle);
            header("Location: foro.php");
            exit;
        } else {
            echo "Error al abrir el archivo.";
        }
    } else {
        echo "Error al subir el archivo.";
    }
} 
?>
