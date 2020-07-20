import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//blame Skye
// let i = 0;
// setInterval(() => { console.log(`%cowo uwu xD rawr~ *pounces on you*${i++}`, "color: pink; font-weight: bold; font-size: 48px") })

/**
 * 1. Display the location for each move in the format (col, row) in the move history list.
 * 2. Bold the currently selected item in the move list.
 * 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
 * 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
 * 5. When someone wins, highlight the three squares that caused the win.
 * 6. When no one wins, display a message about the result being a draw.
 */

function Square(props) {
    return (
        
        <button className={props.squareName} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        let squareName = "square";
        console.log(this.props.winner)
        if (this.props.winner && this.props.winner.includes(i)) {
            console.log('shuold apply winner style')
            squareName = "winnerSquare"
        }
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                number={i}
                squareName={squareName}
            />
        );
    }

    render() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const squares = [];

            for (let j = 0; j < 3; j++) {
                squares.push(this.renderSquare(j + i * 3)) // add square to array
            }
            
            // add this row to row array
            rows.push(
                <div className="board-row">
                    {squares}
                </div>
            );
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                change: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            descending: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                change: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleOtherClick() {
        this.setState({
            descending: !this.state.descending
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
    
        const moves = history.map((step, move) => {
            const coords = [step.change % 3, Math.floor(step.change / 3)]; // #1
            const desc = move ?
            'Go to move #' + move + " | " + coords :
            'Go to game start';
            
            const shouldBold = move === this.state.stepNumber ? // #2
            <b>{desc}</b> :
            desc
            
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{shouldBold}</button>
                </li>
            );
        });

        if (this.state.descending) {
            moves.reverse()
        }

        let status;
        if (winner) {
            status = "Winner: " +  (this.state.xIsNext ? 'O' : 'X');
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    
                    <ol>
                        <button onClick={() => this.handleOtherClick()}>{this.state.descending ? "Sort Ascending" : "Sort Descending"}</button>
                        <p />
                        {moves}
                        </ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}
