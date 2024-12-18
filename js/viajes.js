class Geolocalizacion {
    constructor() {
        navigator.geolocation.getCurrentPosition(
            this.getPosicion.bind(this),
            this.verErrores.bind(this)
        );
    }
  
    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo = posicion.coords.heading;
        this.velocidad = posicion.coords.speed;
        this.crearBotonesMapa();
    }
  
    crearBotonesMapa() {
        const article = $("<article>");
        article.append($("<h2>").text("Opciones de Mapa"));
  
        const btnMapaEstatico = $("<button>")
        .text("Mostrar Mapa Estático")
        .on("click", (event) => {
            $(event.target).prop("disabled", true);
            this.mostrarMapaEstatico();
        });
    
        const btnMapaDinamico = $("<button>")
        .text("Mostrar Mapa Dinámico")
        .on("click", (event) => {
            $(event.target).prop("disabled", true);
            this.mostrarMapaDinamico();
        });
  
        article.append(btnMapaEstatico, btnMapaDinamico);
        $("main").append(article);
    }
  
    mostrarMapaEstatico() {
      const style_id = "streets-v11"; 
      const accessToken = "pk.eyJ1IjoiYmVnZWdhZmVybmFuZG8iLCJhIjoiY20zZWkxaDNwMGI4ZTJscXhhbGsxeWI3aiJ9.5OHMMeLIsf0DgIkGXEo3jA";
      const lon = this.longitud;
      const lat = this.latitud;
  
      const marker = `pin-s(${lon},${lat})`;
  
      const url = `https://api.mapbox.com/styles/v1/mapbox/${style_id}/static/${marker}/${lon},${lat},14/800x600@2x?access_token=${accessToken}`;
      
      const img = $("<img>").attr("src", url).attr("alt", "Mapa con tu ubicación");
  
      const article = $("<article>");
      article.append($("<h2>").text("Mapa Estático"));
      article.append(img);
  
      $("main").append(article);
  }
  
    mostrarMapaDinamico() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmVnZWdhZmVybmFuZG8iLCJhIjoiY20zZWkxaDNwMGI4ZTJscXhhbGsxeWI3aiJ9.5OHMMeLIsf0DgIkGXEo3jA';
  
        const article = $("<article>");
        article.append($("<h2>").text("Mapa Dinámico"));
  
        const divMapa = $("<div></div>");
        article.append(divMapa);
  
        $("main").append(article);
  
        const longitud = this.longitud;
        const latitud = this.latitud;
  
        const map = new mapboxgl.Map({
            container: divMapa[0],
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitud, latitud],
            zoom: 10
        });
  
        new mapboxgl.Marker()
            .setLngLat([longitud, latitud])
            .addTo(map);
  
        map.addControl(new mapboxgl.NavigationControl(), 'top-left');
        map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left');
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true
        }), 'top-left');
    }
  
    verErrores(error) {
        alert("Error en la geolocalización: " + error.message);
    }
  }
  
  class Carrusel {
  
      
    añadirFuncioncionalidad() {
        const slides = document.querySelectorAll("img");
        const nextSlide = document.querySelector("button:nth-of-type(1)");
        const prevSlide = document.querySelector("button:nth-of-type(2)");
  
        let curSlide = 0;
        const maxSlide = slides.length - 1;
  
        nextSlide.addEventListener("click", function () {
            curSlide = (curSlide === maxSlide) ? 0 : curSlide + 1;
            slides.forEach((slide, indx) => {
                const trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)');
            });
        });
  
        prevSlide.addEventListener("click", function () {
            curSlide = (curSlide === 0) ? maxSlide : curSlide - 1;
            slides.forEach((slide, indx) => {
                const trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)');
            });
        });
    }
  }
  
  const miPosicion = new Geolocalizacion();
  const carrusel = new Carrusel();
  carrusel.añadirFuncioncionalidad();
  