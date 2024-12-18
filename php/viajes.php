<?php
class Carrusel {
    protected $pais;
    protected $capital;

    public function __construct($pais, $capital) {
        $this->pais = $pais;
        $this->capital = $capital; 
    }

    public function obtenerImagenes() {
        $apiKey = '41f4017ceadadfd2f4e6c6f77529e271';
        $tags = $this->capital . "ciudad";
        $perPage = 10;
        $page = 1;

        $url = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
        $url .= "&api_key=" . $apiKey;
        $url .= "&tags=" . urlencode($tags);
        $url .= "&format=json";
        $url .= "&nojsoncallback=1";
        $url .= "&content_type=1";
        $url .= "&media=photos";
        $url .= "&extras=url_o";
        $url .= "&per_page=" . $perPage;
        $url .= "&page=" . $page;

        $respuesta = file_get_contents($url);
        $json = json_decode($respuesta);

        echo "<div></div>";
        echo '<article class="carrusel">';
        echo '<h3>Carrusel de Imágenes</h3>';
        
        foreach ($json->photos->photo as $photo) {
            if (isset($photo->server, $photo->id, $photo->secret)) {
                $photoUrl = "https://live.staticflickr.com/{$photo->server}/{$photo->id}_{$photo->secret}_q.jpg";
            } else {
                $photoUrl = 'https://via.placeholder.com/300';
            }

            $title = isset($photo->title) ? $photo->title : 'Sin título';
            $tags = isset($photo->tags) ? $photo->tags : 'Sin etiquetas';

            echo "<img src='$photoUrl' alt='$title'/>";
        }

        echo '<button> &gt; </button>';
        echo '<button> &lt; </button>';
        echo '</article>';
    }
}

class Moneda {
    protected $local;
    protected $cambio;
    protected $apiKey = "";

    public function __construct($local, $cambio) {
        $this->local = $local;
        $this->cambio = $cambio; 
    }

    public function obtenerCambio() {
        $url = "https://v6.exchangerate-api.com/v6/a4a4ed5fc5be2c8546260129/latest/" . $this->local;
        $response = file_get_contents($url);

        if ($response === FALSE) {
            return "Error al obtener el tipo de cambio.";
        }

        $data = json_decode($response, true);
        echo "<p> 1 " . $this->local . " equivale a";

        if (isset($data['conversion_rates'][$this->cambio])) {
            echo " " . $data['conversion_rates'][$this->cambio];
        } else {
            echo " Error: No se pudo obtener el tipo de cambio.";
        }

        echo " $this->cambio </p>";
    }
}
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    
    <link rel="icon" href="../multimedia/imagenes/favicon.ico"/>
    <meta charset="UTF-8"/>
    <meta name="author" content="Fernando Begega Suarez"/>
    <meta name="description" content="Pagina viajes de la f1"/>
    <meta name="keywords" content="ubicacion,viaje,mapa,moneda,carrusel" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css" rel="stylesheet" />

    <title>F1Desktop viajes</title>
</head>
<body>
    <header>
        <h1><a href="../index.html">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html" title="Inicio">Inicio</a>
            <a href="../piloto.html" title="Piloto">Piloto</a>
            <a href="../noticias.html" title="Noticias">Noticias</a>
            <a href="../calendario.html" title="Calendario">Calendario</a>
            <a href="../meteorología.html" title="Meteorologia">Meteorologia</a>
            <a href="../circuito.html" title="Circuito">Circuito</a>
            <a href="viajes.php" title="Viajes" class="active">Viajes</a>
            <a href="../juegos.html" title="Juegos">Juegos</a>
            <a href="foro.php" title="Foro">Foro</a>
        </nav>
    </header>

    <p class="migas"><a href="../index.html">Inicio</a> >> Viaje</p>
    <h2>Viajes</h2>
    <main>
        <?php
        $moneda = new Moneda('EUR', 'USD');
        $moneda->obtenerCambio();
        $carrusel = new Carrusel("Netherlands", "Amsterdam");
        $carrusel->obtenerImagenes();
        ?>
    </main>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js"></script>
    <script src="../js/viajes.js"></script>
</body>
</html>
