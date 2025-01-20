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
     */
    getAvailableMoves(board: Board): Coordinate[];

    /**
     * @param newPosition position that this piece will be moved to
     * @param board representation of the current state of the board
     * 
     * @returns representation of the state of the board after making the given move
     * 
     * @throws if moving to the new position is not one of the available moves for 
     *         this piece given the current state of the board
     */
    move(newPosition: Coordinate, board: Board): Board;

    /**
     * @param newPosition position that this piece will be moved to
     * @param board representation of the current state of the board
     * 
     * @returns representation of the state of the board after making the given move
     * 
     * This function will just move the piece to that space without considering if it is legal
     */
    easyMove(newPosition: Coordinate, board: Board): Board;
}

export class Coordinate {
    /**
     * Immutable coordinate (xPosition, yPosition), 
     * with the top left corner of the board being (0,0)
     */

    public constructor(
        public readonly x: number,
        public readonly y: number
    ) {}

    /**
     * 
     * @returns true if this coordinate is on the board, false otherwise
     */
    public inBounds(): boolean {
        return this.x >= 0 && this.x < 8 && this.y >= 0 && this.y < 8;
    }

    /**
     * @param other second coordinate to check for equality with this coordinate
     * 
     * @returns true if coordinates represent the same space, false otherwise
     */
    public equals(other: Coordinate) {
        return this.x === other.x && this.y === other.y;
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
            return true;
        }
        throw new Error('Illegal coordinate');
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
     * @param coordinate coordinate of the space to check get the piece at
     * 
     * @returns the piece in that space, or 'Empty' if there is no piece there
     * 
     * @throws if the coordinate is not on the board
     */
    public getAt(coordinate: Coordinate): Piece | 'Empty' {

        if (coordinate.inBounds()) {
            for (let piece of this.pieces) {
                if (piece.position.equals(coordinate)) {
                    return piece;
                }
            }
            return 'Empty';
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
        x: number,
        y: number, 
    ) {
        this.position = new Coordinate(x, y);
        this.icon = color === 'White' ? "/images/whitePawn.png" : "/images/blackPawn.png";
    }

    public getAvailableMoves(board: Board): Coordinate[] {
        const availableMoves: Coordinate[] = new Array<Coordinate>();
        let forward = new Coordinate(this.position.x, this.position.y - 1);
        let left = new Coordinate(this.position.x - 1, this.position.y - 1);
        let right = new Coordinate(this.position.x + 1, this.position.y - 1);
        if (this.color === 'Black') {
            forward = new Coordinate(this.position.x, this.position.y + 1);
            left = new Coordinate(this.position.x - 1, this.position.y + 1);
            right = new Coordinate(this.position.x + 1, this.position.y + 1);
        }

        if (forward.inBounds()) {
            if (board.isEmpty(forward)) {
                let newBoard = this.easyMove(forward, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(forward);
                }
            }
        }

        if (left.inBounds()) {
            if (!board.isEmpty(left)) {
                if (this.color !== board.getPieceAt(left).color) {
                    let newBoard = this.easyMove(left, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(left);
                }
                }
            }
        }

        if (right.inBounds()) {
            if (!board.isEmpty(left)) {
                if (this.color !== board.getPieceAt(right).color) {
                    let newBoard = this.easyMove(right, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(right);
                }
                }
            }
        }

        return availableMoves;    
    }

    public easyMove(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Pawn(this.color, newPosition.x, newPosition.y);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }


    public move(newPosition: Coordinate, board: Board): Board {
        let validMove = false; // true if moving to newPosition is a valid move, false otherwise
        for (let validPosition of this.getAvailableMoves(board)) {
            if (newPosition.equals(validPosition)) {
                validMove = true;
            }
        }
        if (validMove) {
            const oldPieces = board.getPieces();
            const newPieces: Piece[] = [];
            for (let oldPiece of oldPieces) {
                if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                    newPieces.push(oldPiece);
                }
            }
            const addedPiece: Piece = new Pawn(this.color, newPosition.x, newPosition.y);;
            newPieces.push(addedPiece);
            return new Board(newPieces);
        }
        throw new Error('Illegal Move'); // moving to newPosition is not a valid move, so an error is thrown
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

    public getAvailableMoves(board: Board): Coordinate[] {
        const availableMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            let x = this.position.x + direction[0];
            let y = this.position.y + direction[1];
            let newPosition = new Coordinate(x, y);
            while (newPosition.inBounds() && board.isEmpty(newPosition)) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
                x += direction[0];
                y += direction[1];
                newPosition = new Coordinate(x, y);
            }
            if (newPosition.inBounds() && board.getPieceAt(newPosition).color !== this.color) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
            } 
        }

        return availableMoves;   
    }

    public easyMove(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Bishop(this.color, newPosition.x, newPosition.y);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

    public move(newPosition: Coordinate, board: Board): Board {
        let validMove = false; // true if moving to newPosition is a valid move, false otherwise
        for (let validPosition of this.getAvailableMoves(board)) {
            if (newPosition.equals(validPosition)) {
                validMove = true;
            }
        }
        if (validMove) {
            const oldPieces = board.getPieces();
            const newPieces: Piece[] = [];
            for (let oldPiece of oldPieces) {
                if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                    newPieces.push(oldPiece);
                }
            }
            const addedPiece: Piece = new Bishop(this.color, newPosition.x, newPosition.y);;
            newPieces.push(addedPiece);
            return new Board(newPieces);
        }
        throw new Error('Illegal Move'); // moving to newPosition is not a valid move, so an error is thrown
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

    public getAvailableMoves(board: Board): Coordinate[] {
        const availableMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let x = this.position.x + direction[0];
            let y = this.position.y + direction[1];
            let newPosition = new Coordinate(x, y);
            while (newPosition.inBounds() && board.isEmpty(newPosition)) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
                x += direction[0];
                y += direction[1];
                newPosition = new Coordinate(x, y);
            }
            if (newPosition.inBounds() && board.getPieceAt(newPosition).color !== this.color) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
            } 
        }

        return availableMoves;   
    }

    public easyMove(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Rook(this.color, newPosition.x, newPosition.y);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

    public move(newPosition: Coordinate, board: Board): Board {
        let validMove = false; // true if moving to newPosition is a valid move, false otherwise
        for (let validPosition of this.getAvailableMoves(board)) {
            if (newPosition.equals(validPosition)) {
                validMove = true;
            }
        }
        if (validMove) {
            const oldPieces = board.getPieces();
            const newPieces: Piece[] = [];
            for (let oldPiece of oldPieces) {
                if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                    newPieces.push(oldPiece);
                }
            }
            const addedPiece: Piece = new Rook(this.color, newPosition.x, newPosition.y);;
            newPieces.push(addedPiece);
            return new Board(newPieces);
        }
        throw new Error('Illegal Move'); // moving to newPosition is not a valid move, so an error is thrown
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

    public getAvailableMoves(board: Board): Coordinate[] {
        const availableMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let x = this.position.x + direction[0];
            let y = this.position.y + direction[1];
            let newPosition = new Coordinate(x, y);
            while (newPosition.inBounds() && board.isEmpty(newPosition)) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
                x += direction[0];
                y += direction[1];
                newPosition = new Coordinate(x, y);
            }
            if (newPosition.inBounds() && board.getPieceAt(newPosition).color !== this.color) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
            } 
        }

        return availableMoves;   
    }

    public easyMove(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Queen(this.color, newPosition.x, newPosition.y);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

    public move(newPosition: Coordinate, board: Board): Board {
        let validMove = false; // true if moving to newPosition is a valid move, false otherwise
        for (let validPosition of this.getAvailableMoves(board)) {
            if (newPosition.equals(validPosition)) {
                validMove = true;
            }
        }
        if (validMove) {
            const oldPieces = board.getPieces();
            const newPieces: Piece[] = [];
            for (let oldPiece of oldPieces) {
                if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                    newPieces.push(oldPiece);
                }
            }
            const addedPiece: Piece = new Queen(this.color, newPosition.x, newPosition.y);;
            newPieces.push(addedPiece);
            return new Board(newPieces);
        }
        throw new Error('Illegal Move'); // moving to newPosition is not a valid move, so an error is thrown
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

    public getAvailableMoves(board: Board): Coordinate[] {
        const availableMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
            let x = this.position.x + direction[0];
            let y = this.position.y + direction[1];
            let newPosition = new Coordinate(x, y);
            if (newPosition.inBounds()) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
            }
        }

        return availableMoves;   
    }

    public easyMove(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new King(this.color, newPosition.x, newPosition.y);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

    public move(newPosition: Coordinate, board: Board): Board {
        let validMove = false; // true if moving to newPosition is a valid move, false otherwise
        for (let validPosition of this.getAvailableMoves(board)) {
            if (newPosition.equals(validPosition)) {
                validMove = true;
            }
        }
        if (validMove) {
            const oldPieces = board.getPieces();
            const newPieces: Piece[] = [];
            for (let oldPiece of oldPieces) {
                if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                    newPieces.push(oldPiece);
                }
            }
            const addedPiece: Piece = new King(this.color, newPosition.x, newPosition.y);;
            newPieces.push(addedPiece);
            return new Board(newPieces);
        }
        throw new Error('Illegal Move'); // moving to newPosition is not a valid move, so an error is thrown
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

    public getAvailableMoves(board: Board): Coordinate[] {
        const availableMoves: Coordinate[] = new Array<Coordinate>();
        
        for (let direction of [[2, 1], [1, 2], [-2, 1], [-1, 2], [2, -1], [1, -2], [-2, -1], [-1, -2]]) {
            let x = this.position.x + direction[0];
            let y = this.position.y + direction[1];
            let newPosition = new Coordinate(x, y);
            if (newPosition.inBounds()) {
                let newBoard = this.easyMove(newPosition, board);
                if (!inCheck(this.color, newBoard)) {
                    availableMoves.push(newPosition);
                }
            }
        }

        return availableMoves;   
    }

    public easyMove(newPosition: Coordinate, board: Board): Board {
        const oldPieces = board.getPieces();
        const newPieces: Piece[] = [];
        for (let oldPiece of oldPieces) {
            if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                newPieces.push(oldPiece);
            }
        }
        const addedPiece: Piece = new Knight(this.color, newPosition.x, newPosition.y);;
        newPieces.push(addedPiece);
        return new Board(newPieces);
    }

    public move(newPosition: Coordinate, board: Board): Board {
        let validMove = false; // true if moving to newPosition is a valid move, false otherwise
        for (let validPosition of this.getAvailableMoves(board)) {
            if (newPosition.equals(validPosition)) {
                validMove = true;
            }
        }
        if (validMove) {
            const oldPieces = board.getPieces();
            const newPieces: Piece[] = [];
            for (let oldPiece of oldPieces) {
                if (!oldPiece.position.equals(newPosition) && !oldPiece.position.equals(this.position)) {
                    newPieces.push(oldPiece);
                }
            }
            const addedPiece: Piece = new Knight(this.color, newPosition.x, newPosition.y);
            newPieces.push(addedPiece);
            return new Board(newPieces);
        }
        throw new Error('Illegal Move'); // moving to newPosition is not a valid move, so an error is thrown
    }
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
            for (let availablePosition of piece.getAvailableMoves(board)) {
                if (availablePosition.equals(kingPosition)) {
                    return true
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
                for (let availableMove of piece.getAvailableMoves(board)) {
                    let newBoard = piece.move(availableMove, board);
                    if (!inCheck(color, newBoard)) {
                        return false;
                    }
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
                if (piece instanceof King) {
                    for (let availableMove of piece.getAvailableMoves(board)) {
                        let newBoard = piece.move(availableMove, board);
                        if (!inCheck(color, newBoard)) {
                            return false;
                        }
                    }
                } else {
                    if (piece.getAvailableMoves(board).length === 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    return false;
}






