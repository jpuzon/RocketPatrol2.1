// Name: Jasha Puzon
// Date: 4/19/2022
// Project Title: CRUSTACEAN CONTROL
// Hours Worked (thus far): 8

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserving keyboard variables
let keyUP, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyW;

// setting UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Changes made:
//      - simultaneous two player (30)
//      - redesign game artwork, UI, and sound to change aesthetic (60)  
//      
//      
//      more to be added...
