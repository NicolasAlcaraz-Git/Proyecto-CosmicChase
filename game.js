import TitleScene from './scenes/TitleScene.js';
import ControlScene from './scenes/ControlScene.js';
import GameScene from './scenes/GameScene.js';
import DeathScene from './scenes/DeathScene.js';

// configuración pantalla del juego
const config = {
  type: Phaser.AUTO,
  width: 800,         // ancho de la pantalla del juego
  height: 600,        // alto de la pantalla del juego
  scale: {
    mode: Phaser.Scale.FIT,                // modo de escala, FIT ajusta el juego al tamaño de la pantalla
    autoCenter: Phaser.Scale.CENTER_BOTH,  // centra el juego en la pantalla
    min: { width: 16, height: 9 },         // tamaño mínimo de la pantalla
    max: { width: 1920, height: 1080 },    // tamaño máximo de la pantalla
  },
  physics: {
    default: 'arcade',            // tipo de física utilizada, arcade es una física simple y rápida
    arcade: { debug: false },     // desactiva la visualización de la física
  },
  scene: [TitleScene, ControlScene, GameScene, DeathScene], // escenas en orden
};

new Phaser.Game(config);
