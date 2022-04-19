class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // loading images/tile sprites
        this.load.image('crab', './assets/crab.png');
        this.load.image('crab2', './assets/crab2.png');
        //this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('fishy', './assets/fishy.png');
        //this.load.image('starfield', './assets/starfield.png');       //testing ocean background
        this.load.image('ocean', './assets/ocean.png');

        this.load.audio('background_music', './assets/BackgroundMusic.mp3');

        // spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0,
        endFrame: 9});
    }

    create() {
        // placing tile sprite
        //this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.ocean = this.add.tileSprite(0, 0, 640, 480, 'ocean').setOrigin(0, 0);
        // adding green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // adding rocket (p1)
        this.p1Crab = new Crab(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'crab').setOrigin(0.5, 0);
        this.p2Crab = new Crab2(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'crab2').setOrigin(-0.5, 0);
        // add 3 fishy
        this.fish01 = new Fish(this, game.config.width + borderUISize*6, borderUISize*4, 'fishy', 0, 30).setOrigin(0, 0);
        this.fish02 = new Fish(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'fishy', 0, 20).setOrigin(0, 0);
        this.fish03 = new Fish(this, game.config.width, borderUISize*6 + borderPadding*4, 'fishy', 0, 10).setOrigin(0, 0);        
        
        // defining keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.sound.play('background_music');

        // animation config
        this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
        });
        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, 
        this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', 
        scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        //this.starfield.tilePositionX -= 4;
        this.ocean.tilePositionX -= 4;
        
        // checks key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }


        if (!this.gameOver) {
            // updates rocket movement
            this.p1Crab.update();
            this.p2Crab.update();
            // updates spaceship movement
            this.fish01.update();
            this.fish02.update();
            this.fish03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Crab, this.fish03)) {
            this.p1Crab.reset();
            this.fishExplode(this.fish03);
        }
        if (this.checkCollision(this.p1Crab, this.fish02)) {
            this.p1Crab.reset();
            this.fishExplode(this.fish02);
        }
        if (this.checkCollision(this.p1Crab, this.fish01)) {
            this.p1Crab.reset();
            this.fishExplode(this.fish01);
        }
        //p2crab collisions
        if(this.checkCollision(this.p2Crab, this.fish03)) {
            this.p2Crab.reset();
            this.fishExplode(this.fish03);
        }
        if (this.checkCollision(this.p2Crab, this.fish02)) {
            this.p2Crab.reset();
            this.fishExplode(this.fish02);
        }
        if (this.checkCollision(this.p2Crab, this.fish01)) {
            this.p2Crab.reset();
            this.fishExplode(this.fish01);
        }
    }

    checkCollision(crab, fish) {
        // simple AABB checking
        if (crab.x < fish.x + fish.width && 
            crab.x + crab.width > fish.x && 
            crab.y < fish.y + fish.height &&
            crab.height + crab.y > fish. y) {
                return true;
        } else {
            return false;
        }
    }

    fishExplode(fish) {
        // temporarily hide ship
        fish.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(fish.x, fish.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          fish.reset();                         // reset ship position
          fish.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        }); 
        // score add and repaint
        this.p1Score += fish.points;
        this.scoreLeft.text = this.p1Score;  
        this.sound.play('sfx_explosion');
      }
}