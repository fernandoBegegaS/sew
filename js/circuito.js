class Circuito {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.write("<p>Este navegador soporta el API File.</p>");
        } else {
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
        }
    }

    añadirTextoError(indice, texto) {
        const p = $("p:has(input)").eq(indice);
        if (p.length) {
            p.find("input").after(`${texto}`);
        } else {
            console.error("No se encontró un <p> con el índice especificado.");
        }
    }

    readInputFileXML(files) {
        
        const archivo = files[0];
        const tipoXml = /xml/;

        if (archivo && archivo.type.match(tipoXml)) {
            this.añadirTextoError(0,"");
            const lector = new FileReader();

            lector.onload = (e) => {
                const xmlString = e.target.result;
                const xmlDoc = $.parseXML(xmlString);
                this.mostrarXML(xmlDoc);
            };

            lector.readAsText(archivo);
        } else {
            this.añadirTextoError(0,"Tipo de archivo incorrecto");
        }
    }

    mostrarXML(xmlDoc) {
        $('main > article').remove();
        const $xml = $(xmlDoc);

        const procesarNodo = (nodo) => {
            let html = "";

            if (nodo.children.length > 0) {
                html += '<ul>';
                $(nodo.children).each(function () {
                    const nombre = this.tagName;
                    html += `<li><strong>${nombre}:</strong> ${procesarNodo(this)}</li>`;
                });
                html += '</ul>';
            } else {
                html += nodo.textContent ? nodo.textContent.trim() : "(vacío)";
            }

            return html;
        };

        let html = "<article>";
         html += '<h2>Contenido del Archivo XML</h2>';
        html += '<ul>';
        $xml.children().each(function () {
            const nombre = this.tagName;
            html += `<li><strong>${nombre}:</strong> ${procesarNodo(this)}</li>`;
        });
        html += '</ul>';
        html += "</article>"

        $("main").html(html);
    }

    async readInputFileKML(files) {
        const archivo = files[0];

        const tipoKml = /kml/;

        console.log(archivo.type);
        if (archivo) {
            const lector = new FileReader();
            this.añadirTextoError(1,"");

            lector.onload = (e) => {
                const kmlString = e.target.result;
                const parser = new DOMParser();
                const kml = parser.parseFromString(kmlString, "application/xml");

                const geojson = this.kmlToGeoJSON(kml);

                try{
                    this.mostrarMapa(geojson);
                }catch(error){
                    this.añadirTextoError(1,"Tipo de archivo incorrecto");
                }

            };

            lector.readAsText(archivo);
        } else {
            this.añadirTextoError(1,"Tipo de archivo incorrecto");
        }
    }

    mostrarMapa(geojson) {
        $('main > article').remove();
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmVnZWdhZmVybmFuZG8iLCJhIjoiY20zZWkxaDNwMGI4ZTJscXhhbGsxeWI3aiJ9.5OHMMeLIsf0DgIkGXEo3jA';

        const article = $("<article>");
        article.append($("<h2>").text("Mapa Dinámico"));
        const divMapa = $("<div></div>");
        article.append(divMapa);
        $("main").append(article);

    var map = new mapboxgl.Map({
    container: divMapa[0],
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [geojson.features[0].geometry.coordinates[0][0], geojson.features[0].geometry.coordinates[0][1]],
            zoom: 10 
        });

        map.on('load', () => {
            map.addSource('kmlData', {
                type: 'geojson',
                data: geojson
            });

            map.addLayer({
                id: 'kmlLayer',
                type: 'line',
                source: 'kmlData',
                paint: {
                    'line-color': '#FF0000',
                    'line-width': 2
                }
            });

            const bounds = new mapboxgl.LngLatBounds();
            geojson.features.forEach((feature) => {
                feature.geometry.coordinates.forEach((coord) => {
                    bounds.extend(coord);
                });
            });
            map.fitBounds(bounds, { padding: 20 });
        });
    }

    kmlToGeoJSON(kmlString) {
        var parser = new DOMParser();
        var kml = typeof kmlString === "string" ? parser.parseFromString(kmlString, "application/xml") : kmlString;
    
        var geojson = {
            type: "FeatureCollection",
            features: []
        };
    
        function parseCoordinates(coordinateString) {
            var coords = coordinateString.trim().split(/\s+/);
            var result = [];
            for (var i = 0; i < coords.length; i++) {
                var parts = coords[i].split(",");
                var lon = parseFloat(parts[0]);
                var lat = parseFloat(parts[1]);
                var alt = 0;
                if (parts[2]) {
                alt = parseFloat(parts[2]);
                }
                result[i] = [lon, lat, alt];
            }
            return result;
        }
    
        var placemarks = kml.getElementsByTagName("Placemark");
        for (var i = 0; i < placemarks.length; i++) {
            var placemark = placemarks[i];
            var feature = {
                type: "Feature",
                properties: {},
                geometry: null
            };
    
            var nameNode = placemark.getElementsByTagName("name")[0];
            var descNode = placemark.getElementsByTagName("description")[0];
            if (nameNode) {
                feature.properties.name = nameNode.textContent;
            }
            if (descNode) {
                feature.properties.description = descNode.textContent;
            }
    
            var point = placemark.getElementsByTagName("Point")[0];
            var lineString = placemark.getElementsByTagName("LineString")[0];
            var polygon = placemark.getElementsByTagName("Polygon")[0];
    
            if (point) {
                var pointCoordsText = point.getElementsByTagName("coordinates")[0].textContent;
                var pointCoords = parseCoordinates(pointCoordsText);
                feature.geometry = {
                    type: "Point",
                    coordinates: pointCoords[0]
                };
            } else if (lineString) {
                var lineCoordsText = lineString.getElementsByTagName("coordinates")[0].textContent;
                var lineCoords = parseCoordinates(lineCoordsText);
                feature.geometry = {
                    type: "LineString",
                    coordinates: lineCoords
                };
            } else if (polygon) {
                var outerBoundary = polygon.getElementsByTagName("outerBoundaryIs")[0];
                var linearRing = outerBoundary.getElementsByTagName("LinearRing")[0];
                var polyCoordsText = linearRing.getElementsByTagName("coordinates")[0].textContent;
                var polyCoords = parseCoordinates(polyCoordsText);
                feature.geometry = {
                    type: "Polygon",
                    coordinates: [polyCoords]
                };
            }
    
            if (feature.geometry) {
                geojson.features[i] = feature;
            }
        }
    
        return geojson;
    }
    

    readInputFileSVG(files) {
        const archivo = files[0];
        const tipoSvg = /svg/;
    
        if (archivo && archivo.type.match(tipoSvg)) {
            const lector = new FileReader();
            this.añadirTextoError(2, "");
    
            lector.onload = (e) => {
                const contenidoSvg = e.target.result;
                this.mostrarSVG(contenidoSvg);
            };
    
            lector.readAsText(archivo);
        } else {
            this.añadirTextoError(2, "Tipo de archivo incorrecto");
        }
    }
    

    mostrarSVG(contenidoSvg) {
    
        $('main > article').remove();

        const h2 = $('<h2>').text('Contenido SVG');
       
        
        const article = $("<article> </article>").html(contenidoSvg);
        $(article).prepend(h2);
        
    
        $("main").append(article);
    }

}



const circuito = new Circuito();