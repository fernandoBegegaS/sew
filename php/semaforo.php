<?php

class Database {
    protected $server;
    protected $user;
    protected $pass;
    protected $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";  
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
    }

   
    public function connect() {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }
        return $conn; 
    }
}

$dataBases = new Database();
$conn = $dataBases->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_POST["firstName"]) && isset($_POST["lastName"]) && isset($_POST["difficulty"]) && isset($_POST["reactionTime"])) {
       
        $firstName = $_POST["firstName"];
        $lastName = $_POST["lastName"];
        $difficulty = $_POST["difficulty"];
        $reactionTime = $_POST["reactionTime"];

        $stmt = $conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssd", $firstName, $lastName, $difficulty, $reactionTime);

        if (!$stmt->execute()) {
            echo "Error al registrar la puntuación: " . $stmt->error;
        }
        
        $stmt->close();
    }
    
}


?>



<!DOCTYPE HTML>
<html lang="es">
<head>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/semaforo.css" />
    <link rel="icon" href="../multimedia/imagenes/favicon.ico" />

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    
    <meta charset="UTF-8"/>
    <meta name="author" content="Fernando Begega Suarez"/>
    <meta name="description" content="Descripción del contenido concreto del documento"/>
    <meta name="keywords" content="palabras, clave, separadas, por, comas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>F1 Desktop Juego: Semaforo</title>
</head>

<body>
    <header>
        <h1><a href="../index.html">F1 Desktop</a></h1>
    
        <nav>
            <a href="../index.html" title="Inicio">Inicio</a>
            <a href="../piloto.html" title="Piloto">Piloto</a>
            <a href="../noticias.html" title="Noticias">Noticias</a>
            <a href="../calendario.html" title="Calendario">Calendario</a>
            <a href="../meteorologia.html" title="Meteorología">Meteorología</a>
            <a href="../circuito.html" title="Circuito">Circuito</a>
            <a href="viajes.php" title="Viajes">Viajes</a>
            <a href="../juegos.html" title="Juegos" class="active">Juegos</a>
            <a href="foro.php" title="Foro">Foro</a>
        </nav>
    </header>

    <p class="migas"><a href="../index.html">Inicio</a> >>> Juego > Semáforo</p>

    

    <main>
    <?php
            if (isset($_POST["difficulty"])) {
                $difficulty = $_POST["difficulty"];
                
                $stmt = $conn->prepare("SELECT * FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
                
                $stmt->bind_param("d", $difficulty); 

               
                $stmt->execute();
                
                $resultado = $stmt->get_result();
                
                echo "<table >";
                echo "<caption>Ranking de los primeros 10 jugadores (por tiempo y nivel):</caption>";
                echo "<thead><tr><th scope='col'>Nombre</th><th scope='col'>Apellido</th><th scope='col'>Tiempo</th></tr></thead>";
                echo "<tbody>";
                
                if ($resultado->num_rows > 0) {
                    while ($fila = $resultado->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . htmlspecialchars($fila["nombre"]) . "</td>";
                        echo "<td>" . htmlspecialchars($fila["apellidos"]) . "</td>";
                        echo "<td>" . htmlspecialchars($fila["tiempo"]) . "</td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='3'>No se encontraron resultados.</td></tr>";
                }
                
                echo "</tbody></table>";
            
                $stmt->close();
            }
            
            $conn->close();

            echo "<script>";
            echo " window.onload = function() { window.scrollTo(0, document.body.scrollHeight); } ";
            echo "</script>";
        ?>

    </main>

    

    <script src="../js/semaforo.js"></script>
</body>
</html>
