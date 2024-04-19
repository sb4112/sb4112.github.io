export { DinoScoreArray }

//Henter objekter fra DOM
let boardEl = document.querySelector('#spillbrett')
let restartCont = document.querySelector('#restartCont')
let gameOverCont = document.querySelector('#gameOver')
let scoreEl = document.querySelector('p')
let scoreContainer = document.querySelector('#scoreCont')
let JumpUpBtn = document.querySelector('#JumpUp')
let DuckDownBtn = document.querySelector('#DuckDown')
let FlipPhoneCont = document.querySelector('#flipPhone')


// Score
let DinoScoreArray = [0, 0, 0, 0, 0]

let StoredDinoScoreArray = localStorage.getItem('DinoScoreArray')
if (StoredDinoScoreArray) {
    DinoScoreArray = JSON.parse(StoredDinoScoreArray)
}




// Objekter - alt som skal tegnes på canvas
// board
/* let board = {
    width: 750,
    height: 300,
} */
let board = {
    width: window.innerWidth - 100,
    height: 300
}

// dino
let dino = {
    width: 88,
    height: 94,
    normal: "dino-bilder/dino.png",
    duck: "dino-bilder/dino-duck.png",
    ducking: false
}
let dinoDuck = {
    height: 50,
}
let dinoY = board.height - dino.height

//Background
// Cloud
let cloudArray = []

let cloud = {
    width: 55,
    height: 45,
    img: "dino-bilder/cloud.png"
}

// Track
let trackArray = []

let track = {
    width: board.width,
    height: 30,
    img: "dino-bilder/track.png"
}
//Obstacles
let obstacleArray = []

// cactus
let cactus1 = {
    width: 34,
    img: "dino-bilder/cactus1.png"
}
let cactus2 = {
    width: 69,
    img: "dino-bilder/cactus2.png"
}
let cactus3 = {
    width: 102,
    img: "dino-bilder/cactus3.png"
}

let cactusheight = 70

// Bird
let bird = {
    width: 74,
    height: 55,
    img: "dino-bilder/bird.png"

}


// spill-fysikk
let velocityX = -3.8
let velocityY = 0
let gravity = 0.272


// Variabler
let gameOver = false
let ScoreIsSet = false 
let score = 0
let timeForTrack = (board.width / velocityX) * -10



// Lokasjon til objektene på spillbrettet
let dinoXspawn = 50
let dinoYspawn = board.height - dino.height

let obstacleXspawn = board.width
let cactusYspawn = board.height - cactusheight
let HighbirdYspawn = board.height - (cactusheight + bird.height + 10)
let LowbirdYspawn = board.height - (90)

let cloudXspawn = board.width

let trackXspawn = board.width
let trackYspawn = board.height - track.height

if(boardEl){
// Setter spillbrettets høyde og bredde
boardEl.height = board.height
boardEl.width = board.width


// forkortelse for tegning senere
let ctx = boardEl.getContext("2d")

// Image loading
let dinoImg = new Image()
dinoImg.src = dino.normal
dinoImg.onload = function () {
    ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)
}

let cactus1Img = new Image()
cactus1Img.src = cactus1.img

let cactus2Img = new Image()
cactus2Img.src = cactus2.img

let cactus3Img = new Image()
cactus3Img.src = cactus3.img

let birdImg = new Image()
birdImg.src = bird.img

let cloudImg = new Image()
cloudImg.src = cloud.img

let trackImg = new Image()
trackImg.src = track.img




document.addEventListener('keydown', dinoJump)


let intervalID = setInterval(update, 10.00)
let obstacleSpawnTime = performance.now()
let cloudSpawnTime = performance.now()
let trackSpawnTime = performance.now()


