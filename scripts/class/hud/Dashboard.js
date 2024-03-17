import { gameData } from '../../main.js';

export default class Dashboard {
    constructor() {
        this.attempts = document.querySelector('#nb-attempts')
        this.attempts.innerHTML = gameData.maxAttempts
    }
    changeAttemps(attempts) {
        this.attempts.innerHTML = gameData.maxAttempts - attempts;
    }

}
