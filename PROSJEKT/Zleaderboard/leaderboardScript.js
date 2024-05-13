// Importerer objekter fra andre filer 
import { DinoScoreArray } from "../dino-game/dinoscript.js"
import { TriviaScoreArray } from "../trivia-game/triviascript.js"

console.log(TriviaScoreArray)
console.log(DinoScoreArray)

// Henter objekter fra DOM
let mainEl = document.querySelector('main')

// Images
let DinoStart = new Image()
DinoStart.src = "gamepictures/DinoStart.png"
DinoStart.alt = "Start pf game"

let DinoJump = new Image()
DinoJump.src = "gamepictures/DinoJump.png"
DinoJump.alt = "Dino Jumping"

let DinoDuck = new Image()
DinoDuck.src = "gamepictures/DinoDuck.png"
DinoDuck.alt = "Dino Ducking"

let DinoDead = new Image()
DinoDead.src = "gamepictures/DinoDead.png"
DinoDead.alt = "Dino dead - game over"

let TriviaStart = new Image()
TriviaStart.src = "gamepictures/TriviaStart.png"
TriviaStart.alt = "Start of game"

let TriviaCatagory = new Image()
TriviaCatagory.src = "gamepictures/TriviaCatagory.png"
TriviaCatagory.alt = "Pick category"

let TriviaSkip = new Image()
TriviaSkip.src = "gamepictures/TriviaSkip.png"
TriviaSkip.alt = "Skip questions"

let TriviaEnd = new Image()
TriviaEnd.src = "gamepictures/TriviaEnd.png"
TriviaEnd.alt = "Three answers wrong, game over."

// Footers 
let DinoStartFoot = "The game starts as soon as you load the page. Be ready for coming obstacles!"
let DinoJumpFoot = "Press the space-bar or the arrow-up-key to jump over obstacles"
let DinoDuckFoot = "Press the arrow-down-key to duck from coming obstacles"
let DinoDeadFoot = "If the Dino hits an obstacles, it's game-over"

let TriviaStartFoot = "At the start of the game you'll get a general knowledge question, take your time before answering!"
let TriviaCatagoryFoot = "Categories are set for 5 questions at a time, chose wisely!"
let TriviaSkipFoot = "If you dont know the answer to the question, skip the question by clicking next question without having chosen an answer"
let TriviaEndFoot = "If you answer three questions wrong, the game is over"

let imagesLoaded = 0
let totalImages = 8

function checkImagesLoaded() {
    imagesLoaded++
    if (imagesLoaded === totalImages) {
        // All images have loaded, proceed with appending
        setGameContainers()
    }
}


DinoStart.onload = checkImagesLoaded
DinoJump.onload = checkImagesLoaded
DinoDuck.onload = checkImagesLoaded
DinoDead.onload = checkImagesLoaded
TriviaStart.onload = checkImagesLoaded
TriviaCatagory.onload = checkImagesLoaded
TriviaSkip.onload = checkImagesLoaded
TriviaEnd.onload = checkImagesLoaded


// Spill Objekter 
let dinoImgs = [DinoStart, DinoJump, DinoDuck, DinoDead]
let DinoGameFooter = [DinoStartFoot, DinoJumpFoot, DinoDuckFoot, DinoDeadFoot]
let triviaImgs = [TriviaStart, TriviaCatagory, TriviaSkip, TriviaEnd]
let TriviaGameFooter = [TriviaStartFoot, TriviaCatagoryFoot, TriviaSkipFoot, TriviaEndFoot]

let dinoGame
let triviaGame


for (let i = 0; i < dinoImgs.length; i++) {
    dinoImgs[i].classList.add('images')
}
for (let i = 0; i < triviaImgs.length; i++) {
    triviaImgs[i].classList.add('images')
}

