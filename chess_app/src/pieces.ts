interface Piece {
    /** 
     * Immutable piece at a given position on a chess board with a given color
     */

    readonly position: Coordinate;
    readonly color: 'White' | 'Black';
    readonly icon: string; // path to the image representing this piece
    readonly firstMove: boolean;
    readonly enPassant: boolean;

    /**
     * @param board representation of the current state of the board
     * 
     * @returns list of coordinates that this piece could move to during its next turn
     * 
     * This function gets spaces a piece could move to without considering if that would
     * put the player in check.
     */
    getOpenMoves(board: Board, castle?: boolean): Coordinate[];

    /**
     * @param newPosition position that this piece will be moved to
     * @param board representation of the current state of the board
     * 
     * @returns representation of the state of the board after making the given move
     * 
     * @throws if the new position is out of bounds
     * 
     * This function will just move the piece to that space without considering if it is legal
     */
    move(newPosition: Coordinate, board: Board): Board;
}

/**
 * Immutable coordinate (column, row), 
 * with the top left corner of the board being (0,0)
 */
export class Coordinate {
    public constructor(
        public readonly column: number,
        public readonly row: number
    ) {}

    /**
     * 
     * @returns true if this coordinate is on the board, false otherwise
     */
    public inBounds(): boolean {
        return this.column >= 0 && this.column < 8 && this.row >= 0 && this.row < 8;
    }

    /**
     * @param other second coordinate to check for equality with this coordinate
     * 
     * @returns true if coordinates represent the same space, false otherwise
     */
    public equals(other: Coordinate) {
        return this.column === other.column && this.row === other.row;
    }

    /**
     * 
     * @returns a string representation of this coordinate in the form (column, row)
     */
    public getString(): string {
        return `${this.column}, ${this.row}`
    }
}

/**
 * Immutable board with an array giving the pieces on the board and their positions
 */
export class Board {

    public constructor(
        private pieces: Array<Piece>
    ) {}

    /**
     * @param coordinate coordinate of the space to check whether there is a piece at
     * 
     * @returns true if there is no piece in that space, false otherwise
     * 
     * @throws if the coordinate is not on the board
     */
    public isEmpty(coordinate: Coordinate): boolean {

        if (coordinate.inBounds()) {
            for (let piece of this.pieces) {
                if (piece.position.equals(coordinate)) {
                    return false;
                }
            }
        } else {
            throw new Error("Coordinate out of bounds");
        }
        return true;
    }

    /**
     * @param coordinate Coordinate of the space to get the piece at
     * 
     * @returns The piece in that space
     * 
     * @throws if the coordinate is not on the board or there is no piece in that space
     */
    public getPieceAt(coordinate: Coordinate): Piece {

        if (coordinate.inBounds()) {
            for (let piece of this.pieces) {
                if (piece.position.equals(coordinate)) {
                    return piece;
                }
            }
            throw new Error('No Piece In Space');
        }
        throw new Error('Illegal coordinate');
    }

    /**
     * 
     * @returns a copy of the pieces array
     */
    public getPieces(): Array<Piece> {
        return this.pieces.slice();
    }
}

