import * as THREE from 'three';
import * as CANNON from 'cannon';
import { gameData } from '../../main.js';


export default class Floor {
    constructor() {
        this.createFloor();
        // this.createShadow();
    }

    /*
    Création de l'ombre
    */
    createShadow() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.ShadowMaterial({
                opacity: .15
            })
        )
        floor.receiveShadow = true;
        floor.position.y = -6.95;
        floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
        gameData.scene.add(floor);

        const floorBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        floorBody.position.copy(floor.position);
        floorBody.quaternion.copy(floor.quaternion);
        gameData.physicsWorld.addBody(floorBody);
    }

    /*
    Création du plane
    */
    createFloor() {
        const textureDiff = this.loadTexture('/assets/images/textures/compressed/wood_floor_worn_diff_1k.png');
        const textureNor = this.loadTexture('/assets/images/textures/wood_floor_worn_nor_gl_2k.jpg');
        const textureArm = this.loadTexture('/assets/images/textures/compressed/wood_floor_worn_arm_1k.png');
        const textureRough = this.loadTexture('/assets/images/textures/compressed/wood_floor_worn_rough_1k.png');
    
        const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
        floorGeometry.setAttribute('uv2', new THREE.BufferAttribute(floorGeometry.attributes.uv.array, 2));
    
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: textureDiff,
            normalMap: textureNor,
            aoMap: textureArm,
            metalness: 0,
            roughness: 0.8,
            roughnessMap: textureRough,
            side: THREE.DoubleSide,
        });
        console.log(floorMaterial)
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        floor.position.y = -7.1;
        floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * .5);
    
        const floorBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        floorBody.position.copy(floor.position);
        floorBody.quaternion.copy(floor.quaternion);
        gameData.physicsWorld.addBody(floorBody);
        gameData.scene.add(floor);
    }
    
    loadTexture(url) {
        const textureSize = 25;
        const texture = new THREE.TextureLoader().load(url);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(textureSize, textureSize);
        return texture;
    }
    

}