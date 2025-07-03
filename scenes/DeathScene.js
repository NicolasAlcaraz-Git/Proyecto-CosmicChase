export default class DeathScene extends Phaser.Scene {
  constructor() {
    super('DeathScene');
    this.selectedOption = 0; // 0 para "Play Again", 1 para "Top Global"
  }

  // inicializacion de datos
  init(data) {
    this.score = data.score || 0;                                    // puntaje alcanzado en la partida
    this.shipsDestroyed = data.shipsDestroyed || 0;                  // cantidad de naves destruidas
    const storedScore = localStorage.getItem('highScore') || 0;      // puntaje almacenado en localStorage, si no existe se inicializa a 0
    this.isNewHighScore = this.score > storedScore;                  // verifica si el puntaje actual es un nuevo record
    if (this.isNewHighScore) {
      localStorage.setItem('highScore', this.score);                 // actualiza el record en localStorage
    }
  }

  preload() {
    // carga de sonidos
    this.load.audio('gameover1', './public/audio/gameover1.wav');
    this.load.audio('gameover2', './public/audio/gameover2.wav');
    // carga de imagenes
    this.load.image('rocket', './public/menus/rocket.png');
    this.load.image('shipsmsg', './public/menus/shipsmsg.png');
    this.load.image('playGris', './public/menus/playgris.png');
    this.load.image('topBlanco', './public/menus/topblanco.png');
    this.load.image('mensajeHS', './public/menus/mensaje.hs.png');
    this.load.image('playBlanco', './public/menus/playblanco.png');
    this.load.image('mensajeNHS', './public/menus/mensaje.nhs.png');
    this.load.image('logoGameOver', './public/menus/logo.gameover.png');
  }

  // ACA EMPIEZA EL CREATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    create() {
    this.cameras.main.setBackgroundColor('#000'); // color de fondo negro
    const centerX = this.scale.width / 2;

    // reproduce el sonido de game over según el puntaje
    if (this.isNewHighScore) {
        this.sound.play('gameover2', { loop: false }); // sonido para nuevo record
    } else {
        this.sound.play('gameover1', { loop: false }); // sonido para game over normal
    }

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

    // entrada de teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // teclas alternativas
    this.altKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.I,
      down: Phaser.Input.Keyboard.KeyCodes.K
    });

    this.inputCooldown = 0; // fuerza que se actualicen las texturas y posición del selector
  }

  // ACA EMPIEZA EL UPDATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  update(time) {
    if (time > this.inputCooldown) {
      if ((this.cursors.down.isDown || this.altKeys.down.isDown) && this.selectedOption === 0) { // si se presiona hacia abajo o la tecla alternativa y la opcion seleccionada es "Play Again"
        this.selectedOption = 1; // cambia la opcion seleccionada a "Top Global"
        this.updateMenu();
        this.inputCooldown = time + 150;
      } else if ((this.cursors.up.isDown || this.altKeys.up.isDown) && this.selectedOption === 1) { // si se presiona hacia arriba o la tecla alternativa y la opcion seleccionada es "Top Global"
        this.selectedOption = 0; // cambia la opcion seleccionada a "Play Again"
        this.updateMenu();
        this.inputCooldown = time + 150;
      } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) { // si se presiona Enter
        if (this.selectedOption === 0) { // si la opcion seleccionada es "Play Again"
          this.scene.start('TitleScene'); // reinicia el juego y vuelve a la pantalla de título
        } else {
          console.log("Ir a Top Global"); // futuro codigo para implementar la pantalla de Top Global
        }
      }
    }
  }
  updateMenu() {
    if (this.selectedOption === 0) {           // si la opcion seleccionada es "Play Again"
      this.playText.setTexture('playBlanco');  // cambia el texto a blanco
      this.topText.setTexture('topGris');      // cambia el texto a gris
      this.rocket.setY(this.playText.y);       // posiciona el cohete en la opcion "Play Again"
    } else {
      this.playText.setTexture('playGris');    // cambia el texto a gris
      this.topText.setTexture('topBlanco');    // cambia el texto a blanco
      this.rocket.setY(this.topText.y);        // posiciona el cohete en la opcion "Top Global"
    }
  }
}
