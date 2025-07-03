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
      delay: 90000,                 //tiempo de aparicion en ms (1 minuto 30 segundos)
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
    const minDelay = 0;                                                    // delay minimo para el spawn de enemigos (0 segundos)
    const spawnDelay = Math.max(baseDelay - this.score * 0.01, minDelay);    // delay de spawn de enemigos basado en el score (va aumentando)

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
    if (this.fuel <= 0) {                       // si el combustible llega a 0, termina el juego
      this.scene.start('DeathScene', {
        score: this.score,
        shipsDestroyed: this.shipsDestroyed
      });
    }

    // actualiza la posicion de los enemigos
    this.enemiesGroup.children.each(enemy => {
      if (!enemy.active) return; 
      let dir = enemy.getData("dir") ?? (Phaser.Math.Between(0, 1) === 0 ? -1 : 1); // obtiene la direccion del enemigo o la asigna aleatoriamente
      enemy.setData("dir", dir);
      // velocidad lateral progresiva, pero limitada
      const baseSpeed = 2.5;                                     // velocidad base de movimiento lateral
      const extraSpeed = Math.min(this.score * 0.0005, 500)        // velocidad extra basada en el score, limitada a 5
      const lateralSpeed = baseSpeed + extraSpeed;
      enemy.x += dir * lateralSpeed;                             // mueve al enemigo lateralmente
      // limita el movimiento lateral a la zona superior
      if (enemy.x < 232) {                                       // si el enemigo sale del limite izquierdo
        enemy.x = 232;                                           // lo posiciona en el limite izquierdo
        enemy.setData("dir", 1);                                 // cambia la direccion a derecha
      }
      if (enemy.x > 564) {                                       // si el enemigo sale del limite derecho
        enemy.x = 564;                                           // lo posiciona en el limite derecho
        enemy.setData("dir", -1);                                // cambia la direccion a izquierda
      }

      // mantiene la Y fija para que no bajen
      if (enemy.getData("fixedY")) {
        enemy.y = enemy.getData("fixedY");
      }
    });

    // actualizar imagen del tanque de combustible
    if (this.fuel > 70) {                             // si el combustible es mayor o igual a 70, muestra tanque1
      this.tankImage.setTexture("tanque1");
    } else if (this.fuel > 40) {                      // si el combustible es mayor o igual a 40, muestra tanque2
      this.tankImage.setTexture("tanque2");
    } else if (this.fuel > 10) {                      // si el combustible es mayor o igual a 10, muestra tanque3
      this.tankImage.setTexture("tanque3");
    } else {                                          // si el combustible es menor o igual a 10, muestra tanque4
      this.tankImage.setTexture("tanque4");
    }

    // movimiento fijo de los aliados en formación
    this.allyPlanes.forEach((ally, i) => {
      if (!ally.active) return;
      const offsetX = i === 0 ? 50 : -50;             // posicion lateral de los aliados respecto al jugador
      const offsetY = 40;                             // posicion vertical de los aliados respecto al jugador
      ally.x = this.player.x + offsetX;
      ally.y = this.player.y + offsetY;
      const bounds = this.physics.world.bounds;                                 // obtiene los limites del mundo
      ally.x = Phaser.Math.Clamp(ally.x, bounds.left + 20, bounds.right - 20);  // limita el movimiento lateral de los aliados
      ally.y = Phaser.Math.Clamp(ally.y, bounds.top + 20, bounds.bottom - 20);  // limita el movimiento vertical de los aliados
    });
  }
  // ACA TERMINA EL UPDATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // codigo para intercambio de sprites de disparo
  shootBullet() {                                 
    const bulletTexture = this.bulletToggle ? "bullet1" : "bullet2";  // intercambio de sprites de disparo para jugador
    this.bulletToggle = !this.bulletToggle;
    this.sfx.bullet.play();
    const bullet = this.bullets.create(
      this.player.x,
      this.player.y - this.player.displayHeight / 2 - 10,   // posiciona la bala justo arriba del jugador
      bulletTexture
    );
    bullet.setVelocityY(-900);               // velocidad de la bala
    bullet.setScale(1.4);                    // tamaño de la bala
    this.allyPlanes.forEach(ally => {
      if (!ally.active) return;
    const bulletTexture = this.bulletToggle ? "bullet1" : "bullet2";  // intercambio de sprites de disparo para los aliados
    const bullet = this.bullets.create(
      ally.x,
      ally.y - ally.displayHeight / 2 - 10,                 // posiciona la bala justo arriba del aliado
      bulletTexture
    );
    bullet.setVelocityY(-900);               // velocidad de la bala
    bullet.setScale(1.4);                    // tamaño de la bala
  });
  }

  // codigo para el disparo de misiles
  shootMissile() {
    if (this.missilesAvailable <= 0) return;     // si no hay misiles disponibles, no dispara
    this.sfx.misil.play();
    const missile = this.missiles.create(this.player.x, this.player.y - this.player.displayHeight / 2 - 10, 'missile1'); // posiciona el misil justo arriba del jugador
    missile.setVelocityY(-700);                  // velocidad del misil
    missile.setScale(2.8);                       // tamaño del misil
    this.missilesAvailable--;
    this.updateMissileText();
  }

  // codigo para actualizar el texto de misiles disponibles
  updateMissileText() {
    for (let i = 0; i < this.maxMissiles; i++) {                    // recorre los iconos de misiles
      this.missileIcons[i].setVisible(i < this.missilesAvailable);  // muestra los iconos de misiles disponibles
    }
  }

  // spawn del item caja de misiles
  spawnMissileCrate() {
    if (this.playerSpeed < 400) return; // solo si el jugador esta a mas de 400 km/h
    const x = Phaser.Math.Between(230, 570);                   // posicion aleatoria entre 230 y 570
    const crate = this.missileCrates.create(x, -20, "caja");   // crea la caja de misiles
    crate.setVelocityY(250);                                   // velocidad de caida de la caja de misiles
    crate.setScale(1.5);                                       // tamaño de la caja de misiles
  }

  // spawn del item bidon de combustible
  spawnFuelItem() {
    if (this.playerSpeed < 400) return; // solo si el jugador esta a mas de 400 km/h
    const x = Phaser.Math.Between(230, 570);                   // posicion aleatoria entre 230 y 570
    const fuel = this.fuelItems.create(x, -20, "fuelItem");    // crea el item de combustible
    fuel.setVelocityY(250);                                    // velocidad de caida del item de combustible
    fuel.setScale(1.5);                                        // tamaño del item de combustible
  }

  // spawn del item de powerup
  spawnPowerUp() {
    if (this.playerSpeed < 400) return; // solo si el jugador esta a mas de 400 km/h)
    const x = Phaser.Math.Between(230, 570);                 // posicion aleatoria entre 230 y 570
    const power = this.powerups.create(x, -20, "powerup");   // crea el item de powerup
    power.setVelocityY(280);                                 // velocidad de caida del powerup
    power.setScale(0.2);                                     // tamaño del powerup
  }

  // codigo para recolectar powerup
  collectPowerUp(entity, power) {        // tanto jugador como aliados pueden recoger powerups
    power.destroy();                     // se destruye al recojerlo
    this.sfx.powerup.play();
    if (this.allyPlanes.length >= 2) {
      this.score += 1200;                // recojerlo da 1200 puntos
      return;
    }

    // codigo para agregar un aliado
    const offsetX = this.allyPlanes.length === 0 ? 45 : -45;  // posicion lateral del aliado respecto al jugador
    const offsetY = 40;                                       // posicion vertical del aliado respecto al jugador
    const ally = this.physics.add.sprite(entity.x + offsetX, entity.y + offsetY, "avion-power1"); 
    ally.setScale(1);
    ally.setCollideWorldBounds(true);   // evita que el aliado salga de los limites del mundo
    ally.body.immovable = true;
    ally.setPushable(false);
    this.allyPlanes.push(ally);         // agrega el aliado al array de aliados
    this.allyGroup.add(ally);           // agrega el aliado al grupo de aliados
    this.score += 1200;                  // recojerlo da 500 puntos
  }

  // codigo para recolectar item de caja de misiles
  collectMissileCrate(entity, crate) {         // tanto jugador como aliados pueden recoger cajas de misiles
    crate.destroy();                           // se destruye al recojerla
    this.sfx.itemcaja.play();
    this.missilesAvailable = this.maxMissiles; // recarga los misiles disponibles al maximo
    this.updateMissileText();                  // actualiza el texto de misiles disponibles
    this.score += 250;                         // recojerla da 250 puntos
  }

  // codigo para recolectar item de combustible
  collectFuel(entity, fuel) {                  // tanto jugador como aliados pueden recoger items de combustible
    fuel.destroy();                            // se destruye al recojerlo
    this.sfx.itemfuel.play();
    this.fuel = Math.min(this.fuel + 30, 100); // recarga 30 de combustible hasta un maximo de 100
    this.score += 250;                         // recojerlo da 250 puntos
  }

  // spawn de la explosion pequeña o grande
  spawnExplosion(x, y, contagious = false) {                     // no es contagiosa para balas, si lo es para misiles
    const explosion = this.explosions.create(x, y, "explode1");  // crea la explosion desde explode1
    explosion.setScale(contagious ? 2.5 : 1.2);                  // escala de la explosion, mas grande si es contagiosa
    explosion.setAlpha(0.9);
    explosion.setData('contagious', contagious);                 // marca si la explosion es contagiosa o no

    // animacion manual
    let frame = 1;                                   // contador de frames para la animacion
    const frameRate = 110;                           // velocidad de cambio de frames en ms
    const maxFrames = 6;                             // numero maximo de frames de la animacion (explode1 a explode6)
    const animationTimer = this.time.addEvent({
      delay: frameRate,
      callback: () => {
        if (!explosion.active) return;
        frame++;
        if (frame > maxFrames) frame = 1;            // vuelve al primer frame si ya paso el ultimo
        explosion.setTexture(`explode${frame}`);
      },
      loop: true
    });
    const explosionDuration = contagious ? 2000 : 600; // duracion de la explosion, mas larga si es contagiosa
    this.time.delayedCall(explosionDuration, () => {
      if (explosion.active) {
        explosion.destroy();
        animationTimer.remove();
      }
    });
  }

  // spawn de enemigos aleatorios
  spawnRandomEnemy() {
    const x = Phaser.Math.Between(230, 540);                             // posicion aleatoria entre 230 y 540
    const type = Phaser.Math.Between(0, 1) === 0 ? "cargo" : "hunter";   // tipo de enemigo aleatorio, 50% cargo y 50% hunter
    if (type === "cargo" && this.enemiesGroup.countActive(true) < 8) this.spawnCargoEnemy(x, -60); // si hay menos de 8 enemigos activos, spawnea un carguero
    else if (type === "hunter" && this.enemiesGroup.countActive(true) < 8) this.spawnHunterEnemy(x, -60); // si hay menos de 8 enemigos activos, spawnea un cazador
  }

  // spawn de carguero (CARGO)
  spawnCargoEnemy(x, y) {
    const ship = this.enemiesGroup.create(x, y, "cargo1");
    ship.setVelocityY(250);             // posicion en linea Y de ubicacion del carguero
    ship.setData("type", "cargo");      // tipo de enemigo cargo
    ship.setData("life", 5);            // vida del carguero (5 golpes)
    ship.setData("wasScored", false);
    ship.setScale(1);
    this.time.delayedCall(1000, () => {
      if (!ship.active) return;
      ship.setVelocityY(0);
      ship.body.moves = false;
      ship.setData("fixedY", ship.y);        // fijar la posición Y para que no bajen más
      ship.bombTimer = this.time.addEvent({
        delay: this.getEnemyFireDelay(),     // tiempo de disparos basado en puntuacion
        callback: () => {
          if (!ship.active) return;
          this.sfx.lasermini.play();
          const bomb = this.bombs.create(ship.x, ship.y + 40, "bomb1");
          bomb.setVelocityY(450);            // velocidad de caida de la bomba
          bomb.setTexture("bomb1");
          bomb.setScale(2.8);                // escala de la bomba, mucho mas grande que la imagen base
        },
        loop: true
      });
    });
  }
  // spawn de cazador (HUNTER)
  spawnHunterEnemy(x, y) {
    const ship = this.enemiesGroup.create(x, y, "hunter1");
    ship.setVelocityY(140);                   // posicion en linea Y de ubicacion del cazador
    ship.setData("type", "hunter");           // tipo de enemigo hunter
    ship.setData("life", 7);                  // vida del hunter (7 golpes)
    ship.setData("wasScored", false);
    ship.setScale(1.3);
    this.time.delayedCall(1000, () => {
      if (!ship.active) return;
      ship.setVelocityY(0);
      ship.body.allowGravity = false;
      ship.body.immovable = true;
      ship.setData("fixedY", ship.y);         // fijar la posición Y para que no bajen más
      ship.laserTimer = this.time.addEvent({
        delay: this.getEnemyFireDelay(),      // tiempo de disparos basado en puntuacion
        callback: () => {
          if (!ship.active) return;
          this.sfx.lasermax.play();
          const laser = this.enemyLasers.create(ship.x, ship.y + 40, "laser1");
          laser.setVelocityY(450);            // velocidad de caida del laser
          laser.setTexture("laser1");
          laser.setScale(2);
        },
        loop: true
      });
    });
  }

  // sistema de puntos por naves destruidas
  scoreEnemy(enemy, value) {
    if (!enemy.getData("wasScored")) {
      this.score += value;                // suma de los puntos
      enemy.setData("wasScored", true);   // se asegura de que solo sume una vez
    }
  }

  // comportamiento de balas golpeando enemigos
  hitEnemy(bullet, enemy) {
    bullet.destroy();                     // al golpear, la bala se destruye
    let hp = enemy.getData("life") - 1;   // resta 1 de vida a la nave golpeada
    if (hp <= 0) {                        // si la vida llega a 0, entonces ...
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 200 : 400);
      this.shipsDestroyed++;
      this.spawnExplosion(enemy.x, enemy.y, false); // explosion pequeña, NO contagiosa
      enemy.destroy();                              // el enemigo desaparece
      this.sfx.explodemini.play();
    } else {
      enemy.setData("life", hp);
      const type = enemy.getData("type");
      const stage = (type === "cargo") ? 6 - hp : 8 - hp;    // cambia de textura segun la vida restante
      enemy.setTexture(type === "cargo" ? `cargo${stage}` : `hunter${stage}`);
    }
  }

  // comportamiento de misiles golpeando enemigos
  hitWithMissile(missile, enemy) {
    missile.destroy();
    this.sfx.explodemax.play();
    this.spawnExplosion(enemy.x, enemy.y, true); // grande, contagiosa
    if (enemy.active) {
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 300 : 500); // puntaje por destruir enemigo
      this.shipsDestroyed++;                                                 // contador de naves destruidas
      enemy.destroy();
    }
  }

  // comportamiento de explosiones golpeando enemigos
  hitByExplosion(explosion, enemy) {
    if (!enemy.active) return;
    if (explosion.getData('contagious')) {                                    // la explosion es contagiosa
      this.scoreEnemy(enemy, enemy.getData("type") === "cargo" ? 100 : 200);  // puntaje por destruir enemigo
      this.shipsDestroyed++;                                                  // contador de naves destruidas
      this.spawnExplosion(enemy.x, enemy.y, false);                           // genera explosion pequeña, NO contagiosa
      enemy.destroy();
      this.sfx.explodemini.play();
    }
  }

  // jugador golpeado por ataque enemigo 
  hitPlayer(player, projectile) {
    projectile.destroy();
    if (this.gameMusic && this.gameMusic.isPlaying) {       // si la musica esta sonando, la detiene
      this.gameMusic.stop();
    }
    this.gameIsFrozen = true;                               // congela el juego para evitar mas acciones
    this.enemiesGroup.children.each(enemy => {              // pausa los timers de los enemigos
      if (enemy.bombTimer) enemy.bombTimer.paused = true;
      if (enemy.laserTimer) enemy.laserTimer.paused = true;
    });
    this.sfx.explodemax.play();
    this.showPlayerExplosion(() => {     // muestra la explosion del jugador y luego inicia la escena de GameOver
      this.scene.start('DeathScene', {
        score: this.score,
        shipsDestroyed: this.shipsDestroyed
      });
    });
  }

  // aliado golpeado por ataque enemigo
  hitAlly(ally, projectile) {
    projectile.destroy();
    this.spawnExplosion(ally.x, ally.y, false);   // genera explosion pequeña, NO contagiosa
    this.sfx.explodemini.play();
    ally.destroy();
    this.allyGroup.remove(ally, true, true);      // elimina el aliado del grupo y del array
    this.allyPlanes = this.allyPlanes.filter(a => a.active && a.visible);
  }

  // disparo enemigo más rápido con más puntos
  getEnemyFireDelay() {
    return Math.max(2500 - this.score * 0.06, 300); // tiempo de disparos basado en puntuacion, minimo 300ms
  }

  // muestra la explosion del jugador y luego llama al callback
  showPlayerExplosion(callback) {
    this.player.setVisible(false);     // oculta al jugador para crear la explosion
    const explosion = this.add.sprite(this.player.x, this.player.y, "explode1").setScale(2.5).setAlpha(0.95);
    let frame = 1;
    const maxFrames = 6;
    const frameRate = 300;
    const animationTimer = this.time.addEvent({  // animacion mas lenta para la explosion del jugador
      delay: frameRate,
      repeat: maxFrames - 1,
      callback: () => {
        frame++;
        if (frame > maxFrames) frame = maxFrames;
        explosion.setTexture(`explode${frame}`);
      }
    });
    this.time.delayedCall(frameRate * maxFrames + 200, () => {
      explosion.destroy();
      if (callback) callback();
    });
  }
}
export default GameScene; // exporta la clase GameScene para que pueda ser utilizada en otras partes del juego
