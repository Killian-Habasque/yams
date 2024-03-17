import { GameInstance } from './gameLogic.js';

export let gameData = {
    renderer: null,
    scene: null,
    camera: null,
    physicsWorld: null,

    diceArray: [],
    diceArraySelected: [],
    dicePositionSelected: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
    },
    scoreSelected: [],
    scoreGlobal: [],
    maxAttempts: 3,
    attempts: 0,
    turn: 1,
    brake: null,

    dashboard: null,
    sheet: null,
    button: null,
    dice: null,
    models: null,
    cup: null,
    landing: null,
    music: null,
};


const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
    const content = document.querySelector(".content"); 
    content.style.display = "none";
    GameInstance();
});
// const content = document.querySelector(".content"); 
// content.style.display = "none";
// GameInstance();