// Game models

var Cell = function (lifeTime, interval) {
  this.lifeTime = lifeTime;
  this.interval = interval;
  this.show = false;
}

Cell.prototype.getRandomBoolean = function () {
   return Math.random() >= 0.5;
}

Cell.prototype.setShow = function () {
  this.show = true;
}

Cell.prototype.setHide = function() {
  this.show = false;
}

Cell.prototype.hasShown = function () {
  return this.show ? true : false;
}

/**
 * Constructor of Board.prototype.object
 * @param integer    size size of Board.prototype.grid
 * @param integer    lifeTime life time for a tile (ms)
 * @param integer    interval of generating new tile (ms)
 *
 */
var Board = function (size, lifeTime, interval) {
  this.size = size;
  this.lifeTime = lifeTime;
  this.interval = interval;
  this.startTime = Date.now();
  this.clickTimes = 0;
  this.effectiveClickTimes = 0;

  this.cells = [];
  // Init grid
  var i, j;
  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
      if (this.cells[i] === undefined) {
        this.cells[i] = [];
      }
      this.cells[i][j] = new Cell(this.lifeTime, this.interval);
    }
  }

  // the start interval, for stop handling
  this.executing = null;
  this.end = false;
};


Board.prototype.checkCells = function () {
  var counter = 0;
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      if (this.cells[i][j].hasShown()) {
        counter ++;
      }
    }
  }

  this.end = counter >= this.size * this.size ? true : false;
  return this.end;
}