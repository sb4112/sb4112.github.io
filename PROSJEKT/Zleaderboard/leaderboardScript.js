// Henter objekter fra DOM
let LeaderboardCont = document.querySelector('#leaderboards')

console.log(LeaderboardCont)

// Importerer objekter fra andre filer 
import {TriviaScoreArray} from "/PROSJEKT/TriviaGame/triviascript.js"
import {DinoScoreArray} from "/PROSJEKT/DinoGame/dinoscript.js"

console.log("Trivia : " + TriviaScoreArray)
console.log("Dino : " + DinoScoreArray)
