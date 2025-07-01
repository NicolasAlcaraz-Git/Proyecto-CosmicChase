class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.bulletToggle = true; // intercambio de sprites de disparo
  }

  preload() {
    // sonidos y audios
    this.load.audio('misil', './public/audio/misil.wav');
    this.load.audio('bullet', './public/audio/bullet.wav');
    this.load.audio('powerup', './public/audio/powerup.wav');
    this.load.audio('lasermax', './public/audio/lasermax.wav');
    this.load.audio('lasermini', './public/audio/lasermini.wav');
    this.load.audio('itemcaja', './public/audio/itemcaja.wav');
    this.load.audio('itemfuel', './public/audio/itemfuel.wav');
    this.load.audio('gameMusic', './public/audio/game.music.mp3');
    this.load.audio('explodemax', './public/audio/explodemax.wav');
    this.load.audio('explodemini', './public/audio/explodemini.wav');
    // HUD lateral
    this.load.image("fuel", "./public/menus/fuel.png");
    this.load.image("speed", "./public/menus/speed.png");
    this.load.image("tanque1", "./public/menus/tanque1.png");
    this.load.image("tanque2", "./public/menus/tanque2.png");
    this.load.image("tanque3", "./public/menus/tanque3.png");
    this.load.image("tanque4", "./public/menus/tanque4.png");
    this.load.image("missiles", "./public/menus/missiles.png");
    this.load.image("misilhud", "./public/menus/misilhud.png");
    this.load.image("highscore", "./public/menus/highscore.png");
    // sprites de aviones
    this.load.image("avion-rojo1", "./public/aviones/avion-rojo1.png");
    this.load.image("avion-rojo2", "./public/aviones/avion-rojo2.png");
    this.load.image("avion-power1", "./public/aviones/avion-power1.png");
    this.load.image("avion-power2", "./public/aviones/avion-power2.png");
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
    // cazadores (hunter)
    this.load.image("hunter1", "./public/naves/cazador52x64-azul.png");
    this.load.image("hunter2", "./public/naves/cazador-rojo1.png");
    this.load.image("hunter3", "./public/naves/cazador-rojo2.png");
    this.load.image("hunter4", "./public/naves/cazador-rojo3.png");
    this.load.image("hunter5", "./public/naves/cazador-rojo4.png");
    this.load.image("hunter6", "./public/naves/cazador-rojo5.png");
    this.load.image("hunter7", "./public/naves/cazador-rojo6.png");
    // explosiones
    this.load.image("explode1", "./public/items/explode1.png");
    this.load.image("explode2", "./public/items/explode2.png");
    this.load.image("explode3", "./public/items/explode3.png");
    this.load.image("explode4", "./public/items/explode4.png");
    this.load.image("explode5", "./public/items/explode5.png");
    this.load.image("explode6", "./public/items/explode6.png");
    this.load.image("explode7", "./public/items/explode7.png");
    // otros, items y demás
    this.load.image("caja", "./public/items/caja.png");
    this.load.image("fuelItem", "./public/items/fuel.png");
    this.load.image("powerup", "./public/items/powerup.png");
    this.load.image("road", "./public/items/background.png");
    this.load.image("explosion", "./public/items/explosion.png");
    this.load.image("avionPower", "./public/aviones/avion-power.png");
  }

  // ACA EMPIEZA EL CREATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  create() {
    this.road = this.add.tileSprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 400, 600, "road"); // posicion del fondo
    this.gameMusic = this.sound.add('gameMusic', { loop: true, volume: 0.2 });                                    // musica de fondo
    this.gameMusic.play();

    this.testKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);                                  // tecla de prueba para acceder a gameover

    // metodo para cerrar la musica
    this.events.on('shutdown', () => {                                                                            // se ejecuta cuando la escena se cierra
      if (this.gameMusic && this.gameMusic.isPlaying) {                                                           // si la musica esta sonando, la detiene
        this.gameMusic.stop();
      }
    });

    this.gameIsFrozen = false; // permite volver a iniciar el juego despues del GameOver (SIN ESTO NO VIVIMOS)

    // configuracion directa con el HUD y velocidad del jugador
    this.maxSpeedNormal = 600;               // velocidad maxima del jugador
    this.fuelDrainNormal = 0.03;             // nivel de consumo de combustible
    this.playerSpeed = 0;
    this.fuel = 100;
    this.score = 0;
    this.maxMissiles = 6;
    this.missilesAvailable = this.maxMissiles;

    // definicion de sonidos en gameplay
    this.sfx = {
      misil: this.sound.add('misil', { volume: 0.3 }),
      bullet: this.sound.add('bullet', { volume: 0.6 }),
      itemfuel: this.sound.add('itemfuel', { volume: 3 }),
      powerup: this.sound.add('powerup', { volume: 1.2 }),
      itemcaja: this.sound.add('itemcaja', { volume: 2.5 }),
      lasermax: this.sound.add('lasermax', { volume: 0.2 }),
      lasermini: this.sound.add('lasermini', { volume: 0.3 }),
      explodemax: this.sound.add('explodemax', { volume: 0.3 }),
      explodemini: this.sound.add('explodemini', { volume: 1 })
    };

    // GENERACION DE GRUPOS
    this.bombs = this.physics.add.group();

    this.bullets = this.physics.add.group();
    this.missiles = this.physics.add.group();
    this.fuelItems = this.physics.add.group();
    this.enemiesGroup = this.physics.add.group();
    this.missileCrates = this.physics.add.group();
    this.enemyLasers = this.physics.add.group();
    this.explosions = this.physics.add.group();
    this.powerups = this.physics.add.group();
    this.shipsDestroyed = 0;
    this.allyPlanes = [];                            // array para los aliados tipo avionPower
    this.allyGroup = this.physics.add.group();       // grupo para los aliados

    // intervalo de sprites en disparos
   this.time.addEvent({
     delay: 100,            // tiempo de cambio de sprites en ms
     callback: () => {
       const toggleFrame = (obj, frame1, frame2) => {
         if (!obj.active) return;
         const next = obj.texture.key === frame1 ? frame2 : frame1;
         obj.setTexture(next);
        };
        this.missiles.children.each(m => toggleFrame(m, "missile1", "missile2"));            // cambio de sprites de misiles
        this.bombs.children.each(b => toggleFrame(b, "bomb1", "bomb2"));                     // cambio de sprites de bombas
        this.enemyLasers.children.each(l => toggleFrame(l, "laser1", "laser2"));             // cambio de sprites de lasers
        toggleFrame(this.player, "avion-rojo1", "avion-rojo2");                              // cambio de sprites del jugador
        this.allyPlanes.forEach(ally => {
          if (!ally.active) return;
          if (ally.texture.key === "avion-power1" || ally.texture.key === "avion-power2") {
            toggleFrame(ally, "avion-power1", "avion-power2");                               // cambio de sprites de aliados
          }
        });
      },
      callbackScope: this,
      loop: true
    });

    // evento para el powerup
    this.time.addEvent({
      delay: 60000,                 //tiempo de aparicion en ms (1 minuto)
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true
    });

    // jugador, avion de combate
    this.player = this.physics.add.sprite(400, 500, "avion-rojo1"); // llamada al sprite del jugador
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1);
    this.enablePlayerControl = false;
    this.keys = this.input.keyboard.addKeys('Z,X,C');               // teclas de accion del jugador
    this.cursors = this.input.keyboard.createCursorKeys();          // teclas de control del jugador (solo movimiento lateral)

    // TEXTOS DEL HUD LATERAL
    // HIGHSCORE
    this.add.image(710, 60, "highscore").setScale(0.3).setOrigin(0.5);
    this.scoreText = this.add.text(710, 120, '000000', {
      fontFamily: 'monospace', fontSize: '30px', fill: '#fff'
    }).setOrigin(0.5);

    // SPEED
    this.add.image(610, 190, "speed").setScale(0.2).setOrigin(0);
    this.speedText = this.add.text(690, 188, '000 Km/h', {
      fontFamily: 'monospace', fontSize: '24px', fill: '#fff'
    });

    // FUEL
    this.add.image(610, 260, "fuel").setScale(0.2).setOrigin(0);
    this.fuelText = this.add.text(710, 257, '100%', {
      fontFamily: 'monospace', fontSize: '24px', fill: '#fff'
    });

    // INDICADOR TANQUE
    this.tankImage = this.add.image(705, 320, "tanque1").setScale(2.6).setOrigin(0.5);

    // MISSILES
    this.add.image(655, 400, "missiles").setScale(0.2).setOrigin(0.5);

    // LISTA DE MISILES
    this.missileIcons = []
    const startX = 630;
    const spacing = 30;
    for (let i = 0; i < this.maxMissiles; i++) {
      const icon = this.add.image(startX + i * spacing, 450, "misilhud").setScale(0.1).setVisible(true);
      this.missileIcons.push(icon);
    }

    // colisiones
    this.physics.add.overlap(this.player, this.bombs, this.hitPlayer, null, this);
    this.physics.add.overlap(this.allyGroup, this.bombs, this.hitAlly, null, this);
    this.physics.add.overlap(this.player, this.enemyLasers, this.hitPlayer, null, this);
    this.physics.add.overlap(this.player, this.fuelItems, this.collectFuel, null, this);
    this.physics.add.overlap(this.allyGroup, this.enemyLasers, this.hitAlly, null, this);
    this.physics.add.overlap(this.bullets, this.enemiesGroup, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.powerups, this.collectPowerUp, null, this);
    this.physics.add.overlap(this.allyGroup, this.fuelItems, this.collectFuel, null, this);
    this.physics.add.overlap(this.allyGroup, this.powerups, this.collectPowerUp, null, this);
    this.physics.add.overlap(this.missiles, this.enemiesGroup, this.hitWithMissile, null, this);
    this.physics.add.overlap(this.explosions, this.enemiesGroup, this.hitByExplosion, null, this);
    this.physics.add.overlap(this.player, this.missileCrates, this.collectMissileCrate, null, this);
    this.physics.add.overlap(this.allyGroup, this.missileCrates, this.collectMissileCrate, null, this);

    // teclas alternativas para movimiento (PETICION ESPECIAL DE UN USUARIO CUYAS FLECHAS NO FUNCIONAN)
    this.altKeys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.J,
      down: Phaser.Input.Keyboard.KeyCodes.K,
      right: Phaser.Input.Keyboard.KeyCodes.L,
      up: Phaser.Input.Keyboard.KeyCodes.I
    });

    // configuraciones de la camara y spawn de items
    this.physics.world.setBounds(200, 0, this.scale.width / 2, this.scale.height);
    this.time.delayedCall(500, () => this.enablePlayerControl = true);
    this.time.addEvent({ delay: 15000, callback: this.spawnFuelItem, callbackScope: this, loop: true });          // tiempo de spawn para el item combustible en ms
    this.time.addEvent({ delay: 35000, callback: this.spawnMissileCrate, callbackScope: this, loop: true });      // tiempo de spawn para el item caja de misiles en ms
  }

  // ACA EMPIEZA EL UPADTE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  update() {
    // verifica si el juego esta congelado o no
    if (this.gameIsFrozen) return;                       // si el juego esta congelado, no actualiza nada
    this.road.tilePositionY -= this.playerSpeed * 0.03;  // movimiento del fondo respecto a la velocidad del jugador
    if (!this.enablePlayerControl) return;               // deja de ejecutar el update si el jugador no tiene control
    if (Phaser.Input.Keyboard.JustDown(this.testKey)) {  // tecla de prueba para acceder a GameOver (fue muy util durante el desarrollo)
      this.scene.start('DeathScene', {
        score: this.score || 0,
        shipsDestroyed: this.shipsDestroyed || 0
     });
    }

    // movimiento lateral del jugador (permite flechas y J/L)
    const moveSpeed = 300;                                    // velocidad de movimiento lateral del jugador
    let velocityX = 0;
    if (this.cursors.left.isDown || this.altKeys.left.isDown) {
      velocityX = -moveSpeed;
    } else if (this.cursors.right.isDown || this.altKeys.right.isDown) {
      velocityX = moveSpeed;
    }
    this.player.setVelocityX(velocityX);

    // velocidad del disparo al presionar Z y drenado de combustible
    if (this.keys.Z.isDown) {
      this.playerSpeed = Math.min(this.playerSpeed + 2, this.maxSpeedNormal);
      this.fuel -= this.fuelDrainNormal;
    } else {
      this.playerSpeed *= 0.99;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.X)) this.shootBullet();     // disparo de balas al presionar X
    if (Phaser.Input.Keyboard.JustDown(this.keys.C)) this.shootMissile();    // disparo de misiles al presionar C

    const speed = Math.floor(this.playerSpeed).toString().padStart(3, ' ');  // formatea la velocidad del jugador
    this.speedText.setText(`${speed} Km/h`);                                 // actualiza el texto de velocidad
    this.fuelText.setText(`${Math.floor(this.fuel)}%`);                      // actualiza el texto de combustible
    this.scoreText.setText(this.score.toFixed(0).padStart(6, '0'));          // actualiza el texto de score
 
    const baseDelay = 2500;                                                  // delay base para el spawn de enemigos (2 segundos y medio)
    const minDelay = 600;                                                    // delay minimo para el spawn de enemigos (0.6 segundos)
    const spawnDelay = Math.max(baseDelay - this.score * 0.1, minDelay);     // delay de spawn de enemigos basado en el score (va aumentando)

    // spawn de enemigos basado en la velocidad del jugador y el tiempo transcurrido
    if (this.playerSpeed > 450 && (!this.lastEnemyTime || this.time.now > this.lastEnemyTime + spawnDelay)) {
      if (this.enemiesGroup.countActive(true) < 8) {       // si hay menos de 8 enemigos activos, spawnea un nuevo enemigo
        this.spawnRandomEnemy();
        this.lastEnemyTime = this.time.now;
      }
    }

    // limpiezas de items
    this.bullets.children.each(b => b.y < -20 && b.destroy());                            // limpia las balas que salgan de pantalla
    this.bombs.children.each(b => b.y > 600 && b.destroy());                              // limpia las bombas que salgan de pantalla
    this.enemyLasers.children.each(l => l.y > 620 && l.destroy());                        // limpia los lasers de enemigos que salgan de pantalla
    this.missiles.children.each(m => m.y < -20 && m.destroy());                           // limpia los misiles que salgan de pantalla
    this.powerups.children.each(p => p.y > this.scale.height + 20 && p.destroy());        // limpia los powerups que salgan de pantalla
    this.missileCrates.children.each(c => c.y > this.scale.height + 20 && c.destroy());   // limpia las cajas de misiles que salgan de pantalla
    this.fuelItems.children.each(f => f.y > this.scale.height + 20 && f.destroy());       // limpia los items de combustible que salgan de pantalla

  
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

      // Velocidad lateral progresiva, pero limitada
      const baseSpeed = 2.5;
      const extraSpeed = Math.min(this.score * 0.001, 5)
      const lateralSpeed = baseSpeed + extraSpeed;

      enemy.x += dir * lateralSpeed;

      // Limita el movimiento lateral a la zona superior
      if (enemy.x < 232) {
        enemy.x = 232;
        enemy.setData("dir", 1);
      }
      if (enemy.x > 564) {
        enemy.x = 564;
        enemy.setData("dir", -1);
      }

      // Mantén la Y fija para que no bajen
      if (enemy.getData("fixedY")) {
        enemy.y = enemy.getData("fixedY");
      }
    });

    // Actualizar imagen del tanque de combustible
    if (this.fuel > 70) {
      this.tankImage.setTexture("tanque1");
    } else if (this.fuel > 40) {
      this.tankImage.setTexture("tanque2");
    } else if (this.fuel > 10) {
      this.tankImage.setTexture("tanque3");
    } else {
      this.tankImage.setTexture("tanque4");
    }


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
    this.sfx.bullet.play();
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
    this.sfx.misil.play();
    const missile = this.missiles.create(this.player.x, this.player.y - this.player.displayHeight / 2 - 10, 'missile1');
    missile.setVelocityY(-700);
    missile.setScale(2.8);
    this.missilesAvailable--;
    this.updateMissileText();
  }

  updateMissileText() {
    for (let i = 0; i < this.maxMissiles; i++) {
      this.missileIcons[i].setVisible(i < this.missilesAvailable);
    }
  }

  // SPAWN DEL ITEM CAJA MISILES
  spawnMissileCrate() {
    if (this.playerSpeed < 400) return; // Solo si el jugador va rápido
    if (this.missileCrates.countActive(true) >= 2) return;
    const x = Phaser.Math.Between(230, 570);
    const crate = this.missileCrates.create(x, -20, "caja");
    crate.setVelocityY(250);
    crate.setScale(1.5);
  }

  // SPAWN DEL ITEM COMBUSTIBLE
  spawnFuelItem() {
    if (this.playerSpeed < 400) return; // Solo si el jugador va rápido
    const x = Phaser.Math.Between(230, 570);
    const fuel = this.fuelItems.create(x, -20, "fuelItem");
    fuel.setVelocityY(250);
    fuel.setScale(1.5);
  }

  spawnPowerUp() {
    if (this.playerSpeed < 400) return;
    if (this.powerups.countActive(true) >= 1) return;

    // 💡 Esta condición es la clave: solo si hay menos de 2 aviones aliados, creamos el ítem
    if (this.allyPlanes.length >= 100) return;

    const x = Phaser.Math.Between(230, 570);
    const power = this.powerups.create(x, -20, "powerup");
    power.setVelocityY(280);
    power.setScale(0.2);
  }



  // codigo para recolectar powerup
  collectPowerUp(entity, power) {
    power.destroy();
    this.sfx.powerup.play();

    if (this.allyPlanes.length >= 2) {
      this.score += 1200;
      return;
    }

    const offsetX = this.allyPlanes.length === 0 ? 45 : -45;
    const offsetY = 40;
    const ally = this.physics.add.sprite(entity.x + offsetX, entity.y + offsetY, "avion-power1");
    ally.setScale(1);
    ally.setCollideWorldBounds(true);
    ally.body.immovable = true;
    ally.setPushable(false);
    this.allyPlanes.push(ally);
    this.allyGroup.add(ally); // <-- Agrega al grupo de Phaser
    this.score += 500;
  }


  // CODIGO PARA RECOLECTAR CAJA MISILES
  collectMissileCrate(entity, crate) {
    crate.destroy();
    this.sfx.itemcaja.play();
    this.missilesAvailable = this.maxMissiles;
    this.updateMissileText();
    this.score += 250;
  }

  // CODIGO PARA RECOLECTAR ITEM COMBUSTIBLE
  collectFuel(entity, fuel) {
    fuel.destroy();
    this.sfx.itemfuel.play();
    this.fuel = Math.min(this.fuel + 25, 100);
    this.score += 250;
  }

  // DURACION DE LA EXPLOSION
  spawnExplosion(x, y, contagious = false) {
    const explosion = this.explosions.create(x, y, "explode1");
    explosion.setScale(contagious ? 2.5 : 1.2); // grande para misil, chica para bala
    explosion.setAlpha(0.9);
    explosion.setData('contagious', contagious);

    // Animación manual
    let frame = 1;
    const frameRate = 110;
    const maxFrames = 6; // solo 1,2,3 para visual
    const animationTimer = this.time.addEvent({
      delay: frameRate,
      callback: () => {
        if (!explosion.active) return;
        frame++;
        if (frame > maxFrames) frame = 1;
        explosion.setTexture(`explode${frame}`);
      },
      loop: true
    });

    const explosionDuration = contagious ? 2000 : 600; // más corta para visual
    this.time.delayedCall(explosionDuration, () => {
      if (explosion.active) {
        explosion.destroy();
        animationTimer.remove();
      }
    });
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
      // Fijar la posición Y para que no bajen más
      ship.setData("fixedY", ship.y);
      ship.bombTimer = this.time.addEvent({
        delay: this.getEnemyFireDelay(),
        callback: () => {
          if (!ship.active) return;
          this.sfx.lasermini.play();
          const bomb = this.bombs.create(ship.x, ship.y + 40, "bomb1");
          bomb.setVelocityY(450);
          bomb.setTexture("bomb1");
          bomb.setScale(2.8);
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
      // Fijar la posición Y para que no bajen más
      ship.setData("fixedY", ship.y);
      ship.laserTimer = this.time.addEvent({
        delay: this.getEnemyFireDelay(),
        callback: () => {
          if (!ship.active) return;
          this.sfx.lasermax.play();
          const laser = this.enemyLasers.create(ship.x, ship.y + 40, "laser1");
          laser.setVelocityY(450);
          laser.setTexture("laser1");
          laser.setScale(2);
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
      this.shipsDestroyed++;
      this.spawnExplosion(enemy.x, enemy.y, false); // pequeña, NO contagiosa
      enemy.destroy();
      this.sfx.explodemini.play();
    } else {
      enemy.setData("life", hp);
      const type = enemy.getData("type");
      const stage = (type === "cargo") ? 6 - hp : 8 - hp;
      enemy.setTexture(type === "cargo" ? `cargo${stage}` : `hunter${stage}`);
    }
  }

  hitWithMissile(missile, enemy) {
    missile.destroy();
    this.sfx.explodemax.play();
    this.spawnExplosion(enemy.x, enemy.y, true); // grande, contagiosa
    if (enemy.active) {
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 200 : 500);
      this.shipsDestroyed++;
      enemy.destroy();
    }
  }

  hitByExplosion(explosion, enemy) {
    if (!enemy.active) return;
    if (explosion.getData('contagious')) {
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 200 : 100);
      this.shipsDestroyed++;
      this.spawnExplosion(enemy.x, enemy.y, false); // solo visual
      enemy.destroy();
      this.sfx.explodemini.play();
    }
  }

  hitPlayer(player, projectile) {
    projectile.destroy();

    if (this.gameMusic && this.gameMusic.isPlaying) {
      this.gameMusic.stop();
    }

    this.gameIsFrozen = true;

    // Detener los timers de disparo de todos los enemigos
    this.enemiesGroup.children.each(enemy => {
      if (enemy.bombTimer) enemy.bombTimer.paused = true;
      if (enemy.laserTimer) enemy.laserTimer.paused = true;
    });

    this.sfx.explodemax.play();

    this.showPlayerExplosion(() => {
      this.scene.start('DeathScene', {
        score: this.score,
        shipsDestroyed: this.shipsDestroyed
      });
    });
  }


  hitAlly(ally, projectile) {
    projectile.destroy();
    this.spawnExplosion(ally.x, ally.y, false);
    this.sfx.explodemini.play();
    ally.destroy();

    // 💡 Filtramos usando .active Y .visible para mayor seguridad
    this.allyGroup.remove(ally, true, true); // Elimina del grupo y destruye el sprite
    this.allyPlanes = this.allyPlanes.filter(a => a.active && a.visible);
  }

  getEnemyFireDelay() {
    // Disparan más rápido con más puntos, pero nunca menos de 600ms
    return Math.max(2500 - this.score * 0.15, 600);
  }

  showPlayerExplosion(callback) {
    // Oculta el sprite del jugador
    this.player.setVisible(false);

    // Crea la explosión grande en la posición del jugador
    const explosion = this.add.sprite(this.player.x, this.player.y, "explode1").setScale(2.5).setAlpha(0.95);

    // Animación lenta: cambia de frame cada 300ms
    let frame = 1;
    const maxFrames = 6;
    const frameRate = 300;
    const animationTimer = this.time.addEvent({
      delay: frameRate,
      repeat: maxFrames - 1,
      callback: () => {
        frame++;
        if (frame > maxFrames) frame = maxFrames;
        explosion.setTexture(`explode${frame}`);
      }
    });

    // Cuando termine la animación, destruye la explosión y llama al callback
    this.time.delayedCall(frameRate * maxFrames + 200, () => {
      explosion.destroy();
      if (callback) callback();
    });
  }
}
export default GameScene;
