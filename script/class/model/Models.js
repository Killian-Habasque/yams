import * as THREE from 'three';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gameData } from '../../main.js';
import * as TWEEN from 'https://cdn.skypack.dev/@tweenjs/tween.js';

export default class Models {
    constructor() {
        this.loadingManagment = new THREE.LoadingManager();
        this.loader = new GLTFLoader( this.loadingManagment );
       
        this.showProgressBar = false;
        this.valueProgressBar = 0;
        this.totalModels = 3;
        this.modelsLoaded = 0;
        this.createOrUpdateRectangle();
        this.loadModels();
        const loadingContainer = document.querySelector(".loading__container")
        const progress = document.querySelector(".progress-bar span")
        this.loadingManagment.onProgress = function(url, loaded, total){
            let value = (loaded / total) * 100;
            progress.style.width = value + "%";
            if(value === 100) {
                setTimeout(() => {
                    loadingContainer.style.top = "-100%";
                    const targetPosition = { x: 1.3, y: 11, z: 0 };

                    new TWEEN.Tween(gameData.camera.position)
                    .to({
                        x: targetPosition.x,
                        y: targetPosition.y,
                        z: targetPosition.z
                    }, 3000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .delay(500)
                    .start();
                
                    new TWEEN.Tween(gameData.camera.rotation)
                    .to({
                        x: -Math.PI * 0.5,
                        y: 0,
                        z: 0,
                    }, 3000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .delay(500)
                    .start();
                
                }, 500);
                setTimeout(() => {
                    loadingContainer.style.display = "none";
                }, 10000);
            }
        }
    }

    updateProgressBar(xhr) {
        if (xhr.lengthComputable) {
            let percentComplete = (xhr.loaded / xhr.total) * 100;
            this.valueProgressBar += percentComplete / this.totalModels;
            console.log(this.valueProgressBar)
            this.showProgressBar = true;
        }
    }

    onModelLoad() {
        this.modelsLoaded++;
        if (this.modelsLoaded === this.totalModels) {
            this.showProgressBar = false;
        }
    }

    loadModel(url, onLoadCallback) {
        this.loader.load(
            url,
            (gltf) => {
                onLoadCallback.call(this, gltf);
                this.onModelLoad();
            },
            (xhr) => {
                this.updateProgressBar(xhr);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    loadModels() {
        this.loadModel('/assets/models/tray.glb', this.handleTrayModelLoad);
        this.loadModel('/assets/models/pen.glb', this.handlePenModelLoad);
        this.loadModel('/assets/models/cup.glb', this.handleCupModelLoad);
    }

    handleTrayModelLoad(gltf) {
        gltf.scene.traverse((child) => {
            if (child.type === 'Mesh') {
                let m = child;
                m.receiveShadow = false;
                m.castShadow = true;
                m.scale.set(8, 8, 8);
                m.position.set(2, -7.1, 0);

                let plateauMaterial = m.material;
                plateauMaterial.color.r = 3;
                plateauMaterial.color.g = 3;
                plateauMaterial.color.b = 3;
                m.material = plateauMaterial;
            }
        });
        gameData.scene.add(gltf.scene);
    }

    handlePenModelLoad(gltf) {
        gltf.scene.traverse((child) => {
            if (child.type === 'Mesh') {
                let m = child;
                m.receiveShadow = false;
                m.castShadow = true;
                m.scale.set(50, 50, 50);
                console.log(m);
                m.position.set(-1100, -670, -2);
                m.rotateY(Math.PI / 1.2);
            }
        });
        gameData.scene.add(gltf.scene);
    }

    handleCupModelLoad(gltf) {
        gltf.scene.traverse((child) => {
            if (child.type === 'Mesh') {
                child.receiveShadow = false;
                child.castShadow = true;
                child.scale.set(1.3, 1.3, 1.3);
                child.position.set(17, 4, -6.5);
                gameData.cup = child;
            }
        });
        gameData.scene.add(gltf.scene);
    }

    createOrUpdateRectangle() {
        const wall = {
            width: 17,
            height: 6,
            positionX: 2,
            positionY: -4,
            positionZ: -6,
        }
        const geometry = new THREE.BoxGeometry(wall.width, wall.height, 0.1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0
        });
        this.createWallCollision(wall.width, wall.height, geometry, material, wall.positionX, wall.positionY, wall.positionZ, 0)
        this.createWallCollision(wall.width, wall.height, geometry, material, wall.positionX, wall.positionY, -wall.positionZ, 0)
        this.createWallCollision(wall.width, wall.height, geometry, material, -6, wall.positionY, 0, Math.PI / 2)
        this.createWallCollision(wall.width, wall.height, geometry, material, 10, wall.positionY, 0, Math.PI / 2)
    }

    createWallCollision(width, height, geometry, material, x, y, z, rotationY) {
        let rectangleMesh = new THREE.Mesh(geometry, material);
        rectangleMesh.position.set(x, y, z);
        rectangleMesh.rotation.set(0, rotationY, 0)
        gameData.scene.add(rectangleMesh);
        const rectangleShape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, 0.05));
        const rectangleBody = new CANNON.Body({
            mass: 0,
            shape: rectangleShape,
            position: new CANNON.Vec3(x, y, z),
            // rotation: new CANNON.Vec3(0, rotationY, 0), 
            quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotationY)
        });
        gameData.physicsWorld.addBody(rectangleBody);
    }

    animeCup(afterFirstAnimationCallback) {
        let startPosition = { x: 17, y: 4, z: -6.5 };
        let endPosition = { x: 6.5, y: 0, z: 8.5 };
        let startRotation = { rotationY: 0 };

        let forwardTween = new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate((obj) => {
            gameData.cup.rotation.y = startRotation.rotationY + obj.t * (Math.PI * (-5 / 6) - startRotation.rotationY);
            gameData.cup.position.set(
                startPosition.x + obj.t * (endPosition.x - startPosition.x),
                startPosition.y + obj.t * (endPosition.y - startPosition.y),
                startPosition.z + obj.t * (endPosition.z - startPosition.z)
            );
        }).onComplete(() => {
            afterFirstAnimationCallback()
        });

        let backwardTween = new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate((obj) => {
            gameData.cup.rotation.y = startRotation.rotationY + (1 - obj.t) * (Math.PI * (-5 / 6) - startRotation.rotationY);
            gameData.cup.position.set(
                startPosition.x + (1 - obj.t) * (endPosition.x - startPosition.x),
                startPosition.y + (1 - obj.t) * (endPosition.y - startPosition.y),
                startPosition.z + (1 - obj.t) * (endPosition.z - startPosition.z)
            );
        })
        .delay(200)
        .onComplete(() => {
            gameData.cup.rotation.y = 0;
            gameData.cup.position.set(startPosition.x, startPosition.y, startPosition.z);
        });

        forwardTween.chain(backwardTween);
        forwardTween.start();
    }
}

