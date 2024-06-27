import { gameData } from '../../main.js';

export default class Dashboard {
    constructor() {
        this.attempts = document.querySelector('#nb-attempts')
        this.attempts.innerHTML = gameData.maxAttempts
    }
    changeAttemps(attempts) {
        const sheet = document.querySelector(".attempts");
        TweenMax.from(sheet,2,{scale:1.3, x: -20});
        TweenMax.to(sheet,2,{scale:1});
      
        this.attempts.innerHTML = gameData.maxAttempts - attempts;
    }
}
