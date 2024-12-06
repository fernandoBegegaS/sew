class Agenda {
    constructor(url) {
      this.url = url;
    }
  
    obtenerCarreras() {
        // Llamada AJAX para obtener los datos
        $.ajax({
            url: this.url,
            method: "GET",
            dataType: "json"
        }).done((data) => {
            const carreras = data.MRData.RaceTable.Races;

            if (carreras.length === 0) {
                console.warn("No se encontraron carreras.");
                return;
            }

            // Limpiar el contenido anterior antes de mostrar nuevas carreras
            $("body").find("#carreras-container").remove();

            // Contenedor para las carreras
            const container = $("<div>").attr("id", "carreras-container");

            carreras.forEach(race => {
                const art = $("<article>").addClass("carrera");

                // Nombre de la carrera como un <h3>
                art.append($("<h3>").text(race.raceName));

                // Fecha y hora de la carrera
                art.append($("<p>").text(`Fecha: ${race.date}`));
                art.append($("<p>").text(`Hora: ${race.time || "No especificada"}`));

                // Información del circuito
                art.append($("<p>").text(`Circuito: ${race.Circuit.circuitName}`));
                art.append($("<p>").text(`País: ${race.Circuit.Location.country}`));
                art.append($("<p>").text(`Latitud: ${race.Circuit.Location.lat}`));
                art.append($("<p>").text(`Longitud: ${race.Circuit.Location.long}`));

                // Añadir el artículo al contenedor
                container.append(art);
            });

            // Añadir el contenedor al cuerpo del documento
            $("body").append(container);
        }).fail((jqXHR, textStatus, errorThrown) => {
            console.error("Error al obtener los datos de la API:", textStatus, errorThrown);
            alert("No se pudieron cargar los datos. Intenta más tarde.");
        });
    }

    añadirEventoAlBoton() {
        // Añadir evento click al botón
        $("button").on("click", () => {
            this.obtenerCarreras(); // Llamar al método para obtener las carreras
        });
    }
}

// Instanciar y configurar la agenda
const agenda = new Agenda("http://ergast.com/api/f1/current.json");
agenda.añadirEventoAlBoton();
