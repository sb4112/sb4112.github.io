// For special caracters 
/* Spør didrik neste time */


// Henter objekter fra DOM
let questionEl = document.querySelector('#question')
let selectEl = document.querySelector('#catagory')
let checkAnswerEl = document.querySelector('#checkAnswer')
let scoreEl = document.querySelector('#score')
let optionContainer = document.querySelector('#OptionCont')


// Deklarer variabler 
let correctAnswer
let wrongAnswers


async function getQuestion() {
    optionContainer.innerHTML = ``

    let category = Number(selectEl.value)

    let url = `https://opentdb.com/api.php?amount=1&category=${category}`

    let response = await fetch(url)
    let data = await response.json()
    let questionInfo = data.results[0]
    correctAnswer = questionInfo.correct_answer
    wrongAnswers = questionInfo.incorrect_answers

    console.log(data)

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

        radioEl.classList.add('checkedAnsw') 
        labelEl.classList.add('checkedAnswLabel')
        
        radioEl.type = 'radio'
        radioEl.name = `Options`
        radioEl.value = options[t]

        console.log(radioEl)
        console.log(labelEl)

        labelEl.appendChild(radioEl)

        labelEl.innerHTML += options[t]

        optionContainer.append(labelEl)
    }
}

let score = 0
let UserAnswer

// Henter inn radio-elementene lagd i funksjonen ovenfor
function checkAnswer(){
    let radioEls = document.querySelectorAll('input[type="radio"]')
    let checked = false
    
    for(let s = 0; s < radioEls.length; s++){
        console.log(radioEls[s].value)
        if(radioEls[s].checked){
            UserAnswer = radioEls[s].value
            checked = true
        }
    }
    console.log(checked)

    if(checked == false){
        console.log(checked)
        scoreEl.innerHTML = "vennligst kryss av en boks"
        return
    }

    console.log(UserAnswer)
    if(UserAnswer == correctAnswer){
        score +=1
        scoreEl.innerHTML = `Du har ${score} riktige svar på rad!` 
    }
    else if(UserAnswer != correctAnswer){
        scoreEl.innerHTML = `Ops! Feil svar, prøv igjen`
        score = 0 
    }
    setTimeout(getQuestion, 900)
}

getQuestion()
checkAnswerEl.addEventListener('click', checkAnswer)
