export default class Button {
    static currentButton = null;

    constructor(slug, innerHTML, callback) {
        this.button = document.createElement("button");
        this.button.className = slug;
        this.button.id = slug;
        this.button.innerHTML = innerHTML;
        this.button.addEventListener('click', callback);
        Button.currentButton = this.button;
    }

    existButton() {
        const button = document.querySelector("#" + this.button.id);
        return button ? true : false;
    }

    addButton() {
        const controls = document.querySelector(".ui-controls");
        controls.appendChild(this.button);
    }

    removeButton() {
        const controls = document.querySelector(".ui-controls");
        if (controls.contains(this.button)) {
            controls.removeChild(this.button);
        }
    }
    
    static removeInstance() {
        if (Button.currentButton && Button.currentButton.parentNode) {
            Button.currentButton.parentNode.removeChild(Button.currentButton);
            Button.currentButton = null;
        }
    }
}