function update() {
    if(window.innerWidth < 600){
        ctx.clearRect(0, 0, board.width, board.height)
        gameOverCont.style.display = "none"
        FlipPhoneCont.style.display = "inline"
        return
    }
    else{
        FlipPhoneCont.style.display = "none"
    }
    if (gameOver) {
        clearInterval(intervalID)

        gameOverCont.style.visibility = 'visible'
        scoreContainer.style.display = 'inline'

        restartCont.addEventListener('click', function () {
            clearInterval(intervalID)
            cloudArray.splice(0, cloudArray.length)
            obstacleArray.splice(0, obstacleArray.length)
            ScoreIsSet = false
            score = 0



            dinoYspawn = board.height - dino.height
            dinoImg.src = "dino-bilder/dino.png"
            dinoImg.onload = function () {
                ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)
            }

            intervalID = setInterval(update, 10.00);


            gameOver = false

            restartCont.blur()
        })

        scoreEl.innerHTML = `New score : ${score}`

        ScoreTraverser()
        return
    }
    else {
        gameOverCont.style.visibility = 'hidden'
        scoreCont.style.display = 'none'
    }

    //Bestemmer dinos høyde og yspawn
    if (dino.ducking) {
        dino.height = dinoDuck.height
        dinoY = board.height - dino.height

        dinoImg.src = dino.duck
    } else {
        dino.height = 94
        dinoY = board.height - dino.height
        dinoImg.src = dino.normal
    }

    // Time before spawn of objects
    let currentTime = performance.now()

    let timeSinceLastObstacleSpawn = currentTime - obstacleSpawnTime
    let timeSinceLastCloudSpawn = currentTime - cloudSpawnTime

    if (timeSinceLastCloudSpawn >= 2500) {
        placeCloud()
        cloudSpawnTime = currentTime
    }
    if (timeSinceLastObstacleSpawn >= 1200) {
        placeObstacle()
        obstacleSpawnTime = currentTime
    }


    trackSpawnTime = currentTime
    if (trackArray.length === 0 || trackArray[trackArray.length - 1].x <= 1.1) {
        placeTrack();
    }


    ctx.clearRect(0, 0, board.width, board.height)

    if (trackSpawnTime <= timeForTrack) {
        ctx.drawImage(trackImg, 0, trackYspawn, track.width, track.height)
    }


    //cloud
    for (let j = 0; j < cloudArray.length; j++) {
        let Cloud = cloudArray[j]

        Cloud.x += (velocityX + 3)
        ctx.drawImage(Cloud.img, Cloud.x, Cloud.y, Cloud.width, Cloud.height)
    }

    //track
    for (let k = 0; k < trackArray.length; k++) {
        let Track = trackArray[k]

        Track.x += velocityX
        ctx.drawImage(trackImg, Track.x, Track.y, Track.width, Track.height)
    }
    //dino
    velocityY += gravity

    dinoYspawn = Math.min(dinoYspawn + velocityY, dinoY)

    ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)

    //obstacle
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i]
        obstacle.x += velocityX
        ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height)

        if (detectCollision(obstacle)) {
            if (dino.ducking) {
                ctx.clearRect(0, 0, (dinoXspawn + dino.width), board.height)
                ctx.drawImage(trackImg, 0, trackYspawn, track.width, track.height)
            }
            gameOver = true
            dinoImg.src = "dino-bilder/dino-dead.png"
            dinoImg.onload = function () {
                ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)
            }
        }
    }

    ctx.fillStyle = "black"
    ctx.font = "24px VT323"
    score += 1
    ctx.fillText(score, 5, 20)



}

// For devices with mouse
JumpUpBtn.addEventListener('click', function(){
    if (dinoYspawn == dinoY && !dino.ducking){
        velocityY = -10.6
    }
})
DuckDownBtn.addEventListener('mousedown', function(){
    if (dinoYspawn == dinoY){
        dino.ducking = true
    }
})
document.addEventListener('mouseup', function(){
    dino.ducking = false
})

// Ipad and iphone
DuckDownBtn.addEventListener('touchstart', function(){
    if(dinoYspawn == dinoY){
        dino.ducking = true
    }
})
DuckDownBtn.addEventListener('touchend', function(){
    dino.ducking = false
})



