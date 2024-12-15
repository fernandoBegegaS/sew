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

                const geojson = toGeoJSON.kml(kml);

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