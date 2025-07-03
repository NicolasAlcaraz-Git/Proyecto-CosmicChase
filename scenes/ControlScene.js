class ControlScene extends Phaser.Scene {
  constructor() {
    super('ControlScene');
    this.optionIndex = 0; // 0 para "Start", 1 para "Back"
  }
  init(data) {
    this.music = data.music; // recibe la música desde TitleScene
  }

  preload() {
    // solo carga de imagenes
    this.load.image('move', './public/menus/move.png');
    this.load.image('order', './public/menus/order.png');
    this.load.image('action', './public/menus/action.png');
    this.load.image('teclas', './public/menus/teclas.png');
    this.load.image('rocket', './public/menus/misil1.png');
    this.load.image('letras', './public/menus/letras.png');
    this.load.image('flechas', './public/menus/flechas.png');
    this.load.image('backgris', './public/menus/backgris.png');
    this.load.image('controls', './public/menus/controls.png');
    this.load.image('gamegris', './public/menus/gamegris.png');
    this.load.image('gameblanco', './public/menus/gameblanco.png');
    this.load.image('backblanco', './public/menus/backblanco.png');
  }

  // ACA EMPIEZA EL CREATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  create() {
    this.add.image(400, 90, 'controls').setScale(0.2); // imagen fija superior de controles

    // subtítulos
    this.add.image(220, 160, 'action').setScale(0.2);
    this.add.image(570, 160, 'move').setScale(0.2);

    // imagen de teclas amarillas
    this.add.image(220, 260, 'teclas').setScale(0.65);

    // imagen que alterna entre flechas y teclas (rojas)
    this.currentAlt = this.add.image(570, 260, 'flechas').setScale(0.8);
    this.altState = true;
    this.time.addEvent({
      delay: 2000,             // cambia cada 2 segundos cambia
      callback: () => {
        this.altState = !this.altState;
        this.currentAlt.setTexture(this.altState ? 'flechas' : 'letras'); // alterna entre imagen flechas y letras
      },
      loop: true
    });

    // instrucciones
    this.add.image(180, 370, 'order').setScale(0.17);

    // opciones
    this.gameStart = this.add.image(400, 480, 'gameblanco').setScale(0.5);
    this.back = this.add.image(400, 540, 'backgris').setScale(0.5);

    // cohete seleccionador
    this.selector = this.add.image(170, 440, 'rocket').setScale(0.15);

    // entrada de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    // teclas alternativas
    this.altKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.J,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      up: Phaser.Input.Keyboard.KeyCodes.I,
      down: Phaser.Input.Keyboard.KeyCodes.K
    });

    this.updateSelection(0); // fuerza que se actualicen las texturas y posición del selector
  }

  // ACA EMPIEZA EL UPDATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  update(time) {
    if (!this.inputCooldown || time > this.inputCooldown) {
      if ((this.cursors.down.isDown || this.altKeys.down.isDown)) { // si se presiona hacia abajo o la tecla alternativa y la opción seleccionada es "Start Game"
        this.updateSelection(1); // cambia la opción seleccionada a "Back"
        this.inputCooldown = time + 150;
      } else if ((this.cursors.up.isDown || this.altKeys.up.isDown)) { // si se presiona hacia arriba o la tecla alternativa y la opción seleccionada es "Back"
        this.updateSelection(-1); // cambia la opción seleccionada a "Start Game"
        this.inputCooldown = time + 150;
      } else if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.zKey)) { // si se presiona Enter o Z (por algun motivo Z es enter en esta pantalla)
        this.selectOption(); // selecciona la opción actual
        this.inputCooldown = time + 150;
      }
    }
  }
  updateSelection(dir) { // actualiza la selección según la dirección
    this.optionIndex = Phaser.Math.Wrap(this.optionIndex + dir, 0, 2); // 0 para "Start Game", 1 para "Back"
    if (this.optionIndex === 0) { // si la opción seleccionada es "Start Game"
      this.gameStart.setTexture('gameblanco'); // cambia el texto a blanco
      this.back.setTexture('backgris'); // cambia el texto a gris
      this.selector.y = this.gameStart.y; // posiciona el cohete en la opción "Start Game"
    } else {
      this.gameStart.setTexture('gamegris'); // cambia el texto a gris
      this.back.setTexture('backblanco'); // cambia el texto a blanco
      this.selector.y = this.back.y; // posiciona el cohete en la opción "Back"
    }
  }
  selectOption() { // selecciona la opción actual
    if (this.optionIndex === 0) { // si la opción seleccionada es "Start Game"
      if (this.music && this.music.isPlaying) { // si hay música y está sonando
        this.music.stop(); // detiene la música
      }
      this.scene.start('GameScene'); // inicia la escena del juego
    } else {
      this.scene.start('TitleScene', { music: this.music }); // volver a TitleScene con la música
    }
  }
}
export default ControlScene; // exporta la clase ControlScene para que pueda ser utilizada en otras partes del juego
