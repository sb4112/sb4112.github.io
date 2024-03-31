//Henter objekter fra DOM
let boardEl = document.querySelector('#spillbrett')
let restartCont = document.querySelector('#restartCont')
let gameOverCont = document.querySelector('#gameOver')
let scoreEl = document.querySelector('p')
let scoreContainer = document.querySelector('#scoreCont')

// Dino og spillbrett som objekter
let board = {
    width: 750,
    height: 300,
}

let dino = {
    width: 88,
    height: 94,
}

let dinoY = board.height - dino.height

//Cactus
let cactusArray = []

let cactus1 = {
    width: 34,
    img: "dinoBilder/cactus1.png"
}
let cactus2 = {
    width: 69,
    img: "dinoBilder/cactus2.png"
}
let cactus3 = {
    width: 102,
    img: "dinoBilder/cactus3.png"
}

let cactusheight = 70

// spill-fysikk
let velocityX = -3.8
let velocityY = 0
let gravity = 0.272

let gameOver = false
let score = 0



// Lokasjon til dinosauren og cactusene på spillbrettet
let dinoXspawn = 50
let dinoYspawn = board.height - dino.height

let cactusXspawn = 700
let cactusYspawn = board.height - cactusheight

// Setter spillbrettets høyde og bredde
boardEl.height = board.height
boardEl.width = board.width

// Siste gang cactus ble spawna
let lastCactusSpawnTime = 0

//tegner inn dino 
let ctx = boardEl.getContext("2d")

let dinoImg = new Image()
dinoImg.src = "dinoBilder/dino.png"
dinoImg.onload = function () {
    ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)
}

let cactus1Img = new Image()
cactus1Img.src = cactus1.img

let cactus2Img = new Image()
cactus2Img.src = cactus2.img

let cactus3Img = new Image()
cactus3Img.src = cactus3.img

/* requestAnimationFrame(update) */
/* setInterval(plasserCactus, 1200) */
document.addEventListener('keydown', dinoJump)


let intervalID = setInterval(update, 10.00); 

let cactusSpawnTime = performance.now();


function update() {

    if (gameOver) {
        gameOverCont.style.visibility = 'visible'
        scoreCont.style.visibility = 'visible'
        clearInterval(intervalID)
    
        restartCont.addEventListener('click', function () {
            console.log("hieiei")
            cactusArray.splice(0, cactusArray.length)
            score = 0
            
            dinoImg.src = "dinoBilder/dino.png"
            dinoImg.onload = function () {
            ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)

            intervalID = setInterval(update, 10.00);
            }
        

            gameOver = false
            
            restartCont.blur()
        })

        scoreEl.innerHTML = `New score : ${score}`
        return
    }
    else{
        gameOverCont.style.visibility = 'hidden'
        scoreCont.style.visibility = 'hidden'
    }
    
    
    let currentTime = performance.now();
    console.log("currenct time: "+ currentTime)
    console.log(cactusSpawnTime)

    
    let timeSinceLastCactusSpawn = currentTime - cactusSpawnTime;
    console.log("time since last cactus spawn: " + timeSinceLastCactusSpawn)

   
    if (timeSinceLastCactusSpawn >= 1200) {
        plasserCactus();
        cactusSpawnTime = currentTime; 
    } 

    ctx.clearRect(0, 0, board.width, board.height) 

    //dino
    velocityY += gravity

    dinoYspawn = Math.min(dinoYspawn + velocityY, dinoY)

    ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)


    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i]
        cactus.x += velocityX
        ctx.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height)

        if (detectCollision(cactus)) {
            gameOver = true
            dinoImg.src = "dinoBilder/dino-dead.png"
            dinoImg.onload = function () {
                ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.width, dino.height)
            }
        }
    }

    ctx.fillStyle = "black"
    ctx.font = "20px courier"
    score += 1
    ctx.fillText(score, 5, 20)



}

function dinoJump(e) {
    if (gameOver) {
        return
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dinoYspawn == dinoY) {
        velocityY = -10.6
    }
}

function plasserCactus() {

    let cactus = {
        img: null,
        x: cactusXspawn,
        y: cactusYspawn,
        width: null,
        height: cactusheight
    }

    let plasserCactusSjanse = Math.random();

    if (plasserCactusSjanse > 0.8) {
        cactus.img = cactus3Img
        cactus.width = cactus3.width
        cactusArray.push(cactus)
    }
    else if (plasserCactusSjanse > 0.6) {
        cactus.img = cactus2Img
        cactus.width = cactus2.width
        cactusArray.push(cactus)
    }
    else if (plasserCactusSjanse > 0.3) {
        cactus.img = cactus1Img
        cactus.width = cactus1.width
        cactusArray.push(cactus)
    }
    if (cactusArray.length > 7) {
        cactusArray.shift()
    }
}


// her må det tegnes
function detectCollision(cactus) {
    return dinoXspawn < cactus.x + cactus.width &&
        dinoXspawn + dino.width > cactus.x &&
        dinoYspawn < cactus.y + cactus.height &&
        dinoYspawn + dino.height > cactus.y
}