class Fondo {

    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
    }

    cargarImagen() {
        const apiKey = '41f4017ceadadfd2f4e6c6f77529e271'; 
        const tags = `formula1, ${this.pais} f1`; 
        const format = 'json';

        const flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search";

        $.getJSON(flickrAPI, {
            api_key: apiKey,
            tags: tags,
            format: 'json',
            nojsoncallback: 1,
            content_type: 1,
            media: 'photos', 
            extras: 'url_o', 
            per_page: 10, 
            page: 1  
        })
        .done(function(data) {
            

            const photo = data.photos.photo[0]; // Obtener la primera foto
            const imgSrc = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
            const cssRegla = `
            <style>
                body {
                    background-image: url('${imgSrc}');
                    background-size: cover;        
                    background-position: center center; 
                    background-repeat: no-repeat;  
                    min-height: 100vh;             
                }
            </style>
        `;
            $("head").append(cssRegla);
        })
        .fail(function(jqxhr, textStatus, error) {
            console.error("Hubo un problema con la petición:", textStatus, error);
        });
    }
}

const fondo = new Fondo("Paises bajos","Amsterdam","Zandvoort");
fondo.cargarImagen();
