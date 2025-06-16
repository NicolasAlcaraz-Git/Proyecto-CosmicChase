class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image("player", "./public/aviones/avion.rojo.png");
    this.load.image("enemy1", "./public/naves/carguero.png");
    this.load.image("enemy2", "./public/naves/cazador.png");
    this.load.image("bomb", "./public/items/bomba.png");
    this.load.image("laser", "./public/items/laser.png");
    this.load.image("road", "./assets/road.png");
    this.load.image("bullet", "./assets/bullet.png");
  }

  create() {
    this.road = this.add.tileSprite(200, 300, 400, 600, "road");

    this.maxSpeedNormal = 200;
    this.maxSpeedBoost = 400;
    this.fuelDrainNormal = 0.03;
    this.fuelDrainBoost = 0.06;
    this.playerSpeed = 0;
    this.fuel = 100;
    this.score = 0;

    this.enemiesGroup = this.physics.add.group();
    this.bombs = this.physics.add.group();
    this.enemyLasers = this.physics.add.group();

    this.enemySpacing = 600;
    this.enemyActiveIndex = 0;

    this.player = this.physics.add.sprite(200, 500, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(70, 70);
    this.enablePlayerControl = false;

    this.keys = this.input.keyboard.addKeys('Z,X,C');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group();

    this.physics.add.overlap(this.bullets, this.enemiesGroup, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.bombs, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemyLasers, this.hitPlayer, null, this);

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
    this.road.tilePositionY -= this.playerSpeed * 0.03;

    document.getElementById('speed').innerText = Math.floor(this.playerSpeed) + ' km/h';
    document.getElementById('fuel').innerText = Math.floor(this.fuel);
    document.getElementById('score').innerText = String(Math.floor(this.score)).padStart(6, '0');

    if (!this.enablePlayerControl) return;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.keys.X.isDown) {
      this.playerSpeed = Math.min(this.playerSpeed + 4, this.maxSpeedBoost);
      this.fuel -= this.fuelDrainBoost;
    } else if (this.keys.Z.isDown) {
      this.playerSpeed = Math.min(this.playerSpeed + 2, this.maxSpeedNormal);
      this.fuel -= this.fuelDrainNormal;
    } else {
      this.playerSpeed *= 0.95;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.C)) {
      this.shootBullet();
    }

    this.score += this.playerSpeed * 0.01;

    // Tope de enemigos
    const cargos = this.enemiesGroup.getChildren().filter(e => e.getData('type') === 'cargo');
    const hunters = this.enemiesGroup.getChildren().filter(e => e.getData('type') === 'hunter');

    if (!this.lastEnemyTime || this.time.now > this.lastEnemyTime + 2000) {
      if (cargos.length < 5 || hunters.length < 5) {
        this.spawnRandomEnemy();
        this.lastEnemyTime = this.time.now;
      }
    }

    // Limpiar bombas/lasers
    this.bombs.children.iterate(b => {
      if (b && b.y > 600) b.destroy();
    });
    this.enemyLasers.children.iterate(l => {
      if (l && l.y > 620) l.destroy();
    });

    if (this.fuel <= 0) {
      this.scene.restart();
    }
  }

  // === ENEMIGOS ===

  spawnRandomEnemy() {
    const x = Phaser.Math.Between(60, 340);
    const type = Phaser.Math.Between(0, 1) === 0 ? "cargo" : "hunter";

    if (type === "cargo") {
      if (this.enemiesGroup.getChildren().filter(e => e.getData("type") === "cargo").length < 5) {
        this.spawnCargoEnemy(x, -60);
      }
    } else {
      if (this.enemiesGroup.getChildren().filter(e => e.getData("type") === "hunter").length < 5) {
        this.spawnHunterEnemy(x, -60);
      }
    }
  }

  spawnCargoEnemy(x, y) {
    const carguero = this.enemiesGroup.create(x, y, "enemy1");
    carguero.setDisplaySize(80, 80);
    carguero.setVelocityY(100);
    carguero.setData("type", "cargo");

    // Entrada animada
    this.time.delayedCall(1000, () => {
      if (!carguero.active) return;
      carguero.setVelocityY(0);

      carguero.bombTimer = this.time.addEvent({
        delay: 2000,
        callback: () => {
          if (!carguero.active) return;
          const bomb = this.bombs.create(carguero.x, carguero.y + 40, "bomb");
          bomb.setVelocityY(150);
        },
        loop: true
      });
    });
  }

  spawnHunterEnemy(x, y) {
    const cazador = this.enemiesGroup.create(x, y, "enemy2");
    cazador.setDisplaySize(80, 80);
    cazador.setVelocityY(120);
    cazador.setData("type", "hunter");

    this.time.delayedCall(1000, () => {
      if (!cazador.active) return;
      cazador.setVelocityY(0);

      cazador.laserTimer = this.time.addEvent({
        delay: 1500,
        callback: () => {
          if (!cazador.active) return;
          const laser = this.enemyLasers.create(cazador.x, cazador.y + 40, "laser");
          laser.setVelocityY(300);
        },
        loop: true
      });
    });
  }

  // === COLISIONES ===

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
  }

  hitPlayer(player, projectile) {
    projectile.destroy();
    this.scene.restart();
  }
}
