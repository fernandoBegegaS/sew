
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
        this.mostrarMapaEstatico();
        this.mostrarMapaDinamico();
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
    
        const divMapa = $("<div id='divMapa'></div>");
        article.append(divMapa);
    
        $("main").append(article);
    
        const longitud = this.longitud ; 
        const latitud = this.latitud ;   


        var map = new mapboxgl.Map({
        container: 'divMapa',
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
        console.error("Error de geolocalización: ", error.message);
    }

}


class Carrusel{
    
  añadirFuncioncionalidad(){
        const slides = document.querySelectorAll("img");

// select next slide button
const nextSlide = document.querySelector("button:nth-of-type(1)");

// current slide counter
let curSlide = 3;
// maximum number of slides
let maxSlide = slides.length - 1;

// add event listener and navigation functionality
nextSlide.addEventListener("click", function () {
  // check if current slide is the last and reset current slide
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  //   move slide by -100%
  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});

// select next slide button
const prevSlide = document.querySelector("button:nth-of-type(2)");

// add event listener and navigation functionality
prevSlide.addEventListener("click", function () {
  // check if current slide is the first and reset current slide to last
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }

  //   move slide by 100%
  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});
    }
}

var carrusel = new Carrusel();
carrusel.añadirFuncioncionalidad();
var miPosicion = new Geolocalizacion();

