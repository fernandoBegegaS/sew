<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register() {
        $username = $_POST['username'];
            $password = $_POST['password'];

            $query = "SELECT id FROM users WHERE username = :username";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'error', 'message' => 'El usuario ya existe.']);
                exit;
            }

            $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password); 
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Usuario registrado exitosamente. 
                Inicie sesion para comenzar a publicar y comentar']);
            } else {
                echo json_encode(['status' => 'error','type' => 'register' , 'message' => 'Error al registrar usuario.']);
            }
    }

    public function login() {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $query = "SELECT id, username FROM users WHERE username = :username AND password = :password";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password); 
        $stmt->execute();

        if ($stmt->rowCount() === 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            echo json_encode(['status' => 'success','type' => 'login' , 'message' => 'Inicio de sesión exitoso.']);
        } else {
            echo json_encode(['status' => 'error','type' => 'login' , 'message' => 'Credenciales incorrectas.']);
        }
    }
}
