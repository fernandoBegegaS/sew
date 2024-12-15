class Trivia {
  constructor() {
      this.elements =[
        {
          "pregunta": "¿Quién ganó el Campeonato Mundial de Fórmula 1 en 2020?",
          "respuesta1": "Lewis Hamilton",
          "respuesta2": "Sebastian Vettel",
          "respuesta3": "Max Verstappen",
          "respuesta4": "Valtteri Bottas",
          "respuesta5": "Daniel Ricciardo",
          "respuestaCorrecta": "Lewis Hamilton"
        },
        {
          "pregunta": "¿En qué año se celebró la primera carrera de Fórmula 1?",
          "respuesta1": "1950",
          "respuesta2": "1947",
          "respuesta3": "1960",
          "respuesta4": "1927",
          "respuesta5": "1980",
          "respuestaCorrecta": "1950"
        },
        {
          "pregunta": "¿Quién es conocido como el 'Rey de Mónaco' en Fórmula 1?",
          "respuesta1": "Alain Prost",
          "respuesta2": "Sebastian Vettel",
          "respuesta3": "Ayrton Senna",
          "respuesta4": "Juan Manuel Fangio",
          "respuesta5": "Kimi Räikkönen",
          "respuestaCorrecta": "Ayrton Senna"
        },
        {
          "pregunta": "¿Qué piloto tiene más títulos mundiales en la historia de la Fórmula 1?",
          "respuesta1": "Michael Schumacher",
          "respuesta2": "Juan Manuel Fangio",
          "respuesta3": "Lewis Hamilton",
          "respuesta4": "Alain Prost",
          "respuesta5": "Sebastian Vettel",
          "respuestaCorrecta": "Michael Schumacher"
        },
        {
          "pregunta": "¿Qué equipo ganó el Campeonato de Constructores en 2021?",
          "respuesta1": "Mercedes",
          "respuesta2": "Ferrari",
          "respuesta3": "Red Bull Racing",
          "respuesta4": "McLaren",
          "respuesta5": "Alpine",
          "respuestaCorrecta": "Mercedes"
        },
        {
          "pregunta": "¿Qué piloto tiene el récord de más victorias en el Gran Premio de Brasil?",
          "respuesta1": "Ayrton Senna",
          "respuesta2": "Michael Schumacher",
          "respuesta3": "Lewis Hamilton",
          "respuesta4": "Felipe Massa",
          "respuesta5": "Kimi Räikkönen",
          "respuestaCorrecta": "Ayrton Senna"
        },
        {
          "pregunta": "¿En qué circuito se corre el Gran Premio de Mónaco?",
          "respuesta1": "Circuit de Spa-Francorchamps",
          "respuesta2": "Autódromo Hermanos Rodríguez",
          "respuesta3": "Circuito de Silverstone",
          "respuesta4": "Circuito de Montecarlo",
          "respuesta5": "Circuito de Suzuka",
          "respuestaCorrecta": "Circuito de Montecarlo"
        },
        {
          "pregunta": "¿Cuál fue el primer año de Ferrari en la Fórmula 1?",
          "respuesta1": "1950",
          "respuesta2": "1947",
          "respuesta3": "1953",
          "respuesta4": "1965",
          "respuesta5": "1939",
          "respuestaCorrecta": "1950"
        },
        {
          "pregunta": "¿Qué piloto ganó su primer Gran Premio en la temporada 2016?",
          "respuesta1": "Max Verstappen",
          "respuesta2": "Daniel Ricciardo",
          "respuesta3": "Valtteri Bottas",
          "respuesta4": "Kimi Räikkönen",
          "respuesta5": "Sebastian Vettel",
          "respuestaCorrecta": "Max Verstappen"
        },
        {
          "pregunta": "¿Quién fue el primer piloto en conseguir 100 victorias en la Fórmula 1?",
          "respuesta1": "Lewis Hamilton",
          "respuesta2": "Michael Schumacher",
          "respuesta3": "Ayrton Senna",
          "respuesta4": "Sebastian Vettel",
          "respuesta5": "Alain Prost",
          "respuestaCorrecta": "Lewis Hamilton"
        },
        {
          "pregunta": "¿Qué piloto británico debutó en la Fórmula 1 con el equipo McLaren en 2007?",
          "respuesta1": "Lewis Hamilton",
          "respuesta2": "Jenson Button",
          "respuesta3": "David Coulthard",
          "respuesta4": "Kimi Räikkönen",
          "respuesta5": "Lando Norris",
          "respuestaCorrecta": "Lewis Hamilton"
        },
        {
          "pregunta": "¿Qué equipo es conocido como 'La Scuderia' en la Fórmula 1?",
          "respuesta1": "McLaren",
          "respuesta2": "Ferrari",
          "respuesta3": "Mercedes",
          "respuesta4": "Red Bull Racing",
          "respuesta5": "Alpine",
          "respuestaCorrecta": "Ferrari"
        },
        {
          "pregunta": "¿En qué país se encuentra el Circuito de Suzuka?",
          "respuesta1": "China",
          "respuesta2": "Australia",
          "respuesta3": "Japón",
          "respuesta4": "Singapur",
          "respuesta5": "Corea del Sur",
          "respuestaCorrecta": "Japón"
        },
        {
          "pregunta": "¿Qué piloto de Fórmula 1 fue apodado 'El Torpedo'?",
          "respuesta1": "Sebastian Vettel",
          "respuesta2": "Kimi Räikkönen",
          "respuesta3": "Vladimir Putin",
          "respuesta4": "Vitaly Petrov",
          "respuesta5": "Romain Grosjean",
          "respuestaCorrecta": "Kimi Räikkönen"
        },
        {
          "pregunta": "¿Cuál es el nombre de la famosa curva del Circuito de Silverstone conocida por su velocidad?",
          "respuesta1": "La Curva Becketts",
          "respuesta2": "La Curva Eau-Rouge",
          "respuesta3": "La Curva Copse",
          "respuesta4": "La Curva Ascari",
          "respuesta5": "La Curva Parabolica",
          "respuestaCorrecta": "La Curva Copse"
        }
      ];

      this.numeroPreguntas = 10;
      this.index = 0;
      this.aciertos = 0;
      this.timeLeft = 10;
      this.correctSound = new Audio('multimedia/audios/acierto.mp3');
      this.errorSound = new Audio('multimedia/audios/error.mp3');

      $('div > span').text(""+this.timeLeft);
  }

  shuffleElements() {
    for (let i = this.elements.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
    }
  }

  construirHTMLPregunta() {
    const pregunta = this.elements[this.index];

    $('article').find('div[data-pregunta]').remove();

    const preguntaHTML = `
      <article data-pregunta="${this.index}">
        <h4>${pregunta.pregunta}<h4>
        <input type="radio" name="respuesta" value="${pregunta.respuesta1}"> ${pregunta.respuesta1}<br>
        <input type="radio" name="respuesta" value="${pregunta.respuesta2}"> ${pregunta.respuesta2}<br>
        <input type="radio" name="respuesta" value="${pregunta.respuesta3}"> ${pregunta.respuesta3}<br>
        <input type="radio" name="respuesta" value="${pregunta.respuesta4}"> ${pregunta.respuesta4}<br>
        <input type="radio" name="respuesta" value="${pregunta.respuesta5}"> ${pregunta.respuesta5}<br>
      </article>
    `;

    $('article').append(preguntaHTML);
  }

  comprobarRespuesta() {
    const respuestaSeleccionada = $('input[name="respuesta"]:checked').val();
    const respuestaCorrecta = this.elements[this.index]["respuestaCorrecta"];

    if (respuestaSeleccionada === respuestaCorrecta) {
      this.aciertos++;
      this.correctSound.play(); // Reproducir sonido si acierta
    }else{
      this.errorSound.play();
    }

    this.mostrarSiguientePregunta(); // Pasar a la siguiente pregunta
  }

  mostrarSiguientePregunta() {
    this.index++;
    if (this.index < this.numeroPreguntas) {
      this.construirHTMLPregunta();
    } else {
      clearInterval(this.timer);

    var mejor = localStorage.getItem('mejor');

    $('article').html('<h3>¡Trivia completada!</h3>'); 

    if (this.aciertos > mejor || mejor == null) {
      $('article').append('<p>Nuevo record personal, ha acertado ' + this.aciertos + ' de ' + this.index + '</p>');
      localStorage.setItem('mejor', this.aciertos);
    } else {
      $('article').append('<p>Ha acertado ' + this.aciertos + ' de ' + this.index + '</p>');
      $('article').append('<p>Su mejor puntuación hasta el momento es ' + mejor + ' aciertos</p>');
}
    }
  }

  iniciarTemporizador() {
    let tiempoGuardado = sessionStorage.getItem('tiempoRestante');
    if (tiempoGuardado === null || 0 >= tiempoGuardado) {
      this.timeLeft = 10;
    } else {
      this.timeLeft = parseInt(tiempoGuardado);
    }

    $('div > span').text(`${this.timeLeft} segundos`);

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.funcionIntervalo();
    }, 1000);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(this.timer);
        sessionStorage.setItem('tiempoRestante', this.timeLeft);
      } else {
        if (this.index < this.numeroPreguntas) {
          this.reiniciarTemporizador();
        }
      }
    });
  }

  reiniciarTemporizador() {
    sessionStorage.setItem('tiempoRestante', this.timeLeft);

    $('div > span').text(`${this.timeLeft} segundos`);

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.funcionIntervalo();
    }, 1000);

  }

  funcionIntervalo(){
    this.timeLeft--;
      $('div > span').text(`${this.timeLeft} segundos`);

      sessionStorage.setItem('tiempoRestante', this.timeLeft);

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        sessionStorage.removeItem('tiempoRestante');
        this.index = this.numeroPreguntas;
        this.mostrarSiguientePregunta();
      }
  }

  inicializrBotones() {
    $('button:contains("Iniciar")').click(() => {
      this.iniciarTrivia();
    });
  }

  iniciarTrivia() {
    this.shuffleElements();
    this.index = 0;
    this.aciertos = 0;

    $('article').remove();

    const articleHTML = `
      <article>
       <h3>Responde rapido<h3>
        <button>Siguiente</button>
      </article>
    `;

    const existingButton = $('button');
    if (existingButton.length) {
      existingButton.first().before(articleHTML);
    } else {
      $('body').append(articleHTML);
    }

    this.construirHTMLPregunta();
    this.iniciarTemporizador();

    $('button:contains("Siguiente")').click(() => {
      this.comprobarRespuesta();
    });
  }

  guardarProgreso(aciertos, indicePregunta) {
    localStorage.setItem('aciertos', aciertos);
    localStorage.setItem('indicePregunta', indicePregunta);
  }
}

const miTrivia = new Trivia();
miTrivia.inicializrBotones();

