var config = {
  type: Phaser.AUTO,
  width: 1430,
  height: 768,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
  };

  var game = new Phaser.Game(config);
  function Main () {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer;

  function preload () {
  this.load.image('sky', './assets/planet_scenery2.jpg');
  this.load.image('platform', './assets/platform2.png');
  this.load.image('ice-platform', './assets/ice-platform.png');
  this.load.image('ground', './assets/ground.jpg');
  this.load.image('star', './assets/star.png');
  this.load.image('bomb', './assets/bomb.png');
  this.load.spritesheet('dude', './assets/Keilas_Sprite_Sheet_2.png', { frameWidth: 69, frameHeight: 90 });
  }

  var platforms;
  var player;
  var score = 0;
  var highscore = 0;
  var scoreText;
  var highScoreText;


  function create () {
    //background
    this.add.image(400, 300, 'sky');
    //platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 750, 'ground').setScale(1).refreshBody();
    platforms.create(650, 370, 'platform');
    platforms.create(115, 330, 'platform');
    platforms.create(700, 200, 'ice-platform');
    //player
    player = this.physics.add.sprite(100, 390, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300)
    //create movement
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    cursors = this.input.keyboard.createCursorKeys();
    //create collected item (star soon to be crystal)
    stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
    });
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    //score
    //add score to local storage for high score
    if (score < localStorage.getItem("highscore")) {
      // debugger
      // scoreText = score.add.text(16, 16, 'score: 0', {fontFamily fontSize: '32px', fill: '#000' });
      // localStorage.setItem("highscore", score);
      highScoreText = this.add.text(16, 16,
      { fontSize: '32px', fill: '#00'})

    }
    //enemy (bombs)
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
  }

  function update () {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-430);
    }
  }

  function collectStar (player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    var x = (player.x < 400) ? Phaser.Math.Between(390, 800) : Phaser.Math.Between(0, 390);
    var bomb = bombs.create(x, 12, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
    }
}

  function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }


  //Event Listeners
