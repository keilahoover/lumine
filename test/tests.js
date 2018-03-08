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
    it('is a function', function () {
      expect(setHighScore).to.be.a('function');
    });
  });
  describe('Get Highscore', function () {
    it('is a function', function () {
      expect(getHighScore).to.be.a('function');
    });
  });
});
