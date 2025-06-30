export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.selectedOption = 0; // 0: Start, 1: Top Global
  }

  preload() {
    // Carga de imágenes desde /public/menus/
    this.load.audio('menuMusic', './public/audio/menu.music.mp3');
    this.load.image('logo', 'public/menus/logo.png');
    this.load.image('alcaraz', 'public/menus/alcaraz.png');
    this.load.image('unraf', 'public/menus/unraf.png');
    this.load.image('rocket', 'public/menus/rocket.png');
    this.load.image('startBlanco', 'public/menus/startblanco.png');
    this.load.image('startGris', 'public/menus/startgris.png');
    this.load.image('topBlanco', 'public/menus/topblanco.png');
    this.load.image('topGris', 'public/menus/topgris.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000'); // Fondo negro
    const centerX = this.scale.width / 2;

    this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
    this.menuMusic.play();

    // Cuando pasás de escena, detenés esta música
    this.input.keyboard.on('keydown-ENTER', () => {
      this.menuMusic.stop();
      this.scene.start('GameScene');
    });

    // Elementos fijos
    this.add.image(centerX, 65, 'unraf').setOrigin(0.5).setDisplaySize(150, 30);
    this.add.image(centerX + 10, 190, 'logo').setOrigin(0.5).setDisplaySize(450, 180);
    this.add.image(centerX, 320, 'alcaraz').setOrigin(0.5).setDisplaySize(250, 30);

    // Rocket selector
    this.rocket = this.add.image(centerX - 170, 420, 'rocket').setOrigin(0.5).setDisplaySize(80, 30);

    // Opciones
    this.startText = this.add.image(centerX, 420, 'startBlanco').setOrigin(0.5).setDisplaySize(110, 40);
    this.topText = this.add.image(centerX, 490, 'topGris').setOrigin(0.5).setDisplaySize(210, 40);


    // Entrada de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Control de tiempo para evitar múltiples inputs rápidos
    this.inputCooldown = 0;
  }

  update(time) {
    // Cooldown para evitar movimientos múltiples
    if (time > this.inputCooldown) {
      if (this.cursors.down.isDown && this.selectedOption === 0) {
        this.selectedOption = 1;
        this.updateMenu();
        this.inputCooldown = time + 150;
      } else if (this.cursors.up.isDown && this.selectedOption === 1) {
        this.selectedOption = 0;
        this.updateMenu();
        this.inputCooldown = time + 150;
      } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        if (this.selectedOption === 0) {
          this.scene.start('GameScene');
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
