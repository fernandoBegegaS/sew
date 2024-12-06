<?php
// Definición de la clase Database

class Database {
    protected $server;
    protected $user;
    protected $pass;
    protected $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "simulacion";
    }

    public function connect($useDb = false) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $useDb ? $this->dbname : null);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }
        return $conn;
    }

    public function verificarTablas() {
        $conn = $this->connect(true);
    
        // Verificar que todas las tablas necesarias existen
        $tablasNecesarias = [
            'usuarios',
            'pilotos',
            'coches',
            'mecanicos',
            'temporadas',
            'carreras',
            'equipos',
            'temporada_participantes'
        ];
    
        $tablasExistentes = [];
        $result = $conn->query("SHOW TABLES");
        if ($result) {
            while ($fila = $result->fetch_row()) {
                $tablasExistentes[] = $fila[0];
            }
        } else {
            echo "Error al verificar tablas: " . $conn->error;
            $conn->close();
            return false;
        }
    
        $conn->close();
    
        // Comparar las tablas necesarias con las existentes
        foreach ($tablasNecesarias as $tabla) {
            if (!in_array($tabla, $tablasExistentes)) {
                return false;
            }
        }
    
        return true;
    }
    

    public function crearBaseDeDatos() {
        $conn = $this->connect();
        $sql = "CREATE DATABASE IF NOT EXISTS $this->dbname";
        if ($conn->query($sql) === TRUE) {
            echo "Base de datos '$this->dbname' creada o ya existente.\n";
        } else {
            die("Error al crear la base de datos: " . $conn->error);
        }
    
        $conn->select_db($this->dbname);
    
        $tablas = [
            "CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                presupuesto FLOAT NOT NULL DEFAULT 5000000
            )",
            "CREATE TABLE IF NOT EXISTS temporadas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                num_carreras INT NOT NULL,
                carreras_restantes INT NOT NULL,
                fecha_inicio DATE NOT NULL,
                fecha_fin DATE DEFAULT NULL,
                estado ENUM('en_curso', 'finalizada') DEFAULT 'en_curso'
            )",
            "CREATE TABLE IF NOT EXISTS carreras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                id_temporada INT NOT NULL,
                posicion_usuario INT DEFAULT NULL,
                ganancia FLOAT DEFAULT 0,
                FOREIGN KEY (id_temporada) REFERENCES temporadas(id) ON DELETE CASCADE
            )",
            "CREATE TABLE IF NOT EXISTS temporada_participantes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_temporada INT NOT NULL,
                id_usuario INT NOT NULL,
                puntuacion INT DEFAULT 0,
                FOREIGN KEY (id_temporada) REFERENCES temporadas(id) ON DELETE CASCADE,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
            )",
            "CREATE TABLE IF NOT EXISTS coches (
                nombre VARCHAR(100) NOT NULL PRIMARY KEY,
                velocidad INT NOT NULL,
                fiabilidad INT NOT NULL,
                coste FLOAT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS pilotos (
                nombre VARCHAR(100) NOT NULL PRIMARY KEY,
                habilidad INT NOT NULL,
                experiencia INT NOT NULL,
                coste FLOAT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS mecanicos (
                nombre VARCHAR(100) NOT NULL PRIMARY KEY,
                nivel INT NOT NULL,
                coste FLOAT NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS equipos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT NOT NULL,
                id_coche VARCHAR(100) DEFAULT NULL,
                id_piloto VARCHAR(100) DEFAULT NULL,
                id_mecanico VARCHAR(100) DEFAULT NULL,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (id_coche) REFERENCES coches(nombre) ON DELETE SET NULL,
                FOREIGN KEY (id_piloto) REFERENCES pilotos(nombre) ON DELETE SET NULL,
                FOREIGN KEY (id_mecanico) REFERENCES mecanicos(nombre) ON DELETE SET NULL
                );"
        ];
    
        foreach ($tablas as $tabla) {
            if ($conn->query($tabla) === TRUE) {
                echo "Tabla creada exitosamente.\n";
            } else {
                die("Error al crear la tabla: " . $conn->error);
            }
        }
    
        echo "Base de datos y tablas creadas correctamente.\n";
        $conn->close();
    }
    

    public function insertarDatosIniciales() {
        $conn = $this->connect(true);
    
        $coches = [
            "INSERT INTO coches (nombre, velocidad, fiabilidad, coste) VALUES
                ('Ferrari', 95, 85, 1500000),
                ('Mercedes', 94, 88, 1400000),
                ('Red Bull', 90, 82, 1200000),
                ('McLaren', 85, 78, 900000),
                ('Alfa Romeo', 80, 75, 700000),
                ('Haas', 75, 70, 500000)"
        ];
    
        $pilotos = [
            "INSERT INTO pilotos (nombre, habilidad, experiencia, coste) VALUES
                ('Lewis Hamilton', 95, 90, 2000000),
                ('Max Verstappen', 93, 88, 1900000),
                ('Charles Leclerc', 90, 85, 1500000),
                ('Lando Norris', 85, 80, 1000000),
                ('Valtteri Bottas', 80, 78, 700000),
                ('Kevin Magnussen', 75, 70, 500000)"
        ];
    
        $mecanicos = [
            "INSERT INTO mecanicos (nombre, nivel, coste) VALUES
                ('Ingeniero de Ferrari', 90, 800000),
                ('Ingeniero de Mercedes', 88, 750000),
                ('Ingeniero de Red Bull', 85, 700000),
                ('Ingeniero de McLaren', 80, 600000),
                ('Ingeniero de Alfa Romeo', 75, 500000),
                ('Ingeniero de Haas', 70, 400000)"
        ];
    
        // Inserción de datos para la tabla carreras
        $carreras = [
            "INSERT INTO carreras (nombre, id_temporada, posicion_usuario, ganancia) VALUES
                ('Gran Premio de Mónaco', 1, NULL, 0),
                ('Gran Premio de Italia', 1, NULL, 0),
                ('Gran Premio de Brasil', 1, NULL, 0),
                ('Gran Premio de Japón', 1, NULL, 0),
                ('Gran Premio de Abu Dabi', 1, NULL, 0)"
        ];
    
        // Listado de datos a insertar
        $datosIniciales = [$coches, $pilotos, $mecanicos, $carreras];
    
        foreach ($datosIniciales as $tabla) {
            foreach ($tabla as $sql) {
                if ($conn->query($sql) === TRUE) {
                    echo "Datos insertados correctamente.\n";
                } else {
                    echo "Error al insertar datos: " . $conn->error . "\n";
                }
            }
        }
    
        $conn->close();
    }
    

    public function mostrarOpcionesHTML() {
        $conn = $this->connect(true);
    
        $queries = [
            'pilotos' => "SELECT nombre, habilidad, experiencia, coste FROM pilotos",
            'coches' => "SELECT nombre, velocidad, fiabilidad, coste FROM coches",
            'mecanicos' => "SELECT nombre, nivel, coste FROM mecanicos"
        ];
    
        $resultados = [];
        foreach ($queries as $tabla => $query) {
            $result = $conn->query($query);
            if ($result) {
                $resultados[$tabla] = $result->fetch_all(MYSQLI_ASSOC);
            } else {
                echo "Error al obtener datos de $tabla: " . $conn->error;
                return;
            }
        }
    
        $html = '<form method="post" action="#">';
    
        // Sección para ingresar el nombre y apellido del usuario
        $html .= '<h2>Información del Usuario</h2>';
        $html .= '<div>';
        $html .= '<label for="nombre_usuario">Nombre:</label>';
        $html .= '<input type="text" id="nombre_usuario" name="nombre_usuario" required>';
        $html .= '</div>';
        $html .= '<div>';
        $html .= '<label for="apellido_usuario">Apellido:</label>';
        $html .= '<input type="text" id="apellido_usuario" name="apellido_usuario" required>';
        $html .= '</div>';
    
        // Sección para seleccionar un piloto
        $html .= '<h2>Selecciona un Piloto</h2>';
        foreach ($resultados['pilotos'] as $piloto) {
            $html .= '<div>';
            $html .= '<input type="radio" id="piloto_' . $piloto['nombre'] . '" name="piloto" value="' . $piloto['nombre'] . '">';
            $html .= '<label for="piloto_' . $piloto['nombre'] . '">' . $piloto['nombre'] . ' (Habilidad: ' . $piloto['habilidad'] . ', Experiencia: ' . $piloto['experiencia'] . ', Coste: $' . $piloto['coste'] . ')</label>';
            $html .= '</div>';
        }
    
        // Sección para seleccionar un coche
        $html .= '<h2>Selecciona un Coche</h2>';
        foreach ($resultados['coches'] as $coche) {
            $html .= '<div>';
            $html .= '<input type="radio" id="coche_' . $coche['nombre'] . '" name="coche" value="' . $coche['nombre'] . '">';
            $html .= '<label for="coche_' . $coche['nombre'] . '">' . $coche['nombre'] . ' (Velocidad: ' . $coche['velocidad'] . ', Fiabilidad: ' . $coche['fiabilidad'] . ', Coste: $' . $coche['coste'] . ')</label>';
            $html .= '</div>';
        }
    
        // Sección para seleccionar un mecánico
        $html .= '<h2>Selecciona un Mecánico</h2>';
        foreach ($resultados['mecanicos'] as $mecanico) {
            $html .= '<div>';
            $html .= '<input type="radio" id="mecanico_' . $mecanico['nombre'] . '" name="mecanico" value="' . $mecanico['nombre'] . '">';
            $html .= '<label for="mecanico_' . $mecanico['nombre'] . '">' . $mecanico['nombre'] . ' (Nivel: ' . $mecanico['nivel'] . ', Coste: $' . $mecanico['coste'] . ')</label>';
            $html .= '</div>';
        }
    
        // Botón de confirmación
        $html .= '<div>';
        $html .= '<button type="submit">Iniciar temporada</button>';
        $html .= '</div>';
    
        $html .= '</form>';
    
        $conn->close();
        echo $html;
    }

    public function almacenarEquipo() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $conn = $this->connect(true);
    
            // Obtener datos del formulario
            $nombreUsuario = $conn->real_escape_string($_POST['nombre_usuario']);
            $apellidoUsuario = $conn->real_escape_string($_POST['apellido_usuario']);
            $piloto = $conn->real_escape_string($_POST['piloto']);
            $coche = $conn->real_escape_string($_POST['coche']);
            $mecanico = $conn->real_escape_string($_POST['mecanico']);
    
            // Verificar que todos los campos están presentes
            if (empty($nombreUsuario) || empty($apellidoUsuario) || empty($piloto) || empty($coche) || empty($mecanico)) {
                echo "Todos los campos son obligatorios.";
                return;
            }
    
            // Verificar si el usuario ya existe en la tabla usuarios
            $usuarioCheckQuery = "SELECT * FROM usuarios WHERE nombre = '$nombreUsuario $apellidoUsuario'";
            $usuarioCheckResult = $conn->query($usuarioCheckQuery);
    
            if ($usuarioCheckResult->num_rows > 0) {
                // Usuario ya existe, obtener el ID
                $usuario = $usuarioCheckResult->fetch_assoc();
                $usuarioId = $usuario['id'];
            } else {
                // Crear un nuevo usuario
                $insertUsuarioQuery = "INSERT INTO usuarios (nombre) VALUES ('$nombreUsuario $apellidoUsuario')";
                if ($conn->query($insertUsuarioQuery) === TRUE) {
                    $usuarioId = $conn->insert_id;
                } else {
                    echo "Error al crear el usuario: " . $conn->error;
                    return;
                }
            }
    
            // Insertar el equipo en la tabla equipos
            $insertEquipoQuery = "INSERT INTO equipos (id_usuario, id_coche, id_piloto, id_mecanico) VALUES (
                '$usuarioId',
                '$coche',
                '$piloto',
                '$mecanico'
            )";
    
            if ($conn->query($insertEquipoQuery) === TRUE) {
                echo "Equipo creado exitosamente.";
            } else {
                echo "Error al crear el equipo: " . $conn->error;
                return;
            }
    
            // Opcional: Actualizar el presupuesto del usuario según los costes del equipo
            $costosQuery = "
                SELECT 
                    (SELECT coste FROM coches WHERE nombre = '$coche') AS coste_coche,
                    (SELECT coste FROM pilotos WHERE nombre = '$piloto') AS coste_piloto,
                    (SELECT coste FROM mecanicos WHERE nombre = '$mecanico') AS coste_mecanico
            ";
            $costosResult = $conn->query($costosQuery);
    
            if ($costosResult && $costosResult->num_rows > 0) {
                $costos = $costosResult->fetch_assoc();
                $totalCoste = $costos['coste_coche'] + $costos['coste_piloto'] + $costos['coste_mecanico'];
    
                $updatePresupuestoQuery = "UPDATE usuarios SET presupuesto = presupuesto - $totalCoste WHERE id = '$usuarioId'";
                if ($conn->query($updatePresupuestoQuery) === TRUE) {
                    echo "Presupuesto del usuario actualizado.";
                } else {
                    echo "Error al actualizar el presupuesto del usuario: " . $conn->error;
                }
            } else {
                echo "Error al calcular el coste del equipo.";
            }
    
            $conn->close();
        } else {
            echo "Método HTTP no permitido.";
        }
    }

    public function get_equipos_por_usuario {

header('Content-Type: application/json');

// Conexión a la base de datos
$conn = $this->connect();

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificamos que el GET tenga el parámetro 'id_usuario'
if (isset($_GET['id_usuario'])) {
    $id_usuario = $conn->real_escape_string($_GET['id_usuario']);

    // Consulta para obtener todos los equipos de un usuario
    $query = "
        SELECT e.id, e.id_usuario, e.id_coche, e.id_piloto, e.id_mecanico,
               u.nombre AS nombre_usuario,
               p.nombre AS nombre_piloto, p.habilidad, p.experiencia,
               c.nombre AS nombre_coche, c.velocidad, c.fiabilidad, c.coste,
               m.nombre AS nombre_mecanico, m.nivel, m.coste AS coste_mecanico
        FROM equipos e
        JOIN usuarios u ON e.id_usuario = u.id
        LEFT JOIN pilotos p ON e.id_piloto = p.nombre
        LEFT JOIN coches c ON e.id_coche = c.nombre
        LEFT JOIN mecanicos m ON e.id_mecanico = m.nombre
        WHERE e.id_usuario = '$id_usuario'";

    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        // Crear un array de equipos
        $equipos = [];
        while ($equipo = $result->fetch_assoc()) {
            $equipos[] = $equipo;
        }
        // Devolver los equipos como JSON
        echo json_encode($equipos);
    } else {
        // Si no tiene equipos, enviar un mensaje
        echo json_encode(['error' => 'No tienes equipos creados']);
    }
} else {
    // Si falta el parámetro 'id_usuario'
    echo json_encode(['error' => 'Faltan parámetros en la solicitud']);
}

$conn->close();

    }
    
}

$database = new Database();

if (!$database->verificarTablas()) {
    echo "La base de datos no existe o no está inicializada. Procediendo a crearla...\n";
    $database->crearBaseDeDatos();
    $database->insertarDatosIniciales();
    echo "Base de datos creada y datos iniciales insertados correctamente.\n";
} else {
    echo "La base de datos ya está inicializada.\n";
}
?>




<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Enlace a las hojas de estilo -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
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
            // Ejecución del Código
           
            echo "<p>Dispone de un presupuesto de 1000000</p>";
            $database->mostrarOpcionesHTML();
            $database->almacenarEquipo();
        ?>

    </main>

    
</body>
</html>
