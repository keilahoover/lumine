var config = {
  type: Phaser.AUTO,
  width: 1400,
  height: 650,
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
      update: update,
      // render: render
  }
  };
  var game = new Phaser.Game(config);
  console.log(game);

  function Main () {}
  // gameOptions = {
  //   playSound: true,
  //   playMusic: true
  // },
  // musicPlayer;

  function preload () {
  this.load.image('sky', './assets/images/planet_scenery2.jpg');
  this.load.image('platform', './assets/images/platform2.png');
  this.load.image('ice-platform', './assets/images/ice-platform.png');
  this.load.image('ground', './assets/images/ground.jpg');
  this.load.image('star', './assets/images/star.png');
  this.load.image('bomb', './assets/images/bomb.png');
  this.load.spritesheet('dude', './assets/images/Keilas_Sprite_Sheet_2.png', { frameWidth: 70.555, frameHeight: 90 });
  }

  var platforms;
  var player;
  var score = 0;
  var scoreText;
  var scoreDisplay;
  var highScore;
  var highScoreText = getHighScore();
  var title;

  function create () {
    //background
    this.add.image(450, 300, 'sky');
    //platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(700, 1500, 'ground').setScale(3).refreshBody();
    platforms.create(1200, 450, 'platform');
    platforms.create(800, 500, 'platform');
    platforms.create(115, 330, 'platform');
    platforms.create(700, 300, 'ice-platform');

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
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 9 }),
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
    //Score and Highscore
    scoreText = this.add.text(20, 60, 'SCORE: 0', {fontFamily: 'Alien Beasts', fontSize: '50px', fill: '#FFFFFF'});
    // scoreDisplay = this.add.text(40, 40, score, {fontFamily: 'Alien Beasts', fontSize: '50px', fill: '#FFFFFF'});
    if (getHighScore(highScore) === '0') {
      highScoreText = this.add.text(20, 20, 'HIGH SCORE: 0', {fontFamily: 'Alien Beasts', fontSize: '50px', fill: '#FFFFFF'});
    } else {
        highScoreText = this.add.text(20, 20, 'HIGHSCORE:' + getHighScore(highScore), {fontFamily: 'Alien Beasts', fontSize: '50px', fill: '#FFFFFF'});
    }


    //Title
    title = this.add.text(1230, 20, 'LUMINE', {fontFamily: 'Alien Beasts', fontSize: '90px', fill: '#FFFFFF'});


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
    scoreText.setText('SCORE: ' + score);
    if (score > getHighScore()) {
      setHighScore(score);
      highScoreText.setText('HIGHSCORE:' + getHighScore(highScore));
    }
    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    var x = (player.x < 400) ? Phaser.Math.Between(390, 800) : Phaser.Math.Between(0, 390);
    var bomb = bombs.create(x, 12, 'bomb');
    bomb.setBounce(1);
    // bomb.setCollideWorldBounds(true);
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
//Add score to local storage for highscore
function setHighScore (score = 0) {
    localStorage.setItem('score', JSON.stringify(score));
}

function getHighScore (highScore = 0) {
  return JSON.parse(localStorage.getItem('score') || '0');
}
