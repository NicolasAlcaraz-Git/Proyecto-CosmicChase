import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import DeathScene from './scenes/DeathScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 16, height: 9 },
    max: { width: 1920, height: 1080 },
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [TitleScene, GameScene, DeathScene], // Acá las escenas en orden
};

new Phaser.Game(config);
