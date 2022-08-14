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

    this.load.spritesheet("jessie", jessie, {
      frameWidth: 47,
      frameHeight: 63,
    });
  }

  create() {
    this.add.image(400, 300, "sky"); //put this first so everything else will disply on top of it

    const platforms = this.physics.add.staticGroup();
    //platforms
    // platforms.create(100, 100, "ground").setScale(2).refreshBody();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();


    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
    this.player = this.physics.add.sprite(100, 450, "jessie");
    this.player.setBounce(0.2);
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
    //stars
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(this.player, stars, collect, null, this);
    //thunders

    const thunders = this.physics.add.group();
    this.physics.add.collider(thunders, platforms);

    this.physics.add.collider(this.player, thunders, thunderTouched, null, this);

    function thunderTouched(player, thunder) {
      this.physics.pause();
      this.player.setTint(0xff000);
      this.player.anims.play("turn");
    }

    //score text

    const scoreText = this.add.text(15, 15, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    let score = 0;
    //stars collision
    function collect(player, star) {
      star.disableBody(true, true);
      score += 1;
      scoreText.setText("Score: " + score);

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        const thunder = thunders.create(x, 16, "thunder");
        thunder.setBounce(1);
        thunder.setCollideWorldBounds(true);
        thunder.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }
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
      this.player.setVelocityY(-420);
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
      gravity: { y: 450 },
      debug: false,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
