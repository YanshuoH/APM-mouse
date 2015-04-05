/** @jsx React.DOM */
var BoardView = React.createClass({displayName: "BoardView",
  getInitialState: function () {
    return {
      board: new Board(3, 1000, 2000),
      showOverlay: true
    };
  },

  startGame: function (overlay) {
    this.setState({
      board: this.state.board,
      showOverlay: false
    });
  },

  handleCellClickClick: function (cell) {
    // TODO: statistics
  },

  handleCellGenerate: function (cell) {
    // TODO: check if board's cells have all tiles
    if (this.state.board.checkCells()) {
      this.props.endGame = true;
      this.setState(this.getInitialState());

      // Stop cell interval
      return true;
    }
  },

  render: function () {
    var self = this;
    var cells = this.state.board.cells.map(function (row) {
      return (React.createElement("div", {className: "row"}, 
        
          row.map(function (col) {
            return React.createElement(CellView, {
              tile: col, 
              onCellClick: self.handleCellClickClick, 
              onCellGenerate: self.handleCellGenerate, 
              endGame: self.props.endGame});
          })
        
      ));
    });

    return (
      React.createElement("div", {className: "board"}, 
        cells, 
        React.createElement(Overlay, {board: this.state.board, show: this.state.showOverlay, onStart: this.startGame})
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
      this.props.onCellClick(this);
      this.state.tile.setHide();
      this.setState({ tile: this.state.tile });
  },

  // Core function for tiles generation and callbacks to board
  componentWillReceiveProps: function (oldProps, newProps) {
    if (oldProps.endGame === true) {
      return;
    }
    var self = this;
    // Generate tiles by input interval of board
    self.props.intervalVariable = setInterval(function () {
      // Random generation
      if (oldProps.tile.getRandomBoolean()) {
        // show tile and update the rendering
        oldProps.tile.setShow();
        self.setState({ tile: oldProps.tile });

        // Callback function in board, check if the game is over
        if (self.props.onCellGenerate(oldProps.tile)) {
          clearInterval(self.props.intervalVariable);
          console.log('game ends');
        }
      }
    }, oldProps.tile.interval);
  },

  render: function () {
    var cs = React.addons.classSet;
    var classes = cs({
      'cell': true,
      'tile b-red': this.state.tile.hasShown() ? true : false
    });
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
    var board = this.props.board;
    // TODO: is first start of already end
    this.props.buttonWording = 'Start';
    this.props.wording = 'GO GO GO';

    var classes = cs({
      'overlay': true,
      'visible': this.props.show,
      'hidden': !this.props.show
    });
    return (
      React.createElement("div", {className: classes}, 
        React.createElement("p", {className: "message"}, this.props.wording), 
        React.createElement("button", {className: "startButton b-lblue", onClick: this.handleClick}, this.props.buttonWording)
      )
    )
  }
});

React.render(React.createElement(BoardView, null), document.getElementById('board'));