function setGameContainers() {
    dinoGame = {
        class: "DinoGame",
        name: "Dino-game",
        info: "Dino Game is a classic browser-based game originally introduced as a quirky feature in Google Chrome, appearing when users encountered connection issues. In this game, players navigate their dinosaur character through obstacles by utilizing keyboard controls: jump over hurdles by pressing the spacebar or the arrow-up key and duck under obstacles by pressing the arrow-down key. If you are playing on a device without a keyboard, utalize the buttons under the gameboard. By staying alive your score increases; try to get a new highscore!",
        imgSlider: dinoImgs,
        imgFooter: DinoGameFooter,
        imgSliderIndex: 0,
        gameLink: '../dino-game/dino.html',
        leaderboard : DinoScoreArray,
        suffix : ' pts'
    }

    triviaGame = {
        class: "TriviaGame",
        name: "Trivia-game",
        info: "Welcome to our trivia game adventure! Here, it's not just about answering questions—it's a journey through different categories, testing your knowledge at every turn. As you navigate through, you'll face a variety of challenges, each one requiring quick thinking and a keen eye for detail. But don't worry, if you find yourself stumped, you've got a few skips up your sleeve to keep the game going. Just remember, make too many wrong moves, and it's game over. So, gear up, aim high, and let's see how far you can go in mastering the trivia realm!",
        imgSlider: triviaImgs,
        imgFooter: TriviaGameFooter,
        imgSliderIndex: 0,
        gameLink: '../trivia-game/trivia.html',
        leaderboard : TriviaScoreArray,
        suffix : ' pts'
    }

    // Array av spillene 
    let games = [dinoGame, triviaGame]

    for (let i = 0; i < games.length; i++) {
        // Gamecontainer
        let gameContainer = document.createElement('div')

        // Gamecontainer > 
        let HeadlineCont = document.createElement('div')
        let aboutCont = document.createElement('div')
        let leaderboardCont = document.createElement('div')

        // Headlinecontainer >
        let Headline = document.createElement('h1')
        Headline.innerHTML = games[i].name

        // AboutContianer > 
        let subHeadContainer = document.createElement('div')
        let subHead = document.createElement('h3')
        subHead.innerHTML = 'About'

        let PlayGameHref = document.createElement('a')
        PlayGameHref.setAttribute('href', games[i].gameLink)
        let PlayGameCont = document.createElement('div')
        PlayGameHref.innerHTML = "Go to game"

        let InfoImgContainer = document.createElement('div')

        // AboutContainer > infoImgContainer >
        let infoContainer = document.createElement('div')
        let pInfo = document.createElement('p')
        pInfo.innerHTML = games[i].info

        let imgContainer = document.createElement('div')
        let imgSlider = document.createElement('div')
        let ImgFootCont = document.createElement('div')
        let imageArrowCont = document.createElement('div')
        let imageArrowLeft = document.createElement('i')
        let imageArrowRight = document.createElement('i')

        // leaderboard > 
        let leaderboardHeadCont = document.createElement('div')
        let leaderboardHead = document.createElement('h3')
        leaderboardHead.innerHTML = "Leaderboard"

        leaderboardCont.appendChild(leaderboardHeadCont)
        leaderboardHeadCont.appendChild(leaderboardHead)


        for (let j = 0; j < 5; j++) {
            let scoreContainer = document.createElement('div')
            scoreContainer.classList.add('scoreContainer')
            let nrEl = document.createElement('div')
            nrEl.innerHTML = `${j + 1}.`
            nrEl.classList.add('nr')
            let scoreEl = document.createElement('div')
            scoreEl.classList.add('score')
            if (games[i].leaderboard[j] == "undefined"){
                games[i].leaderboard[j] = 0
            }
            scoreEl.innerHTML = `${games[i].leaderboard[j]} ${games[i].suffix}`

            leaderboardCont.appendChild(scoreContainer)
            scoreContainer.appendChild(nrEl)
            scoreContainer.appendChild(scoreEl)
        }

        // Legger til klasser
        gameContainer.classList.add('gamesContainer')

        HeadlineCont.classList.add('headlineContainer')
        aboutCont.classList.add('aboutContainer')
        leaderboardCont.classList.add('leaderboardContainer')

        Headline.classList.add('headline')
        subHeadContainer.classList.add('subHeadCont')
        subHead.classList.add('subHead')

        PlayGameHref.classList.add('gamelink')
        PlayGameCont.classList.add('gameLinkCont')

        InfoImgContainer.classList.add('InfoImgCont')

        infoContainer.classList.add('infoContainer')
        pInfo.classList.add('pInfo')

        imgContainer.classList.add('imgContainer')
        imgSlider.classList.add('imgSlider')
        imgSlider.classList.add(`${games[i].name}Slider`)
        ImgFootCont.classList.add(`${games[i].name}ImgFootCont`)
        imageArrowCont.classList.add('imageArrows')
        imageArrowRight.classList.add('fa-solid')
        imageArrowRight.classList.add('fa-circle-chevron-right')
        imageArrowRight.classList.add(`${games[i].class}Right`)
        imageArrowLeft.classList.add('fa-solid')
        imageArrowLeft.classList.add('fa-circle-chevron-left')
        imageArrowLeft.classList.add(`${games[i].class}Left`)


        leaderboardHeadCont.classList.add('lHeadCont')

        // Appending
        gameContainer.appendChild(HeadlineCont)
        gameContainer.appendChild(aboutCont)
        gameContainer.appendChild(leaderboardCont)

        //Headline
        HeadlineCont.appendChild(Headline)

        //About
        aboutCont.appendChild(subHeadContainer)
        subHeadContainer.appendChild(subHead)

        aboutCont.appendChild(InfoImgContainer)

        InfoImgContainer.appendChild(infoContainer)
        infoContainer.appendChild(pInfo)

        InfoImgContainer.appendChild(imgContainer)
        imgContainer.appendChild(imgSlider)
        imgSlider.appendChild(ImgFootCont)
        ImgFootCont.appendChild(games[i].imgSlider[games[i].imgSliderIndex])

        let footerText = document.createTextNode(games[i].imgFooter[games[i].imgSliderIndex])

        ImgFootCont.appendChild(footerText)
        imgContainer.appendChild(imageArrowCont)
        imageArrowCont.appendChild(imageArrowLeft)
        imageArrowCont.appendChild(imageArrowRight)


        aboutCont.appendChild(PlayGameCont)
        PlayGameCont.appendChild(PlayGameHref)

        mainEl.appendChild(gameContainer)
    }

    let TriviaRight = document.querySelector('.TriviaGameRight')
    let TriviaLeft = document.querySelector('.TriviaGameLeft')
    let DinoRight = document.querySelector('.DinoGameRight')
    let DinoLeft = document.querySelector('.DinoGameLeft')

    TriviaRight.addEventListener('click', function () {
        if (triviaGame.imgSliderIndex < 3) {
            console.log(triviaGame.imgSliderIndex)
            triviaGame.imgSliderIndex += 1
            imageSlider()
        }
        else if (triviaGame.imgSliderIndex == 3) {
            console.log(triviaGame.imgSliderIndex)
            triviaGame.imgSliderIndex = 0
            imageSlider()
        }
    })
    TriviaLeft.addEventListener('click', function () {
        if (triviaGame.imgSliderIndex == 0) {
            console.log(triviaGame.imgSliderIndex)
            triviaGame.imgSliderIndex = 3
            imageSlider()
        }
        else if (triviaGame.imgSliderIndex > 0) {
            console.log(triviaGame.imgSliderIndex)
            triviaGame.imgSliderIndex -= 1
            imageSlider()
        }
    })
    DinoRight.addEventListener('click', function () {
        if (dinoGame.imgSliderIndex < 3) {
            console.log(dinoGame.imgSliderIndex)
            dinoGame.imgSliderIndex += 1
            imageSlider()
        }
        else if (dinoGame.imgSliderIndex == 3) {
            console.log(dinoGame.imgSliderIndex)
            dinoGame.imgSliderIndex = 0
            imageSlider()
        }
    })
    DinoLeft.addEventListener('click', function () {
        if (dinoGame.imgSliderIndex == 0) {
            console.log(dinoGame.imgSliderIndex)
            dinoGame.imgSliderIndex = 3
            imageSlider()
        }
        else if (dinoGame.imgSliderIndex > 0) {
            console.log(dinoGame.imgSliderIndex)
            dinoGame.imgSliderIndex -= 1
            imageSlider()
        }
    })
}

function imageSlider(){
    let dinoImgSlider = document.querySelector('.Dino-gameSlider')
    dinoImgSlider.innerHTML = ''

    let triviaImgSlider = document.querySelector('.Trivia-gameSlider')
    triviaImgSlider.innerHTML = ''

    let dinoFooterText = document.createElement('div')
    dinoFooterText.classList.add('Dino-gameFooterText')
    dinoFooterText.innerHTML = DinoGameFooter[dinoGame.imgSliderIndex]

    let triviaFooterText = document.createElement('div')
    triviaFooterText.classList.add('Trivia-gameFooterText')
    triviaFooterText.innerHTML = TriviaGameFooter[triviaGame.imgSliderIndex]

    dinoImgSlider.appendChild(dinoImgs[dinoGame.imgSliderIndex])
    dinoImgSlider.appendChild(dinoFooterText)

    triviaImgSlider.appendChild(triviaImgs[triviaGame.imgSliderIndex])
    triviaImgSlider.appendChild(triviaFooterText)
}

/* console.log("Trivia : " + TriviaScoreArray)
console.log("Dino : " + DinoScoreArray) */
