import { gameData } from "../main.js";
import Sound from "../class/hud/Sound.js";

/*
Toggle menu animation
*/
const btnMenu = document.querySelector("#menu");
const menu = document.querySelector(".header-menu");
const menuLinks = document.querySelector(".header-menu__links");
const menuRules = document.querySelector(".header-menu__rules");
const menuBlog = document.querySelector(".header-menu__blog");

let isMenuOpen = false;

btnMenu.addEventListener("click", () => {
    if (!isMenuOpen) {
        // Animations à effectuer lorsque le menu est ouvert
        menu.style.display = "flex";
        TweenMax.from(menu, 0.5, { opacity: 0 });
        TweenMax.from(menuLinks, 0.5, { y: 200, rotation: 10 });
        TweenMax.from(menuRules, 0.5, { y: 300, rotation: -10 });
        TweenMax.from(menuBlog, 0.5, { y: 200, rotation: -10 });

        TweenMax.to(menu, 0.5, { opacity: 1, delay: 0.2 });
        TweenMax.to(menuLinks, 0.5, { y: 0, rotation: 0, delay: 0.2 });
        TweenMax.to(menuRules, 0.5, { y: 0, rotation: 0, delay: 0.2 });
        TweenMax.to(menuBlog, 0.5, { y: 0, rotation: 0, delay: 0.3 });
        isMenuOpen = true;
    } else {
        // Animations à effectuer lorsque le menu est fermé
        TweenMax.to(menu, 0.5, { opacity: 0, delay: 0.2 });
        TweenMax.to(menuLinks, 0.5, { y: 200, rotation: 10, delay: 0.3 });
        TweenMax.to(menuRules, 0.5, { y: 300, rotation: -10, delay: 0.3 });
        TweenMax.to(menuBlog, 0.5, {
            y: 200, rotation: -10, delay: 0.2, onComplete: () => {
                menu.style.display = "none";
                isMenuOpen = false;
            }
        });

    }
});

let element = document.getElementById("btn-audio");

element.addEventListener('click', (e) => {
    let soundEnabled = localStorage.getItem("soundEnabled") === "true";

    if (!soundEnabled) {
        element.classList.add("active");
        localStorage.setItem("soundEnabled", !soundEnabled);
        gameData.music.playSound()
        Sound.playAllSound()
    } else {
        element.classList.remove("active");
        localStorage.setItem("soundEnabled", !soundEnabled);
        // gameData.music.pauseSound()
        Sound.pauseAllSound()
    }

})
