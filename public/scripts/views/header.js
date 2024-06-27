

import { gameData } from "../main.js";
import Sound from "../class/hud/Sound.js";

export function loadHeader() {

    /*
    Toggle menu animation
    */
    const btnMenu = document.querySelector("#menu");
    const menu = document.querySelector(".header-menu");
    const menuLinks = document.querySelector(".header-menu__links");
    const menuRules = document.querySelector(".header-menu__rules");
    const menuBlog = document.querySelector(".header-menu__blog");

    let isMenuOpen = false;

    btnMenu.addEventListener("click", toggleMenu);

    function toggleMenu() {

        if (!isMenuOpen) {
            // if (scoreMenuOpen) {
            //     toggleScoreMenu()
            // }
            if (userMenuOpen) {
                toggleUserMenu()
            }
            menu.style.display = "flex";
            TweenMax.from(menu, 0.5, { opacity: 0 });
            TweenMax.from(menuLinks, 0.5, { y: 200, rotation: 10 });
            TweenMax.from(menuRules, 0.5, { y: 300, rotation: -10 });
            TweenMax.from(menuBlog, 0.5, { y: 400, rotation: 10 });

            TweenMax.to(menu, 0.5, { opacity: 1 });
            TweenMax.to(menuLinks, 0.5, { y: 0, rotation: 0 });
            TweenMax.to(menuRules, 0.5, { y: 0, rotation: 0 });
            TweenMax.to(menuBlog, 0.5, { y: 0, rotation: 0 });
            isMenuOpen = true;
        } else {
            TweenMax.to(menu, 0.5, { opacity: 0 });
            TweenMax.to(menuLinks, 0.5, { y: 200, rotation: 10 });
            TweenMax.to(menuRules, 0.5, { y: 300, rotation: -10 });
            TweenMax.to(menuBlog, 0.5, {
                y: 400, rotation: 10, onComplete: () => {
                    menu.style.display = "none";
                    isMenuOpen = false;
                }
            });
        }
    }

    /*
    Toggle menu audio
    */
    let btnAudio = document.getElementById("btn-audio");

    btnAudio.addEventListener('click', toggleAudioMenu)

    function toggleAudioMenu() {
        let soundEnabled = localStorage.getItem("soundEnabled") === "true";
        localStorage.setItem("soundEnabled", !soundEnabled);
        initSound(!soundEnabled)
    }


    // const scoreMenu = document.querySelector(".header-score");
    // const scoreBtn = document.getElementById("btn-score");
    // let scoreMenuOpen = false;

    // scoreBtn.addEventListener("click", toggleScoreMenu);

    // function toggleScoreMenu() {

    //     if (!scoreMenuOpen) {
    //         if (isMenuOpen) {
    //             toggleMenu()
    //         }
    //         if (userMenuOpen) {
    //             toggleUserMenu()
    //         }
    //         scoreMenu.style.display = "flex";
    //         TweenMax.from(scoreMenu, 0.5, { y: 600, rotation: -10, opacity: 0 });
    //         TweenMax.to(scoreMenu, 0.5, { y: 0, rotation: 0, opacity: 1 });
    //         scoreMenuOpen = true;
    //     } else {
    //         TweenMax.to(scoreMenu, 0.5, {
    //             opacity: 0, y: 600, rotation: -10, onComplete: () => {
    //                 scoreMenu.style.display = "none";
    //                 scoreMenuOpen = false;
    //             }
    //         });
    //     }
    // }

    /*
    Toggle menu user
    */
    const usereMenu = document.querySelector(".header-user");
    const userBtn = document.getElementById("btn-user");
    let userMenuOpen = false;

    userBtn.addEventListener("click", toggleUserMenu);

    function toggleUserMenu() {

        if (!userMenuOpen) {
            if (isMenuOpen) {
                toggleMenu()
            }
            // if (scoreMenuOpen) {
            //     toggleScoreMenu()
            // }

            usereMenu.style.display = "flex";
            TweenMax.from(usereMenu, 0.5, { y: 600, rotation: 5, opacity: 0 });
            TweenMax.to(usereMenu, 0.5, { y: 0, rotation: 0, opacity: 1 });
            userMenuOpen = true;
        } else {
            TweenMax.to(usereMenu, 0.5, {
                opacity: 0, y: 600, rotation: 10, onComplete: () => {
                    usereMenu.style.display = "none";
                    userMenuOpen = false;
                }
            });
        }
    }

    const loginButton = document.querySelector('.form-bar button:nth-child(1)');
    const registerButton = document.querySelector('.form-bar button:nth-child(2)');
    const loginForm = document.querySelector('.form-item.login');
    const registerForm = document.querySelector('.form-item.register');

    loginButton.addEventListener('click', function () {
        if (!loginButton.classList.contains('active')) {
            loginButton.classList.add('active');
            registerButton.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        }
    });

    registerButton.addEventListener('click', function () {
        if (!registerButton.classList.contains('active')) {
            registerButton.classList.add('active');
            loginButton.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    });

}

export function initSound() {
    let btnAudio = document.getElementById("btn-audio");
    let soundEnabled = localStorage.getItem("soundEnabled") === "true";
    if (soundEnabled) {
        btnAudio.classList.add("active");
        gameData.music.playSound()
        Sound.playAllSound()
    } else {
        btnAudio.classList.remove("active");
        Sound.pauseAllSound()
    }
    // if (localStorage.getItem("soundEnabled") === null) {
    //     toggleMenu()
    // }
}