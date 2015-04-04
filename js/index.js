/** @jsx React.DOM */
var board = new Board(3, 500, 400);

var BoardView = React.createClass({
  getInitialState: function () {
    return {board: this.props.board};
  },
  handleCellClickClick: function(cell) {
    // TODO
  },
  render: function () {
    var self = this;
    var cells = this.state.board.cells.map(function (row) {
      return (<div className='row'>
        {
          row.map(function (col) {
            return <CellView tile={col} onCellClick={self.handleCellClickClick} />;
          })
        }
      </div>);
    });

    return (
      <div className='board'>
        {cells}
      </div>
    );
  }
});


var CellView = React.createClass({
  handleClick: function() {
      this.props.onCellClick(this);
  },
  render: function () {
    var cs = React.addons.classSet;
    var classes = cs({
      'cell': true,
      'tile b-red': this.props.tile !== null ? true : false
    });
    return (
      <span className={classes} onClick={this.handleClick}>{''}</span>
    );
  }
});

React.render(<BoardView board={board} />, document.getElementById('board'));