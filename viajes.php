


<?php
// Definición de la clase Database
class Carrusel {
    protected $pais;
    protected $capital;

    public function __construct($pais,$capital) {
        $this->pais = $pais;
        $this->capital = $capital; 
    }

    // Método para realizar la conexión a la base de datos
    public function obtenerImagenes() {
		// API Key y parámetros de búsqueda
		$apiKey = '41f4017ceadadfd2f4e6c6f77529e271';  // Reemplaza con tu clave API de Flickr
		$tags = $this->capital . "ciudad";  // Las etiquetas que deseas buscar
		$perPage = 10;          // Número de fotos por página
		$page = 1;              // Página de los resultados
	
		// Construir la URL de la API de Flickr
		$url = "https://www.flickr.com/services/rest/?method=flickr.photos.search";
		$url .= "&api_key=" . $apiKey;
		$url .= "&tags=" . urlencode($tags);
		$url .= "&format=json";
		$url .= "&nojsoncallback=1";
		$url .= "&content_type=1"; // Solo fotos
		$url .= "&media=photos";   // Filtrar solo fotos
		$url .= "&extras=url_o";  // Obtener la URL de la foto en tamaño original
		$url .= "&per_page=" . $perPage;
		$url .= "&page=" . $page;
	
		$respuesta = file_get_contents($url);
	
		$json = json_decode($respuesta);
	
		echo '<article class = "carrusel">';
		echo '<h3>Carrusel de Imágenes</h3>';
	
		foreach ($json->photos->photo as $photo) {
				// Verificar si las propiedades necesarias para construir la URL existen
			if (isset($photo->server, $photo->id, $photo->secret)) {
				$photoUrl = "https://live.staticflickr.com/{$photo->server}/{$photo->id}_{$photo->secret}_b.jpg";
			} else {
				$photoUrl = 'https://via.placeholder.com/300'; // Imagen por defecto
			}
			
			$title = isset($photo->title) ? $photo->title : 'Sin título';
			$tags = isset($photo->tags) ? $photo->tags : 'Sin etiquetas';
			
			
			echo "<img src='$photoUrl' alt='$title' style='width:300px; height:auto;' />";
				
		}

		echo '<button> &gt; </button>';
		echo '<button> &lt; </button>';

		echo '</article>';
		
	}
}

class Moneda {
    protected $local;
    protected $cambio;
    protected $apiKey = "YOUR_API_KEY"; // Reemplaza con tu API Key

    public function __construct($local, $cambio) {
        $this->local = $local;
        $this->cambio = $cambio; 
    }

    // Método para obtener el cambio de moneda usando file_get_contents()
    public function obtenerCambio() {
        // Construir la URL de consulta con la clave de la API y las monedas
        $url = "https://v6.exchangerate-api.com/v6/a4a4ed5fc5be2c8546260129/latest/" . $this->local;
    
        // Obtener la respuesta usando file_get_contents()
        $response = file_get_contents($url);
    
        // Verificar si se obtuvo la respuesta correctamente
        if ($response === FALSE) {
            return "Error al obtener el tipo de cambio.";
        }
    
        // Decodificar la respuesta JSON
        $data = json_decode($response, true);
    
        echo "<p> 1 " . $this->local . " equivale a" ;

		
        if (isset($data['conversion_rates'][$this->cambio])) {
            echo " ". $data['conversion_rates'][$this->cambio]; // Devolver el tipo de cambio
        } else {
            echo "Error: No se pudo obtener el tipo de cambio.";
        }

		echo " $this->cambio </p>";
    }
}

// Ejemplo de uso





?>

<!DOCTYPE HTML>
<html lang="es">

<head>
    <!-- añadir el elemento link de enlace a la hoja de estilo dentro del <head> del documento html -->
	<link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
	<link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    
	<link rel="stylesheet" type="text/css" href="estilo/layout.css" />
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css" rel="stylesheet" />
	<link rel="icon" href="multimedia/imagenes/favicon.ico"/>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8"/>
	
	<meta name = "author" content = "Fernando Begega Suarez"/>
	<meta name = "description" content = "aquí cada documento debe tener la
		descripción del contenido concreto del mismo"/>
	
	<meta name ="keywords" content ="aquí cada documento debe tener la lista
	de las palabras clave del mismo separadas por comas" />

	<meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
	<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
	<script src="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js"></script>

	<title>F1Desktop viajes</title>
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
	
	<header>
		<h1><a href = "index.html"> F1 Desktop  </a> </h1>
		
	

	<nav>
		<a href = "index.html" title="Inicio" >Inicio</a>
		<a href="piloto.html" title="Piloto">Piloto</a>
		<a href="noticias.html" title="Noticias">Noticias</a>
		<a href="calendario.html" title="Calendario">Calendario</a>
		<a href="meteorología.html" title="Meteorologia" >Meteorologia</a>
		<a href="circuito.html" title="Circuito" >Circuito</a>
		<a href="viajes.html" title="Viajes" class="active">Viajes</a>
		<a href="juegos.html" title="Juegos">Juegos</a>
	</nav>

	
	</header>

	<P class="migas"><a href="index.html">Inicio</a> >> Viaje</P>

	<h2>Viajes </h2>
	<main>
		
		<?php
		$moneda = new Moneda('EUR', 'USD');
		$moneda->obtenerCambio();
		$carrusel = new Carrusel("Netherlands","Amsterdam");
		$carrusel->obtenerImagenes();
		?>
	</main>
	<script src="js/viajes.js"></script> 
	
	
	

</body>
</html>