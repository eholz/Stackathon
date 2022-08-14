import Phaser from "phaser";
import sky from "./assets/sky.png";
import ground from "./assets/platform.png";
import star from "./assets/star.png";
// import thunder from "./assets/thunder.png"; //was bomb
// import monkey from "./assets/jessie.png"; //32 by 48 frame dimensions + different frameNums
import jessie from "./assets/jessie.png";
import thunder from "./assets/thunder1.png"; //replace all thunder
import pikachu from "./assets/pikachu.png";
  //don't ctrl f star bc that also includes "start"
import koffing from "./assets/koffing.png";
import smallPlatform from "./assets/smallPlatform.png";
import smallerPlatform from "./assets/smallerPlatform.png";
import smallerPlatform2 from "./assets/smallerPlatform2.png";
import smallerPlatform3 from "./assets/smallerPlatform3.png";
import diglett from "./assets/diglett.png";


class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    //load images we will use.
    this.load.image("sky", sky);
    this.load.image("ground", ground);
    this.load.image("star", star);
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
    this.add.image(400, 300, "sky"); //put this first so everything else will disply on top of it

    //platforms
    const platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 570, "ground").setScale(2).refreshBody();
      // (so the ground is 64 y px tall. centered at 570.)
      // the top of the ground is 538. 

    //og platforms:
    // platforms.create(700, 400, "ground");
    // platforms.create(0, 250, "ground");
    platforms.create(800, 220, "ground");
    
    
    
    // platforms.create(100, 500, "smallPlatform");
    // platforms.create(300, 500, "smallerPlatform");
    
    platforms.create(100, 490, "smallerPlatform2");
    
    // platforms.create(180, 430, "smallerPlatform2");
    
    platforms.create(250, 490, "smallerPlatform2");
    platforms.create(400, 420, "smallerPlatform2");
    
    // platforms.create(400, 300, "smallerPlatform2");
    // platforms.create(400, 150, "smallerPlatform2"); //land here front and center   
    
    platforms.create(500, 500, "smallerPlatform2");
    
    // platforms.create(600, 500, "smallerPlatform3");
    
    platforms.create(700,532, "diglett");
      //position it slightly in the ground/platform
    
    
    
    const movingPlatforms = this.physics.add.staticGroup();
    movingPlatforms.create(400, 300, "koffing");
    
    
    
    this.player = this.physics.add.sprite(400, 10, "jessie"); //starting coordinates
    // this.player = this.physics.add.sprite(100, 450, "jessie");
    this.player.setBounce(0.1); //0.2
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, movingPlatforms);
    
    //add collider for koffing once i figure out how to create non-static group for it
    
    
    
    
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
    
    //stars
    
    // left stars
    const stars = this.physics.add.group({
      key: "star",
      repeat: 5,
      setXY: { x: 12, y: 0, stepX: 60 },
    });
    
    //OG stars
    // const stars = this.physics.add.group({
    //   key: "star",
    //   repeat: 11,
    //   setXY: { x: 12, y: 0, stepX: 70 },
    // });
    
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(this.player, stars, collect, null, this);
    
    const pikachus = this.physics.add.group({
      key: "pikachu",
      repeat: 0,
      setXY: { x: 12, y: 0, stepX: 60 },
    });
    
    this.physics.add.collider(pikachus, platforms);
    this.physics.add.overlap(this.player, pikachus, collect, null, this);
    
    
    //thunders

    const thunders = this.physics.add.group();
    this.physics.add.collider(thunders, platforms);

    this.physics.add.collider(this.player, thunders, thunderTouched, null, this);

    let lives = 2;
    const livesText = this.add.text(15, 50, "Lives: " + lives, {
      fontSize: "32px",
      fill: "#EE3D73",  //font color
    });

    function thunderTouched(player, thunder) {
      if (lives === 1) {
        this.physics.pause();
        this.player.setTint(0xff0000); //0xff000, #5A3DA9, 0xff0000 red, 0x + hexcode
        this.player.anims.play("turn");
      }
      if (lives === 2) {
        this.player.setTint(0xff0000);
        lives -= 1
        livesText.setText("Lives: " + lives)
      }
      
    }
    
    // function thunderTouched(player, thunder) {
    //   this.physics.pause();
    //   this.player.setTint(0xff0000); //0xff000, #5A3DA9, 0xff0000 red, 0x + hexcode
    //   this.player.anims.play("turn");
    // }

    // function thunderTouched(player, pikachu) {
    //   this.physics.pause();
    //   this.player.setTint(0xff0000); //0xff000, #5A3DA9, 0xff0000 red, 0x + hexcode
    //   this.player.anims.play("turn");
    // }
    
    // function thunderTouched(player, diglett) {
    //   this.physics.pause();
    //   this.player.setTint(0xff0000); //0xff000, #5A3DA9, 0xff0000 red, 0x + hexcode
    //   this.player.anims.play("turn");
    // }


    //score text

    //starting text
    const scoreText = this.add.text(15, 15, "CATCH PIKACHU", {
      fontSize: "32px",
      fill: "#EE3D73",  //font color
    });
    let score = 0;
    // let lives = 2;
    
    // stars collision
    function collect(player, star) {
      star.disableBody(true, true);
      score += 1;
      
    // score === 1 
    //     ? scoreText.setText("Pikachu escaped " + score + " time \nLives: " + lives)
    //     : scoreText.setText("Pikachu escaped " + score + " times \nLives: " + lives);


      
      score === 1 
        ? scoreText.setText("Pikachu escaped " + score + " time")
        : scoreText.setText("Pikachu escaped " + score + " times");

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        // const pikachu = pikachus.create(x, 16, "thunder");
        // thunder.setBounce(1);
        // thunder.setCollideWorldBounds(true);
        // thunder.setVelocity(Phaser.Math.Between(-200, 200), 20);

        const thunder = thunders.create(x, 16, "thunder");
        thunder.setBounce(1);
        thunder.setCollideWorldBounds(true);
        thunder.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }
    
      // function collect(player, pikachu) {
      // pikachu.disableBody(true, true);
      // score += 1;
      
      // score === 1 
      //   ? scoreText.setText("Pikachu escaped " + score + " time")
      //   : scoreText.setText("Pikachu escaped " + score + " times");

      // var x =
      //     player.x < 400
      //       ? Phaser.Math.Between(400, 800)
      //       : Phaser.Math.Between(0, 400);
      
      // if (pikachus.countActive(true) === 0) {
        
      //   pikachus.children.iterate(function (child) {
      //     child.enableBody(true, child.x, 0, true, true);
      //   });

        // const pikachu = pikachus.create(x, 16, "thunder");
        // thunder.setBounce(1);
        // thunder.setCollideWorldBounds(true);
        // thunder.setVelocity(Phaser.Math.Between(-200, 200), 20);

    //     const thunder = thunders.create(x, 16, "thunder");
    //     thunder.setBounce(1);
    //     thunder.setCollideWorldBounds(true);
    //     thunder.setVelocity(Phaser.Math.Between(-200, 200), 20);
    //   }
    // }
    
    
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

    // if (cursors.up.isDown) {
    //   this.player.setVelocityY(-250); //-420 //jump height
    // }
    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-250); //-420 //jump height
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 450 }, //{ y: 450 } //x of 4000 isn't that strong...
      debug: false,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
