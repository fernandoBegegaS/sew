class Memoria {
    constructor() {
        // Definición del objeto JSON elements
        this.elements = [ {
            "element": "RedBull",
            "source": "multimedia/imagenes/Red_Bull_Racing_logo.svg"
        },
        {
            "element": "McLaren",
            "source": "multimedia/imagenes/McLaren_Racing_logo.svg"
        },
        {
            "element": "Alpine",
            "source": "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg"
        },
        {
            "element": "AstonMartin",
            "source": "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        {
            "element": "Ferrari",
            "source": "multimedia/imagenes/Scuderia_Ferrari_Logo.svg"
        },
        {
            "element": "Mercedes",
            "source": "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg"
        },{
            "element": "RedBull",
            "source": "multimedia/imagenes/Red_Bull_Racing_logo.svg"
        },
        {
            "element": "McLaren",
            "source": "multimedia/imagenes/McLaren_Racing_logo.svg"
        },
        {
            "element": "Alpine",
            "source": "multimedia/imagenes/Alpine_F1_Team_2021_Logo.svg"
        },
        {
            "element": "AstonMartin",
            "source": "multimedia/imagenes/Aston_Martin_Aramco_Cognizant_F1.svg"
        },
        {
            "element": "Ferrari",
            "source": "multimedia/imagenes/Scuderia_Ferrari_Logo.svg"
        },
        {
            "element": "Mercedes",
            "source": "multimedia/imagenes/Mercedes_AMG_Petronas_F1_Logo.svg"
        }
        ];

        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.shuffleElements();
        this.createElements();
        this.addActionListeners();
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {

            this.firstCard.removeAttribute('data-state');
            this.secondCard.removeAttribute('data-state');  
            this.resetBoard();
        }, 750); 
        
        
        
    }

    resetBoard() {
        
        this.firstCard = null;
        this.secondCard = null;

        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch() {
        if (this.compareCards()) {
            this.disableCards();
        } else {
            this.unflipCards();
        }
    }

    disableCards() {

        this.firstCard.setAttribute("data-state","revealed");
        this.secondCard.setAttribute("data-state","revealed");
        this.resetBoard();
        
    }

    compareCards(){
        return this.firstCard.getAttribute("data-element") ==  this.secondCard.getAttribute("data-element");
    }

   

    createElements() {
        this.shuffleElements();
        const tablero = document.querySelector("section");
        
        this.elements.forEach(item => {
            tablero.appendChild((this.createElement(item.element, item.source)));
        });

        
    }

    createElement(element, source) {
        const article = document.createElement("article");
        article.setAttribute("data-element", element);

        const h3 = document.createElement("h3");
        h3.textContent = "Memory Card";

        const img = document.createElement("img");
        img.setAttribute("alt", element);
        img.setAttribute("src", source);

        article.appendChild(h3);
        article.appendChild(img);

        return article;
    }


    
    addActionListeners() {
        const parentElement = document.querySelector('section'); 
        const children = parentElement.querySelectorAll('article'); 

        
        children.forEach(child => {
            child.onclick = () => {
                const flip = this.flipCard.bind(this,child);
                flip();
            }; 
        });
    }

    


    flipCard(card){

        if (card.getAttribute('data-state') === 'revealed') return; 
        if (this.lockBoard) return; 
        if (card === this.firstCard) return;

        card.setAttribute('data-state', 'flip');

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card;
        } else {
            this.secondCard = card;
            this.checkForMatch();
        }

    }

}




