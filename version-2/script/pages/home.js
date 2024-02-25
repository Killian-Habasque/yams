function init() {
    const cup = document.querySelector(".logo__cup");
    const bandOne = document.querySelector(".band.one");
    const bandTwo = document.querySelector(".band.two");
    const bandThree = document.querySelector(".band.three");
    const diceOne = document.querySelector(".logo__dice.one");
    const diceTwo = document.querySelector(".logo__dice.two");
    const text = document.querySelector(".logo__text");


    TweenMax.from(cup, 2, {
        x: 200, y: 200, rotation: -30,
        onComplete: function () { // Fonction de rappel pour la deuxième animation de dice2
            TweenMax.to(cup, 10, { x: 10, y: 10, rotation: -5, repeat: -1, yoyo: true }); // Deuxième animation de dice2
        }
    });

    TweenMax.to(cup, 1, {
        opacity: 1, delay: 0.2
    });

    TweenMax.from(text, 2, { x: -100, y: 80, });
    TweenMax.to(text, 1, {
        opacity: 1, delay: 0.2
    });
    TweenMax.from(diceOne, 2, {
        x: 200, y: 100, rotation: 50,
        onComplete: function () { // Fonction de rappel pour la deuxième animation de dice2
            TweenMax.to(diceOne, 15, { x: 10, y: -10, rotation: -15, repeat: -1, yoyo: true }); // Deuxième animation de dice2
        }
    });
    TweenMax.to(diceOne, 1, {
        opacity: 1, delay: 0.2
    });
    TweenMax.from(diceTwo, 2, {
        x: 200, y: 100, rotation: -60,
        onComplete: function () { // Fonction de rappel pour la deuxième animation de dice2
            TweenMax.to(diceTwo, 15, { x: 10, y: -10, rotation: 15, repeat: -1, yoyo: true }); // Deuxième animation de dice2
        }
    });
    TweenMax.to(diceTwo, 1, {
        opacity: 1, delay: 0.2
    });
    TweenMax.from(bandThree, 1.5, { transform: "translateX(27px) translateY(-7px)", delay: 0.2, repeat: -1, yoyo: true });
    TweenMax.to(bandThree, 0.5, {
        opacity: 1, delay: 0.2
    });

    TweenMax.from(bandTwo, 1.5, { transform: "translateX(54px) translateY(-14px)", delay: 0.4, repeat: -1, yoyo: true });
    TweenMax.to(bandTwo, 1, {
        opacity: 1, delay: 0.2
    });

    TweenMax.from(bandOne, 1.5, { transform: "translateX(81px) translateY(-21px)", delay: 0.6, repeat: -1, yoyo: true });
    TweenMax.to(bandOne, 1, {
        opacity: 1, delay: 0.2
    });

}