// Henter objekter fra DOM
let burgerEl = document.querySelector('.fa-bars')
let navEl = document.querySelector('nav')

burgerEl.addEventListener('click', showNav)

function showNav(){
    navEl.classList.toggle('show')
}