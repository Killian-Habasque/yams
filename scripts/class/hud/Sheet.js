import Label from './Label.js';
import { gameData } from '../../main.js';

export default class Sheet {
    constructor(callback) {
        this.sheet = [
            { slug: 1, label: 1, value: null, checked: false },
            { slug: 2, label: 2, value: null, checked: false },
            { slug: 3, label: 3, value: null, checked: false },
            { slug: 4, label: 4, value: null, checked: false },
            { slug: 5, label: 5, value: null, checked: false },
            { slug: 6, label: 6, value: null, checked: false },
            { slug: "chance", label: "Chance", value: null, checked: false },
            { slug: "sm-straight", label: "Petite suite", value: null, checked: false },
            { slug: "lg-straight", label: "Grande suite", value: null, checked: false },
            { slug: "full", label: "Full", value: null, checked: false },
            { slug: "four-kind", label: "Carré", value: null, checked: false },
            { slug: "yams", label: "Yam's", value: null, checked: false }
        ];
        this.callback = callback;
        this.bonus = 0;
        this.score = 0;
    }

    /*
    Comparer les valeurs du tableau de score à partir des dés
    */
    compare(dice) {
        dice.sort((a, b) => a - b);
        const counts = this.countDiceValues(dice);
        let result = "";
        // Yam's
        this.updateYamsScore(counts);
        // Carré
        this.updateFourOfAKindScore(counts);
        // Full
        this.updateFullScore(counts);
        // Grande suite
        let straight = this.updateStraightScore(dice, "lg-straight");
        // Petite suite
        this.updateStraightScore(dice, "sm-straight", straight);
        // Chance
        this.updateChanceScore(dice);
        // Chiffres
        this.updateNumberScore(dice);

    }

    countDiceValues(dice) {
        const counts = {};
        dice.forEach((die) => {
            counts[die] = (counts[die] || 0) + 1;
        });
        return counts;
    }

    updateYamsScore(counts) {
        const item = this.sheet.find(item => item.slug === "yams");
        if (!item.checked) {
            if (Object.values(counts).includes(5)) {
                item.value = 50;
                new Label("txt__alert", "Yams !", 2000);
            } else {
                item.value = null;
            }
        }
    }

    updateFourOfAKindScore(counts) {
        const item = this.sheet.find(item => item.slug === "four-kind");
        if (!item.checked) {
            if (Object.values(counts).includes(4)) {
                const fourOfAKindValue = Object.keys(counts).find(key => counts[key] === 4);
                const nonFourOfAKindValue = Object.keys(counts).find(key => counts[key] !== 4);
                if (fourOfAKindValue && nonFourOfAKindValue) {
                    const sumOfDice = parseInt(fourOfAKindValue) * 4 + parseInt(nonFourOfAKindValue);
                    item.value = sumOfDice;
                    if (!Object.values(counts).includes(5)) {
                        new Label("txt__alert", "Carré !", 2000);
                    }
                }
            } else {
                item.value = null;
            }
        }
    }

    updateStraightScore(dice, slug, lgStraightExist) {
        let diceValue = [];
        dice.forEach((die) => {
            diceValue.push(die);
        });
        const diceSort = [...new Set(diceValue)];

        let maxNumber = 0
        let score = 0
        let title = ""
        switch (true) {
            case slug == "sm-straight":
                title = "Petite suite !"
                maxNumber = 4
                score = 30
                break;
            case slug == "lg-straight":
                title = "Grande suite !"
                maxNumber = 5
                score = 40
                break;
        }
        const straight = diceSort.length >= maxNumber && (diceSort[maxNumber - 1] - diceSort[0] === maxNumber - 1)

        const item = this.sheet.find(item => item.slug === slug);
        if (!item.checked) {
            if (straight) {
                item.value = score;
                if (slug == "lg-straight") {
                    new Label("txt__alert", title, 2000);
                    return true;
                }
                if (!lgStraightExist) {
                    new Label("txt__alert", title, 2000);
                }
            } else {
                item.value = null;
            }
        }
    }

