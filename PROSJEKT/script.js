

// Henter elementer fra DOM
const spillContainer = document.querySelector('#spillContainer')

// Spillene; objekt
let dinoEl = {
    navn: "Dino",
    link: "DinoGame/dino.html",
    bgBilde: "bilder/Dino.png" 
}
let triviaEl = {
    navn: "Trivia",
    link: "TriviaGame/trivia.html",
    bgBilde: "bilder/Trivia.jpg"
}


// Spillene; array
let spill = [dinoEl, triviaEl]


// Fyll spillcontainer
function LeggTilSpill(){
    for(let i = 0; i<spill.length; i++){
        // Lager html-elementene
        let divEl = document.createElement('div')
        let pEl = document.createElement('p')
        let linkEl = document.createElement('a') 

        // Setter riktig link, bilde og navn til spillene
        divEl.style.backgroundImage = `url(${spill[i].bgBilde})`
        divEl.style.backgroundSize = 'cover'
        
        linkEl.setAttribute('href', spill[i].link)
        pEl.innerHTML = spill[i].navn

        //Gir klasse til styling i css
        divEl.classList.add('spillDiv')
        linkEl.classList.add('spillLink')
        pEl.classList.add('spillTittel')

        //Legger de inn i hverandre
        divEl.appendChild(linkEl)
        linkEl.appendChild(pEl)

        //Legger til i spill container
        spillContainer.appendChild(divEl)
    }
}

LeggTilSpill()