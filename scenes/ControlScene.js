class ControlScene extends Phaser.Scene {
  constructor() {
    super('ControlScene');
    this.optionIndex = 0;
  }

  init(data) {
    this.music = data.music; // 🎵 recibe la música desde TitleScene
  }

  preload() {
    this.load.image('controls', './public/menus/controls.png');
    this.load.image('action', './public/menus/action.png');
    this.load.image('move', './public/menus/move.png');
    this.load.image('teclas', './public/menus/teclas.png');
    this.load.image('flechas', './public/menus/flechas.png');
    this.load.image('letras', './public/menus/letras.png');
    this.load.image('gameblanco', './public/menus/gameblanco.png');
    this.load.image('gamegris', './public/menus/gamegris.png');
    this.load.image('backblanco', './public/menus/backblanco.png');
    this.load.image('backgris', './public/menus/backgris.png');
    this.load.image('rocket', './public/menus/misil1.png');
  }

  create() {
    // Imagen fija superior
    this.add.image(400, 80, 'controls').setScale(0.4);

    // Títulos
    this.add.image(220, 160, 'action').setScale(0.25);
    this.add.image(570, 160, 'move').setScale(0.25);

    // Teclas amarillas
    this.add.image(220, 260, 'teclas').setScale(0.45);

    // Imagen que alterna entre flechas y teclas (rojas)
    this.currentAlt = this.add.image(570, 260, 'flechas').setScale(0.5);
    this.altState = true;
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.altState = !this.altState;
        this.currentAlt.setTexture(this.altState ? 'flechas' : 'letras');
      },
      loop: true
    });

    // Opciones
    this.gameStart = this.add.image(400, 400, 'gameblanco').setScale(0.4);
    this.back = this.add.image(400, 470, 'backgris').setScale(0.4);

    // Misil selector
    this.selector = this.add.image(280, 400, 'rocket').setScale(0.15);

    // Input
    this.input.keyboard.on('keydown-UP', () => this.updateSelection(-1));
    this.input.keyboard.on('keydown-DOWN', () => this.updateSelection(1));
    this.input.keyboard.on('keydown-Z', () => this.selectOption());
    this.input.keyboard.on('keydown-ENTER', () => this.selectOption());

    this.updateSelection(0); // fuerza que se actualicen las texturas y posición del selector
  }

  updateSelection(dir) {
    this.optionIndex = Phaser.Math.Wrap(this.optionIndex + dir, 0, 2);
    if (this.optionIndex === 0) {
      this.gameStart.setTexture('gameblanco');
      this.back.setTexture('backgris');
      this.selector.y = this.gameStart.y;
    } else {
      this.gameStart.setTexture('gamegris');
      this.back.setTexture('backblanco');
      this.selector.y = this.back.y;
    }
  }

  selectOption() {
    if (this.optionIndex === 0) {
      if (this.music && this.music.isPlaying) {
        this.music.stop(); // Solo al ir a GameScene
      }
      this.scene.start('GameScene');
    } else {
      this.scene.start('TitleScene', { music: this.music }); // Volvés con música
    }
  }
}
export default ControlScene;