    updateFullScore(counts) {
        const item = this.sheet.find(item => item.slug === "full");
        if (!item.checked) {
            if (Object.values(counts).includes(3) && Object.values(counts).includes(2)) {
                const threeOfAKindValue = Object.keys(counts).find(key => counts[key] === 3);
                const twoOfAKindValue = Object.keys(counts).find(key => counts[key] === 2);
                if (threeOfAKindValue !== twoOfAKindValue) {
                    item.value = 25;
                    new Label("txt__alert", "Full !", 2000);
                }
            } else {
                item.value = null;
            }
        }
    }

    updateNumberScore(dice) {
        for (let i = 1; i <= 6; i++) {
            const count = dice.filter(die => die === i).length;
            if (!this.sheet.find(item => item.slug === i).checked) {
                this.sheet.find(item => item.slug == i).value = count * i;
            }
        }
    }

    updateChanceScore(dice) {
        const item = this.sheet.find(item => item.slug === "chance");
        if (!item.checked) {
            let sum = 0;
            dice.forEach((die) => {
                sum += die;
            });
            item.value = sum;
        }
    }

    updateTurn(turn) {
        const cellTurn = document.getElementById('total__turn');
        cellTurn.textContent = turn;
    }

    updateBonus() {
        let sum = 0;
        for (let i = 1; i <= 6; i++) {
            if (this.sheet.find(item => item.slug === i).checked) {
                const value = this.sheet.find(item => item.slug === i).value;
                if (value !== null) {
                    sum += value;
                }
            }
        }
        this.bonus = sum
        this.displayBonus()
    }
    displayBonus() {
        const cellTotalBonusScore = document.getElementById('total-bonus__score');
        cellTotalBonusScore.textContent = this.bonus + "/63";
        if (this.bonus >= 63) {
            const cellBonusScore = document.getElementById('bonus__score');
            cellBonusScore.textContent = "✗";
        }
    }
    updateScore() {
        let sum = 0;
        for (const item of this.sheet) {
            if (item.value !== null && item.checked) {
                sum += item.value;
            }
        }
        if (this.bonus >= 63) {
            sum += 35;
        }
        this.score = sum
        this.displayScore()
    }
    displayScore() {
        const cellScore = document.getElementById('total__score');
        cellScore.textContent = this.score;
    }
    checkRemainingCells() {
        const remainingCells = this.sheet.filter(cell => !cell.checked).length;
        if (!remainingCells) {
            gameData.landing.showLanding(() => {
                gameData.landing.displayFinalScore(this.score)
            })
            return false
        }
        return true
    }

    updateSheet() {
        const table = document.getElementById('sheet');
        const allCells = table.querySelectorAll('.cell');

        allCells.forEach(cell => {
            const key = cell.dataset.key;
            if (key) {
                cell.textContent = this.sheet[key].value !== null ? this.sheet[key].value : '0';
                if (this.sheet[key].checked) {
                    cell.classList.add('selected');
                }
                if (!this.sheet[key].checked) {
                    cell.onclick = () => {
                        this.sheet[key].checked = true;
                        cell.classList.add('selected');
                        this.updateBonus();
                        this.updateScore();
                        if (this.checkRemainingCells()) {
                            const allCells = document.querySelectorAll('.cell:last-child');
                            allCells.forEach(cell => {
                                const key = cell.dataset.key;
                                if (key && !this.sheet[key].checked) {
                                    cell.textContent = '0';
                                }
                                cell.onclick = () => { return; };
                            });
                            this.callback();
                        }
                    };
                }
            }
        });
    }

    pendingSheet() {
        const table = document.getElementById('sheet');
        const allCells = table.querySelectorAll('.cell');

        allCells.forEach(cell => {
            const key = cell.dataset.key;
            if (key && !this.sheet[key].checked) {
                cell.textContent = '-';
                cell.onclick = () => { return; };
            }

        });
    }
}
