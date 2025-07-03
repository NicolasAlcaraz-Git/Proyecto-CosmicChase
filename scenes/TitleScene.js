export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.selectedOption = 0; // 0 para "Start", 1 para "Top Scores"
  }
  init(data) {
    this.musicData = data.music; // recibe la musica del menu si ya existe
  }

  preload() {
    // carga de la musica
    this.load.audio('menuMusic', './public/audio/menu.music.mp3');
    // carga de imagenes
    this.load.image('logo', './public/menus/logo.png');
    this.load.image('unraf', './public/menus/unraf.png');
    this.load.image('rocket', './public/menus/rocket.png');
    this.load.image('alcaraz', './public/menus/alcaraz.png');
    this.load.image('topGris', './public/menus/topgris.png');
    this.load.image('startGris', './public/menus/startgris.png');
    this.load.image('topBlanco', './public/menus/topblanco.png');
    this.load.image('startBlanco', './public/menus/startblanco.png');
  }

  // ACA EMPIEZA EL CREATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  create() {
    this.cameras.main.setBackgroundColor('#000'); // fondo negro
    const centerX = this.scale.width / 2;         // centro de la pantalla en X

    // musica del menu
    if (!this.musicData) {
      this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.2 });
      this.menuMusic.play();
    } else {
      this.menuMusic = this.musicData; 
      if (!this.menuMusic.isPlaying) {
        this.menuMusic.play({ loop: true });
      }
    }

    // elementos fijos del logo
    this.add.image(centerX, 65, 'unraf').setOrigin(0.5).setDisplaySize(150, 30);
    this.add.image(centerX, 320, 'alcaraz').setOrigin(0.5).setDisplaySize(250, 30);
    this.add.image(centerX + 10, 190, 'logo').setOrigin(0.5).setDisplaySize(450, 180);

    // cohete seleccionador
    this.rocket = this.add.image(centerX - 170, 420, 'rocket').setOrigin(0.5).setDisplaySize(80, 30);

    // opciones
    this.startText = this.add.image(centerX, 420, 'startBlanco').setOrigin(0.5).setDisplaySize(110, 30);
    this.topText = this.add.image(centerX, 490, 'topGris').setOrigin(0.5).setDisplaySize(210, 30);

    // entrada de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // teclas alternativas
    this.altKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.J,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      up: Phaser.Input.Keyboard.KeyCodes.I,
      down: Phaser.Input.Keyboard.KeyCodes.K
    });

    this.inputCooldown = 0; // fuerza que se actualicen las texturas y posición del selector
  }

  // ACA EMPIEZA EL UPDATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  update(time) {
    if (time > this.inputCooldown) {
      if ((this.cursors.down.isDown || this.altKeys.down.isDown) && this.selectedOption === 0) { // si se presiona hacia abajo o la tecla alternativa y la opcion seleccionada es "Start"
        this.selectedOption = 1; // cambia la opcion seleccionada a "Top Scores"
        this.updateMenu(); 
        this.inputCooldown = time + 150;
      } else if ((this.cursors.up.isDown || this.altKeys.up.isDown) && this.selectedOption === 1) { // si se presiona hacia arriba o la tecla alternativa y la opcion seleccionada es "Top Scores"
        this.selectedOption = 0; // cambia la opcion seleccionada a "Start"
        this.updateMenu(); 
        this.inputCooldown = time + 150; 
      } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) { // si se presiona Enter
        if (this.selectedOption === 0) { // si la opcion seleccionada es "Start"
            this.scene.start('ControlScene', { music: this.menuMusic }); // inicia la escena de control y pasa la musica del menu
        }
      }
    }
  }
  updateMenu() { // actualiza el menu segun la opcion seleccionada
    if (this.selectedOption === 0) { // si la opcion seleccionada es "Start"
      this.startText.setTexture('startBlanco'); // cambia el texto a blanco
      this.topText.setTexture('topGris'); // cambia el texto a gris
      this.rocket.setY(this.startText.y); // posiciona el cohete en la opcion "Start"
    } else {
      this.startText.setTexture('startGris'); // cambia el texto a gris
      this.topText.setTexture('topBlanco'); // cambia el texto a blanco
      this.rocket.setY(this.topText.y); // posiciona el cohete en la opcion "Top Scores"
    }
  }
}
