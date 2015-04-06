/** @jsx React.DOM */
var supportedColors = ['b-orange', 'b-purple', 'b-blue', 'b-green', 'b-red', 'b-lblue', 'b-dgreen', 'b-teal'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var WrapperView = React.createClass({displayName: "WrapperView",
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
        interval: 3000
      },
      'hard': {
        size: 4,
        probability: 0.45,
        interval: 2500
      },
      'wtf?': {
        size: 3,
        probability: 0.6,
        interval: 2000
      }
    }
  },
  handleDifficultyClick: function (difficulty) {
    this.setState({ difficulty: difficulty });
  },
  render: function () {
    var difficulty = this.state.difficulty;
    var difficultySets = this.getDifficultySets()[difficulty];

    return React.createElement("div", null, 
      React.createElement(BoardView, {difficulty: difficultySets}), 
      React.createElement(NavView, {difficulty: difficulty, onClick: this.handleDifficultyClick})
    )
  }
})

var NavView = React.createClass({displayName: "NavView",
  render: function () {
    var self = this;
    var difficulties = ['normal', 'hard', 'wtf?'];

    var options = difficulties.map(function (difficulty) {
      var classes = difficulty === self.props.difficulty ? 'active' : '';
      return React.createElement("li", {className: classes}, React.createElement("a", {href: "#", onClick: self.props.onClick.bind(this, difficulty), key: difficulty}, difficulty));
    });

    return (React.createElement("nav", {className: "sidebar"}, React.createElement("ul", null, options)));

  }
})

var BoardView = React.createClass({displayName: "BoardView",
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
      return (React.createElement("div", {className: className}, 
        
          row.map(function (col) {
            return React.createElement(CellView, {
              tile: col, 
              onCellClick: self.handleCellClickClick, 
              onCellGenerate: self.handleCellGenerate, 
              startGame: self.state.startGame, 
              endGame: self.state.endGame});
          })
        
      ));
    });

    var sizeClassName = 'board';
    sizeClassName += ' size-' + this.props.difficulty.size;

    return (
      React.createElement("div", {className: sizeClassName}, 
        React.createElement(ScoreBox, {totalClick: this.state.totalClick, effectiveClick: this.state.effectiveClick}), 
        cells, 
        React.createElement(Overlay, {boardState: this.state, show: this.state.showOverlay, onStart: this.startGame})
      )
    );
  }
});


var CellView = React.createClass({displayName: "CellView",
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
      React.createElement("span", {className: classes, onClick: this.handleClick}, '')
    );
  }
});


var Overlay = React.createClass({displayName: "Overlay",
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
      subWording = ((boardState.effectiveClick / boardState.duration).toFixed(2)) * 60 + ' EPM!';
      buttonWording = 'Retry';
      buttonClass = 'startButton b-green';
    }
    var classes = cs({
      'overlay': true,
      'visible': this.props.show,
      'hidden': !this.props.show
    });
    return (
      React.createElement("div", {className: classes}, 
        React.createElement("p", {className: "sub-message"}, subWording), 
        React.createElement("p", {className: "message"}, wording), 
        React.createElement("button", {className: buttonClass, onClick: this.handleClick}, buttonWording)
      )
    );
  }
});

var ScoreBox = React.createClass({displayName: "ScoreBox",
  render: function () {
    var percentage = this.props.effectiveClick / this.props.totalClick * 100;
    percentage = percentage ? Math.round(percentage) : 0;
    var totalClick = this.props.totalClick === undefined ? 0 : this.props.totalClick;
    var effectiveClick = this.props.effectiveClick === undefined ? 0 : this.props.effectiveClick;

    return React.createElement("div", {className: "score-box"}, 
      React.createElement(ScoreCircle, {percentage: percentage, number: effectiveClick, type: 'Effective Clicks'}), 
      React.createElement(ScoreCircle, {percentage: percentage, number: totalClick, type: 'Clicks'}), 
      React.createElement(ScoreCircle, {percentage: percentage, number: percentage, type: 'Percentage'})
    )
  }
});

var ScoreCircle = React.createClass({displayName: "ScoreCircle",
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
    return React.createElement("div", {className: className}, 
      React.createElement("span", null, number), 
      React.createElement("div", {className: "slice"}, 
        React.createElement("div", {className: "bar"}), 
        React.createElement("div", {className: "fill"})
      ), 
      React.createElement("span", {className: typeClassName}, this.props.type)
    )
  }

});

React.render(React.createElement(WrapperView, null), document.getElementById('board'));