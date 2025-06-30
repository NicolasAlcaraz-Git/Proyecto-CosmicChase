export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.selectedOption = 0;
  }

  init(data) {
    this.musicData = data.music; // ✅ Guardamos la música (si viene)
  }

  preload() {
    // Carga de imágenes desde /public/menus/
    this.load.audio('menuMusic', './public/audio/menu.music.mp3');
    this.load.image('logo', './public/menus/logo.png');
    this.load.image('alcaraz', './public/menus/alcaraz.png');
    this.load.image('unraf', './public/menus/unraf.png');
    this.load.image('rocket', './public/menus/rocket.png');
    this.load.image('startBlanco', './public/menus/startblanco.png');
    this.load.image('startGris', './public/menus/startgris.png');
    this.load.image('topBlanco', './public/menus/topblanco.png');
    this.load.image('topGris', './public/menus/topgris.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000'); // Fondo negro
    const centerX = this.scale.width / 2;

    if (!this.musicData) {
      this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.2 });
      this.menuMusic.play();
    } else {
      this.menuMusic = this.musicData;
      if (!this.menuMusic.isPlaying) {
        this.menuMusic.play({ loop: true });
      }
    }

    // Elementos fijos
    this.add.image(centerX, 65, 'unraf').setOrigin(0.5).setDisplaySize(150, 30);
    this.add.image(centerX + 10, 190, 'logo').setOrigin(0.5).setDisplaySize(450, 180);
    this.add.image(centerX, 320, 'alcaraz').setOrigin(0.5).setDisplaySize(250, 30);

    // Rocket selector
    this.rocket = this.add.image(centerX - 170, 420, 'rocket').setOrigin(0.5).setDisplaySize(80, 30);

    // Opciones
    this.startText = this.add.image(centerX, 420, 'startBlanco').setOrigin(0.5).setDisplaySize(110, 30);
    this.topText = this.add.image(centerX, 490, 'topGris').setOrigin(0.5).setDisplaySize(210, 30);

    // Entrada de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // NUEVO: teclas alternativas
    this.altKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.J,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      up: Phaser.Input.Keyboard.KeyCodes.I,
      down: Phaser.Input.Keyboard.KeyCodes.K
    });

    // Control de tiempo para evitar múltiples inputs rápidos
    this.inputCooldown = 0;
  }

  update(time) {
    // Cooldown para evitar movimientos múltiples
    if (time > this.inputCooldown) {
      // Soporte para flechas y teclas alternativas
      if ((this.cursors.down.isDown || this.altKeys.down.isDown) && this.selectedOption === 0) {
        this.selectedOption = 1;
        this.updateMenu();
        this.inputCooldown = time + 150;
      } else if ((this.cursors.up.isDown || this.altKeys.up.isDown) && this.selectedOption === 1) {
        this.selectedOption = 0;
        this.updateMenu();
        this.inputCooldown = time + 150;
      } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        if (this.selectedOption === 0) {
            this.scene.start('ControlScene', { music: this.menuMusic });
        } else {
          // Futuro: mostrar tabla global
        }
      }
    }
  }

  updateMenu() {
    if (this.selectedOption === 0) {
      this.startText.setTexture('startBlanco');
      this.topText.setTexture('topGris');
      this.rocket.setY(this.startText.y);
    } else {
      this.startText.setTexture('startGris');
      this.topText.setTexture('topBlanco');
      this.rocket.setY(this.topText.y);
    }
  }
}
