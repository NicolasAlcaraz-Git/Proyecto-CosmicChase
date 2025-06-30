import TitleScene from "./scenes/TitleScene";
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 16,
      height: 9,
    },
    max: {
      width: 1920,
      height:  1080,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
