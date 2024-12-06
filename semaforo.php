<?php
// Definición de la clase Database
class Database {
    protected $server;
    protected $user;
    protected $pass;
    protected $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";  // Asegúrate de que estas credenciales sean correctas
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
    }

    // Método para realizar la conexión a la base de datos
    public function connect() {
        // Conexión a la base de datos con mysqli
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        // Verificar si la conexión fue exitosa
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }
        return $conn; // Retornar la conexión
    }
}

$dataBases = new Database();
$conn = $dataBases->connect();

// Verificar si el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Verificar si los campos necesarios están definidos
    if (isset($_POST["firstName"]) && isset($_POST["lastName"]) && isset($_POST["difficulty"]) && isset($_POST["reactionTime"])) {
        // Obtener los valores enviados
        $firstName = $_POST["firstName"];
        $lastName = $_POST["lastName"];
        $difficulty = $_POST["difficulty"];
        $reactionTime = $_POST["reactionTime"];

        // Insertar los datos en la base de datos
        $stmt = $conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssd", $firstName, $lastName, $difficulty, $reactionTime);

        if (!$stmt->execute()) {
            echo "Error al registrar la puntuación: " . $stmt->error;
        }
        
        // Cerramos la declaración
        $stmt->close();
    }
    
}

// Consultar el ranking después de insertar los datos

?>



<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Enlace a las hojas de estilo -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico" />

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    
    <!-- Meta datos -->
    <meta charset="UTF-8"/>
    <meta name="author" content="Fernando Begega Suarez"/>
    <meta name="description" content="Descripción del contenido concreto del documento"/>
    <meta name="keywords" content="palabras, clave, separadas, por, comas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>F1 Desktop Juego: Semaforo</title>
</head>

<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
    
        <nav>
            <a href="index.html" title="Inicio">Inicio</a>
            <a href="piloto.html" title="Piloto">Piloto</a>
            <a href="noticias.html" title="Noticias">Noticias</a>
            <a href="calendario.html" title="Calendario">Calendario</a>
            <a href="meteorologia.html" title="Meteorología">Meteorología</a>
            <a href="circuito.html" title="Circuito">Circuito</a>
            <a href="viajes.html" title="Viajes">Viajes</a>
            <a href="juegos.html" title="Juegos" class="active">Juegos</a>
        </nav>
    </header>

    <p class="migas"><a href="index.html">Inicio</a> >>> Juego > Semáforo</p>

    

    <main>
    <?php
            if (isset($_POST["difficulty"])) {
                $difficulty = $_POST["difficulty"];
                
                // Realizar la consulta de los primeros 10 por tiempo
                $stmt = $conn->prepare("SELECT * FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
                $stmt->bind_param("d", $difficulty); // 'd' es para un valor numérico (double)
                $stmt->execute();
                
                // Obtener el resultado de la consulta
                $resultado = $stmt->get_result();
                
                // Crear una tabla para mostrar el ranking
                echo "<table border='1'>";
                echo "<caption>Ranking de los primeros 10 jugadores (por tiempo y nivel):";
                echo "<thead><tr><th>Nombre</th><th>Apellido</th><th>Tiempo</th></tr></thead>";
                echo "<tbody>";
            
                if ($resultado->num_rows > 0) {
                    // Mostrar los resultados
                    while ($fila = $resultado->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>" . $fila["nombre"] . "</td>";
                        echo "<td>" . $fila["apellidos"] . "</td>";
                        echo "<td>" . $fila["tiempo"] . "</td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='5'>No se encontraron resultados.</td></tr>";
                }
                echo "</tbody></table>";
            
                // Cerramos la declaración
                $stmt->close();
            }
            
            // Cerrar la conexión
            $conn->close();

            echo "<script type='text/javascript'>";
            echo " window.onload = function() { window.scrollTo(0, document.body.scrollHeight); } ";
            echo "</script>";
        ?>

    </main>

    

    <script src="js/semaforo.js"></script>
</body>
</html>
