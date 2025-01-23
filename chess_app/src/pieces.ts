interface Piece {
    /** 
     * Immutable piece at a given position on a chess board with a given color
     */

    readonly position: Coordinate; // X position of the piece, with the left side having lower x positions
    readonly color: 'White' | 'Black'; // color of the piece
    readonly icon: string;

    /**
     * @param board representation of the current state of the board
     * 
     * @returns list of coordinates that this piece could move to during its next turn
     * 
     * This function gets spaces a piece could move to without considering if that would
     * put the player in check.
     */
    getOpenMoves(board: Board): Coordinate[];

    /**
     * @param newPosition position that this piece will be moved to
     * @param board representation of the current state of the board
     * 
     * @returns representation of the state of the board after making the given move
     * 
     * This function will just move the piece to that space without considering if it is legal
     */
    move(newPosition: Coordinate, board: Board): Board;
}

export class Coordinate {
    /**
     * Immutable coordinate (xPosition, yPosition), 
     * with the top left corner of the board being (0,0)
     */

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
}

export class Board {
    /**
     * Immutable board with an array giving the pieces on the board and their positions
     */

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
    public firstMove: boolean
    public constructor(
        public readonly color: 'White' | 'Black',
        x: number,
        y: number, 
    ) {
        this.position = new Coordinate(x, y);
        this.icon = color === 'White' ? "/images/whitePawn.png" : "/images/blackPawn.png";
        this.firstMove = true;
    }

    public getOpenMoves(board: Board): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        let forward = new Coordinate(this.position.column, this.position.row - 1);
        let left = new Coordinate(this.position.column - 1, this.position.row - 1);
        let right = new Coordinate(this.position.column + 1, this.position.row - 1);
        let doubleForward = new Coordinate(this.position.column, this.position.row - 2);
        if (this.color === 'Black') {
            forward = new Coordinate(this.position.column, this.position.row + 1);
            left = new Coordinate(this.position.column - 1, this.position.row + 1);
            right = new Coordinate(this.position.column + 1, this.position.row + 1);
            doubleForward = new Coordinate(this.position.column, this.position.row + 2);
        }

        if (forward.inBounds()) {
            if (board.isEmpty(forward)) {
                openMoves.push(forward);
            }
        }

        if (this.firstMove) {
            if (board.isEmpty(forward) && board.isEmpty(doubleForward)) {
                openMoves.push(doubleForward);
            }
        }

        if (left.inBounds()) {
            if (!board.isEmpty(left)) {
                if (this.color !== board.getPieceAt(left).color) {
                    openMoves.push(left);
                }
            }
        }

        if (right.inBounds()) {
            if (!board.isEmpty(left)) {
                if (this.color !== board.getPieceAt(right).color) {
                    openMoves.push(right);
                }
            }
        }

