// Henter objekter fra DOM
let submitBtn = document.getElementById('submit')

let MostLikedOpts = document.querySelectorAll('Input[type = "radio"]')
let WhyLikedQuery = document.querySelector('#WhyLiked')
let TriviaRatingQuery = document.querySelector('#TriviaRating')
let DinoRatingQuery = document.querySelector('#DinoRating')
let ElseQuery = document.querySelector('#other')

// Definerer variabler
let MostLikedOpt
let WhyLiked
let TriviaRating
let DinoRating
let Else 

function Submit(){
    console.log('hello')
    
    for (let i = 0; i < MostLikedOpts.length; i++){
        if (MostLikedOpts[i].checked){
            MostLikedOpt = MostLikedOpts[i].value 
        }
    }
    WhyLiked = WhyLikedQuery.value
    TriviaRating = TriviaRatingQuery.value
    DinoRating = DinoRatingQuery.value
    Else = ElseQuery.value


}


submitBtn.addEventListener('click', Submit)