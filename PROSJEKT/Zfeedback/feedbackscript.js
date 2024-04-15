// Henter objekter fra DOM
let submitBtn = document.getElementById('submit')

let MostLikedOpts = document.querySelectorAll('Input[type = "radio"]')
let WhyLiked = document.querySelector('#WhyLiked')
let TriviaRating = document.querySelector('#TriviaRating')
let DinoRating = document.querySelector('#DinoRating')


function Submit(){
    
    console.log('hello')
    console.log(MostLikedOpts)
}


submitBtn.addEventListener('click', Submit)