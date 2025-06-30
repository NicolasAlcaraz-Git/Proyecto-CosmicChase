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
    this.load.image('order', './public/menus/order.png');
    this.load.image('gameblanco', './public/menus/gameblanco.png');
    this.load.image('gamegris', './public/menus/gamegris.png');
    this.load.image('backblanco', './public/menus/backblanco.png');
    this.load.image('backgris', './public/menus/backgris.png');
    this.load.image('rocket', './public/menus/misil1.png');
  }

  create() {
    // Imagen fija superior
    this.add.image(400, 90, 'controls').setScale(0.2);

    // Títulos
    this.add.image(220, 160, 'action').setScale(0.2);
    this.add.image(570, 160, 'move').setScale(0.2);

    // Teclas amarillas
    this.add.image(220, 260, 'teclas').setScale(0.65);

    // Imagen que alterna entre flechas y teclas (rojas)
    this.currentAlt = this.add.image(570, 260, 'flechas').setScale(0.8);
    this.altState = true;
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.altState = !this.altState;
        this.currentAlt.setTexture(this.altState ? 'flechas' : 'letras');
      },
      loop: true
    });

    // instrucciones
    this.add.image(180, 370, 'order').setScale(0.17);

    // Opciones
    this.gameStart = this.add.image(400, 480, 'gameblanco').setScale(0.5);
    this.back = this.add.image(400, 540, 'backgris').setScale(0.5);

    // Misil selector
    this.selector = this.add.image(170, 440, 'rocket').setScale(0.15);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.altKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.J,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      up: Phaser.Input.Keyboard.KeyCodes.I,
      down: Phaser.Input.Keyboard.KeyCodes.K
    });

    this.updateSelection(0); // fuerza que se actualicen las texturas y posición del selector
  }

  update(time) {
    if (!this.inputCooldown || time > this.inputCooldown) {
      if ((this.cursors.down.isDown || this.altKeys.down.isDown)) {
        this.updateSelection(1);
        this.inputCooldown = time + 150;
      } else if ((this.cursors.up.isDown || this.altKeys.up.isDown)) {
        this.updateSelection(-1);
        this.inputCooldown = time + 150;
      } else if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.zKey)) {
        this.selectOption();
        this.inputCooldown = time + 150;
      }
    }
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
