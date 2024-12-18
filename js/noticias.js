class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            document.write("<p>Este navegador soporta el API File</p>");
        } else {
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
        }
    }

    async readInputFile(files) {
        const archivo = files[0];
        const tipoTexto = /text.*/;

        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader(); 

            lector.onload = () => {
                const lineas = lector.result.split("\n"); 

                const mainElement = document.querySelector("main");

                let sectionElement = mainElement.querySelector("section");
                

                sectionElement.innerHTML = ""; 

                const h3Element = document.createElement("h3");
                h3Element.textContent = "Últimas noticias";
                sectionElement.appendChild(h3Element);

                
                lineas.forEach((linea, index) => {
                    if (linea.trim() !== "") {
                        const partes = linea.split("_"); 

                        
                        if (partes.length === 3) {
                            const [titulo, contenido, autor] = partes;

                            
                            const article = document.createElement("article");

                            const h2 = document.createElement("h2");
                            h2.textContent = titulo;

                            const pContenido = document.createElement("p");
                            pContenido.textContent = contenido;

                            const pAutor = document.createElement("p");
                            pAutor.innerHTML = `Autor: <small>${autor}</small>`;

                           
                            article.appendChild(h2);
                            article.appendChild(pContenido);
                            article.appendChild(pAutor);

                           
                            sectionElement.appendChild(article);


                            const mainElement = document.querySelector("main");
                            const prevParagraph = mainElement.previousElementSibling;
                            prevParagraph.textContent = "";
                        } 
                    }
                });
            };

            
            lector.readAsText(archivo);
        } else {
            const mainElement = document.querySelector("main");
            const prevParagraph = mainElement.previousElementSibling;
            prevParagraph.textContent = "Tipo de archivo invalido";

         
            
        }
    }
}


const noticias = new Noticias();
