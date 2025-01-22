function GameBoard({board, color, selectedPiece, winner, onPlay}) {
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
  
    const startingColor = "White";
    const startingSelectedPiece = null;
    const startingWinner = null;
  
    const [state, setState] = useState([startingPieces, startingColor, startingSelectedPiece, startingWinner]);
  
    function handleButtonClick(row, column) {
      const position = new Coordinate(column, row);
      const [board, color, selectedPiece, winner] = state;
  
      if (winner === null) {
        if (selectedPiece !== null && position in selectedPiece.getAvailableMoves(board)) {
          const newBoard = selectedPiece.move(position);
          const newColor = color === "White" ? "Black" : "White";
          const newSelectedPiece = null;
          let newWinner = null;
  
          if (inStalemate(newColor, newBoard)) {
            newWinner = "Tie";
          }
          if (inCheckmate(newColor, newBoard)) {
            newWinner = color;
          }
  
          setState([newBoard, newColor, newSelectedPiece, newWinner]);
          return;
        }
  
        let newSelectedPiece = selectedPiece;
        if (!board.isEmpty(position)) {
          const piece = board.getPieceAt(position);
          if (piece.color === color) {
            if (selectedPiece && piece.position.equals(selectedPiece.position)) {
              newSelectedPiece = null;
            } else {
              newSelectedPiece = piece;
            }
          } else {
            newSelectedPiece = null;
          }
        }
  
        setState([board, color, newSelectedPiece]);
      }
    }
  
    const [board, color, selectedPiece, winner] = state;
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
            key={`button-${row}-${column}`}
            row={row}
            column={column}
            onClick={() => handleButtonClick(row, column)} // Captures row and column correctly
          />
        );
      }
    }
  
    if (selectedPiece !== null) {
      for (let availableMove of selectedPiece.getAvailableMoves(board)) {
        const row = availableMove.y;
        const col = availableMove.x;
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
  
    return (
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
    );
  }
  
  
  function Square({row, column, onClick}) {
    return (
      <button 
        onClick = {onClick}
        style={{
          position: "absolute",
          left: `${385+88*row}px`,
          top: `${60+88*column}px`,
          width: "88px",
          height: "88px",
        }}
        >
        
      </button>
    )
  }
  
  function Game() {
  
  }