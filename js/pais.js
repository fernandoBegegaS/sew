
        
        class Pais {
            constructor(nombre, capital, poblacion) {
                this.nombre = nombre;           
                this.capital = capital;         
                this.poblacion = poblacion; 
                this.circuito = null;       
                this.gobierno = null;       
                this.coordenadas = null; 
                this.religion = null;   
            }

            rellenar(circuito,gobierno,coordenadas,religion){
                this.circuito = circuito;       
                this.gobierno = gobierno;       
                this.coordenadas = coordenadas; 
                this.religion = religion;  
            }

            getNombre(){
                document.write( "<p> " + this.nombre + "</p>"); 
            }

            getCapital(){
                document.write( "<p> " + this.capital + "</p>"); 
            }

            getInformacionSecundaria(){
                let string = "<ul>";

                string += "<li> " + this.circuito + "</li>" ;
                string += "<li> " + this.gobierno + "</li>" ;
                string += "<li> " + this.coordenadas + "</li>"; 
                string += "<li> " + this.religion + "</li>" ;

                string += "</ul>";

                document.write( string );
                
            }


            getMeteorologia() {
                const apikey = "98f3fc1bf6134541332f676c5c9c1318";
                const ciudad = "Zandvoort"; 
                const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&mode=xml&units=metric&lang=es&appid=${apikey}`;
                
                $.ajax({
                    dataType: "xml",
                    url: url,
                    method: 'GET',
                    success: function(datos) {
                        const pronosticosPorDia = {};
            
                        $(datos).find('time').each(function() {
                            const fechaIntervalo = $(this).attr('from').split('T')[0]; 
                            const hora = $(this).attr('from').split('T')[1].split(':')[0]; 
            
                            if (hora === '12') {
                                const temperaturaMax = parseFloat($(this).find('temperature').attr('max'));
                                const temperaturaMin = parseFloat($(this).find('temperature').attr('min'));
                                const humedad = $(this).find('humidity').attr('value');
                                const condiciones = $(this).find('symbol').attr('name'); 
                                const iconoCodigo = $(this).find('symbol').attr('var'); 
            
                                const iconoURL = `multimedia/imagenes/${iconoCodigo}@2x.png`;
            
                               
                                if (!pronosticosPorDia[fechaIntervalo]) {
                                    pronosticosPorDia[fechaIntervalo] = {
                                        max: temperaturaMax,
                                        min: temperaturaMin,
                                        humedad: humedad,
                                        condiciones: condiciones,
                                        iconoURL: iconoURL
                                    };
                                }
                            }
                        });
                        
                        
                        const main = $("<main>");
                        $("body").append(main);
                        const section = $("<section>");
                        main.append(section);
                        const header = $("<h3>Prediccion</h3>");
                        section.append(header);

                        
                        for (let fecha in pronosticosPorDia) {
                            const temperaturaMax = pronosticosPorDia[fecha].max;
                            const temperaturaMin = pronosticosPorDia[fecha].min;
                            const humedad = pronosticosPorDia[fecha].humedad;
                            const condiciones = pronosticosPorDia[fecha].condiciones;
                            const iconoURL = pronosticosPorDia[fecha].iconoURL;
                            
                           
                            const articulo = $("<article></article>"); 
            
                            articulo.append(`<h2>${fecha}`);
                            var imagen = $("<img>");
                            imagen.attr("src", iconoURL);
                            imagen.attr("alt", condiciones);
                            articulo.append(imagen);
                            articulo.append(`<p>Temperatura máxima: ${temperaturaMax} °C</p>`);
                            articulo.append(`<p>Temperatura mínima: ${temperaturaMin} °C</p>`);
                            articulo.append(`<p>Humedad: ${humedad}%</p>`);
            
                            section.append(articulo);
                        }
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.error("Error en la solicitud:", errorThrown);
                        console.error("Detalles del error:", xhr.responseText);
                        $("body").append("<p>¡Tenemos problemas! No puedo obtener XML de OpenWeatherMap.</p>");
                    }
                });
            }
        }
            
        
        var pais = new Pais("Paises Bajos", "Amsterdam", 17963553);
        pais.rellenar("Circuito de Zandvoort", "Monarquía Constitucional", "52°23'23 N 4°32'28 E", "Calvinista");

        pais.getNombre();
        pais.getCapital();
        pais.getInformacionSecundaria();
        pais.getMeteorologia();
    