import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as TWEEN from 'https://cdn.skypack.dev/@tweenjs/tween.js';


import { gameData } from '../main.js';
import { showRollResults } from '../gameLogic.js';


let canSelect = false;

let diceParams = {
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    selected: {
        positionX: 0,
        positionY: 0,
        positionZ: -5,
    },
}
/*
Maillage du dés en regroupement Plane et Box geometry
*/
export function createDiceMesh() {
    const boxMaterialOuter = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
    })
    const boxMaterialInner = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0,
        metalness: 1,
        side: THREE.DoubleSide
    })

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
    let outerMesh = new THREE.Mesh(createBoxGeometry(), boxMaterialOuter);

    outerMesh.castShadow = true;
    diceMesh.add(innerMesh, outerMesh);

    return diceMesh;
}

/*
Création des dés
*/
export function createDice() {
    const mesh = gameData.diceMesh.clone();
    gameData.scene.add(mesh);

    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(.5, .5, .5)),
        sleepTimeLimit: .1,
    });
    // body.initQuaternion = mesh.quaternion.clone();
    gameData.physicsWorld.addBody(body);

    return { mesh, body };
}


/*
Box geometry à l'exterieur des dés
*/
export function createBoxGeometry() {

    let boxGeometry = new THREE.BoxGeometry(1, 1, 1, gameData.params.segments, gameData.params.segments, gameData.params.segments);
    // boxGeometry.callback = function() { console.log("dsfdsfds"); }
    const positionAttr = boxGeometry.attributes.position;
    const subCubeHalfSize = .5 - gameData.params.edgeRadius;


    for (let i = 0; i < positionAttr.count; i++) {

        let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

        const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
        const addition = new THREE.Vector3().subVectors(position, subCube);

        if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.normalize().multiplyScalar(gameData.params.edgeRadius);
            position = subCube.add(addition);
        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize) {
            addition.z = 0;
            addition.normalize().multiplyScalar(gameData.params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.y = subCube.y + addition.y;
        } else if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.y = 0;
            addition.normalize().multiplyScalar(gameData.params.edgeRadius);
            position.x = subCube.x + addition.x;
            position.z = subCube.z + addition.z;
        } else if (Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
            addition.x = 0;
            addition.normalize().multiplyScalar(gameData.params.edgeRadius);
            position.y = subCube.y + addition.y;
            position.z = subCube.z + addition.z;
        }

        const notchWave = (v) => {
            v = (1 / gameData.params.notchRadius) * v;
            v = Math.PI * Math.max(-1, Math.min(1, v));
            return gameData.params.notchDepth * (Math.cos(v) + 1.);
        }
        const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);

        const offset = .23;

        if (position.y === .5) {
            position.y -= notch([position.x, position.z]);
        } else if (position.x === .5) {
            position.x -= notch([position.y + offset, position.z + offset]);
            position.x -= notch([position.y - offset, position.z - offset]);
        } else if (position.z === .5) {
            position.z -= notch([position.x - offset, position.y + offset]);
            position.z -= notch([position.x, position.y]);
            position.z -= notch([position.x + offset, position.y - offset]);
        } else if (position.z === -.5) {
            position.z += notch([position.x + offset, position.y + offset]);
            position.z += notch([position.x + offset, position.y - offset]);
            position.z += notch([position.x - offset, position.y + offset]);
            position.z += notch([position.x - offset, position.y - offset]);
        } else if (position.x === -.5) {
            position.x += notch([position.y + offset, position.z + offset]);
            position.x += notch([position.y + offset, position.z - offset]);
            position.x += notch([position.y, position.z]);
            position.x += notch([position.y - offset, position.z + offset]);
            position.x += notch([position.y - offset, position.z - offset]);
        } else if (position.y === -.5) {
            position.y += notch([position.x + offset, position.z + offset]);
            position.y += notch([position.x + offset, position.z]);
            position.y += notch([position.x + offset, position.z - offset]);
            position.y += notch([position.x - offset, position.z + offset]);
            position.y += notch([position.x - offset, position.z]);
            position.y += notch([position.x - offset, position.z - offset]);
        }

        positionAttr.setXYZ(i, position.x, position.y, position.z);
    }


    boxGeometry.deleteAttribute('normal');
    boxGeometry.deleteAttribute('uv');
    boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

    boxGeometry.computeVertexNormals();

    return boxGeometry;
}

