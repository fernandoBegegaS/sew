<?php
class Database {

    private $host = "localhost";
    private $db_name = "f1_app";
    private $username = "DBUSER2024";
    private $password = "DBPSWD2024";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $exception) {
        }
        return $this->conn;
    }

    public function createDatabase() {
        try {
            $conn = new PDO("mysql:host=" . $this->host, $this->username, $this->password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "CREATE DATABASE IF NOT EXISTS " . $this->db_name;
            $conn->exec($sql);

            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            $this->createTables();

        } catch (PDOException $exception) {
        }
    }

    private function createTables() {
        try {
            $queries = [
                "CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL
                )",

                "CREATE TABLE IF NOT EXISTS posts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    user_id INT,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )",

                "CREATE TABLE IF NOT EXISTS comments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    content TEXT NOT NULL,
                    post_id INT,
                    user_id INT,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )",

                "CREATE TABLE IF NOT EXISTS votes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    post_id INT,
                    user_id INT,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )",

                "CREATE TABLE IF NOT EXISTS categories (
                    name VARCHAR(255) PRIMARY KEY
                )",

                "CREATE TABLE IF NOT EXISTS post_categories (
                    post_id INT,
                    category_id VARCHAR(255),
                    PRIMARY KEY (post_id, category_id),
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (category_id) REFERENCES categories(name) ON DELETE CASCADE
                )"
            ];

            foreach ($queries as $query) {
                try {
                    $this->conn->exec($query);
                } catch (PDOException $exception) {
                    throw $exception;
                }
            }

        } catch (PDOException $exception) {
            error_log("Error al crear tablas: " . $exception->getMessage());
        }
    }

    public function resetDatabase() {
        try {
            $this->getConnection();

            $query = "SELECT table_name FROM information_schema.tables WHERE table_schema = :db_name";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':db_name', $this->db_name);
            $stmt->execute();

            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 0");

            foreach ($tables as $table) {
                $this->conn->exec("DROP TABLE IF EXISTS $table");
            }

            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 1");

            $this->createTables();

        } catch (PDOException $exception) {
        }
    }
}
?>
