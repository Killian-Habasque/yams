import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gameData } from './main.js';

/*
Controle via HUD
*/
export function initDatGui() {

    // const controls = new OrbitControls(gameData.camera, gameData.renderer.domElement)
    // controls.enableDamping = true
    // controls.target.y = 0.5

    // const gui = new dat.GUI();
    // const perspectiveCameraFolder = gui.addFolder('Camera');
    // perspectiveCameraFolder.add(gameData.camera.position, 'x', -20, 20, 0.05);
    // perspectiveCameraFolder.add(gameData.camera.position, 'y', -20, 20, 0.05);
    // perspectiveCameraFolder.add(gameData.camera.position, 'z', -20, 20, 0.05);
    // perspectiveCameraFolder.add(gameData.camera.rotation, 'x', -20, 20, 0.05);
    // perspectiveCameraFolder.add(gameData.camera.rotation, 'y', -20, 20, 0.05);
    // perspectiveCameraFolder.add(gameData.camera.rotation, 'z', -20, 20, 0.05);
    // perspectiveCameraFolder.open()

    // const rectangleFolder = gui.addFolder('Rectangle');
    // rectangleFolder.add(gameData.params.rectangle, 'width', 1, 5).onChange(() => gameData.tray.updateRectangle());
    // rectangleFolder.add(gameData.params.rectangle, 'height', 1, 5).onChange(() => gameData.tray.updateRectangle());
    // rectangleFolder.add(gameData.params.rectangle, 'positionX', -10, 10).onChange(() => gameData.tray.updateRectangle());
    // rectangleFolder.add(gameData.params.rectangle, 'positionY', -10, 10).onChange(() => gameData.tray.updateRectangle());
    // rectangleFolder.add(gameData.params.rectangle, 'positionZ', -10, 10).onChange(() => gameData.tray.updateRectangle());

    // const diceDebugFolder = gui.addFolder('Dice Debug');

    // gameData.diceArray.forEach((dice, index) => {
    //     const diceFolder = diceDebugFolder.addFolder(`Dice ${index + 1}`);
    //     diceFolder.add(dice.body.position, 'x').listen().name('Position X');
    //     diceFolder.add(dice.body.position, 'y').listen().name('Position Y');
    //     diceFolder.add(dice.body.position, 'z').listen().name('Position Z');
    //     diceFolder.add(dice.mesh.rotation, 'x').listen().name('rotation X');
    //     diceFolder.add(dice.mesh.rotation, 'y').listen().name('rotation Y');
    //     diceFolder.add(dice.mesh.rotation, 'z').listen().name('rotation Z');
    //     diceFolder.add(dice.body.quaternion, 'x').listen().name('Quaternion X');
    //     diceFolder.add(dice.body.quaternion, 'y').listen().name('Quaternion Y');
    //     diceFolder.add(dice.body.quaternion, 'z').listen().name('Quaternion Z');
    //     diceFolder.add(dice.body.quaternion, 'w').listen().name('Quaternion W');
    // });
}

