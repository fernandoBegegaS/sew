class Agenda {
    constructor(url) {
        this.url = url;
    }
  
    obtenerCarreras() {
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

            $("body").find("section").remove();

            const section = $("<section>");
            const header = $("<h2>").text("Calendario de Carreras");
            section.append(header);

            carreras.forEach(race => {
                const article = $("<article>");
                article.append($("<h3>").text(race.raceName));

                article.append($("<p>").text(`Fecha: ${race.date}`));
                article.append($("<p>").text(`Hora: ${race.time || "No especificada"}`));

                article.append($("<p>").text(`Circuito: ${race.Circuit.circuitName}`));
                article.append($("<p>").text(`País: ${race.Circuit.Location.country}`));
                article.append($("<p>").text(`Latitud: ${race.Circuit.Location.lat}`));
                article.append($("<p>").text(`Longitud: ${race.Circuit.Location.long}`));

                section.append(article);
            });

            $("body").append(section);
        }).fail((jqXHR, textStatus, errorThrown) => {
            console.error("Error al obtener los datos de la API:", textStatus, errorThrown);
            alert("No se pudieron cargar los datos. Intenta más tarde.");
        });
    }

    añadirEventoAlBoton() {
        $("button").on("click", () => {
            this.obtenerCarreras(); 
        });
    }
}


const agenda = new Agenda("http://ergast.com/api/f1/current.json");
agenda.añadirEventoAlBoton();
