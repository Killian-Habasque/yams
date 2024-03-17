
import * as THREE from 'three';
import * as CANNON from 'cannon';
import { gameData } from './main.js';

import { render } from './render.js';
import { initSound } from './pages/header.js';
import { initDatGui } from './datGui.js';
import { onDocumentMouseDown, onDocumentMouseMove } from './eventHandling.js';

const canvasEl = document.querySelector('#canvas');

import Models from './class/models/Models.js';
import Floor from './class/models/Floor.js';
import Dice from './class/models/Dice.js';
import Sheet from './class/hud/Sheet.js';
import Button from './class/hud/Button.js';
import Dashboard from './class/hud/Dashboard.js';
import Landing from './class/hud/Landing.js';
import Sound from './class/hud/Sound.js';

/*
Création du jeu
*/
export function GameInstance() {
    initScene();
    initPhysics();
    initLight();
    initGame();
    initDatGui();
    updateSceneSize();
    initSound()

    window.addEventListener('click', onDocumentMouseDown, false);
    window.addEventListener('resize', updateSceneSize);
    render();
}

/*
Initialisation de la physique
*/
export function initPhysics() {
    gameData.physicsWorld = new CANNON.World({
        allowSleep: true,
        gravity: new CANNON.Vec3(0, -50, 0),
    })
    gameData.physicsWorld.defaultContactMaterial.restitution = .3;
}


/*
Initialisation de la scène
*/
export function initScene() {
    gameData.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvasEl
    });
    gameData.renderer.shadowMap.enabled = true
    gameData.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    gameData.scene = new THREE.Scene();

    gameData.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 300)
    gameData.camera.position.set(15, 25, 30);
    gameData.camera.rotation.set(-Math.PI * 0.25, Math.PI * 0.1, Math.PI * 0.1);


}


/*
Initialisation des models et du hud
*/
export function initGame() {
    gameData.landing = new Landing();
    gameData.button = new Button("btn-throw__primary", 'Lancer <svg class="dice one" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.45172" y="0.935488" width="28.0645" height="29" rx="5.6129" fill="white" stroke="#9D301D" stroke-width="1.87097" /><circle cx="15" cy="14.9355" r="3" fill="#9D301D" /><circle cx="9" cy="20.9355" r="3" fill="#9D301D" /><circle cx="21" cy="8.93555" r="3" fill="#9D301D" /></svg ><svg class="dice two" width="31" height="31" viewBox="0 0 31 31" fill="none"xmlns="http://www.w3.org/2000/svg"><rect x="1.45172" y="0.935488" width="28.0645" height="29" rx="5.6129" fill="white" stroke="#9D301D"stroke-width="1.87097" /><circle cx="15" cy="14.9355" r="3" fill="#9D301D" /></svg>', () => { gameData.dice.throwDice(); })
    gameData.sheet = new Sheet(() => { gameData.dice.reloadDice(); })
    gameData.models = new Models();
    new Floor();
    gameData.music = new Sound("music.mp3", 0.05, true);
    gameData.dice = new Dice();
    gameData.dashboard = new Dashboard();
    gameData.button.addButton();
}

/*
Lights
*/
export function initLight() {
    let lightIntensity = 0.5; 
    let shadowIntensity = 0.2; 

    const ambientLight = new THREE.AmbientLight(0xffffff, lightIntensity);

    const topLight = new THREE.PointLight(0xffffff, shadowIntensity);
    topLight.position.set(1, 20, 1);
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.radius = 5;
    topLight.shadow.camera.near = 0.1;
    topLight.shadow.camera.far = 400;
    topLight.castShadow = true;

    const topLightShadow = topLight.clone();
    topLightShadow.castShadow = false;
    topLightShadow.intensity = lightIntensity - shadowIntensity;

    gameData.scene.add(ambientLight);
    gameData.scene.add(topLight);
    gameData.scene.add(topLightShadow);
}

/*
Responsive scene
*/
export function updateSceneSize() {
    gameData.camera.aspect = window.innerWidth / window.innerHeight;
    gameData.camera.updateProjectionMatrix();
    gameData.renderer.setSize(window.innerWidth, window.innerHeight);
}

/*
Résultats score en texte
*/
export function showRollResults(score) {
    gameData.scoreGlobal.push(score)

    clearTimeout(gameData.brake);

    if (gameData.scoreGlobal.length == gameData.diceArray.length) {
        if (gameData.attempts < gameData.maxAttempts) {
            gameData.button.addButton();
        }
        gameData.dice.alignDiceInLine();
        document.addEventListener('mousemove', onDocumentMouseMove, false);
    } else {
        gameData.dice.diceBrake()
    }
}
