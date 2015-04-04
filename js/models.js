// Game models

/**
 * Constructor of Board.prototype.object
 * @param integer    size size of Board.prototype.grid
 * @param integer    lifeTime life time for a tile (ms)
 * @param integer    interval of generating new tile (ms)
 *
 */
var Board = function (size, lifeTime, interval) {
  this.cells = [];
  // Init grid
  var i, j;
  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      if (this.cells[i] === undefined) {
        this.cells[i] = [];
      }
      this.cells[i][j] = null;
    }
  }

  this.size = size;
  this.lifeTime = lifeTime;
  this.interval = interval;
  this.startTime = Date.now();
  this.clickTimes = 0;
  this.effectiveClickTimes = 0;

  // the start interval, for stop handling
  this.executing = null;
  this.end = false;
};

/**
 * @param integer    x
 * @param integer    y
 *
 */
Board.prototype.addTile = function (x, y) {
  if (this.cells[x][y] === null) {

    // Create a Tile in (x, y)
    this.cells[x][y] = 1;

    var board = this;
    setTimeout(function () {
      board.clearCell(x, y);
    }, this.lifeTime);

    return true;
  }

  return false;
};

/**
 * @param integer    min
 * @param integer    max
 *
 * @return integer
 */
Board.prototype.generateRandomeInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Add tile in random position
 *
 * @return integer
 */
Board.prototype.addRandomTile = function () {
  var x = this.generateRandomeInteger(0, this.size - 1);
  var y = this.generateRandomeInteger(0, this.size - 1);

  var board = this;
  var retryInterval = setInterval(function () {
    if (board.addTile(x, y)) {
      clearInterval(retryInterval);
    }
  }, 1);

  return;
};

/**
 * @param integer    x
 * @param integer    y
 *
 */
Board.prototype.checkCell = function (x, y) {
  if (this.cells[x][y] !== null) {
    this.end = true;
  }
};


/**
 * @param integer    x
 * @param integer    y
 *
 */
Board.prototype.clearCell = function (x, y) {
  if (this.cells[x][y] !== null) {
    this.cells[x][y] = null;
  }
};



Board.prototype.start = function () {
  var board = this;
  this.executing = setInterval(function () {
    board.addRandomTile();
  }, board.interval);
};

Board.prototype.stop = function () {
  if (this.executing !== null) {
    clearInterval(this.executing);
  }
};