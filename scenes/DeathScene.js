export default class DeathScene extends Phaser.Scene {
  constructor() {
    super('DeathScene');
    this.selectedOption = 0;
  }

  // inicializacion de datos
  init(data) {
    this.score = data.score || 0;                                    // puntaje alcanzado en la partida
    this.shipsDestroyed = data.shipsDestroyed || 0;                  // cantidad de naves destruidas
    const storedScore = localStorage.getItem('highScore') || 0;
    this.isNewHighScore = this.score > storedScore;
    if (this.isNewHighScore) {
      localStorage.setItem('highScore', this.score);
    }
  }

  preload() {
    this.load.image('logoGameOver', './public/menus/logo.gameover.png');
    this.load.image('mensajeHS', './public/menus/mensaje.hs.png');
    this.load.image('mensajeNHS', './public/menus/mensaje.nhs.png');
    this.load.image('rocket', './public/menus/rocket.png');
    this.load.image('shipsmsg', './public/menus/shipsmsg.png');
    this.load.image('playBlanco', './public/menus/playblanco.png');
    this.load.image('playGris', './public/menus/playgris.png');
    this.load.image('topBlanco', './public/menus/topblanco.png');
    this.load.image('topGris', './public/menus/topgris.png');
  }

    create() {
    this.cameras.main.setBackgroundColor('#000');
    const centerX = this.scale.width / 2;

    // GAME OVER logo
    this.add.image(centerX, 150, 'logoGameOver').setOrigin(0.5).setDisplaySize(380, 160);

    // MENSAJE: High Score o New High Score
    const mensajeKey = this.isNewHighScore ? 'mensajeNHS' : 'mensajeHS';
    this.add.image(centerX - 70, 320, mensajeKey).setOrigin(0.5).setDisplaySize(200, 25);
    this.add.text(centerX + 170, 320, this.score, {
      fontFamily: 'monospace',
      fontSize: '25px',
      color: '#FFD700'
    }).setOrigin(0.5);

    // MENSAJE: Ships Destroyed
    this.add.image(centerX - 70, 370, 'shipsmsg').setOrigin(0.5).setDisplaySize(200, 25);
    this.add.text(centerX + 170, 370, this.shipsDestroyed, {
      fontFamily: 'monospace',
      fontSize: '25px',
      color: '#FFD700'
    }).setOrigin(0.5);

    // cohete selector
    this.rocket = this.add.image(centerX - 170, 460, 'rocket').setOrigin(0.5).setDisplaySize(80, 30);

    // opciones
    this.playText = this.add.image(centerX, 460, 'playBlanco').setOrigin(0.5).setDisplaySize(180, 30);
    this.topText = this.add.image(centerX, 530, 'topGris').setOrigin(0.5).setDisplaySize(200, 30);

    // teclas
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.inputCooldown = 0;
  }

  update(time) {
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
          console.log("Ir a Top Global");
        }
      }
    }
  }

  updateMenu() {
    if (this.selectedOption === 0) {
      this.playText.setTexture('playBlanco');
      this.topText.setTexture('topGris');
      this.rocket.setY(this.playText.y);
    } else {
      this.playText.setTexture('playGris');
      this.topText.setTexture('topBlanco');
      this.rocket.setY(this.topText.y);
    }
  }
}
