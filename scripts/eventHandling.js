
import * as THREE from 'three';

import { gameData } from './main.js';

function initEventCanvas(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    event.preventDefault();
    mouse.x = (event.clientX / gameData.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / gameData.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, gameData.camera);
    const intersects = raycaster.intersectObjects(gameData.scene.children, true);
    return intersects;
}

/*
Evenement clic canvas
*/
export function onDocumentMouseDown(event) {
    if (!event.target.closest('a')) {
        const intersects = initEventCanvas(event);
        if (intersects.length > 0) {
            const selectedObject = intersects[0].object.parent;
            if (selectedObject.type === "Group") {
                selectedObject.callback()
            }
        }
    }
}

/*
Evenement hover canvas
*/
let hoveredObject = null;

export function onDocumentMouseMove(event) {
    const intersects = initEventCanvas(event);
    if (hoveredObject && !intersects.find(intersect => intersect.object === hoveredObject)) {
        hoveredObject.children.forEach(child => {
            if (child.type === "Mesh") {
                child.scale.set(1, 1, 1);
            }
        });
        document.body.style.cursor = 'auto';
        hoveredObject = null;
    }

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.parent.type === "Group") {
            object.parent.children.forEach(child => {
                if (child.type === "Mesh") {
                    child.scale.set(1.1, 1.1, 1.1);
                }
            });
            document.body.style.cursor = 'pointer';
            hoveredObject = object.parent;
        }
    } else {
        document.body.style.cursor = 'auto';
    }
}



