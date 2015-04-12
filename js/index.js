/** @jsx React.DOM */
var supportedColors = ['b-orange', 'b-purple', 'b-blue', 'b-green', 'b-red', 'b-lblue', 'b-dgreen', 'b-teal'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var WrapperView = React.createClass({
  getInitialState: function () {
    return {
      difficulty: 'wtf?'
    }
  },
  getDifficultySets: function() {
    return {
      'normal': {
        size: 5,
        probability: 0.3,
        interval: 5000
      },
      'hard': {
        size: 4,
        probability: 0.45,
        interval: 4000
      },
      'wtf?': {
        size: 3,
        probability: 0.6,
        interval: 3000
      }
    }
  },
  handleDifficultyClick: function (difficulty) {
    this.setState({ difficulty: difficulty });
  },
  render: function () {
    var difficulty = this.state.difficulty;
    var difficultySets = this.getDifficultySets()[difficulty];

    return <div>
      <BoardView difficulty={difficultySets} />
      <NavView difficulty={difficulty} onClick={this.handleDifficultyClick} />
    </div>
  }
})

var NavView = React.createClass({
  render: function () {
    var self = this;
    var difficulties = ['normal', 'hard', 'wtf?'];

    var options = difficulties.map(function (difficulty) {
      var classes = difficulty === self.props.difficulty ? 'active' : '';
      return <li className={classes}><a href='#' onClick={self.props.onClick.bind(this, difficulty)} key={difficulty}>{difficulty}</a></li>;
    });

    return (<nav className="sidebar"><ul>{options}</ul></nav>);

  }
})

var BoardView = React.createClass({
  getInitialState: function (isFirst, duration) {
    var initialState = {
      board: new Board(3, 0.6, 2000),
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
      board: new Board(this.props.difficulty.size, this.props.difficulty.probability, this.props.difficulty.interval),
      totalClick: 0,
      effectiveClick: 0,
      showOverlay: false,
      startGame: true,
      startTime: Date.now(),
      endGame: false
    });
  },

  handleGameOver: function () {
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
    if (this.state.board.checkCells()) {
      this.handleGameOver();

      // Stop cell interval
      return true;
    }
  },

  render: function () {
    var self = this;
    var difficulty = this.props.difficulty;

    self.state.board = new Board(difficulty.size, difficulty.probability, difficulty.interval);

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

    var sizeClassName = 'board';
    sizeClassName += ' size-' + this.props.difficulty.size;

    return (
      <div className={sizeClassName}>
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
  // All is asynchro
  handleLifeCycle: function () {
    var self = this;
    // Generate tiles by input interval of board
    self.state.intervalVariable = setInterval(function () {

      // Callback function in board, check if the game is over
      // Game Ends HERE
      if (self.props.onCellGenerate(self.props.tile)) {
        // Shitty loop to clear all interval...sorry about this mess
        for (var i = 1; i < 99999; i++) {
          window.clearInterval(i);
        }
        return;
      }

      // Random generation in certain interval
      if (self.props.tile.getRandomBoolean() && !self.props.tile.hasShown()) {
        // show tile and update the rendering
        self.props.tile.setShow();
        self.setState({ tile: self.props.tile });
        // Set disappear
        setTimeout(function () {
          self.props.tile.setHide();
          self.setState({ tile: self.props.tile });
        }, self.props.tile.interval);
      }

    // interval + random[0, interval] for more taste
    }, self.props.tile.getRandomInterval());

  },

  render: function () {
    if (this.props.startGame) {
      this.handleLifeCycle();
    }

    if (this.props.endGame) {
      this.state.tile.setHide();
    }


    var classes = 'cell'
    if (this.state.tile.hasShown()) {
      classes = 'tile ' + supportedColors[getRandomInt(0, supportedColors.length - 1)];
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
      var buttonWording = 'Start';
      var wording = 'Let\'s do it';
      var subWording = 'Ready ?';
      var buttonClass = 'startButton b-lblue';

    if (boardState.isFirst !== undefined && boardState.isFirst === false) {
      wording = 'Time: ' + boardState.duration + 's';
      subWording = ((boardState.effectiveClick / boardState.duration) * 60).toFixed(2) + ' EPM - '
      subWording += ((boardState.totalClick / boardState.duration) * 60).toFixed(2) + ' APM';
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
        <p className='sub-message'>{subWording}</p>
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
      <ScoreCircle percentage={percentage} number={effectiveClick} type={'Effective Clicks'} />
      <ScoreCircle percentage={percentage} number={totalClick} type={'Clicks'} />
      <ScoreCircle percentage={percentage} number={percentage} type={'Percentage'} />
    </div>
  }
});

var ScoreCircle = React.createClass({
  render: function () {
    var className = 'c100 dark ' + 'p' + this.props.percentage;
    // a little bit more concat of class
    if (this.props.percentage > 60) {
      className += ' green';
    } else if (this.props.percentage <= 70 && this.props.percentage > 45) {
      // will do nothing
    } else {
      className += ' orange';
    }

    var typeClassName = 'type ' + this.props.type.split(' ').join('-');
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

React.render(<WrapperView />, document.getElementById('board'));