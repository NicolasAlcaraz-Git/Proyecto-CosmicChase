class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.bulletToggle = true; // al inicio del constructor
  }

  preload() {
    this.load.audio('gameMusic', './public/audio/game.music.mp3');
    // sprite de jugadores
    this.load.image("player", "./public/aviones/avion-rojo.png");
    this.load.image("p2", "./public/aviones/avion-amar.png");
    this.load.image("p3", "./public/aviones/avion-azul.png");
    this.load.image("p4", "./public/aviones/avion-blan.png");
    this.load.image("p5", "./public/aviones/avion-negro.png");
    this.load.image("p6", "./public/aviones/avion-verde.png");
    this.load.image("p7", "./public/aviones/avion-ale.png");
    this.load.image("p8", "./public/aviones/avion-arg.png");
    this.load.image("p9", "./public/aviones/avion-bra.png");
    this.load.image("p10", "./public/aviones/avion-chi.png");
    this.load.image("p11", "./public/aviones/avion-esp.png");
    this.load.image("p12", "./public/aviones/avion-fra.png");
    this.load.image("p13", "./public/aviones/avion-ita.png");
    this.load.image("p14", "./public/aviones/avion-jap.png");
    this.load.image("p15", "./public/aviones/avion-usa.png");
    this.load.image("p16", "./public/aviones/avion-arstotzka.png");
    this.load.image("p17", "./public/aviones/avion-farfania.png");

    // disparos en general
    this.load.image("bomb1", "./public/items/bomb1.png");
    this.load.image("bomb2", "./public/items/bomb2.png");
    this.load.image("laser1", "./public/items/laser1.png");
    this.load.image("laser2", "./public/items/laser2.png");
    this.load.image("bullet1", "./public/items/bullet1.png");
    this.load.image("bullet2", "./public/items/bullet2.png");
    this.load.image("missile1", "./public/items/misil1.png");
    this.load.image("missile2", "./public/items/misil2.png");

    // cargueros (cargo)
    this.load.image("cargo1", "./public/naves/carguero56x48-azul.png");
    this.load.image("cargo2", "./public/naves/carguero-rojo1.png");
    this.load.image("cargo3", "./public/naves/carguero-rojo2.png");
    this.load.image("cargo4", "./public/naves/carguero-rojo3.png");
    this.load.image("cargo5", "./public/naves/carguero-rojo4.png");

    // explosiones
    this.load.image("explode1", "./public/items/explode1.png");
    this.load.image("explode2", "./public/items/explode2.png");
    this.load.image("explode3", "./public/items/explode3.png");
    this.load.image("explode4", "./public/items/explode4.png");
    this.load.image("explode5", "./public/items/explode5.png");
    this.load.image("explode6", "./public/items/explode6.png");
    this.load.image("explode7", "./public/items/explode7.png");

    // cazadores (hunter)
    this.load.image("hunter1", "./public/naves/cazador52x64-azul.png");
    this.load.image("hunter2", "./public/naves/cazador-rojo1.png");
    this.load.image("hunter3", "./public/naves/cazador-rojo2.png");
    this.load.image("hunter4", "./public/naves/cazador-rojo3.png");
    this.load.image("hunter5", "./public/naves/cazador-rojo4.png");
    this.load.image("hunter6", "./public/naves/cazador-rojo5.png");
    this.load.image("hunter7", "./public/naves/cazador-rojo6.png");

    // otros, items y demás
    this.load.image("road", "./public/items/background.jpg");
    this.load.image("explosion", "./public/items/explosion.png");
    this.load.image("fuelItem", "./public/items/fuel.png");
    this.load.image("caja", "./public/items/caja.png");
    this.load.image("powerup", "./public/items/powerup.png");
    this.load.image("avionPower", "./public/aviones/avion-power.png");

  }

  // ACA EMPIEZA EL CREATE
  create() {
    this.road = this.add.tileSprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 400, 600, "road");      // DIMENSIONES DEL MAPA

    this.gameMusic = this.sound.add('gameMusic', { loop: true, volume: 0.5 });
    this.gameMusic.play();

    this.testKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);


    this.events.on('shutdown', () => {
      if (this.gameMusic && this.gameMusic.isPlaying) {
        this.gameMusic.stop();
      }
    });

    this.events.on('destroy', () => {
      if (this.gameMusic && this.gameMusic.isPlaying) {
        this.gameMusic.stop();
      }
    });

    // configuracion directa con el HUD y velocidad
    this.maxSpeedNormal = 400;
    this.fuelDrainNormal = 0.03;
    this.playerSpeed = 0;
    this.fuel = 100;
    this.score = 0;
    this.maxMissiles = 6;
    this.missilesAvailable = this.maxMissiles;

    // GENERACION DE GRUPOS
    this.enemiesGroup = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.missiles = this.physics.add.group();
    this.fuelItems = this.physics.add.group();
    this.missileCrates = this.physics.add.group();
    this.bombs = this.physics.add.group();
    this.enemyLasers = this.physics.add.group();
    this.explosions = this.physics.add.group();
    this.powerups = this.physics.add.group();
    this.allyPlanes = [];                                     // LISTA DE ACOMPAÑANTES

    // intervalo de sprites en disparos
   this.time.addEvent({
     delay: 100,                                              // TIEMPO DE CAMBIO ENTRE SPRITES
     callback: () => {
       const toggleFrame = (obj, frame1, frame2) => {
         if (!obj.active) return;
         const next = obj.texture.key === frame1 ? frame2 : frame1;
         obj.setTexture(next);
        };
        this.missiles.children.each(m => toggleFrame(m, "missile1", "missile2"));
        this.bombs.children.each(b => toggleFrame(b, "bomb1", "bomb2"));
        this.enemyLasers.children.each(l => toggleFrame(l, "laser1", "laser2"));
      },
      callbackScope: this,
      loop: true
    });

    // EVENTO PARA EL POWER UP
    this.time.addEvent({
      delay: 60000,                    // TIEMPO DE APARICION EN MILISEGUNDOS
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true
    });


    // jugador, avion de combate
    this.player = this.physics.add.sprite(400, 500, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1);
    this.enablePlayerControl = false;
    this.keys = this.input.keyboard.addKeys('Z,X,C');
    this.cursors = this.input.keyboard.createCursorKeys();


    // textos del HUD
    this.missileText = this.add.text(650, 130, 'MISSILES\n6', { fontFamily: 'monospace', fontSize: '25px', fill: '#fff' });
    this.scoreText = this.add.text(650, 20, '000000', { fontFamily: 'monospace', fontSize: '25px', fill: '#fff' });
    this.speedText = this.add.text(650, 50, '000 km/h', { fontFamily: 'monospace', fontSize: '25px', fill: '#fff' });
    this.fuelText = this.add.text(650, 80, 'FUEL\n100', { fontFamily: 'monospace', fontSize: '25px', fill: '#fff' });

    // colisiones
    this.physics.add.overlap(this.bullets, this.enemiesGroup, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.bombs, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemyLasers, this.hitPlayer, null, this);
    this.physics.add.overlap(this.missiles, this.enemiesGroup, this.hitWithMissile, null, this);
    this.physics.add.overlap(this.explosions, this.enemiesGroup, this.hitByExplosion, null, this);
    this.physics.add.overlap(this.player, this.fuelItems, this.collectFuel, null, this);
    this.physics.add.overlap(this.player, this.missileCrates, this.collectMissileCrate, null, this);
    this.physics.add.overlap(this.player, this.powerups, this.collectPowerUp, null, this);
    this.physics.add.overlap(this.allyPlanes, this.bombs, this.hitAlly, null, this);
    this.physics.add.overlap(this.allyPlanes, this.enemyLasers, this.hitAlly, null, this);
    this.physics.add.overlap(this.allyPlanes, this.fuelItems, this.collectFuel, null, this);
    this.physics.add.overlap(this.allyPlanes, this.missileCrates, this.collectMissileCrate, null, this);

    this.physics.world.setBounds(200, 0, this.scale.width / 2, this.scale.height);
    this.time.delayedCall(500, () => this.enablePlayerControl = true);
    this.time.addEvent({ delay: 15000, callback: this.spawnFuelItem, callbackScope: this, loop: true });          // tiempo de spawn para el item combustible
    this.time.addEvent({ delay: 35000, callback: this.spawnMissileCrate, callbackScope: this, loop: true });      // tiempo de spawn para el item caja de misiles
  }

  update() {
    this.road.tilePositionY -= this.playerSpeed * 0.07;          // velocidad de movimiento del fondo respecto al jugador
    if (!this.enablePlayerControl) return;

    if (Phaser.Input.Keyboard.JustDown(this.testKey)) {
      this.scene.start('DeathScene', {
        score: this.score || 0,
        shipsDestroyed: this.shipsDestroyed || 0
     });
    }

    // Movimiento del jugador (simplificado y funcional)
    const moveSpeed = 300;
    let velocityX = 0;

    if (this.cursors.left.isDown) velocityX = -moveSpeed;
    else if (this.cursors.right.isDown) velocityX = moveSpeed;

    this.player.setVelocityX(velocityX);


    
    if (this.keys.Z.isDown) {
      this.playerSpeed = Math.min(this.playerSpeed + 2, this.maxSpeedNormal);
      this.fuel -= this.fuelDrainNormal;
    } else {
      this.playerSpeed *= 0.99;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.X)) this.shootBullet();
    if (Phaser.Input.Keyboard.JustDown(this.keys.C)) this.shootMissile();

    this.speedText.setText(`${Math.floor(this.playerSpeed)} km/h`);
    this.fuelText.setText(`FUEL\n${Math.floor(this.fuel)}`);
    this.scoreText.setText(this.score.toFixed(0).padStart(6, '0'));

    if (this.playerSpeed > 200 && (!this.lastEnemyTime || this.time.now > this.lastEnemyTime + 2500)) {
      if (this.enemiesGroup.countActive(true) < 8) {
        this.spawnRandomEnemy();
        this.lastEnemyTime = this.time.now;
      }
    }

    this.bombs.children.each(b => b.y > 600 && b.destroy());
    this.enemyLasers.children.each(l => l.y > 620 && l.destroy());
    this.missiles.children.each(m => m.y < -20 && m.destroy());
    this.missileCrates.children.each(c => c.y > this.scale.height + 20 && c.destroy());

    if (this.fuel <= 0) {
      this.scene.start('DeathScene', {
        score: this.score,
        shipsDestroyed: this.shipsDestroyed
      });
    }

    this.enemiesGroup.children.each(enemy => {
      if (!enemy.active) return;
      let dir = enemy.getData("dir") ?? (Phaser.Math.Between(0, 1) === 0 ? -1 : 1);
      enemy.setData("dir", dir);
      enemy.x += dir * 3;
      if (enemy.x < 232 || enemy.x > 564) enemy.setData("dir", -dir);
    });

    // movimiento fijo de los aliados en formación
    this.allyPlanes.forEach((ally, i) => {
      if (!ally.active) return;
      const offsetX = i === 0 ? 50 : -50;
      const offsetY = 40;
      ally.x = this.player.x + offsetX;
      ally.y = this.player.y + offsetY;

      
      const bounds = this.physics.world.bounds;
      ally.x = Phaser.Math.Clamp(ally.x, bounds.left + 20, bounds.right - 20);
      ally.y = Phaser.Math.Clamp(ally.y, bounds.top + 20, bounds.bottom - 20);
    });
  }

  shootBullet() {
    const bulletTexture = this.bulletToggle ? "bullet1" : "bullet2";
    this.bulletToggle = !this.bulletToggle;
    const bullet = this.bullets.create(
      this.player.x,
      this.player.y - this.player.displayHeight / 2 - 10,
      bulletTexture
    );
    bullet.setVelocityY(-900);
    bullet.setScale(1.4); // ahora es configurable

    this.allyPlanes.forEach(ally => {
      if (!ally.active) return;
    const bulletTexture = this.bulletToggle ? "bullet1" : "bullet2";
    const bullet = this.bullets.create(
      ally.x,
      ally.y - ally.displayHeight / 2 - 10,
      bulletTexture
    );
    bullet.setVelocityY(-900);
    bullet.setScale(1.4);
  });

  }

  shootMissile() {
    if (this.missilesAvailable <= 0) return;
    const missile = this.missiles.create(this.player.x, this.player.y - this.player.displayHeight / 2 - 10, 'missile1');
    missile.setVelocityY(-400);
    missile.setScale(2.8);
    //missile.setCollideWorldBounds(true);
    //missile.body.onWorldBounds = true;
    this.missilesAvailable--;
    this.updateMissileText();
  }

  updateMissileText() {
    this.missileText.setText(`MISSILES\n${this.missilesAvailable}`);
  }

  // SPAWN DEL ITEM CAJA MISILES
  spawnMissileCrate() {
    if (this.missileCrates.countActive(true) >= 2) return;
    const x = Phaser.Math.Between(230, 570);
    const crate = this.missileCrates.create(x, -20, "caja");
    crate.setVelocityY(200);
    crate.setScale(1.5);
  }

  // SPAWN DEL ITEM COMBUSTIBLE
  spawnFuelItem() {
    const x = Phaser.Math.Between(230, 570);
    const fuel = this.fuelItems.create(x, -20, "fuelItem");
    fuel.setVelocityY(220);
    fuel.setScale(1.5);
  }


  // codigo para recolectar powerup
  collectPowerUp(player, power) {
    power.destroy();

    if (this.allyPlanes.length >= 2) {
      this.score += 1200;
      return;
    }

    const offsetX = this.allyPlanes.length === 0 ? 45 : -45;
    const offsetY = 40;
    const ally = this.physics.add.sprite(player.x + offsetX, player.y + offsetY, "avionPower");
    ally.setScale(1);
    ally.setCollideWorldBounds(true);
    ally.body.immovable = true;
    ally.setPushable(false); // ⚠️ evita que empujen al jugador
    this.allyPlanes.push(ally);
    this.score += 500;
  }

  // CODIGO PARA RECOLECTAR CAJA MISILES
  collectMissileCrate(entity, crate) {
    crate.destroy();
    this.missilesAvailable = this.maxMissiles;
    this.updateMissileText();
    this.score += 250;
  }

  // CODIGO PARA RECOLECTAR ITEM COMBUSTIBLE
  collectFuel(entity, fuel) {
    fuel.destroy();
    this.fuel = Math.min(this.fuel + 25, 100);
    this.score += 250;
  }

  // DURACION DE LA EXPLOSION
  spawnExplosion(x, y) {
    const explosion = this.explosions.create(x, y, "explode1");
    explosion.setScale(2.5);
    explosion.setAlpha(0.9);

    // === 🔥 ANIMACIÓN MANUAL DE LA EXPLOSIÓN ===
    let frame = 1;
    const frameRate = 90; // milisegundos entre frames (~12 FPS)
    const maxFrames = 7;
    const animationTimer = this.time.addEvent({
      delay: frameRate,
      callback: () => {
        if (!explosion.active) return;
        frame++;
        if (frame > maxFrames) frame = 1; // opcional: loop
        explosion.setTexture(`explode${frame}`);
      },
      loop: true
    });

    // === ⏳ DURACIÓN DE LA EXPLOSIÓN ===
    const explosionDuration = 2000; // 💬 Podés cambiar esta duración desde acá (milisegundos)

    this.time.delayedCall(explosionDuration, () => {
      if (explosion.active) {
        explosion.destroy();
        animationTimer.remove(); // detenemos la animación al destruir
      }
    });
  }

  // spawn de powerups
  spawnPowerUp() {
    if (this.powerups.countActive(true) >= 1) return;
    const x = Phaser.Math.Between(230, 570);
    const power = this.powerups.create(x, -20, "powerup");
    power.setVelocityY(200);
    power.setScale(1.5);
  }

  spawnRandomEnemy() {
    const x = Phaser.Math.Between(230, 540);
    const type = Phaser.Math.Between(0, 1) === 0 ? "cargo" : "hunter";
    if (type === "cargo" && this.enemiesGroup.countActive(true) < 8) this.spawnCargoEnemy(x, -60);
    else if (type === "hunter" && this.enemiesGroup.countActive(true) < 8) this.spawnHunterEnemy(x, -60);
  }

  spawnCargoEnemy(x, y) {
    const ship = this.enemiesGroup.create(x, y, "cargo1");
    ship.setVelocityY(250);
    ship.setData("type", "cargo");
    ship.setData("life", 5);
    ship.setData("wasScored", false);
    ship.setScale(1);
    this.time.delayedCall(1000, () => {
      if (!ship.active) return;
      ship.setVelocityY(0);
      ship.body.moves = false;
      ship.bombTimer = this.time.addEvent({
        delay: 2500,
        callback: () => {
          if (!ship.active) return;
          const bomb = this.bombs.create(ship.x, ship.y + 40, "bomb1");
          bomb.setVelocityY(450);
          bomb.setTexture("bomb1"); // usar bomb1 como inicial
          bomb.setScale(2.8);       // 🔧 tamaño editable
        },
        loop: true
      });
    });
  }

  spawnHunterEnemy(x, y) {
    const ship = this.enemiesGroup.create(x, y, "hunter1");
    ship.setVelocityY(140);
    ship.setData("type", "hunter");
    ship.setData("life", 7);
    ship.setData("wasScored", false);
    ship.setScale(1.3);
    this.time.delayedCall(1000, () => {
      if (!ship.active) return;
      ship.setVelocityY(0);
      ship.body.allowGravity = false;
      ship.body.immovable = true;
      ship.laserTimer = this.time.addEvent({
        delay: 2500,
        callback: () => {
          if (!ship.active) return;
          const laser = this.enemyLasers.create(ship.x, ship.y + 40, "laser1");
          laser.setVelocityY(450);
          laser.setTexture("laser1"); // usar laser1 como inicial
          laser.setScale(2);        // 🔧 tamaño editable
        },
        loop: true
      });
    });
  }

  scoreEnemy(enemy, value) {
    if (!enemy.getData("wasScored")) {
      this.score += value;
      enemy.setData("wasScored", true);
    }
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    let hp = enemy.getData("life") - 1;
    if (hp <= 0) {
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 200 : 100);
      enemy.destroy();
    } else {
      enemy.setData("life", hp);
      const type = enemy.getData("type");
      const stage = (type === "cargo") ? 6 - hp : 8 - hp;
      enemy.setTexture(type === "cargo" ? `cargo${stage}` : `hunter${stage}`);
    }
  }

  hitWithMissile(missile, enemy) {
    missile.destroy();
    this.spawnExplosion(enemy.x, enemy.y);
    if (enemy.active) {
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 200 : 500);
      enemy.destroy();
    }
  }

  hitByExplosion(explosion, enemy) {
    if (enemy.active) {
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 200 : 100);
      enemy.destroy();
    }
  }

  hitPlayer(player, projectile) {
    projectile.destroy();
    this.scene.start('DeathScene', {
      score: this.score,
      shipsDestroyed: this.shipsDestroyed
    });
  }


  hitAlly(ally, projectile) {
    projectile.destroy();
    ally.destroy();
    this.allyPlanes = this.allyPlanes.filter(a => a.active); // limpiar la lista
  }
}
export default GameScene;
