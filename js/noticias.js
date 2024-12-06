class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
    {  
        document.write("<p>Este navegador soporta el API File </p>");
    }
        else document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }

    async readInputFile(files) {
        var archivo = files[0];
        const tipoTexto = /text.*/;
        

        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();

            lector.onload = (evento) => {
                const noticias = lector.result.split("_");

                const mainElement = document.querySelector("section");
                mainElement.innerHTML = ""; 

                noticias.forEach((noticia) => {
                    const article = document.createElement("article");
                    const p = document.createElement("p");

                    p.textContent = noticia;

                    article.appendChild(p);
                    mainElement.appendChild(article);
                });
            };

            lector.readAsText(archivo);
        } else {
            console.error("Error: ¡Archivo no válido!");
            const errorArchivo = document.getElementById("errorArchivo");
            if (errorArchivo) {
                errorArchivo.textContent = "Error: ¡Archivo no válido!";
            }
        }
    }
}

const noticias = new Noticias();

