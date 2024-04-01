// For special caracters 
/* Spør didrik neste time */


// Henter objekter fra DOM
let questionEl = document.querySelector('#question')
let selectEl = document.querySelector('#catagory')
let checkAnswerEl = document.querySelector('#checkAnswer')
let scoreEl = document.querySelector('#score')
let optionContainer = document.querySelector('#OptionCont')
let nextQuestionEl = document.querySelector('#nextQuestion')
let buttonContainerEl = document.querySelector('#buttonContainer')
let skipsEl = document.querySelector('#skips')
let wrongAnswersEl = document.querySelector('#wrongAnswers')


// Deklarer variabler 
let correctAnswer
let wrongAnswers


async function getQuestion() {
    let radioEls = document.querySelectorAll('input[type="radio"]')
    let checked = false
    
    if(skips < 2 && checked == false){
        nextQuestionEl.removeEventListener('click', getQuestion)
    }
    for(let s = 0; s < radioEls.length; s++){
        if(radioEls[s].checked){
            checked = true
        }
    }
    if(checked == false){
        skips -= 1
        skipsEl.innerHTML = `Skips remaining : ${skips}`
    }
    console.log(skips)

    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr 1fr"
    checkAnswerEl.style.display = "inline"
    checkAnswerEl.addEventListener('click', checkAnswer)
    optionContainer.innerHTML = ``

    let category = Number(selectEl.value)

    let url = `https://opentdb.com/api.php?amount=1&category=${category}`

    let response = await fetch(url)
    let data = await response.json()
    let questionInfo = data.results[0]
    correctAnswer = questionInfo.correct_answer
    wrongAnswers = questionInfo.incorrect_answers

    console.log(questionInfo)

    questionEl.innerText = `${(questionInfo.question)}`

    let options = [correctAnswer]

    for(let i = 0; i < wrongAnswers.length; i++){
        options.push(wrongAnswers[i])
    }

    // Shuffler array med svaralternativer slik at riktig svar ikke alltid legges først
    function shuffleOptions(){
        for(let j = 0; j<options.length; j++){
        let rndmIndex = Math.floor(Math.random()*options.length)
        let temp = options[j]

        options[j] = options[rndmIndex]
        options[rndmIndex] = temp
        }
    }
    shuffleOptions()

    // Legge til svaralternativene i optionContainer
    for(let t = 0; t<options.length; t++){
        // Lager label og radio-element
        let labelEl = document.createElement('label')
        let radioEl = document.createElement('input')

        radioEl.classList.add('radioBtns') 
        labelEl.classList.add('radioBtnsLabel')
        
        radioEl.type = 'radio'
        radioEl.name = `Options`
        radioEl.value = options[t]

        labelEl.appendChild(radioEl)

        labelEl.innerHTML += options[t]

        optionContainer.append(labelEl)
    }
}

let answeredWrong = 0
let skips = 4
let score = 0
let UserAnswer

// Henter inn radio-elementene lagd i funksjonen ovenfor
function checkAnswer(){
    let radioEls = document.querySelectorAll('input[type="radio"]')
    let checked = false
    
    for(let s = 0; s < radioEls.length; s++){
        if(radioEls[s].checked){
            UserAnswer = radioEls[s].value
            checked = true
        }
    }
    if(checked){
        nextQuestionEl.addEventListener('click', getQuestion)
    }
    else if(checked == false){
        scoreEl.innerHTML = "vennligst kryss av en boks"
        return
    }
    if(UserAnswer == correctAnswer){
        score +=1
        scoreEl.innerHTML = `Du har ${score} riktige svar på rad!` 

        checkAnswerEl.removeEventListener('click', checkAnswer)
    }
    else if(UserAnswer != correctAnswer){
        answeredWrong += 1
        wrongAnswersEl.innerHTML = `Wrong Answers : ${answeredWrong}`

        checkAnswerEl.removeEventListener('click', checkAnswer)
    }

    if(answeredWrong == 3){
        scoreEl.innerHTML = "3 answers wrong - Game Over"

        let restartEl = document.createElement('button')
        restartEl.innerHTML = "Restart"
        restartEl.classList.add('restartBtn')
        restartEl.addEventListener('click', restartGame)

        buttonContainerEl.removeChild(checkAnswerEl)
        buttonContainerEl.removeChild(nextQuestionEl)
        buttonContainerEl.removeChild(selectEl)

        buttonContainerEl.appendChild(restartEl)
        buttonContainerEl.style.gridTemplateColumns = "1fr"

        return
    }

    checkAnswerEl.style.display = "none"
    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr"
}

function restartGame(){
    score = 0
    skips = 3
    answeredWrong = 0


    scoreEl.innerHTML = "Current streak : 0"
    wrongAnswersEl.innerHTML = "Wrong answers : 0"
    skipsEl.innerHTML = "Skips remaining : 3"

    let restartBtn = document.querySelector('.restartBtn')
    buttonContainerEl.removeChild(restartBtn)

    buttonContainerEl.appendChild(selectEl)
    buttonContainerEl.appendChild(checkAnswerEl)
    buttonContainerEl.appendChild(nextQuestionEl)
    

    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr 1fr"

    getQuestion()
}

getQuestion()
checkAnswerEl.addEventListener('click', checkAnswer)
nextQuestionEl.addEventListener('click', getQuestion)