/*
Plane geometry à l'intérieur des dés
*/
export function createInnerGeometry() {
    const baseGeometry = new THREE.PlaneGeometry(1 - 2 * gameData.params.edgeRadius, 1 - 2 * gameData.params.edgeRadius);
    const offset = .48;
    return BufferGeometryUtils.mergeBufferGeometries([
        baseGeometry.clone().translate(0, 0, offset),
        baseGeometry.clone().translate(0, 0, -offset),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, -offset, 0),
        baseGeometry.clone().rotateX(.5 * Math.PI).translate(0, offset, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(-offset, 0, 0),
        baseGeometry.clone().rotateY(.5 * Math.PI).translate(offset, 0, 0),
    ], false);
}

/*
Résultats en texte
*/
export function addDiceEvents(dice) {
    dice.body.addEventListener('sleep', (e) => {

        dice.body.allowSleep = false;

        const euler = new CANNON.Vec3();
        e.target.quaternion.toEuler(euler);

        const eps = .1;
        let isZero = (angle) => Math.abs(angle) < eps;
        let isHalfPi = (angle) => Math.abs(angle - .5 * Math.PI) < eps;
        let isMinusHalfPi = (angle) => Math.abs(.5 * Math.PI + angle) < eps;
        let isPiOrMinusPi = (angle) => (Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps);


        if (isZero(euler.z)) {

            if (isZero(euler.x)) {
                showRollResults(1);
                dice.mesh.callback = function () {
                    console.log(1);
                    selectedDice(dice);
                }

            } else if (isHalfPi(euler.x)) {
                showRollResults(4);
                dice.mesh.callback = function () { console.log(4); selectedDice(dice); }
            } else if (isMinusHalfPi(euler.x)) {
                showRollResults(3);
                dice.mesh.callback = function () { console.log(3); selectedDice(dice); }
            } else if (isPiOrMinusPi(euler.x)) {
                showRollResults(6);
                dice.mesh.callback = function () { console.log(6); selectedDice(dice); }
            } else {
                // landed on edge => wait to fall on side and fire the event again
                dice.body.allowSleep = true;
            }
        } else if (isHalfPi(euler.z)) {
            showRollResults(2);
            dice.mesh.callback = function () { console.log(2); selectedDice(dice); }
        } else if (isMinusHalfPi(euler.z)) {
            showRollResults(5);
            dice.mesh.callback = function () { console.log(5); selectedDice(dice); }
        } else {
            // landed on edge => wait to fall on side and fire the event again
            dice.body.allowSleep = true;
        }
    });

}


// ...

// Modifiez la fonction selectedDice
export function selectedDice(dice) {
        console.log(dice);

        if (!gameData.canSelect) {
            return;
        }

        const targetPosition = new CANNON.Vec3(gameData.diceArraySelected.length * 2, 0, -5);

        new TWEEN.Tween(dice.mesh.position)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z
            }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onStart(() => {
                const selectedDiceIndex = gameData.diceArray.indexOf(dice);
                gameData.diceArray.splice(selectedDiceIndex, 1);
                gameData.diceArraySelected.push(dice);
                console.log("______Dés_______");
                console.log(gameData.diceArray);
                console.log("______Dés Sélectionnés_______");
                console.log(gameData.diceArraySelected);
            })
            .onUpdate(() => {
                dice.body.position.copy(dice.mesh.position);
            })
            .onComplete(() => {
                    realignDice();
            })
            .start();

            gameData.canSelect = false;
        setTimeout(() => {
            gameData.canSelect = true;
        }, 1000);

        dice.mesh.callback = function () { unselectedDice(dice); }
}

