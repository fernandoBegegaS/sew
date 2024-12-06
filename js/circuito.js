class Circuito {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.write("<p>Este navegador soporta el API File.</p>");
        } else {
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
        }
    }

    // Método para leer el archivo subido
    async readInputFileXML(files) {
        const archivo = files[0];
        const tipoXml = /xml/;

        if (archivo && archivo.type.match(tipoXml)) {
            const lector = new FileReader();

            // Usamos función de flecha para mantener el contexto de `this`
            lector.onload = (e) => {
                const xmlString = e.target.result;
                const xmlDoc = $.parseXML(xmlString);  // Parseamos el archivo como XML
                this.mostrarXML(xmlDoc);  // Llamamos al método para mostrar el contenido en HTML
            };

            lector.readAsText(archivo);
        } else {
            $("#errorArchivo").text("Error: ¡Archivo no válido! Debe ser un archivo XML.");
            $("#resultado").empty();
        }
    }

    // Método para mostrar el contenido del XML en HTML
    mostrarXML(xmlDoc) {
        $("#errorArchivo").text("");  // Limpiamos cualquier mensaje de error
        const $xml = $(xmlDoc);
        const circuito = $xml.find("Circuito");

        // Obtenemos la información principal del circuito
        const nombre = circuito.find("NombreCircuito").text();
        const longitud = circuito.find("LongitudCircuito").text() + " " + circuito.find("LongitudCircuito").attr("unidades");
        const anchura = circuito.find("AnchuraMediaPista").text() + " " + circuito.find("AnchuraMediaPista").attr("unidades");
        const fechaCarrera = circuito.find("FechaCarrera").text();
        const horaInicio = circuito.find("HoraInicioEspaña").text();
        const numVueltas = circuito.find("NumeroVueltas").text();
        const localidad = circuito.find("Localidad").text();
        const pais = circuito.find("Pais").text();

        let html = `<h2>Información del Circuito</h2>
                    <p><strong>Nombre:</strong> ${nombre}</p>
                    <p><strong>Longitud:</strong> ${longitud}</p>
                    <p><strong>Anchura Media de la Pista:</strong> ${anchura}</p>
                    <p><strong>Fecha de Carrera:</strong> ${fechaCarrera}</p>
                    <p><strong>Hora de Inicio (España):</strong> ${horaInicio}</p>
                    <p><strong>Número de Vueltas:</strong> ${numVueltas}</p>
                    <p><strong>Localidad:</strong> ${localidad}</p>
                    <p><strong>País:</strong> ${pais}</p>`;

        // Referencias
        html += `<h3>Referencias</h3><ul>`;
        circuito.find("Referencia").each(function () {
            const url = $(this).find("URL").text();
            html += `<li><a href="${url}" target="_blank">${url}</a></li>`;
        });
        html += `</ul>`;

        // Galería de Fotografías
        html += `<h3>Galería de Fotografías</h3><ul>`;
        circuito.find("Fotografia").each(function () {
            const archivo = $(this).attr("archivo");
            const descripcion = $(this).text();
            html += `<li>${descripcion} - Archivo: ${archivo}</li>`;
        });
        html += `</ul>`;

        // Galería de Videos
        html += `<h3>Galería de Videos</h3><ul>`;
        circuito.find("Video").each(function () {
            const archivo = $(this).attr("archivo");
            const descripcion = $(this).text();
            html += `<li>${descripcion} - Archivo: ${archivo}</li>`;
        });
        html += `</ul>`;

        // Coordenadas de la Línea de Salida
        const latitudSalida = circuito.find("CoordenadasLineaSalida > Latitud").text() + " " + circuito.find("CoordenadasLineaSalida > Latitud").attr("unidades");
        const longitudSalida = circuito.find("CoordenadasLineaSalida > Longitud").text() + " " + circuito.find("CoordenadasLineaSalida > Longitud").attr("unidades");
        const altitudSalida = circuito.find("CoordenadasLineaSalida > Altitud").text() + " " + circuito.find("CoordenadasLineaSalida > Altitud").attr("unidades");

        html += `<h3>Coordenadas de la Línea de Salida</h3>
                 <p><strong>Latitud:</strong> ${latitudSalida}</p>
                 <p><strong>Longitud:</strong> ${longitudSalida}</p>
                 <p><strong>Altitud:</strong> ${altitudSalida}</p>`;

        // Tramos del Circuito
        html += `<h3>Tramos del Circuito</h3><ul>`;
        circuito.find("Tramo").each(function () {
            const distancia = $(this).find("Distancia").text() + " " + $(this).find("Distancia").attr("unidades");
            const sector = $(this).find("Sector").text();
            const latitud = $(this).find("CoordenadasFinales > Latitud").text();
            const longitud = $(this).find("CoordenadasFinales > Longitud").text();
            const altitud = $(this).find("CoordenadasFinales > Altitud").text();

            html += `<li><strong>Sector:</strong> ${sector}, <strong>Distancia:</strong> ${distancia}, 
                     <strong>Coordenadas Finales:</strong> (${latitud}, ${longitud}), 
                     <strong>Altitud:</strong> ${altitud}</li>`;
        });
        html += `</ul>`;

        // Mostramos el HTML generado en el contenedor principal
        $("main").html(html);
    }


    async readInputFileKML(files) {
        const archivo = files[0];

        if (archivo) {
            const lector = new FileReader();

            lector.onload = (e) => {
                const kmlString = e.target.result;
                const parser = new DOMParser();
                const kml = parser.parseFromString(kmlString, "application/xml");

                const geojson = toGeoJSON.kml(kml);
                
                this.mostrarMapa(geojson);
            };

            lector.readAsText(archivo);
        } else {
            $("#errorArchivo").text("Error: ¡Archivo no válido! Debe ser un archivo KML.");
            $("#resultado").empty();
        }
    }

    mostrarMapa(geojson) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmVnZWdhZmVybmFuZG8iLCJhIjoiY20zZWkxaDNwMGI4ZTJscXhhbGsxeWI3aiJ9.5OHMMeLIsf0DgIkGXEo3jA';
        
        const article = $("<article>");
        article.append($("<h2>").text("Mapa Dinámico"));
        const divMapa = $("<div id='divMapa' style='width: 100%; height: 400px;'></div>");
        article.append(divMapa);
        $("main").append(article);

        var map = new mapboxgl.Map({
            container: 'divMapa',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [geojson.features[0].geometry.coordinates[0][0], geojson.features[0].geometry.coordinates[0][1]], // Coordenadas del primer punto del GeoJSON
            zoom: 10 
        });

        // Cargamos el GeoJSON como fuente y añadimos una capa de visualización
        map.on('load', () => {
            map.addSource('kmlData', {
                type: 'geojson',
                data: geojson
            });

            // Añadimos la capa con estilo de línea para visualizar el circuito
            map.addLayer({
                id: 'kmlLayer',
                type: 'line',
                source: 'kmlData',
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 2
                }
            });

            // Centramos el mapa en la extensión del GeoJSON
            const bounds = new mapboxgl.LngLatBounds();
            geojson.features.forEach((feature) => {
                feature.geometry.coordinates.forEach((coord) => {
                    bounds.extend(coord);
                });
            });
            map.fitBounds(bounds, { padding: 20 });
        });
    }



    readInputFileSVG(files) {
        const archivo = files[0];
        const tipoSvg = /svg/;

        if (archivo && archivo.type.match(tipoSvg)) {
            const lector = new FileReader();

            // Usamos función de flecha para mantener el contexto de `this`
            lector.onload = (e) => {
                const contenidoSvg = e.target.result; // Contenido del archivo SVG
                this.mostrarSVG(contenidoSvg); // Mostramos el SVG en la página
            };

            lector.readAsText(archivo); // Leemos el archivo como texto
        } else {
            $("#errorArchivo").text("Error: ¡Archivo no válido! Debe ser un archivo SVG.");
            $("#resultado").empty();
        }
    }

    // Método para mostrar el contenido del SVG como una imagen
    mostrarSVG(contenidoSvg) {
        $("#errorArchivo").text(""); // Limpiamos cualquier mensaje de error

        // Crear un contenedor para el SVG
        const article = $("<article>");
        article.append($("<h2>").text("Visualización del SVG"));

        // Añadir el contenido SVG al artículo (directamente en el DOM como HTML)
        const svgContainer = $("<div>").html(contenidoSvg);

        article.append(svgContainer);
        $("main").append(article);
    }
}



// Creación de instancia de la clase Circuito
const circuito = new Circuito();