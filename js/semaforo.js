class Semaforo {
    levels = [0.2, 0.5, 0.8];
    lights = 4;
    unload_moment = null;
    clic_moment = null;
    difficulty;

    constructor() {
        const randomIndex = Math.floor(Math.random() * this.levels.length);
        this.difficulty = this.levels[randomIndex];
    }

    createStructure() {
        
        const main = document.querySelector("main");

        const h2 = document.createElement("h3");
        h2.textContent = "Semaforo"; 
        main.appendChild(h2);

        for (let index = 0; index < this.lights; index++) {
            const semaforo = document.createElement("div");
            main.appendChild(semaforo); 
        }

        const botonInicio = document.createElement("button");
        botonInicio.textContent = "iniciar";
        botonInicio.onclick = () => this.initSequence(botonInicio, botonParar); 

        const botonParar = document.createElement("button");
        botonParar.textContent = "parar"; 
        

        main.appendChild(botonInicio);
        main.appendChild(botonParar);
    }

    initSequence(botonInicio, botonParar) {

        
        const main = document.querySelector("main");

        $("table").prev("h3").remove();
        $("table").remove();
        $("form").prev("p").remove();
        $("form").remove();

        const existingDisplay = main.querySelector("p");
        if (existingDisplay) {
            existingDisplay.remove();
        }

        main.classList.add("load");
        botonInicio.disabled = true; 
        botonParar.disabled = false; 

        const timeoutDuration = 2000 + (this.difficulty * 100);

        setTimeout(() => {
            botonParar.onclick = () => this.stopReaction(botonInicio, botonParar);
            this.unload_moment = new Date();
            this.endSequence(botonInicio);
        }, timeoutDuration);
    }

    endSequence(botonInicio) {
        const main = document.querySelector("main");
        main.classList.remove('load');
        main.classList.add("unload");
    }

    stopReaction(botonInicio, botonParar) {
        this.clic_moment = new Date();

        const reactionTime = this.clic_moment - this.unload_moment;
        

        const reactionDisplay = document.createElement("p");
        const main = document.querySelector("main")
        main.classList.remove('unload');
        main.appendChild(reactionDisplay);

        reactionDisplay.textContent = `Tiempo de reacción: ${reactionTime} ms`;

        botonInicio.disabled = false; 
        botonParar.disabled = true; 
        botonParar.onclick = null;

        this.createRecordForm();
    }

    msToSeconds(milliseconds) {
        if (isNaN(milliseconds) || milliseconds < 0) {
            throw new Error("El valor debe ser un número no negativo.");
        }
        return (milliseconds / 1000).toFixed(2); // Devuelve un número redondeado a 2 decimales
    }
    
    createRecordForm() {
        // Eliminar el formulario anterior, si existe
        $('article').remove();
    
        // Crear el nuevo formulario con los campos requeridos
        const form = `
            <article>
                <p>Registrar puntuación</p>
    
                <form id="#" method="post">
                    <label for="firstName">Nombre:</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Ingrese el nombre" required>
    
                    <label for="lastName">Apellidos:</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Ingrese los apellidos" required>
    
                    <label for="difficulty">Nivel del juego:</label>
                    <input type="text" id="difficulty" name="difficulty" value="${this.difficulty}" readonly>
    
                    <label for="reactionTime">Tiempo de reacción (en segundos):</label>
                    <input type="number" id="reactionTime" name="reactionTime" 
                           value="${this.msToSeconds(this.clic_moment - this.unload_moment)}" readonly>
                    <span></span>
    
                    <button type="submit" id="submitScore">Guardar Puntuación</button>
                </form>
            </article>
        `;
    
        // Añadir el formulario al contenedor principal
        $('main').append(form);
    }
    
}

const semaforo = new Semaforo();
semaforo.createStructure();
