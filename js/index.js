/** @jsx React.DOM */
var supportedColors = ['b-orange', 'b-purple', 'b-blue', 'b-green', 'b-red', 'b-lblue', 'b-dgreen', 'b-teal'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var BoardView = React.createClass({
  getInitialState: function (isFirst, duration) {
    var initialState = {
      board: new Board(3, 1000, 2000),
      showOverlay: true,
      endGame: true,
      startTime: Date.now()
    };
    if (isFirst !== undefined && isFirst === false) {
      initialState.isFirst = false;
      initialState.duration = duration;
    }
    return initialState;
  },

  startGame: function (overlay) {
    this.setState({
      board: new Board(3, 1000, 2000),
      totalClick: 0,
      effectiveClick: 0,
      showOverlay: false,
      startGame: true,
      startTime: Date.now(),
      endGame: false
    });
  },

  handleGameOver: function () {
    console.log('game over');
    var duration = Math.round((Date.now() - this.state.startTime) / 1000);
    this.setState(this.getInitialState(false, duration));
  },

  handleCellClickClick: function (cell, isEffective) {
    // TODO: statistics
    this.setState({
      totalClick: this.state.totalClick + 1,
      effectiveClick: this.state.effectiveClick + (isEffective ? 1 : 0)
    });
  },

  handleCellGenerate: function (cell) {
    // TODO: check if board's cells have all tiles
    if (this.state.board.checkCells()) {
      this.handleGameOver();

      // Stop cell interval
      return true;
    }
  },

  render: function () {
    var self = this;
    var cells = self.state.board.cells.map(function (row, index) {
      var className = 'row';
      if (index == 0) {
        className += ' first-row';
      }
      return (<div className={className}>
        {
          row.map(function (col) {
            return <CellView
              tile={col}
              onCellClick={self.handleCellClickClick}
              onCellGenerate={self.handleCellGenerate}
              startGame={self.state.startGame}
              endGame={self.state.endGame} />;
          })
        }
      </div>);
    });

    return (
      <div className='board'>
        <ScoreBox totalClick={this.state.totalClick} effectiveClick={this.state.effectiveClick} />
        {cells}
        <Overlay boardState={this.state} show={this.state.showOverlay} onStart={this.startGame} />
      </div>
    );
  }
});


var CellView = React.createClass({
  getInitialState: function () {
    return { tile: this.props.tile };
  },
  handleClick: function () {
      // Board callback function for global event handle
      var isEffective = false;
      if (this.state.tile.hasShown()) {
        // Rendering renew cell class on updating the state
        this.state.tile.setHide();
        this.setState({ tile: this.state.tile });

        isEffective = true;
      }
      this.props.onCellClick(this, isEffective);
  },

  // Core function for tiles generation and callbacks to board
  handleLifeCycle: function () {
    var self = this;
    // Generate tiles by input interval of board
    self.state.intervalVariable = setInterval(function () {

      // Callback function in board, check if the game is over
      // Game Ends HERE
      if (self.props.onCellGenerate(self.props.tile)) {
        // Shitty loop to clear all interval...sorry about that
        for (var i = 1; i < 99999; i++) {
          window.clearInterval(i);
        }
        return;
      }

      // Random generation in certain interval
      if (self.props.tile.getRandomBoolean()) {
        // show tile and update the rendering
        self.props.tile.setShow();
        self.setState({ tile: self.props.tile });
      }
    }, self.props.tile.interval);

  },

  render: function () {
    if (this.props.startGame) {
      this.handleLifeCycle();
    }

    if (this.props.endGame) {
      this.state.tile.setHide();
    }


    var classes = 'cell '
    if (this.state.tile.hasShown()) {
      classes += 'tile ' + supportedColors[getRandomInt(0, supportedColors.length - 1)];
    }

    return (
      <span className={classes} onClick={this.handleClick}>{''}</span>
    );
  }
});


var Overlay = React.createClass({
  handleClick: function() {
    this.setState({ show: false });
    this.props.onStart(this);
  },
  render: function () {
    var cs = React.addons.classSet;
    var boardState = this.props.boardState;
    // TODO: is first start of already end
      var buttonWording = 'Start';
      var wording = 'Let\'s do it';
      var buttonClass = 'startButton b-lblue';

    if (boardState.isFirst !== undefined && boardState.isFirst === false) {
      wording = 'Time: ' + boardState.duration + 's';
      buttonWording = 'Retry';
      buttonClass = 'startButton b-green';
    }
    var classes = cs({
      'overlay': true,
      'visible': this.props.show,
      'hidden': !this.props.show
    });
    return (
      <div className={classes}>
        <p className='message'>{wording}</p>
        <button className={buttonClass} onClick={this.handleClick}>{buttonWording}</button>
      </div>
    );
  }
});

var ScoreBox = React.createClass({
  render: function () {
    var percentage = this.props.effectiveClick / this.props.totalClick * 100;
    percentage = percentage ? Math.round(percentage) : 0;
    var totalClick = this.props.totalClick === undefined ? 0 : this.props.totalClick;
    var effectiveClick = this.props.effectiveClick === undefined ? 0 : this.props.effectiveClick;

    return <div className='score-box'>
      <ScoreCircle percentage={percentage} number={effectiveClick} type={'EPM'} />
      <ScoreCircle percentage={percentage} number={totalClick} type={'APM'} />
      <ScoreCircle percentage={percentage} number={percentage} type={'Percentage'} />
    </div>
  }
});

var ScoreCircle = React.createClass({
  render: function () {
    var cs = React.addons.classSet;
    var className = 'c100 dark ' + 'p' + this.props.percentage;
    // a little bit more concat of class
    if (this.props.percentage > 60) {
      className += ' green';
    } else if (this.props.percentage <= 70 && this.props.percentage > 45) {
      // will do nothing
    } else {
      className += ' orange';
    }

    var typeClassName = 'type ' + this.props.type;
    var number = this.props.number;
    if (this.props.type === 'Percentage') {
      number += '%'
    }
    return <div className={className}>
      <span>{number}</span>
      <div className='slice'>
        <div className='bar'></div>
        <div className='fill'></div>
      </div>
      <span className={typeClassName}>{this.props.type}</span>
    </div>
  }

});

React.render(<BoardView />, document.getElementById('board'));