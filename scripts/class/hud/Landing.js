import * as TWEEN from 'tween';
import { gameData } from '../../main.js';

export default class Landing {
    constructor() {
        this.displayProgressBar()
    }

    removeLanding(callback) {
        const loadingContainer = document.querySelector(".loading__container")
        TweenMax.to(loadingContainer, 0.8, {
            top: "-100%",
            delay: 0.8,
            onComplete: () => {
                loadingContainer.style.display = "none";
                callback()
            }
        });
    }

    showLanding(callback) {
        const loadingContainer = document.querySelector(".loading__container")
        TweenMax.to(loadingContainer, 0.8, {
            top: 0,
            delay: 0.8,
            onStart: () => {
                loadingContainer.style.display = "flex";
                callback()
            }
        });
    }

    displayProgressBar() {
        const container = document.querySelector(".begin")
        container.style.display = "flex";
    }
    removeProgressBar() {
        const container = document.querySelector(".begin")
        container.style.display = "none";
    }

    updateProgressBar(value) {
        const progress = document.querySelector(".progress-bar span")
        progress.style.width = value + "%";
    }



    displayFinalScore(score) {
        const container = document.querySelector(".final")
        container.style.display = "flex";
        const scoreResult = document.querySelector(".final span")
        scoreResult.innerHTML = score
        this.showLanding()
    }

    removeFinalScore() {
        const container = document.querySelector(".final")
        container.style.display = "none";
    }

}