function dinoJump(e) {
    if (gameOver) {
        return
    }
    if ((e.code == "Space" || e.code == "ArrowUp") && dinoYspawn == dinoY) {
        if (!dino.ducking) {
            velocityY = -10.6
        }
    }
    else if (e.code === "ArrowDown" && dinoYspawn === dinoY) {
        dino.ducking = true
    }
}

document.addEventListener('keyup', function (e) {
    if (e.code === "ArrowDown" && dinoYspawn === dinoY) {
        dino.ducking = false
    }
})

function placeTrack() {
    let Track = {
        img: trackImg,
        x: trackXspawn,
        y: trackYspawn,
        width: track.width,
        height: track.height
    }

    trackArray.push(Track)

    if (trackArray.length > 3) {
        trackArray.shift()

    }
}

function placeCloud() {
    let Cloud = {
        img: cloudImg,
        x: cloudXspawn,
        y: null,
        width: cloud.width,
        height: cloud.height,
    }
    let YcloudChance = Math.random()

    if (YcloudChance > 0.7) {
        Cloud.y = board.height - 250
        cloudArray.push(Cloud)
    }
    else if (YcloudChance > 0.45) {
        Cloud.y = board.height - 230
        cloudArray.push(Cloud)
    }
    else if (YcloudChance > 0.25) {
        Cloud.y = board.height - 270
        cloudArray.push(Cloud)
    }

    if (cloudArray.length > 15) {
        cloudArray.shift()
    }
}
function placeObstacle() {

    let obstacle = {
        img: null,
        x: obstacleXspawn,
        y: null,
        width: null,
        height: null,
    }

    let plasserObstacleSjanse = Math.random();

    if (plasserObstacleSjanse > 0.8) {
        obstacle.img = cactus3Img
        obstacle.width = cactus3.width
        obstacle.height = cactusheight
        obstacle.y = cactusYspawn
        obstacleArray.push(obstacle)
    }
    else if (plasserObstacleSjanse > 0.6) {
        obstacle.img = cactus2Img
        obstacle.width = cactus2.width
        obstacle.height = cactusheight
        obstacle.y = cactusYspawn
        obstacleArray.push(obstacle)
    }
    else if (plasserObstacleSjanse > 0.4) {
        obstacle.img = cactus1Img
        obstacle.width = cactus1.width
        obstacle.height = cactusheight
        obstacle.y = cactusYspawn
        obstacleArray.push(obstacle)
    }
    else if (plasserObstacleSjanse > 0.3) {
        obstacle.img = birdImg
        obstacle.width = bird.width
        obstacle.height = bird.height
        obstacle.y = LowbirdYspawn
        obstacleArray.push(obstacle)
    }
    else if (plasserObstacleSjanse > 0.1) {
        obstacle.img = birdImg
        obstacle.width = bird.width
        obstacle.height = bird.height
        obstacle.y = HighbirdYspawn
        obstacleArray.push(obstacle)
    }
    if (obstacleArray.length > 14) {
        obstacleArray.shift()
    }
}


// her må det tegnes
function detectCollision(obstacle) {
    return dinoXspawn < obstacle.x + obstacle.width &&
        dinoXspawn + dino.width > obstacle.x &&
        dinoYspawn < obstacle.y + obstacle.height &&
        dinoYspawn + dino.height > obstacle.y
}

function ScoreTraverser() {
    if (DinoScoreArray.length < 5) {
        if (!ScoreIsSet) {
            DinoScoreArray.push(score)
            ScoreIsSet = true
        }
    }
    else if (DinoScoreArray.length == 5) {
        if (score > DinoScoreArray[4]) {
            if (!ScoreIsSet){
                DinoScoreArray.unshift(score)
                ScoreIsSet = true 
            }
        }
    }

    DinoScoreArray.sort(function (a, b) {
        return b - a
    })

    while (DinoScoreArray.length > 5) {
        DinoScoreArray.pop()
    }


    localStorage.setItem('DinoScoreArray', JSON.stringify(DinoScoreArray))
    console.log(DinoScoreArray)

}
}