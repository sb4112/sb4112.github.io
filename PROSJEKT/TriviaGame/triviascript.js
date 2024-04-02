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
let refreshExist = false
let answeredWrong = 0
let skips = 3
let score = 0
let UserAnswer


async function getQuestion() {
    optionContainer.innerHTML = ``

    /* For the skips functionality */
    let radioEls = document.querySelectorAll('input[type="radio"]')
    let checked = false
    for (let s = 0; s < radioEls.length; s++) {
        if (radioEls[s].checked) {
            checked = true
        }
    }
    if (refreshExist == false){
        if (skips > 0){ 
            if(checked == false && checkAnswerEl.style.display === "inline"){
            skips -= 1;
            skipsEl.innerHTML = `Skips remaining: ${skips}`;
            }
        }
    }

    if (skips === 0) {
        nextQuestionEl.removeEventListener('click', getQuestion);
    }
    console.log(skips)

     /* adds checkanswerbutton back into the buttoncontianer (display-none --> display-inline) ETTER SKIPS*/
     buttonContainerEl.style.gridTemplateColumns = "1fr 1fr 1fr"
     checkAnswerEl.style.display = "inline"
  
    /* Api reletaed stuff  */
    let category = Number(selectEl.value)
    let url = `https://opentdb.com/api.php?amount=1&category=${category}`

    let response = await fetch(url)
    console.log(response.status)

    /* Error 429 (5) to many request fix (refresh button) */
    if (response.status === 429) {

        console.log("hello")
        let refreshEl = document.createElement('button')
        refreshEl.classList.add('refresh_429')
        refreshEl.innerHTML = 'Error code : 429 - Refresh'

        buttonContainerEl.removeChild(checkAnswerEl)
        buttonContainerEl.removeChild(nextQuestionEl)
        buttonContainerEl.removeChild(selectEl)

        buttonContainerEl.appendChild(refreshEl)
        buttonContainerEl.style.gridTemplateColumns = "1fr"

        refreshEl.addEventListener('click', refresh)

        refreshExist = true

        return
    }
    let data = await response.json()
    let questionInfo = data.results[0]
    correctAnswer = questionInfo.correct_answer
    wrongAnswers = questionInfo.incorrect_answers

    console.log(questionInfo)

    questionEl.innerText = `${(questionInfo.question)}`

    /* options */
    let options = [correctAnswer]

    for (let i = 0; i < wrongAnswers.length; i++) {
        options.push(wrongAnswers[i])
    }

    // Shuffler array med svaralternativer slik at riktig svar går frøst 
    function shuffleOptions() {
        for (let j = 0; j < options.length; j++) {
            let rndmIndex = Math.floor(Math.random() * options.length)
            let temp = options[j]

            options[j] = options[rndmIndex]
            options[rndmIndex] = temp
        }
    }
    shuffleOptions()

    // Legge til svaralternativene i optionContainer
    for (let t = 0; t < options.length; t++) {
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

// Henter inn radio-elementene lagd i funksjonen ovenfor (to check the answer)
function checkAnswer() {
    let radioEls = document.querySelectorAll('input[type="radio"]')
    let checked = false

    for (let s = 0; s < radioEls.length; s++) {
        if (radioEls[s].checked) {
            UserAnswer = radioEls[s].value
            checked = true
        }
    }
    if (checked) {
        nextQuestionEl.addEventListener('click', getQuestion)
    }
    else if (checked == false) {
        scoreEl.innerHTML = "Please select one of the boxes"
        return
    }
    if (UserAnswer == correctAnswer) {
        score += 1
        scoreEl.innerHTML = `Du har ${score} riktige svar på rad!`
    }
    else if (UserAnswer != correctAnswer) {
        answeredWrong += 1
        wrongAnswersEl.innerHTML = `Wrong Answers : ${answeredWrong}`
    }

    /* game over functionality */
    if (answeredWrong == 3) {
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

    /* removes checkanswert after fucntions is fired */
    checkAnswerEl.style.display = "none"
    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr"
}

/* restart function */
function restartGame() {
    score = 0
    skips = 4
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

/* refresh function (429) */
function refresh() {
    getQuestion()

    let refreshBtn = document.querySelector('.refresh_429')

    buttonContainerEl.removeChild(refreshBtn)

    buttonContainerEl.appendChild(selectEl)
    buttonContainerEl.appendChild(checkAnswerEl)
    buttonContainerEl.appendChild(nextQuestionEl)


    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr 1fr"

    refreshExist = false
}

getQuestion()
checkAnswerEl.addEventListener('click', checkAnswer)
nextQuestionEl.addEventListener('click', getQuestion)
