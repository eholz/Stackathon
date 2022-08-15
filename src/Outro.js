import Phaser from "phaser";
import blastingOff from "./assets/blastingOff.png";

export default class Outro extends Phaser.Scene {
  constructor() {
    super({ key: "Outro" });
  }
  
  preload() {
    this.load.image("blastingOff", blastingOff);
  }
  
  create() {
    this.add.image(400, 300, "blastingOff");
    const blastText = this.add.text(400, 100, "It looks like you're blasting off again!", {
      fontSize: "32px",
      fill: "#EE3D73",  //font color
    });
    blastText.setOrigin(0.5);
  }
  
  update() {
    
  }
  
}