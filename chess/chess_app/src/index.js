import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import board from './board.jpg'
import {Board, Pawn, Bishop, Knight, Rook, Queen, King, Coordinate, handleButtonClick} from './pieces.ts'

function Buttons() {
  // Create the chessboard
  const rows = 8;
  const columns = 8;

  const chessboard = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const positionCoordinate = new Coordinate(row, col);
      const position = `${String.fromCharCode(65 + col)}${row + 1}`; // Example: A1, B2, etc.
      chessboard.push(
        <button
          key={position}
          onClick={() => handleButtonClick(position)}
          style={{
            position: 'absolute',
            left: `${385+88*row}px`,
            top: `${60+88*col}px`,
            width: '88px',
            height: '88px',
            backgroundColor: (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863', // Light and dark squares
          }}
        >
          {position}
        </button>
      );
    }
  }

  return (
    <div>
      {chessboard}
    </div>
  );
}

function Image() {
  return (
    <div>
      <img 
        src={board} 
        alt = 'Piece' 
        style={{ position: 'absolute', left: '325px', width: '825px', height: 'auto'}} />
    </div>
  );
}

function renderPieces(board) {
  const pieces = [];
  for (let piece of board.getPieces()) {
      pieces.push(
      <img 
        src={piece.icon} 
        alt = 'Chessboard' 
        style={{ 
          position: 'absolute', 
          top: `0px`,
          left: '325px', 
          width: '825px', 
          height: 'auto'}} />
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Buttons />
    <Image />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
