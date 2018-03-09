var config = {
  type: Phaser.AUTO,
  width: 1400,
  height: 650,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};
var game = new Phaser.Game(config);
function preload() {
  this.load.image('sky', './assets/images/Game_Background.png');
  this.load.image('platform', './assets/images/Platform_Large.png');
  this.load.image('platform-md', './assets/images/Platform_Medium.png');
  this.load.image('platform-sm', './assets/images/Platform_Small.png');
  this.load.image('ground', './assets/images/Ground.png');
  this.load.image('crystal', './assets/images/Crystal.png');
  this.load.image('enemy', './assets/images/Asteroid.png');
  this.load.spritesheet('alien', './assets/images/Alien_Sprite.png', {
    frameWidth: 68,
    frameHeight: 90
  });
  this.load.audio('enigmatic', ['./assets/audio/bensound-enigmatic.mp3'])
}

var platforms;
var player;
var score = 0;
var scoreText;
var scoreDisplay;
var highScore;
var highScoreText = getHighScore();
var title;

function create() {
  music = this.sound.add('enigmatic');
  music.play();
  this.add.image(700, 300, 'sky');
  enemies = this.physics.add.group();
  platforms = this.physics.add.staticGroup();
  player = this.physics.add.sprite(100, 390, 'alien');
  platforms.create(700, 580, 'ground').setScale(1.2);
  platforms.create(850, 450, 'platform');
  platforms.create(1250, 200, 'platform-sm');
  platforms.create(1050, 200, 'platform-sm');
  platforms.create(850, 250, 'platform-md');
  platforms.create(1300, 450, 'platform-md');
  platforms.create(150, 330, 'platform');
  platforms.create(500, 330, 'platform-md');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(300)
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('alien', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'alien',
      frame: 4
    }],
    frameRate: 20
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('alien', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });
  crystals = this.physics.add.group({
    key: 'crystal',
    repeat: 19,
    setXY: {
      x: 12,
      y: 0,
      stepX: 70
    }
  });
  crystals.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
  });
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(crystals, platforms);
  this.physics.add.overlap(player, crystals, collectCrystal, null, this);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(player, enemies, enemyCollide, null, this);
  cursors = this.input.keyboard.createCursorKeys();
  muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  playKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
  scoreText = this.add.text(20, 60, 'SCORE: 0', {
    fontFamily: 'Alien Beasts',
    fontSize: '50px',
    fill: '#FFFFFF'
  });
  if (getHighScore(highScore) === '0') {
    highScoreText = this.add.text(20, 20, 'HIGH SCORE: 0', {
      fontFamily: 'Alien Beasts',
      fontSize: '50px',
      fill: '#FFFFFF'
    });
  } else {
    highScoreText = this.add.text(20, 20, 'HIGHSCORE:' + getHighScore(highScore), {
      fontFamily: 'Alien Beasts',
      fontSize: '50px',
      fill: '#FFFFFF'
    });
  }
}
function update() {
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
  if (muteKey._justDown) {
    music.pause();
  }
  if (playKey._justDown) {
    music.resume();
  }
}
function collectCrystal(player, crystal) {
  crystal.disableBody(true, true);
  score += 10;
  scoreText.setText('SCORE: ' + score);
  if (score > getHighScore()) {
    setHighScore(score);
    highScoreText.setText('HIGHSCORE:' + getHighScore(highScore));
  }
  if (crystals.countActive(true) === 0) {
    crystals.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });
    var x = (player.x < 400) ? Phaser.Math.Between(390, 800) : Phaser.Math.Between(0, 390);
    var enemy = enemies.create(x, 12, 'enemy');
    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
    enemy.allowGravity = false;
  }
}
function enemyCollide(player) {
  this.physics.pause();
  player.setTint(0x005c04)
}
function setHighScore(score = 0) {
  localStorage.setItem('score', JSON.stringify(score));
}
function getHighScore(highScore = 0) {
  return JSON.parse(localStorage.getItem('score') || '0');
}