        return openMoves;    
    }

    public move(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Pawn(this.color, newPosition.column, newPosition.row);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Bishop implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public constructor(
        public readonly color: 'White' | 'Black',
        x: number,
        y: number, 
    ) {
        this.position = new Coordinate(x, y);
        this.icon = color === 'White' ? "/images/whiteBishop.png" : "/images/blackBishop.png";
    }

    public getOpenMoves(board: Board): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            let x = this.position.column + direction[0];
            let y = this.position.row + direction[1];
            let newPosition = new Coordinate(x, y);
            while (newPosition.inBounds() && board.isEmpty(newPosition)) {
                openMoves.push(newPosition);
                x += direction[0];
                y += direction[1];
                newPosition = new Coordinate(x, y);
            }
            if (newPosition.inBounds() && board.getPieceAt(newPosition).color !== this.color) {
                openMoves.push(newPosition);
            } 
        }

        return openMoves;   
    }

    public move(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Bishop(this.color, newPosition.column, newPosition.row);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Rook implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public constructor(
        public readonly color: 'White' | 'Black',
        x: number,
        y: number, 
    ) {
        this.position = new Coordinate(x, y);
        this.icon = color === 'White' ? "/images/whiteRook.png" : "/images/blackRook.png";
    }

    public getOpenMoves(board: Board): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let x = this.position.column + direction[0];
            let y = this.position.row + direction[1];
            let newPosition = new Coordinate(x, y);
            while (newPosition.inBounds() && board.isEmpty(newPosition)) {
                openMoves.push(newPosition);
                x += direction[0];
                y += direction[1];
                newPosition = new Coordinate(x, y);
            }
            if (newPosition.inBounds() && board.getPieceAt(newPosition).color !== this.color) {
                openMoves.push(newPosition);
            } 
        }

        return openMoves;   
    }

    public move(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Rook(this.color, newPosition.column, newPosition.row);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Queen implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public constructor(
        public readonly color: 'White' | 'Black',
        x: number,
        y: number, 
    ) {
        this.position = new Coordinate(x, y);
        this.icon = color === 'White' ? "/images/whiteQueen.png" : "/images/blackQueen.png";
    }

    public getOpenMoves(board: Board): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let x = this.position.column + direction[0];
            let y = this.position.row + direction[1];
            let newPosition = new Coordinate(x, y);
            while (newPosition.inBounds() && board.isEmpty(newPosition)) {
                openMoves.push(newPosition);
                x += direction[0];
                y += direction[1];
                newPosition = new Coordinate(x, y);
            }
            if (newPosition.inBounds() && board.getPieceAt(newPosition).color !== this.color) {
                openMoves.push(newPosition);
            } 
        }

        return openMoves;   
    }

    public move(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Queen(this.color, newPosition.column, newPosition.row);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class King implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public constructor(
        public readonly color: 'White' | 'Black',
        x: number,
        y: number, 
    ) {
        this.position = new Coordinate(x, y);
        this.icon = color === 'White' ? "/images/whiteKing.png" : "/images/blackKing.png";
    }

    public getOpenMoves(board: Board): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let x = this.position.column + direction[0];
            let y = this.position.row + direction[1];
            let newPosition = new Coordinate(x, y);
            if (newPosition.inBounds()) {
                openMoves.push(newPosition);
            }
        }

        return openMoves;   
    }

    public move(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new King(this.color, newPosition.column, newPosition.row);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

}

export class Knight implements Piece {
    public readonly position: Coordinate;
    public readonly icon: string;
    public constructor(
        public readonly color: 'White' | 'Black',
        x: number,
        y: number, 
    ) {
        this.position = new Coordinate(x, y);
        this.icon = color === 'White' ? "/images/whiteKnight.png" : "/images/blackKnight.png";
    }

    public getOpenMoves(board: Board): Coordinate[] {
        const openMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[2, 1], [1, 2], [-2, 1], [-1, 2], [2, -1], [1, -2], [-2, -1], [-1, -2]]) {
            let x = this.position.column + direction[0];
            let y = this.position.row + direction[1];
            let newPosition = new Coordinate(x, y);
            if (newPosition.inBounds()) {
                openMoves.push(newPosition);
            }
        }

        return openMoves;   
    }

    public move(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Knight(this.color, newPosition.column, newPosition.row);;
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
    for (let openMove of piece.getOpenMoves(board)) {
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
 */
function inCheck(color: 'White' | 'Black', board: Board): boolean {
    let kingPosition: Coordinate = new Coordinate(-1, -1);
    for (let piece of board.getPieces()) {
        if (piece instanceof King && piece.color === color) {
            kingPosition = piece.position;
        }
    }

    for (let piece of board.getPieces()) {
        if (piece.color !== color) {
            for (let openPosition of piece.getOpenMoves(board)) {
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
    return false;
    // if (inCheck(color, board)) {
    //     for (let piece of board.getPieces()) {
    //         if (piece.color === color) {
    //             if (getAvailableMoves(piece,board).length !== 0) {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }
    // return false;
}

/**
 * @param color color of the player who may be in stalemate
 * @param board representation of the current state of the board
 * 
 * @returns true if the player of that color is in stalemate (and the game ends in a tie), false otherwise
 */
export function inStalemate(color: 'White' | 'Black', board: Board): boolean {
    return false;
    // if (!inCheck(color, board)) {
    //     for (let piece of board.getPieces()) {
    //         if (piece.color === color) {
    //             if (getAvailableMoves(piece, board).length !== 0) {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }
    // return false;
}






