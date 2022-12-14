import Phaser from "phaser";
import sky from "./assets/sky.png";
import ground from "./assets/platform.png";
import jessie from "./assets/jessie.png";
import thunder from "./assets/thunder1.png";
import pikachu from "./assets/pikachu.png";
import koffing from "./assets/koffing.png";
// import smallPlatform from "./assets/smallPlatform.png";
// import smallerPlatform from "./assets/smallerPlatform.png";
import smallerPlatform2 from "./assets/smallerPlatform2.png";
// import smallerPlatform3 from "./assets/smallerPlatform3.png";
import diglett from "./assets/diglett.png";
// import MovingPlatform from './MovingPlatform'
let gameOver = false;

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload() {
    //load images we will use.
    this.load.image("sky", sky);
    this.load.image("ground", ground);
    this.load.image("thunder", thunder);
    this.load.image("koffing", koffing);
    // this.load.image("smallPlatform", smallPlatform);
    // this.load.image("smallerPlatform", smallerPlatform);
    this.load.image("smallerPlatform2", smallerPlatform2);
    // this.load.image("smallerPlatform3", smallerPlatform3);
    this.load.image("pikachu", pikachu);
    this.load.image("diglett", diglett);

    this.load.spritesheet("jessie", jessie, {
      frameWidth: 47,
      frameHeight: 63,
    });
  }

  create() {
    this.add.image(400, 300, "sky"); //put this first so everything else will display on top of it

    //platforms
    const platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 570, "ground").setScale(2).refreshBody();
      // (so the ground is 64 y px tall. centered at 570.)
      // the top of the ground is 538. 

    //og platforms:
    // platforms.create(700, 400, "ground");
    // platforms.create(0, 250, "ground");
    // platforms.create(800, 220, "ground");
    
    //pikachu spawns here
    platforms.create(30, 200, "smallerPlatform2");
    
    platforms.create(50, 370, "smallerPlatform2");
    platforms.create(70, 490, "smallerPlatform2");
    platforms.create(180, 430, "smallerPlatform2");
    platforms.create(180, 310, "smallerPlatform2");
    platforms.create(180, 160, "smallerPlatform2");
    platforms.create(260, 250, "smallerPlatform2");
    platforms.create(320, 200, "smallerPlatform2");
    platforms.create(320, 430, "smallerPlatform2");
    platforms.create(400, 370, "smallerPlatform2");
    platforms.create(480, 310, "smallerPlatform2");
    platforms.create(500, 430, "smallerPlatform2");
    platforms.create(560, 250, "smallerPlatform2");
    platforms.create(630, 500, "smallerPlatform2");
    platforms.create(660, 190, "smallerPlatform2");
    
  //   this.koffing = new MovingPlatform(this, 500, 500, 'koffing', {
		// isStatic: true
  // 	})
  // 	this.koffing.moveVertically()
  	
    // const movingPlatforms = this.physics.add.staticGroup();
    // movingPlatforms.create(400, 300, "koffing");
     // this.physics.add.collider(this.player, movingPlatforms);
       //add collider for koffing once i figure out how to create non-static group for it
    
    this.player = this.physics.add.sprite(400, 10, "jessie"); //starting coordinates
    this.player.setBounce(0.1); //0.2
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);
    
    //animation
    this.anims.create({
      key: "turn",
      frames: [{ key: "jessie", frame: 7 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("jessie", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("jessie", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    
    const digletts = this.physics.add.staticGroup();
    // digletts.create(700, 530, "diglett");
    
    this.physics.add.collider(digletts, platforms);
    this.physics.add.collider(this.player, digletts);
    
    const pikachus = this.physics.add.group({
      key: "pikachu",
      repeat: 0,
      setXY: { x: 30, y: 0, stepX: 60 },
    });
    
    this.physics.add.collider(pikachus, platforms);
    this.physics.add.collider(pikachus, digletts);
    this.physics.add.overlap(this.player, pikachus, collect, null, this);
    
    //thunders
    const thunders = this.physics.add.group();
    this.physics.add.collider(thunders, platforms);

    this.physics.add.collider(this.player, thunders, thunderTouched, null, this);
    this.physics.add.overlap(digletts, thunders, collect, null, this);
      //digletts absorb thunders

    let lives = 2;
    //starting text
    const livesText = this.add.text(15, 50, "Lives: " + lives, {
      fontSize: "32px",
      fill: "#EE3D73",  //font color
    });

    function thunderTouched(player, thunder) {
      if (lives === 1) {
        this.physics.pause();
        this.player.setTint(0xff0000); //0xff000, #5A3DA9, 0xff0000 red, 0x + hexcode
        this.player.anims.play("turn");
        lives -= 1;
        livesText.setText("Lives: " + lives);
        gameOver = true;
        const gameOverText = this.add.text(400, 300, "Game Over", {
          fontSize: "64px",
          fill: "#EE3D73",  //font color
        });
        gameOverText.setOrigin(0.5)
        setTimeout(() => {
            this.scene.start("Outro");
        }, 800);
      }
      if (lives === 2) {
        this.player.setTint(0xff0000);
        lives -= 1;
        livesText.setText("Lives: " + lives);
      }
    }

    //score text
    const scoreText = this.add.text(15, 15, "What are you waiting for?? CATCH PIKACHU", {
      fontSize: "32px",
      fill: "#EE3D73",  //font color
    });
    let score = 0;
    
    function collect(player, pikachu) {
      pikachu.disableBody(true, true);
      score += 1;
      
      score === 1 
        ? scoreText.setText("Pikachu escaped " + score + " time")
        : scoreText.setText("Pikachu escaped " + score + " times");

      if (score === 3) {
        digletts.create(730, 530, "diglett");
      }

      if (pikachus.countActive(true) === 0) {
        pikachus.children.iterate(function (child) {
          child.enableBody(true, true);
        });
        
        var x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        const pikachu = pikachus.create(x, 16, "pikachu");
        pikachu.setBounce(.1);
       
        const thunder = thunders.create(x, 16, "thunder");
        thunder.setBounce(.8);
        thunder.setCollideWorldBounds(true);
        thunder.setVelocity(Phaser.Math.Between(-200, 200), 20);
        
      }
    }
    // console.log(this)
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-250); //-420 //jump height
    }
  }
}
