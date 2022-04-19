let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserving keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

// setting UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;