export class Pawn implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public constructor(
        public readonly color: 'White' | 'Black',
        column: number,
        row: number, 
        public readonly firstMove: boolean = true,
        public readonly enPassant: boolean = false
    ) {
        this.position = new Coordinate(column, row);
        this.icon = color === 'White' ? "/images/whitePawn.png" : "/images/blackPawn.png";
    }

    /**
     * @inheritdoc
     */
    public getOpenMoves(board: Board, castle = false): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        let forward = new Coordinate(this.position.column, this.position.row - 1);
        let left = new Coordinate(this.position.column - 1, this.position.row - 1);
        let right = new Coordinate(this.position.column + 1, this.position.row - 1);
        let doubleForward = new Coordinate(this.position.column, this.position.row - 2);
        let leftHorizontal = new Coordinate(this.position.column - 1, this.position.row);
        let rightHorizontal = new Coordinate(this.position.column + 1, this.position.row);
        if (this.color === 'Black') {
            forward = new Coordinate(this.position.column, this.position.row + 1);
            left = new Coordinate(this.position.column - 1, this.position.row + 1);
            right = new Coordinate(this.position.column + 1, this.position.row + 1);
            doubleForward = new Coordinate(this.position.column, this.position.row + 2);
        }

        // Moves forward normally
        if (forward.inBounds()) {
            if (board.isEmpty(forward)) {
                openMoves.push(forward);
            }
        }

        // Can move two forward on its first move
        if (this.firstMove) {
            if (board.isEmpty(forward) && board.isEmpty(doubleForward)) {
                openMoves.push(doubleForward);
            }
        }


        // Can take an opposing piece to the left
        if (left.inBounds()) {
            if (!board.isEmpty(left)) {
                if (this.color !== board.getPieceAt(left).color) {
                    openMoves.push(left);
                }
            }
        }

        // Can take a pawn to the left horizontally with en passant
        if (leftHorizontal.inBounds()) {
            if (!board.isEmpty(leftHorizontal)) {
                if (this.color !== board.getPieceAt(leftHorizontal).color) {
                    if (board.getPieceAt(leftHorizontal) instanceof Pawn) {
                        if (board.getPieceAt(leftHorizontal).enPassant) {
                            openMoves.push(left)
                        }
                    }
                }
            }
        }


        // Can take an opposing piece to the right
        if (right.inBounds()) {
            if (!board.isEmpty(right)) {
                if (this.color !== board.getPieceAt(right).color) {
                    openMoves.push(right);
                }
            }
        }

        // Can take a pawn to the right horizontally with en passant
        if (rightHorizontal.inBounds()) {
            if (!board.isEmpty(rightHorizontal)) {
                if (this.color !== board.getPieceAt(rightHorizontal).color) {
                    if (board.getPieceAt(rightHorizontal) instanceof Pawn) {
                        if (board.getPieceAt(rightHorizontal).enPassant) {
                            openMoves.push(right)
                        }
                    }
                }
            }
        }

        return openMoves;    
    }

    /**
     * @inheritdoc
     */
    public move(newPosition: Coordinate, board: Board): Board {
        if (!newPosition.inBounds()) {
            throw new Error("Moving piece out of bounds");
        }

        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            // Will be set to true if the pawn takes an opposing pawn with en passant
            let takesEnPassant = false;

            if (board.isEmpty(newPosition)) {

                if (oldPiece instanceof Pawn) {
                    if (oldPiece.enPassant) {
                        if (oldPiece.position.column === newPosition.column) {

                            if (this.color === "White") {

                                if (oldPiece.position.row === newPosition.row + 1) {
                                    takesEnPassant = true;
                                }
                            }

                            if (this.color === "Black") {

                                if (oldPiece.position.row === newPosition.row - 1) {
                                    takesEnPassant = true;
                                }
                            }
                        }
                    }
                }
            }
            
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                if (!takesEnPassant) {
                    // Updates so that pawns can no longer be taken with en passant from their last move
                    if (oldPiece instanceof Pawn) {
                        const updatedPawn = new Pawn(oldPiece.color, oldPiece.position.column, oldPiece.position.row, oldPiece.firstMove, false);
                        newPieces.push(updatedPawn);
                    } else {
                        newPieces.push(oldPiece);
                    }
                }
            }
        }

        let enPassant = false
        if (this.color === "White") {
            if (this.position.row === 6) {
                if (newPosition.row === 4) {
                    enPassant = true;
                }
            }
        }

        if (this.color === "Black") {
            if (this.position.row === 1) {
                if (newPosition.row === 3) {
                    enPassant = true;
                }
            }
        }
        
        let addedPiece: Piece = new Pawn(this.color, newPosition.column, newPosition.row, false, enPassant);
        if (this.color === "White" && newPosition.row === 0) {
            addedPiece = new Queen(this.color, newPosition.column, newPosition.row);
        }
        if (this.color === "Black" && newPosition.row === 7) {
            addedPiece = new Queen(this.color, newPosition.column, newPosition.row);
        }
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Bishop implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public readonly enPassant: boolean;
    public readonly firstMove: boolean;
    public constructor(
        public readonly color: 'White' | 'Black',
        column: number,
        row: number, 
    ) {
        this.position = new Coordinate(column, row);
        this.icon = color === 'White' ? "/images/whiteBishop.png" : "/images/blackBishop.png";
        this.firstMove = false;
        this.enPassant = false;
    }

    /**
     * @inheritdoc
     */
    public getOpenMoves(board: Board, castle = false): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            let newColumn = this.position.column + direction[0];
            let newRow = this.position.row + direction[1];
            let newPosition = new Coordinate(newColumn, newRow);
            while (newPosition.inBounds()) {
                if (board.isEmpty(newPosition)) {
                    openMoves.push(newPosition);
                    newColumn += direction[0];
                    newRow += direction[1];
                    newPosition = new Coordinate(newColumn, newRow);
                } else {
                    break;
                }
            }
            if (newPosition.inBounds() && board.getPieceAt(newPosition).color !== this.color) {
                openMoves.push(newPosition);
            } 
        }

        return openMoves;   
    }

    /**
     * @inheritdoc 
     */
    public move(newPosition: Coordinate, board: Board): Board {
        if (!newPosition.inBounds()) {
            throw new Error("Moving piece out of bounds");
        }
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                // Updates so that pawns can no longer be taken with en passant from their last move
                if (oldPiece instanceof Pawn) {
                    const updatedPawn = new Pawn(oldPiece.color, oldPiece.position.column, oldPiece.position.row, oldPiece.firstMove, false);
                    newPieces.push(updatedPawn);
                } else {
                    newPieces.push(oldPiece);
                }
            }
        }
        const addedPiece: Piece = new Bishop(this.color, newPosition.column, newPosition.row);
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Rook implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public readonly enPassant: boolean;
    public constructor(
        public readonly color: 'White' | 'Black',
        column: number,
        row: number, 
        public readonly firstMove: boolean = true
    ) {
        this.position = new Coordinate(column, row);
        this.icon = color === 'White' ? "/images/whiteRook.png" : "/images/blackRook.png";
        this.enPassant = false;
    }

    /**
     * @inheritdoc
     */
    public getOpenMoves(board: Board, castle = false): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let newColumn = this.position.column + direction[0];
            let newRow = this.position.row + direction[1];
            let newPosition = new Coordinate(newColumn, newRow);
            while (newPosition.inBounds()) {
                if (board.isEmpty(newPosition)) {
                    openMoves.push(newPosition);
                    newColumn += direction[0];
                    newRow += direction[1];
                    newPosition = new Coordinate(newColumn, newRow);
                } else {
                    break;
                }
            }
            if (newPosition.inBounds()) {
                if (board.getPieceAt(newPosition).color !== this.color) {
                    openMoves.push(newPosition);
                }
            } 
        }

        return openMoves;   
    }

    /**
     * @inheritdoc
     */
    public move(newPosition: Coordinate, board: Board): Board {
        if (!newPosition.inBounds()) {
            throw new Error("Moving piece out of bounds");
        }
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                // Updates so that pawns can no longer be taken with en passant from their last move
                if (oldPiece instanceof Pawn) {
                    const updatedPawn = new Pawn(oldPiece.color, oldPiece.position.column, oldPiece.position.row, oldPiece.firstMove, false);
                    newPieces.push(updatedPawn);
                } else {
                    newPieces.push(oldPiece);
                }
            }
        }
        const addedPiece: Piece = new Rook(this.color, newPosition.column, newPosition.row, false);
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Queen implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public readonly enPassant: boolean;
    public readonly firstMove: boolean;
    public constructor(
        public readonly color: 'White' | 'Black',
        column: number,
        row: number, 
    ) {
        this.position = new Coordinate(column, row);
        this.icon = color === 'White' ? "/images/whiteQueen.png" : "/images/blackQueen.png";
        this.firstMove = false;
        this.enPassant = false;
    }

    /**
     * @inheritdoc
     */
    public getOpenMoves(board: Board, castle = false): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let newColumn = this.position.column + direction[0];
            let newRow = this.position.row + direction[1];
            let newPosition = new Coordinate(newColumn, newRow);
            while (newPosition.inBounds()) {
                if (board.isEmpty(newPosition)) {
                    openMoves.push(newPosition);
                    newColumn += direction[0];
                    newRow += direction[1];
                    newPosition = new Coordinate(newColumn, newRow);
                } else {
                    break;
                }
            }
            if (newPosition.inBounds()) {
                if (board.getPieceAt(newPosition).color !== this.color) {
                    openMoves.push(newPosition);
                }
            } 
        }

        return openMoves;   
    }

    /**
     * @inheritdoc
     */
    public move(newPosition: Coordinate, board: Board): Board {
        if (!newPosition.inBounds()) {
            throw new Error("Moving piece out of bounds");
        }
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                // Updates so that pawns can no longer be taken with en passant from their last move
                if (oldPiece instanceof Pawn) {
                    const updatedPawn = new Pawn(oldPiece.color, oldPiece.position.column, oldPiece.position.row, oldPiece.firstMove, false);
                    newPieces.push(updatedPawn);
                } else {
                    newPieces.push(oldPiece);
                }
            }
        }
        const addedPiece: Piece = new Queen(this.color, newPosition.column, newPosition.row);
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class King implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public readonly enPassant: boolean;
    public constructor(
        public readonly color: 'White' | 'Black',
        column: number,
        row: number, 
        public readonly firstMove: boolean = true
    ) {
        this.position = new Coordinate(column, row);
        this.icon = color === 'White' ? "/images/whiteKing.png" : "/images/blackKing.png";
        this.enPassant = false;
    }

    /**
     * @inheritdoc
     */
    public getOpenMoves(board: Board, castle: boolean = true): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let newColumn = this.position.column + direction[0];
            let newRow = this.position.row + direction[1];
            let newPosition = new Coordinate(newColumn, newRow);
            let isOpenMove = true;
            if (newPosition.inBounds()) {
                if (!board.isEmpty(newPosition)) {
                    if (board.getPieceAt(newPosition).color === this.color) {
                        isOpenMove = false;
                    }
                }

                if (isOpenMove) {
                    openMoves.push(newPosition);
                }
            }
        }

        if (castle) {
            if (this.firstMove) {
                let canQueensideCastle = true;
                let canKingsideCastle = true;

                let queensideCoordinate = new Coordinate(0, 7);
                let kingsideCoordinate = new Coordinate(7, 7);
                
                if (this.color === "Black") {
                    queensideCoordinate = new Coordinate(0, 0);
                    kingsideCoordinate = new Coordinate(7, 0);
                }

                if (!board.isEmpty(queensideCoordinate)) {
                    if (board.getPieceAt(queensideCoordinate) instanceof Rook) {
                        if (board.getPieceAt(queensideCoordinate).firstMove) {
                            for (let column = 4; column >= 2; column--) {
                                const middlePosition = new Coordinate(column, this.position.row);
                                if (!board.isEmpty(middlePosition)) {
                                    canQueensideCastle = false;
                                }
                                if (inCheck(this.color, this.move(middlePosition, board))) {
                                    canQueensideCastle = false;
                                }
                            }
                            if (canQueensideCastle) {
                                openMoves.push(new Coordinate(2, this.position.row));
                            }
                        }
                    }
                }
                

                if (!board.isEmpty(kingsideCoordinate)) {
                    if (board.getPieceAt(kingsideCoordinate) instanceof Rook) {
                        if (board.getPieceAt(kingsideCoordinate).firstMove) {
                            for (let column = 4; column <= 6; column++) {
                                const middlePosition = new Coordinate(column, this.position.row);
                                if (!board.isEmpty(middlePosition)) {
                                    canKingsideCastle = false;
                                }
                                if (inCheck(this.color, this.move(middlePosition, board))) {
                                    canKingsideCastle = false;
                                }
                            }
                            if (canKingsideCastle) {
                                openMoves.push(new Coordinate(6, this.position.row));
                            }
                        }
                    }
                }
                
            }
        }

        return openMoves;   
    }

    /**
     * @inheritdoc
     */
    public move(newPosition: Coordinate, board: Board): Board {
        if (!newPosition.inBounds()) {
            throw new Error("Moving piece out of bounds");
        }
        let queensideCastle = false;
        let kingsideCastle = false;
        if (this.firstMove && newPosition.equals(new Coordinate(2, this.position.row))) {
            queensideCastle = true;
        }
        if (this.firstMove && newPosition.equals(new Coordinate(6, this.position.row))) {
            kingsideCastle = true;
        }
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                // Updates so that pawns can no longer be taken with en passant from their last move
                if (oldPiece instanceof Pawn) {
                    const updatedPawn = new Pawn(oldPiece.color, oldPiece.position.column, oldPiece.position.row, oldPiece.firstMove, false);
                    newPieces.push(updatedPawn);
                } else if (oldPiece instanceof Rook) {
                    if (queensideCastle) {
                        if (oldPiece.position.equals(new Coordinate(0, this.position.row))) {
                            let updatedRook = new Rook(oldPiece.color, 3, this.position.row);
                            newPieces.push(updatedRook);
                        }
                    } else if (kingsideCastle) {   
                        if (oldPiece.position.equals(new Coordinate(7, this.position.row))) {
                            let updatedRook = new Rook(oldPiece.color, 5, this.position.row);
                            newPieces.push(updatedRook);
                        }
                    } else {
                        newPieces.push(oldPiece);
                    }
                } else {
                    newPieces.push(oldPiece);
                }
            }
        }
        const addedPiece: Piece = new King(this.color, newPosition.column, newPosition.row, false);
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Knight implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public readonly enPassant: boolean;
    public readonly firstMove: boolean;
    public constructor(
        public readonly color: 'White' | 'Black',
        column: number,
        row: number, 
    ) {
        this.position = new Coordinate(column, row);
        this.icon = color === 'White' ? "/images/whiteKnight.png" : "/images/blackKnight.png";
        this.firstMove = false;
        this.enPassant = false;
    }

    /**
     * @inheritdoc
     */
    public getOpenMoves(board: Board, castle = false): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[2, 1], [1, 2], [-2, 1], [-1, 2], [2, -1], [1, -2], [-2, -1], [-1, -2]]) {
            let newColumn = this.position.column + direction[0];
            let newRow = this.position.row + direction[1];
            let newPosition = new Coordinate(newColumn, newRow);
            let isOpenMove = true;
            if (newPosition.inBounds()) {
                if (!board.isEmpty(newPosition)) {
                    if (board.getPieceAt(newPosition).color === this.color) {
                        isOpenMove = false;
                    }
                }

                if (isOpenMove) {
                    openMoves.push(newPosition);
                }
            }
        }

        return openMoves;   
    }

    /**
     * @inheritdoc
     */
    public move(newPosition: Coordinate, board: Board): Board {
        if (!newPosition.inBounds()) {
            throw new Error("Moving piece out of bounds");
        }
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                // Updates so that pawns can no longer be taken with en passant from their last move
                if (oldPiece instanceof Pawn) {
                    const updatedPawn = new Pawn(oldPiece.color, oldPiece.position.column, oldPiece.position.row, oldPiece.firstMove, false);
                    newPieces.push(updatedPawn);
                } else {
                    newPieces.push(oldPiece);
                }
            }
        }
        const addedPiece: Piece = new Knight(this.color, newPosition.column, newPosition.row);
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }
}

