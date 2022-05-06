import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ backgroundColor: props.winner ? 'lightgreen' : null }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        winner={winner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const cols = [];
      for (let j = 0; j < 3; j++) {
        cols.push(
          this.renderSquare(i * 3 + j, this.props.winner?.includes(i * 3 + j))
        );
      }
      rows.push(
        <div key={i} className="board-row">
          {cols}
        </div>
      );
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moveLocation: [null, null],
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      stepsSortDirection: 'asc',
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const column = (i % 3) + 1;
    const row = Math.floor(i / 3) + 1;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        { squares, moveLocation: [column === 0 ? 3 : column, row] },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggleStepsSortDirection() {
    this.setState({
      stepsSortDirection:
        this.state.stepsSortDirection === 'asc' ? 'desc' : 'asc',
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const endGame = calculateEndGame(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move + ` (${step.moveLocation})`
        : 'Go to game start';
      return (
        <li key={move}>
          <button
            style={{
              fontWeight: move === this.state.stepNumber ? 'bold' : 'normal',
            }}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else if (endGame) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleStepsSortDirection()}>
            Sort
            {this.state.stepsSortDirection === 'asc'
              ? ' Descending'
              : ' Ascending'}
          </button>
          <ol>
            {this.state.stepsSortDirection === 'desc' ? moves.reverse() : moves}
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

function calculateEndGame(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}
