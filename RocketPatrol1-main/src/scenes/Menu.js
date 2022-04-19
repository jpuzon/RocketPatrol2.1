class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // loading audio
        this.load.audio('sfx_select', './assets/Blip_Select2.wav');
        this.load.audio('sfx_explosion', './assets/explosion.wav');
        this.load.audio('sfx_crab', './assets/Laser_Shoot4.wav');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Tahoma',
            fontSize: '30px',
            backgroundColor: '#00BBAB',
            color: '#FFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2 - borderUISize -
        borderPadding, 'CRUSTACEAN CONTROL', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '25px'
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows or (A),(D) to move; Use (W) or ꜛ to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#F3B141';
        menuConfig.color = '#843605';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        
        // defines keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            fishSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene'); 
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            fishSpeed: 4,
            gameTimer: 45000   
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');
        }
      }
}