/**
 * 
 * @param piece Piece being moved
 * @param board Current state of the board
 * @returns Positions the piece can legally move to without putting its king in check
 */
export function getAvailableMoves(piece: Piece, board: Board): Coordinate[] {
    const availableMoves: Coordinate[] = new Array<Coordinate>();
    for (let openMove of piece.getOpenMoves(board, true)) {
        if (!inCheck(piece.color, piece.move(openMove, board))) {
            availableMoves.push(openMove);
        }
    }

    return availableMoves;

}

/**
 * @param color color of the player who may be in check
 * @param board representation of the current state of the board
 * 
 * @returns true if the player of that color is in check, false otherwise
 * 
 * @throws if no king is found
 */
export function inCheck(color: 'White' | 'Black', board: Board): boolean {
    let noKingFound = true;
    let kingPosition: Coordinate = new Coordinate(-1, -1);
    for (let piece of board.getPieces()) {
        if (piece instanceof King && piece.color === color) {
            kingPosition = piece.position;
            noKingFound = false;
        }
    }

    if (noKingFound) {
        throw new Error("Must have a king");
    }

    for (let piece of board.getPieces()) {
        if (piece.color !== color) {
            for (let openPosition of piece.getOpenMoves(board, false)) {
                if (openPosition.equals(kingPosition)) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * @param color color of the player who may be in checkmate
 * @param board representation of the current state of the board
 * 
 * @returns true if the player of that color is in checkmate (and loses), false otherwise
 */
export function inCheckmate(color: 'White' | 'Black', board: Board): boolean {
    if (inCheck(color, board)) {
        for (let piece of board.getPieces()) {
            if (piece.color === color) {
                if (getAvailableMoves(piece, board).length !== 0) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

/**
 * @param color color of the player who may be in stalemate
 * @param board representation of the current state of the board
 * 
 * @returns true if the player of that color is in stalemate (and the game ends in a tie), false otherwise
 */
export function inStalemate(color: 'White' | 'Black', board: Board): boolean {
    if (!inCheck(color, board)) {
        for (let piece of board.getPieces()) {
            if (piece.color === color) {
                if (getAvailableMoves(piece, board).length !== 0) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}






