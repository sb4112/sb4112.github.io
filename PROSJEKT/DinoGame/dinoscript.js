//Henter objekter fra DOM
let brettEl = document.querySelector('#spillbrett')
let restartEl = document.querySelector('#restart')

// Dino og spillbrett som objekter
let brett = {
    bredde: 750,
    hoyde: 250,
}

let dino = {
    bredde: 88,
    hoyde: 94,
}

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

let cactusHoyde = 70

// spill-fysikk
let velocityX = -8
let velocityY = 0
let gravity = 0.4

let gameOver = false
let score = 0



// Lokasjon til dinosauren og cactusene på spillbrettet
let dinoXspawn = 50
let dinoYspawn = brett.hoyde - dino.hoyde

let cactusXspawn = 700
let cactusYspawn = brett.hoyde - cactusHoyde

// Setter spillbrettets høyde og bredde
brettEl.height = brett.hoyde
brettEl.width = brett.bredde

//tegner inn dino 
let ctx = brettEl.getContext("2d")

let dinoImg = new Image()
dinoImg.src = "dinoBilder/dino.png"
dinoImg.onload = function () {
    ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.bredde, dino.hoyde)
}

let cactus1Img = new Image()
cactus1Img.src = cactus1.img

let cactus2Img = new Image()
cactus2Img.src = cactus2.img

let cactus3Img = new Image()
cactus3Img.src = cactus3.img

requestAnimationFrame(update)
setInterval(plasserCactus, 1000)
document.addEventListener('keydown', dinoJump)


function update() {
    requestAnimationFrame(update)
    if (gameOver){
        
        return
    }

    ctx.clearRect(0, 0, brett.bredde, brett.hoyde)

    //dino
    velocityY += gravity

    console.log(velocityY)
    dinoYspawn = Math.min(dinoYspawn + velocityY, 156)

    console.log(dinoYspawn)
    ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.bredde, dino.hoyde)

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i]
        cactus.x += velocityX
        ctx.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height)

        if (detectCollision(cactus)) {
            gameOver = true
            dinoImg.src = "dinoBilder/dino-dead.png"
            dinoImg.onload = function () {
                ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.bredde, dino.hoyde)
            }
        }
    }

    ctx.fillStyle = "black"
    ctx.font = "20px courier"
    score ++
    ctx.fillText(score, 5, 20)



}

function dinoJump(e) {
    if (gameOver) {
        return
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dinoYspawn == 156) {
        velocityY = -10
    }
}

function plasserCactus() {

    let cactus = {
        img: null,
        x: cactusXspawn,
        y: cactusYspawn,
        width: null,
        height: cactusHoyde
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

function detectCollision(cactus) {
    return dinoXspawn < cactus.x + cactus.width &&
        dinoXspawn + dino.bredde > cactus.x &&
        dinoYspawn < cactus.y + cactus.height &&
        dinoYspawn + dino.hoyde > cactus.y
} 

restartEl.addEventListener('click', function(){
    cactusArray.splice(0, cactusArray.length)
    gameOver = false
    score = 0

    dinoImg.src = "dinoBilder/dino.png"
dinoImg.onload = function () {
    ctx.drawImage(dinoImg, dinoXspawn, dinoYspawn, dino.bredde, dino.hoyde)
}

    restartEl.blur()
})