class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // loading images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        //this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('fishy', './assets/fishy.png');
        //this.load.image('starfield', './assets/starfield.png');       //testing ocean background
        this.load.image('ocean', './assets/ocean.png');

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
        // adding white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // adding rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add 3 spaceships
        //this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        //this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        //this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0);
        this.fish01 = new Fish(this, game.config.width + borderUISize*6, borderUISize*4, 'fishy', 0, 30).setOrigin(0, 0);
        this.fish02 = new Fish(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'fishy', 0, 20).setOrigin(0, 0);
        this.fish03 = new Fish(this, game.config.width, borderUISize*6 + borderPadding*4, 'fishy', 0, 10).setOrigin(0, 0);        
        
        // defining keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
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
            this.p1Rocket.update();
            // updates spaceship movement
            this.fish01.update();
            this.fish02.update();
            this.fish03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.fish03)) {
            this.p1Rocket.reset();
            this.fishExplode(this.fish03);
        }
        if (this.checkCollision(this.p1Rocket, this.fish02)) {
            this.p1Rocket.reset();
            this.fishExplode(this.fish02);
        }
        if (this.checkCollision(this.p1Rocket, this.fish01)) {
            this.p1Rocket.reset();
            this.fishExplode(this.fish01);
        }
    }

    checkCollision(rocket, fish) {
        // simple AABB checking
        if (rocket.x < fish.x + fish.width && 
            rocket.x + rocket.width > fish.x && 
            rocket.y < fish.y + fish.height &&
            rocket.height + rocket.y > fish. y) {
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