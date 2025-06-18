class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image("player", "./public/aviones/avion-power.png");
    this.load.image("enemy1", "./public/naves/carguero.png");
    this.load.image("enemy2", "./public/naves/cazador.png");
    this.load.image("bomb", "./public/items/bomba.png");
    this.load.image("laser", "./public/items/laser.png");
    this.load.image("road", "./public/items/background.jpg");
    this.load.image("bullet", "./public/items/misil.png");
    this.load.image("missile2", "./public/items/misil2.png");
    this.load.image("explosion", "./public/items/explosion.png");
  }

  create() {
    this.road = this.add.tileSprite(this.cameras.main.width / 2 , this.cameras.main.height / 2, 400, 600, "road");

    this.maxSpeedNormal = 200;
    this.fuelDrainNormal = 0.00;
    this.playerSpeed = 0;
    this.fuel = 100;
    this.score = 0;

    this.enemiesGroup = this.physics.add.group();
    this.bombs = this.physics.add.group();
    this.enemyLasers = this.physics.add.group();
    this.missiles = this.physics.add.group();
    this.explosions = this.physics.add.group();

    this.enemySpacing = 600;
    this.enemyActiveIndex = 0;

    this.player = this.physics.add.sprite(200, 500, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(70, 70);
    this.enablePlayerControl = false;

    this.keys = this.input.keyboard.addKeys('Z,X,C');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group();

    this.scoreText = this.add.text(650, 20, '000000', { fontFamily: 'monospace', fontSize: '25px', fill: '#ffffff' });
    this.speedText = this.add.text(650, 50, '000 km/h', { fontFamily: 'monospace', fontSize: '25px', fill: '#ffffff' });
    this.fuelText = this.add.text(650, 80, 'FUEL\n100', { fontFamily: 'monospace', fontSize: '25px', fill: '#ffffff' });

    this.physics.add.overlap(this.bullets, this.enemiesGroup, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.bombs, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemyLasers, this.hitPlayer, null, this);
    this.physics.add.overlap(this.missiles, this.enemiesGroup, this.hitWithMissile, null, this);
    this.physics.add.overlap(this.explosions, this.enemiesGroup, this.hitByExplosion, null, this);
    this.physics.add.collider(this.enemiesGroup, this.enemiesGroup); // colisión entre enemigos

    this.physics.world.setBounds(200, 0, this.scale.width /2 , this.scale.height);

    this.time.delayedCall(500, () => {
      this.enablePlayerControl = true;
    });
  }

  update() {
    this.road.tilePositionY -= this.playerSpeed * 0.06;

    if (!this.enablePlayerControl) return;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.keys.Z.isDown) {
      this.playerSpeed = Math.min(this.playerSpeed + 2, this.maxSpeedNormal);
      this.fuel -= this.fuelDrainNormal;
    } else {
      this.playerSpeed *= 0.99;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.X)) {
      this.shootBullet();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.C)) {
      this.shootMissile();
    }

    this.score += this.playerSpeed * 0.00;

    this.speedText.setText(`${Math.floor(this.playerSpeed)} km/h`);
    this.fuelText.setText(`FUEL\n${Math.floor(this.fuel)}`);
    this.scoreText.setText(this.score.toFixed(0).padStart(6, '0'));

    const cargos = this.enemiesGroup.getChildren().filter(e => e.getData('type') === 'cargo');
    const hunters = this.enemiesGroup.getChildren().filter(e => e.getData('type') === 'hunter');

    if (this.playerSpeed > 150) {
      if (!this.lastEnemyTime || this.time.now > this.lastEnemyTime + 2000) {
        if (cargos.length < 5 || hunters.length < 5) {
          this.spawnRandomEnemy();
          this.lastEnemyTime = this.time.now;
        }
      }
    }

    this.bombs.children.iterate(b => {
      if (b && b.y > 600) b.destroy();
    });
    this.enemyLasers.children.iterate(l => {
      if (l && l.y > 620) l.destroy();
    });
    this.missiles.children.iterate(m => {
      if (m && m.y < -20) {
        this.spawnExplosion(m.x, m.y);
        m.destroy();
      }
    });

    if (this.fuel <= 0) {
      this.scene.restart();
    }

    this.enemiesGroup.children.iterate(enemy => {
      if (!enemy.active) return;

      let direction = enemy.getData("dir");
      if (!direction) {
        direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
        enemy.setData("dir", direction);
      }

      enemy.x += direction * 3;

      if (enemy.x < 232 || enemy.x > (600 -36)) {
        enemy.setData("dir", -direction);
      }
    });
  }

  shootBullet() {
    const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
    bullet.setVelocityY(-900);
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;

    bullet.body.world.on('worldbounds', (body) => {
      if (body.gameObject === bullet) bullet.destroy();
    });
  }

  shootMissile() {
    const missile = this.missiles.create(this.player.x, this.player.y - 20, 'missile2');
    missile.setVelocityY(-400);
    missile.setDisplaySize(20, 40);
    missile.setCollideWorldBounds(true);
    missile.body.onWorldBounds = true;

    missile.body.world.on('worldbounds', (body) => {
      if (body.gameObject === missile) {
        this.spawnExplosion(missile.x, missile.y);
        missile.destroy();
      }
    });
  }

  spawnExplosion(x, y) {
    const explosion = this.explosions.create(x, y, "explosion");
    explosion.setDisplaySize(80, 80);
    explosion.setAlpha(0.8);
    this.time.delayedCall(2000, () => {
      explosion.destroy();
    });
  }

  spawnRandomEnemy() {
    const x = Phaser.Math.Between(232, 340);
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
    carguero.setVelocityY(220);
    carguero.setData("type", "cargo");
    carguero.setData("life", 3);

    this.time.delayedCall(1000, () => {
      if (!carguero.active) return;
      carguero.setVelocityY(0);
      carguero.bombTimer = this.time.addEvent({
        delay: 2000,
        callback: () => {
          if (!carguero.active) return;
          const bomb = this.bombs.create(carguero.x, carguero.y + 40, "bomb");
          bomb.setVelocityY(400);
        },
        loop: true
      });
    });
  }

  spawnHunterEnemy(x, y) {
    const cazador = this.enemiesGroup.create(x, y, "enemy2");
    cazador.setDisplaySize(80, 80);
    cazador.setVelocityY(140);
    cazador.setData("type", "hunter");
    cazador.setData("life", 3);

    this.time.delayedCall(1000, () => {
      if (!cazador.active) return;
      cazador.setVelocityY(0);
      cazador.laserTimer = this.time.addEvent({
        delay: 1500,
        callback: () => {
          if (!cazador.active) return;
          const laser = this.enemyLasers.create(cazador.x, cazador.y + 40, "laser");
          laser.setVelocityY(500);
        },
        loop: true
      });
    });
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    let hp = enemy.getData("life") - 1;
    if (hp <= 0) {
      enemy.destroy();
    } else {
      enemy.setData("life", hp);
    }
  }

  hitWithMissile(missile, enemy) {
    missile.destroy();
    this.spawnExplosion(missile.x, missile.y);
  }

  hitByExplosion(explosion, enemy) {
    if (enemy.active) enemy.destroy();
  }

  hitPlayer(player, projectile) {
    projectile.destroy();
    this.scene.restart();
  }
}