export function unselectedDice(dice) {

        if (!gameData.canSelect) {
            return;
        }

        const targetPosition = new CANNON.Vec3((gameData.diceArray.length) * 2, 0, 0);

        new TWEEN.Tween(dice.mesh.position)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z
            }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onStart(() => {
                const selectedDiceIndex = gameData.diceArraySelected.indexOf(dice);
                gameData.diceArraySelected.splice(selectedDiceIndex, 1);
                gameData.diceArray.push(dice);
                console.log("______Dés_______");
                console.log(gameData.diceArray);
                console.log("______Dés Sélectionnés_______");
                console.log(gameData.diceArraySelected);
            })
            .onUpdate(() => {
                dice.body.position.copy(dice.mesh.position);
            })
            .onComplete(() => {
                    realignDiceSelected();
            })
            .start();

            gameData.canSelect = false;
        setTimeout(() => {
            gameData.canSelect = true;
        }, 1000);

        dice.mesh.callback = function () { selectedDice(dice); };
}

export function realignDiceSelected(callback) {
    const alignmentDuration = 0.3;
    const delayBetweenDice = 0.1;

    gameData.diceArraySelected.forEach((dice, index) => {
        console.log(gameData.diceArraySelected)
        const targetPosition = new CANNON.Vec3(index * 2, 0, -5);
        new TWEEN.Tween(dice.body.position)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z
            }, alignmentDuration * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(index * delayBetweenDice * 1000)
            .start();

        new TWEEN.Tween({ y: dice.mesh.rotation.y })
            .to({ y: 0 }, alignmentDuration * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(index * delayBetweenDice * 1000)
            .onUpdate((obj) => {
                dice.mesh.rotation.y = obj.y;
                dice.mesh.rotation.reorder('YXZ');
                dice.body.quaternion.copy(dice.mesh.quaternion);
            })
            .start();
    });
}






/*
Lancer dés 
*/
export function throwDice() {
    gameData.scoreResult.innerHTML = '';
    gameData.scoreGlobal = [];

    gameData.canSelect = false;

    gameData.diceArray.forEach((d, dIdx) => {

        d.body.velocity.setZero();
        d.body.angularVelocity.setZero();

        d.body.position = new CANNON.Vec3(6, dIdx * 1.5, 0);
        d.mesh.position.copy(d.body.position);

        d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random())
        d.body.quaternion.copy(d.mesh.quaternion);

        const force = 3 + 5 * Math.random();
        d.body.applyImpulse(
            new CANNON.Vec3(-force, force, 0),
            new CANNON.Vec3(0, 0, .2)
        );
        d.body.allowSleep = true;
    });

}


/*
Alignement des dés après le lancer
*/
export function alignDiceInLine() {
    const alignmentDuration = 1;
    const delayBetweenDice = 0.2;

    gameData.diceArray.forEach((dice, index) => {
        const targetPosition = new CANNON.Vec3(0 + index * 2, 0, 0); 

        new TWEEN.Tween(dice.body.position)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z
            }, alignmentDuration * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(index * delayBetweenDice * 1000)
            .start();


        new TWEEN.Tween({ y: dice.mesh.rotation.y })
            .to({ y: 0 }, alignmentDuration * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(index * delayBetweenDice * 1000)
            .onUpdate((obj) => {
                dice.mesh.rotation.y = obj.y;
                dice.mesh.rotation.reorder('YXZ');
                dice.body.quaternion.copy(dice.mesh.quaternion);
            })
            .onComplete(() => {
                gameData.canSelect = true;
            })
            .start();

    });

}
export function realignDice(callback) {
    const alignmentDuration = 0.3;
    const delayBetweenDice = 0.1;

    gameData.diceArray.forEach((dice, index) => {
        const targetPosition = new CANNON.Vec3(index * 2, 0, 0);
        new TWEEN.Tween(dice.body.position)
            .to({
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z
            }, alignmentDuration * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(index * delayBetweenDice * 1000)
            .start();

        new TWEEN.Tween({ y: dice.mesh.rotation.y })
            .to({ y: 0 }, alignmentDuration * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(index * delayBetweenDice * 1000)
            .onUpdate((obj) => {
                dice.mesh.rotation.y = obj.y;
                dice.mesh.rotation.reorder('YXZ');
                dice.body.quaternion.copy(dice.mesh.quaternion);
            })
            .start();
    });
}