const expect = chai.expect;

describe('Game', function () {
  describe('Preload Game', function () {
    it('is a function', function () {
      expect(preload).to.be.a('function');
    });
  });
  describe('Create Game', function () {
    it('is a function', function () {
      expect(create).to.be.a('function');
    });
  });
  describe('Update Game', function () {
    it('is a function', function () {
      expect(update).to.be.a('function');
    });
  });
  describe('Collect Crystal', function () {
    it('is a function', function () {
      expect(collectCrystal).to.be.a('function');
    });
  });
  describe('Enemy Collide', function () {
    it('is a function', function () {
      expect(enemyCollide).to.be.a('function');
    });
  });
  describe('Set Highscore', function () {
    //default to zero
    //replace with new Highscore
    it('is a function', function () {
      expect(setHighScore).to.be.a('function');
    });
    it('score defaults to zero', function () {
      setHighScore(0)
      expect(getHighScore()).to.eq(0);
    });
    it('expect highscore to equal 100', function () {
      setHighScore(100);
      expect(getHighScore()).to.eq(100);
    });
    it('replace with new highscore', function () {
      setHighScore(200);
      expect(getHighScore()).to.eq(200);
    });
  });
  describe('Get Highscore', function () {
    it('is a function', function () {
      expect(getHighScore).to.be.a('function');
    });
  });
});
