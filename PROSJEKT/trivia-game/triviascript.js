export { TriviaScoreArray } 
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
let statsContainer = document.querySelector('#statsContainer')
let scoreCont = document.querySelector('#scoreCont')
let skipsCont = document.querySelector('#skipsCont')
let wrongAnswCont = document.querySelector('#wrongAnswCont')
let currentCategory = document.querySelector('#currentCatagory')
let PopUpEl = document.querySelector('#catagoryPopUp')




// Deklarer variabler 
let cAnswer
let wAnswers
let UserAnswer

let Questions = []
let TriviaScoreArray = [0, 0, 0, 0, 0]

let currentQuestIndex = 0

let fetching
let PopUp = true

let answeredWrong = 0
let skips = 3
let score = 0

// Henter objekter fra Local Storage 
let StoredTriviaScoreArray = localStorage.getItem('TriviaScoreArray')
if (StoredTriviaScoreArray) {
    TriviaScoreArray = JSON.parse(StoredTriviaScoreArray)
}


// Get questions (5)
async function getQuestions() {
    fetching = true

    if (PopUp){
        buttonContainerEl.innerHTML = ''
        PopUpEl.style.display = "inline"
        selectEl.style.borderColor = "black"
        selectEl.style.borderWidth = "1px"
    
        selectEl.addEventListener('change', function(){
            PopUp = false
            PopUpEl.style.display = "none"

            selectEl.style.borderWidth = "0px"
            buttonContainerEl.appendChild(selectEl)
            buttonContainerEl.appendChild(checkAnswerEl)
            buttonContainerEl.appendChild(nextQuestionEl)

            getQuestions()
        } )
        
    }

    /* Api reletaed stuff  */
    if(PopUp == false){
    let category = Number(selectEl.value)
    let url = `https://opentdb.com/api.php?amount=5&category=${category}`

    let response = await fetch(url)
    console.log(response.status)

    let data = await response.json()
    let options

    console.log(data.results[0])

    currentCategory.innerHTML = `Current category - ${(data.results[0].category)}`

    /* Shuffle options function */
    function shuffleOptions() {
        for (let i = 0; i < options.length; i++) {
            let rndmIndex = Math.floor(Math.random() * options.length)
            let temp = options[i]

            options[i] = options[rndmIndex]
            options[rndmIndex] = temp
        }
    }

    /* Going trough the 5 fetched questions - making option array - shuffeling options - pushing the Question object into the array of questions */
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
}

/* Function Next question */
function nextQuestion() {

    console.log(skips)
    if (skips <= 0 || checkAnswerEl.style.display == "inline") {
        if (skips >= 1 && !fetching) {
            skips -= 1
            skipsEl.innerHTML = `Skips remaining : ${skips}`
        }

        if (skips <= 0) {
            nextQuestionEl.removeEventListener('click', nextQuestion)
        }

    }
    fetching = false

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
    else if (currentQuestIndex >= (Questions.length - 1)) {
        currentQuestIndex = 0
        Questions = []
        getQuestions()
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

    if (checked == true) {
        nextQuestionEl.addEventListener('click', nextQuestion)
    }

    else if (checked == false) {
        scoreEl.innerHTML = "Please select one of the boxes"
        return
    }
    if (UserAnswer == correctAnswer) {
        score += 10
        let labels = document.querySelectorAll('label')

        for (let i = 0; i < labels.length; i++) {
            if (labels[i].textContent === correctAnswer) {
                labels[i].style.backgroundColor = "lightgreen"
            }
        }
        scoreEl.innerHTML = `Current score :  ${score}`
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
        scoreEl.innerHTML = `Current score :  ${score}`
    }

    /* game over functionality */
    if (answeredWrong == 3) {
        scoreEl.innerHTML = "3 answers wrong - Game Over"

        let restartEl = document.createElement('button')
        restartEl.innerHTML = "Restart"
        restartEl.classList.add('restartBtn')
        restartEl.addEventListener('click', restartGame)

        let leaderboardBtn =  document.createElement('div')
        let leaderboardLink = document.createElement('a')
        leaderboardLink.setAttribute('href', "../Zleaderboard/leaderboard.html")
        leaderboardLink.classList.add('leaderboardLink')
        leaderboardBtn.classList.add('leaderboardBtn')
        leaderboardBtn.innerText = "Go to leaderboard"
        leaderboardLink.appendChild(leaderboardBtn)

        buttonContainerEl.removeChild(checkAnswerEl)
        buttonContainerEl.removeChild(nextQuestionEl)
        buttonContainerEl.removeChild(selectEl)

        buttonContainerEl.appendChild(restartEl)
        buttonContainerEl.appendChild(leaderboardLink)
        buttonContainerEl.style.gridTemplateColumns = "1fr 1fr"


        statsContainer.innerHTML = `Final score : ${score} `
        statsContainer.style.gridTemplateColumns = "1fr"
        statsContainer.style.textAlign = "center"
        statsContainer.style.fontWeight = "bold"

        ScoreTraverser()

        return
    }

    /* removes checkanswert after fucntions is fired */
    checkAnswerEl.style.display = "none"
    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr"
}

/* restart function */
function restartGame() {
    score = 0
    skips = 3
    answeredWrong = 0
    fetching = true 
    PopUp = true

    statsContainer.innerHTML = ''
    if (window.innerWidth > 835){
    statsContainer.style.gridTemplateColumns = "1fr"
    statsContainer.style.gridTemplateColumns = "1fr 1fr 1fr"
    }
    else{
        statsContainer.style.gridTemplateColumns = "1fr"
        statsContainer.style.gridTemplateRows = "1fr 1fr 1fr"
    }
    statsContainer.style.fontWeight = "normal"
    statsContainer.appendChild(wrongAnswCont)
    statsContainer.appendChild(scoreCont)
    statsContainer.appendChild(skipsCont)

    scoreEl.innerHTML = "Current score : 0"
    wrongAnswersEl.innerHTML = "Wrong answers : 0"
    skipsEl.innerHTML = "Skips remaining : 3"

    let labels = document.querySelectorAll('label')

    for (let i = 0; i < labels.length; i++) {
        labels[i].style.backgroundColor = "white"
    }


    let restartBtn = document.querySelector('.restartBtn')
    let leaderboardBtn = document.querySelector('.leaderboardLink')
    buttonContainerEl.removeChild(restartBtn)
    buttonContainerEl.removeChild(leaderboardBtn)

    buttonContainerEl.appendChild(checkAnswerEl)
    buttonContainerEl.appendChild(nextQuestionEl)

    selectEl.style.boarderWidth = "1px"
    PopUpEl.appendChild(selectEl)


    buttonContainerEl.style.gridTemplateColumns = "1fr 1fr 1fr"

    getQuestions()
}

function ScoreTraverser() {
    if (TriviaScoreArray.length < 5) {
        TriviaScoreArray.push(score)
    }
    else if (TriviaScoreArray.length == 5) {
            if (score > TriviaScoreArray[4]) {
                TriviaScoreArray.unshift(score)
            }
        }

    TriviaScoreArray.sort(function (a, b) {
        return b - a
    })

    while (TriviaScoreArray.length > 5){
        TriviaScoreArray.pop()
    }


    localStorage.setItem('TriviaScoreArray', JSON.stringify(TriviaScoreArray))
    console.log(TriviaScoreArray)

}


if(nextQuestionEl){
    checkAnswerEl.addEventListener('click', checkAnswer)
    nextQuestionEl.addEventListener('click', nextQuestion)

    getQuestions()
}
