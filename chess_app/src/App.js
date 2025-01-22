import { useState } from 'react';
import React from 'react';
import './App.css';
import {Board, Pawn, Bishop, Knight, Rook, Queen, King, Coordinate, getAvailableMoves, inCheckmate, inStalemate} from "./pieces.ts"

function Square({ row, column, onSquareClick }) {
  return (
    <button 
        key = {column + ', ' + row}
        onClick = {onSquareClick}
        style={{
          position: "absolute",
          left: `${385+88*row}px`,
          top: `${60+88*column}px`,
          width: "88px",
          height: "88px",
        }}
        >
        {column + ', ' + row}
      </button>
  );
}

function ChessBoard({board, color, selectedPiece, onPlay}) {

  function handleClick(row, column) {
      const position = new Coordinate(column, row);
  
      if (calculateWinner(board, color) === null) {
        if (selectedPiece !== null) {
          for (let availablePosition of selectedPiece.getAvailableMoves(board)) {
            if (position.equals(availablePosition)) {
              const newBoard = selectedPiece.easyMove(position);
              const newSelectedPiece = null;
              const newColor = color === "White" ? "Black" : "White";
              onPlay(newBoard, newSelectedPiece, newColor);
              return;
            }

          }
          
        }
  
        if (!board.isEmpty(position)) {
          const piece = board.getPieceAt(position);
          if (piece.color === color) {
            onPlay(board, piece, color)
          }
        }
      }
    }

    // const winner = calculateWinner(board, color);
    // let status;
    // if (winner) {
    //   if (winner === "Tie") {
    //     status = "Tie";
    //   } else {
    //     status = 'Winner: ' + winner;
    //   }
    // } else {
    //   status = 'Next player: ' + color;
    // }

    const rows = 8;
    const columns = 8;
  
    const buttons = [];
    const pieces = [];
    const availableMoves = [];
  
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const currentSpace = new Coordinate(column, row);
  
        if (!board.isEmpty(currentSpace)) {
          const piece = board.getPieceAt(currentSpace);
          pieces.push(
            <img
              key={`piece-${row}-${column}`}
              src={piece.icon}
              alt=""
              style={{
                position: "absolute",
                left: `${385 + 88 * column}px`,
                top: `${60 + 88 * row}px`,
                width: "88px",
                height: "88px",
                pointerEvents: "none",
              }}
            />
          );
        }
  
        buttons.push(
          <Square
            row={row}
            column={column}
            onSquareClick={() => handleClick(row, column)} // Captures row and column correctly
          />
        );
      }
    }
  
    if (selectedPiece !== null) {
      for (let availableMove of getAvailableMoves(selectedPiece, board)) {
        const row = availableMove.row;
        const col = availableMove.column;
        availableMoves.push(
          <img
            key={`available-${row}-${col}`}
            src="/images/redDot.png"
            alt=""
            style={{
              position: "absolute",
              left: `${385 + 88 * col}px`,
              top: `${60 + 88 * row}px`,
              width: "88px",
              height: "88px",
              pointerEvents: "none",
            }}
          />
        );
      }
    }

    let selectedText = 'No Piece Selected';
    if (selectedPiece !== null) {
      selectedText = selectedPiece.color + ' ' + typeof(selectedPiece) + ' ' + selectedPiece.position.column + ', ' + selectedPiece.position.row;
    }
  
    return (
      <>
        <div>
          {buttons}
          {/* <img
            src="/images/board.jpg"
            alt="Board"
            style={{
              position: "absolute",
              left: "325px",
              width: "825px",
              height: "auto",
              pointerEvents: "none",
            }}
          /> */}
          {pieces}
          {availableMoves}
        </div>
        <div className="status">{color}</div>
        <div className="selected">{selectedText}</div>
      </>
    );
}

export default function Game() {
  const startingPieces = new Board([
      new Rook("Black", 0, 0), 
      new Knight("Black", 1, 0),
      new Bishop("Black", 2, 0),
      new Queen("Black", 3, 0),
      new King("Black", 4, 0),
      new Bishop("Black", 5, 0),
      new Knight("Black", 6, 0),
      new Rook("Black", 7, 0),
      new Pawn("Black", 0, 1),
      new Pawn("Black", 1, 1),
      new Pawn("Black", 2, 1),
      new Pawn("Black", 3, 1),
      new Pawn("Black", 4, 1),
      new Pawn("Black", 5, 1),
      new Pawn("Black", 6, 1),
      new Pawn("Black", 7, 1),
      new Rook("White", 0, 7), 
      new Knight("White", 1, 7),
      new Bishop("White", 2, 7),
      new Queen("White", 3, 7),
      new King("White", 4, 7),
      new Bishop("White", 5, 7),
      new Knight("White", 6, 7),
      new Rook("White", 7, 7),
      new Pawn("White", 0, 6),
      new Pawn("White", 1, 6),
      new Pawn("White", 2, 6),
      new Pawn("White", 3, 6),
      new Pawn("White", 4, 6),
      new Pawn("White", 5, 6),
      new Pawn("White", 6, 6),
      new Pawn("White", 7, 6),
    ]);

  const [board, setBoard] = useState(startingPieces);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [color, setColor] = useState("White");

  function handlePlay(newBoard, newSelectedPiece, newColor) {
    setBoard(newBoard);
    setSelectedPiece(newSelectedPiece);
    setColor(newColor);
  }


  return (
    <div className="game-board">
      <ChessBoard board={board} color={color} selectedPiece = {selectedPiece} onPlay={handlePlay} />
    </div>
  );
}

function calculateWinner(board, color) {
  return null;
  // if (inStalemate(color, board)) {
  //   return "Tie";
  // }

  // if (inCheckmate(color, board)) {
  //   if (color === "White") {
  //     return "Black"
  //   }
  //   if (color === "Black") {
  //     return "White"
  //   }
  // }

  // return null;
}
