<?php
session_start(); 
require_once 'db.php';
require_once 'Post.php';
require_once 'User.php';
require_once 'Comment.php';

$database = new Database();
$database->createDatabase();
$db = $database->getConnection();

$stmt = null;
$user = new User($db);
$comment = new Comment($db);
$post = new Post($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    try {
        $action = $_POST['action'];

        if ($action === 'login') {
            $user -> login();
        }

        if ($action === 'register') {
            $user -> register();
        }

        if ($action === 'create_post') {
            $post -> create_post();
        }

        if ($action === 'fetch_comments') {
            $comment -> fetchComments();
        }

        if ($action === 'add_comment') {
            $comment -> createComment();
        }

        if ($action === 'like_post') {
            $post ->like_post();
        }
        if ($action === 'fetch_posts') {
            $post ->fetch_post();
        }if ($action === 'reset_database') {
            $database->resetDatabase();
            header("Location: " . $_SERVER['PHP_SELF']);
            exit;
            
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/foro_estilo.css" />
    <link rel="icon" href="../multimedia/imagenes/favicon.ico" />

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
	
    
    <meta charset="UTF-8"/>
    <meta name="author" content="Fernando Begega Suarez"/>
    <meta name="description" content="Descripción del contenido concreto del documento"/>
    <meta name="keywords" content="palabras, clave, separadas, por, comas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>F1 Desktop Foro</title>

   
</head>
<body>
<header>
        <h1><a href="../index.html">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html" title="Inicio">Inicio</a>
            <a href="../piloto.html" title="Piloto">Piloto</a>
            <a href="../noticias.html" title="Noticias">Noticias</a>
            <a href="../calendario.html" title="Calendario">Calendario</a>
            <a href="../meteorología.html" title="Meteorología" >Meteorología</a>
            <a href="../circuito.html" title="Circuito">Circuito</a>
            <a href="viajes.php" title="Viajes">Viajes</a>
            <a href="../juegos.html" title="Juegos">Juegos</a>
            <a href="foro.php" title="Foro" class="active">Foro</a>
        </nav>
    </header>
    <p class="migas"><a href="../index.html">Inicio</a> >> Foro</p>
    <h2>Foro F1</h2>
    <main>

    
        <form method="POST">
            <input type="hidden" name="action" value="reset_database">
            <button type="submit">Reiniciar Base de Datos</button>
        </form>
    

    <article>
    <h2>Importar Publicaciones</h2>
    <form action="import_csv.php" method="POST" enctype="multipart/form-data">
        <label for="csv_file">Selecciona un archivo CSV:</label>
        <input id="csv_file" type="file" name="csv_file" accept=".csv" required>
        <button type="submit">Importar Publicaciones</button>
    </form>
    </article>
    <article>
        <h2>Exportar Publicaciones</h2>
        <a href="export_csv.php" >Exportar Publicaciones</a>
    </article>
    
        <section>
            
            <h2>Iniciar Sesión o Registrarse</h2>
            <?php if (!isset($_SESSION['user_id'])): ?>
            <form>
                <input type="text" name="username" placeholder="Usuario" required>
                <input type="password" name="password" placeholder="Contraseña" required>
                <button type="submit" name="action" value="login">Iniciar Sesión</button>
                <button type="submit" name="action" value="register">Registrarse</button>
            </form>
            <p></p>
            <?php else: ?>
                <a href="logout.php" >Cerrar Sesión</a>
            <?php endif; ?>
        </section>

        <section>
            <h2>Crear una publicación</h2>
            <form>
                <input type="text" name="title" placeholder="Título de la publicación" required>
                <input type="text" name="categorias" placeholder="Categorias de tu post: coches, equipos, pilotos, curiosidades, ..." required>
                <textarea name="content" placeholder="Escribe tu post sobre f1 aquí..." required></textarea>
                <button type="submit">Publicar</button>
            </form>
            <div></div>
        </section>

        <section>
            <h2>Filtrar y Explorar</h2>
            <form>
                <input type="text" name="categories" placeholder="Categorias: coches, pilotos, equipos,..." >
                <button type="submit">Filtrar</button>
            </form>

            <section>
             <h3>Publicaciones</h3>
                    
            </section>
               
            <script src="../js/foro.js"></script>
                
        </section>
    </main>
</body>
</html>

