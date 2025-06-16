class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image("player", "./public/aviones/avion.rojo.png");
    //this.load.image("enemy", "./assets/enemy.png");
    //this.load.image("boss", "./assets/boss.png");
    //this.load.image("road", "./assets/road.png");
    //this.load.image("bullet", "./assets/bullet.png"); // 🔫 bala del jugador
  }

  create() {
    // Fondo en movimiento
    this.road = this.add.tileSprite(200, 300, 400, 600, "road");

    // VARIABLES EDITABLES
    this.maxSpeedNormal = 200;      // Velocidad con tecla Z
    this.maxSpeedBoost = 400;       // Velocidad con tecla X
    this.fuelDrainNormal = 0.03;    // Combustible por frame normal
    this.fuelDrainBoost = 0.06;     // Combustible en modo boost
    this.playerSpeed = 0;           // Velocidad actual del jugador
    this.fuel = 100;
    this.score = 0;

    this.enemySpeed = 300;          // Velocidad base de enemigos
    this.enemySpacing = 600;        // Distancia entre enemigos a reaparecer
    this.enemyActiveIndex = 0;      // Índice del enemigo que debe aparecer

    // Jugador
    this.player = this.physics.add.sprite(200, 500, "player");
    this.player.setCollideWorldBounds(true);
    this.enablePlayerControl = false;
    //tamaño del jugador
    this.player.setDisplaySize(70, 70); // Tamaño del jugador (editable)

    // Teclas
    this.keys = this.input.keyboard.addKeys('Z,X,C');

    // Grupo de disparos
    this.bullets = this.physics.add.group();

    // Colisiones
    this.physics.add.overlap(this.bullets, this.enemiesGroup, this.hitEnemy, null, this);
    this.physics.add.overlap(this.bullets, this.boss, this.hitBoss, null, this);

    // Entrada animada
    this.time.delayedCall(500, () => {
      this.enablePlayerControl = true;
    });
  }

  shootBullet() {
    const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
    bullet.setVelocityY(-300);
    bullet.setCollideWorldBounds(true);
    bullet.outOfBoundsKill = true;
  }

  update() {
    // Fondo en movimiento
    this.road.tilePositionY -= 2;

    // HUD externo
    document.getElementById('speed').innerText = Math.floor(this.playerSpeed) + ' km/h';
    document.getElementById('fuel').innerText = Math.floor(this.fuel);
    document.getElementById('score').innerText = String(Math.floor(this.score)).padStart(6, '0');

    if (!this.enablePlayerControl) return;

    // Movimiento horizontal
    if (this.input.keyboard.createCursorKeys().left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.input.keyboard.createCursorKeys().right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    // Velocidad (Z = normal, X = boost)
    if (this.keys.X.isDown) {
      this.playerSpeed = Math.min(this.playerSpeed + 4, this.maxSpeedBoost);
      this.fuel -= this.fuelDrainBoost;
    } else if (this.keys.Z.isDown) {
      this.playerSpeed = Math.min(this.playerSpeed + 2, this.maxSpeedNormal);
      this.fuel -= this.fuelDrainNormal;
    } else {
      this.playerSpeed *= 0.95;
    }

    // Disparo con C
    if (Phaser.Input.Keyboard.JustDown(this.keys.C)) {
      this.shootBullet();
    }

    // Fondo más rápido según velocidad
    this.road.tilePositionY -= this.playerSpeed * 0.03;
    this.score += this.playerSpeed * 0.01;

    // Combustible
    if (this.fuel <= 0) {
      this.scene.restart();
    }
  }
}
