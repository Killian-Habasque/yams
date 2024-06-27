export default class Label {
    static currentLabel = null;

    constructor(slug, innerHTML, time) {
        if (Label.currentLabel) {
            Label.currentLabel.remove();
        }

        this.label = document.createElement("p");
        this.label.className = slug;
        this.label.innerHTML = innerHTML;

        const diceContainer = document.querySelector(".game__main");
        diceContainer.appendChild(this.label);

        Label.currentLabel = this.label;

        if (time) {
            setTimeout(() => {
                Label.remove();
            }, time);
        }
    }
    static remove() {
        if (Label.currentLabel && Label.currentLabel.parentNode) {
            Label.currentLabel.parentNode.removeChild(Label.currentLabel);
            Label.currentLabel = null;
        }
    }
}
