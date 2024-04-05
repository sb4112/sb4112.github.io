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
let cAnswer
let wAnswers
let UserAnswer

let Questions = []

let currentQuestIndex = 0

let refreshExist = false

let answeredWrong = 0
let skips = 3
let score = 0


async function getQuestions() {
    /* Api reletaed stuff  */
    let category = Number(selectEl.value)
    let url = `https://opentdb.com/api.php?amount=20&category=${category}`

    let response = await fetch(url)
    console.log(response.status)

    let data = await response.json()
    let options

    /* Shuffle options function */
    function shuffleOptions() {
        for (let i = 0; i < options.length; i++) {
            let rndmIndex = Math.floor(Math.random() * options.length)
            let temp = options[i]

            options[i] = options[rndmIndex]
            options[rndmIndex] = temp
        }
    }

    /* Going trough the 20 fetched questions - making option array - shuffeling options - pushing the Question object into the array of questions */
    for (let j = 0; j < data.results.length; j++) {
        let questionsInfo = data.results[j]
        cAnswer = questionsInfo.correct_answer
        wAnswers = questionsInfo.incorrect_answers

        options = [cAnswer]

        for (let s = 0; s < wAnswers.length; s++) {
            options.push(wAnswers[s])
        }

        shuffleOptions()

        let Question = {
            Info: questionsInfo,
            Options: options,
            id: `Question[${j}]`
        }

        Questions.push(Question)
    }
    console.log(Questions)
    nextQuestion()
}

/* Function Next question */
function nextQuestion() {

    console.log(skips)
    if(skips <= 0 || checkAnswerEl.style.display == "inline"){
        if(skips>=1){
        skips-=1
        skipsEl.innerHTML = `Skips remaining : ${skips}`
        }

        if(skips <= 0){
            nextQuestionEl.removeEventListener('click', nextQuestion)
        }
           
        
    }
    optionContainer.innerHTML = ``

    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr 1fr"
    checkAnswerEl.style.display = "inline"

    if (currentQuestIndex < (Questions.length - 1)) {
        let questionTitle = Questions[currentQuestIndex].Info.question

        questionEl.innerHTML = questionTitle

        for (let t = 0; t < Questions[currentQuestIndex].Options.length; t++) {
            let labelEl = document.createElement('label')
            let radioEl = document.createElement('input')

            radioEl.classList.add('radioBtns')
            labelEl.classList.add('radioBtnsLabel')

            radioEl.type = 'radio'
            radioEl.name = 'Options'
            radioEl.value = Questions[currentQuestIndex].Options[t]

            labelEl.appendChild(radioEl)

            labelEl.innerHTML += Questions[currentQuestIndex].Options[t]

            optionContainer.append(labelEl)
        }
        currentQuestIndex += 1
    }
    else if(currentQuestIndex >= (Questions.length -1)){
        currentQuestIndex = 0
        Questions.splice(0, Questions.length)
        getQuestions()
        nextQuestion()
    }
}

// Henter inn radio-elementene lagd i funksjonen ovenfor (to check the answer)
function checkAnswer() {
    let radioEls = document.querySelectorAll('input[type="radio"]')
    let checked = false

    let correctAnswer = Questions[currentQuestIndex - 1].Info.correct_answer

    console.log(correctAnswer)



    for (let s = 0; s < radioEls.length; s++) {
        if (radioEls[s].checked) {
            UserAnswer = radioEls[s].value
            checked = true

            console.log(UserAnswer)
        }
    }

    if(checked == true){
        nextQuestionEl.addEventListener('click', nextQuestion)
    }

    else if (checked == false) {
        scoreEl.innerHTML = "Please select one of the boxes"
        return
    }
    if (UserAnswer == correctAnswer) {
        score += 1
        let labels = document.querySelectorAll('label')

        for (let i = 0; i < labels.length; i++) {
            if (labels[i].textContent === correctAnswer) {
                labels[i].style.backgroundColor = "lightgreen"
            }
        }
        scoreEl.innerHTML = `Du har ${score} riktige svar på rad!`
    }
    else if (UserAnswer != correctAnswer) {
        answeredWrong += 1

        let labels = document.querySelectorAll('label')

        for (let i = 0; i < labels.length; i++) {
            if (labels[i].textContent === correctAnswer) {
                labels[i].style.backgroundColor = "lightgreen"
            }
            if (radioEls[i].value === UserAnswer) {
                radioEls[i].parentElement.style.backgroundColor = "lightcoral"
            }
        }


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

    let labels = document.querySelectorAll('label')

    for(let i = 0; i<labels.length; i++){
        labels[i].style.backgroundColor = "white"
    }


    let restartBtn = document.querySelector('.restartBtn')
    buttonContainerEl.removeChild(restartBtn)

    buttonContainerEl.appendChild(selectEl)
    buttonContainerEl.appendChild(checkAnswerEl)
    buttonContainerEl.appendChild(nextQuestionEl)


    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr 1fr"

    nextQuestion()
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

/* getQuestion() */
checkAnswerEl.addEventListener('click', checkAnswer)
nextQuestionEl.addEventListener('click', nextQuestion)

getQuestions()