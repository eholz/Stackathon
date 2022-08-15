import Phaser from "phaser";
import Game from './Game.js';
import Outro from './Outro.js';

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
  scene: [Game, Outro]
};

const game = new Phaser.Game(config);