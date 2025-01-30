import {Pawn, Bishop, Rook, Knight, King, Queen, Board, Coordinate, inCheck, getAvailableMoves, inCheckmate, inStalemate} from "../src/pieces"
import assert from "assert"

describe("Board", () => {
    describe("isEmpty", () => {
        it("Finds that empty space is empty", () => {
            const pieces = [
                new Pawn("White", 1, 6)
            ];
            const board = new Board(pieces);
            const coordinate = new Coordinate(6, 1);
            assert(board.isEmpty(coordinate), "Space is empty but board showed it was not");
        });
    
        it("Finds that non-empty space is not empty", () => {
            const pieces = [
                new Pawn("White", 1, 6)
            ];
            const board = new Board(pieces);
            const coordinate = new Coordinate(1, 6);
            assert(!board.isEmpty(coordinate), "Space is not empty but board showed it was");
        });

    });
    
    describe("getPieceAt", () => {
        it("Throws if a space is empty", () => {
            const pieces = [
                new Pawn("White", 1, 6)
            ];
            const board = new Board(pieces);
            const coordinate = new Coordinate(6, 1);
            assert.throws(() => board.getPieceAt(coordinate), "Did not throw for empty space");
        });

        it("Gives correct piece in a space", () => {
            const pieces = [
                new King("White", 1, 6)
            ];
            const board = new Board(pieces);
            const coordinate = new Coordinate(1, 6);
            assert(board.getPieceAt(coordinate) === pieces[0], "Returned an incorrect piece or threw an error");
        });

    });

    describe("getPieces", () => {
        it("Gives all pieces correctly", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Rook("Black", 0, 0),
                new King("White", 5, 7)
            ];

            const board = new Board(pieces);

            let is_in_board;
            for (let piece of board.getPieces()) {
                is_in_board = false;
                for (let original_piece of pieces) {
                    if (piece === original_piece) {
                        is_in_board = true;
                    }
                }
                assert(is_in_board, "Created extra piece");
            }

            for (let original_piece of pieces) {
                is_in_board = false;
                for (let piece of board.getPieces()) {
                    if (piece === original_piece) {
                        is_in_board = true;
                    }
                }
                assert(is_in_board, "Did not include original piece");
            }
        });

    });
 
});

describe("Pawn", () => {
    describe("getOpenMoves", () => {

        it("White pawn with no pieces around", () => {
            const pieces = [
                new Pawn("White", 1, 6)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(1, 5),
                new Coordinate(1, 4)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Black pawn with no pieces around", () => {
            const pieces = [
                new Pawn("Black", 1, 1)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(1, 2),
                new Coordinate(1, 3)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("White pawn with own piece ahead of it", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Rook("White", 1, 5)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]

            assert(pawn.getOpenMoves(board).length === 0, "Should be no open moves")

        });

        it("Black pawn with own piece ahead of it", () => {
            const pieces = [
                new Pawn("Black", 1, 1),
                new Rook("Black", 1, 2)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]

            assert(pawn.getOpenMoves(board).length === 0, "Should be no open moves")

        });

        it("White pawn with opposing piece ahead of it", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Rook("Black", 1, 5)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]

            assert(pawn.getOpenMoves(board).length === 0, "Should be no open moves")

        });

        it("Black pawn with opposing piece ahead of it", () => {
            const pieces = [
                new Pawn("Black", 1, 1),
                new Rook("White", 1, 2)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]

            assert(pawn.getOpenMoves(board).length === 0, "Should be no open moves")

        });

        it("White pawn with own piece two ahead of it", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Queen("White", 1, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(1, 5)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Black pawn with own piece two ahead of it", () => {
            const pieces = [
                new Pawn("Black", 1, 1),
                new Queen("Black", 1, 3)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(1, 2)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("White pawn with opposing piece to the right of it", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Queen("Black", 0, 5)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(0, 5),
                new Coordinate(1, 5),
                new Coordinate(1, 4)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Black pawn with opposing piece to the right of it", () => {
            const pieces = [
                new Pawn("Black", 1, 1),
                new Queen("White", 2, 2)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(2, 2),
                new Coordinate(1, 2),
                new Coordinate(1, 3)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("White pawn with opposing piece to the left of it", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Queen("Black", 2, 5)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(2, 5),
                new Coordinate(1, 5),
                new Coordinate(1, 4)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Black pawn with opposing piece to the left of it", () => {
            const pieces = [
                new Pawn("Black", 1, 1),
                new Queen("White", 0, 2)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(0, 2),
                new Coordinate(1, 2),
                new Coordinate(1, 3)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("White pawn with no pieces around, already moved", () => {
            const pieces = [
                new Pawn("White", 1, 5)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(1, 4)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Black pawn with no pieces around, already moved", () => {
            const pieces = [
                new Pawn("Black", 1, 2)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(1, 3)
            ];
            const pawn = pieces[0]
            const actualOpenMoves = pawn.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });


    });
    
    describe("move", () => {
        it("Move white pawn one forward", () => {
            const pieces = [
                new Pawn("White", 1, 6)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(1, 5), board);
            const expectedPieces = [
                new Pawn("White", 1, 5)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move black pawn one forward", () => {
            const pieces = [
                new Pawn("Black", 1, 1)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(1, 2), board);
            const expectedPieces = [
                new Pawn("Black", 1, 2)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move white pawn two forward", () => {
            const pieces = [
                new Pawn("White", 1, 6)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(1, 4), board);
            const expectedPieces = [
                new Pawn("White", 1, 4)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move black pawn two forward", () => {
            const pieces = [
                new Pawn("Black", 1, 1)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(1, 3), board);
            const expectedPieces = [
                new Pawn("Black", 1, 3)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move white pawn to edge of board", () => {
            const pieces = [
                new Pawn("White", 1, 1)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(1, 0), board);
            const expectedPieces = [
                new Queen("White", 1, 0)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move black pawn to edge of board", () => {
            const pieces = [
                new Pawn("Black", 1, 6)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(1, 7), board);
            const expectedPieces = [
                new Queen("Black", 1, 7)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move white pawn to take piece to the right", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Bishop("Black", 2, 5)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(2, 5), board);
            const expectedPieces = [
                new Pawn("White", 2, 5)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move black pawn to take piece to the right", () => {
            const pieces = [
                new Pawn("Black", 1, 1),
                new Bishop("White", 0, 2)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(0, 2), board);
            const expectedPieces = [
                new Pawn("Black", 0, 2)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move white pawn to take piece to the left", () => {
            const pieces = [
                new Pawn("White", 1, 6),
                new Bishop("Black", 0, 5)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(0, 5), board);
            const expectedPieces = [
                new Pawn("White", 0, 5)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move black pawn to take piece to the left", () => {
            const pieces = [
                new Pawn("Black", 1, 1),
                new Bishop("White", 2, 2)
            ];
            const board = new Board(pieces);
            const pawn = pieces[0]
            const actualBoard = pawn.move(new Coordinate(2, 2), board);
            const expectedPieces = [
                new Pawn("Black", 2, 2)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

    });

});

describe("Bishop", () => {
    describe("getOpenMoves", () => {

        it("Bishop with no pieces around", () => {
            const pieces = [
                new Bishop("White", 4, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 5),
                new Coordinate(6, 6),
                new Coordinate(7, 7),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(3, 5),
                new Coordinate(2, 6),
                new Coordinate(1, 7),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const bishop = pieces[0]
            const actualOpenMoves = bishop.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Bishop with opposing piece in its way", () => {
            const pieces = [
                new Bishop("Black", 4, 4),
                new Knight("White", 6, 6)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(6, 6),
                new Coordinate(5, 5),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(3, 5),
                new Coordinate(2, 6),
                new Coordinate(1, 7),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const bishop = pieces[0]
            const actualOpenMoves = bishop.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Bishop with own piece in its way", () => {
            const pieces = [
                new Bishop("White", 4, 4),
                new Knight("White", 6, 6)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 5),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(3, 5),
                new Coordinate(2, 6),
                new Coordinate(1, 7),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const bishop = pieces[0]
            const actualOpenMoves = bishop.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

    });
    
    describe("move", () => {
        it("Move bishop without taking piece", () => {
            const pieces = [
                new Bishop("White", 1, 6)
            ];
            const board = new Board(pieces);
            const bishop = pieces[0]
            const actualBoard = bishop.move(new Coordinate(0, 5), board);
            const expectedPieces = [
                new Bishop("White", 0, 5)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move bishop and take piece", () => {
            const pieces = [
                new Bishop("Black", 1, 6),
                new Knight("White", 3, 4)
            ];
            const board = new Board(pieces);
            const bishop = pieces[0]
            const actualBoard = bishop.move(new Coordinate(3, 4), board);
            const expectedPieces = [
                new Bishop("Black", 3, 4)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

    });

});

describe("Rook", () => {
    describe("getOpenMoves", () => {

        it("Rook with no pieces around", () => {
            const pieces = [
                new Rook("White", 4, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(6, 4),
                new Coordinate(7, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
            ];
            const rook = pieces[0]
            const actualOpenMoves = rook.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Rook with opposing piece in its way", () => {
            const pieces = [
                new Rook("Black", 4, 4),
                new Knight("White", 6, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(6, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
            ];
            const rook = pieces[0]
            const actualOpenMoves = rook.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Rook with own piece in its way", () => {
            const pieces = [
                new Rook("White", 4, 4),
                new Knight("White", 6, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
            ];
            const rook = pieces[0]
            const actualOpenMoves = rook.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

    });
    
    describe("move", () => {
        it("Move rook without taking piece", () => {
            const pieces = [
                new Rook("White", 1, 6)
            ];
            const board = new Board(pieces);
            const rook = pieces[0]
            const actualBoard = rook.move(new Coordinate(1, 3), board);
            const expectedPieces = [
                new Rook("White", 1, 3)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move rook and take piece", () => {
            const pieces = [
                new Rook("Black", 1, 6),
                new Knight("White", 4, 6)
            ];
            const board = new Board(pieces);
            const rook = pieces[0]
            const actualBoard = rook.move(new Coordinate(4, 6), board);
            const expectedPieces = [
                new Rook("Black", 4, 6)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

    });

});

describe("Queen", () => {
    describe("getOpenMoves", () => {

        it("Queen with no pieces around", () => {
            const pieces = [
                new Queen("White", 4, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(6, 4),
                new Coordinate(7, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
                new Coordinate(5, 5),
                new Coordinate(6, 6),
                new Coordinate(7, 7),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(3, 5),
                new Coordinate(2, 6),
                new Coordinate(1, 7),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const queen = pieces[0]
            const actualOpenMoves = queen.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Queen with opposing piece in its way vertically", () => {
            const pieces = [
                new Queen("Black", 4, 4),
                new Knight("White", 6, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(6, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
                new Coordinate(5, 5),
                new Coordinate(6, 6),
                new Coordinate(7, 7),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(3, 5),
                new Coordinate(2, 6),
                new Coordinate(1, 7),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const queen = pieces[0]
            const actualOpenMoves = queen.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Queen with own piece in its way vertically", () => {
            const pieces = [
                new Queen("White", 4, 4),
                new Knight("White", 6, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
                new Coordinate(5, 5),
                new Coordinate(6, 6),
                new Coordinate(7, 7),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(3, 5),
                new Coordinate(2, 6),
                new Coordinate(1, 7),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const queen = pieces[0]
            const actualOpenMoves = queen.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Queen with opposing piece in its way diagonally", () => {
            const pieces = [
                new Queen("White", 4, 4),
                new Knight("Black", 2, 6)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(6, 4),
                new Coordinate(7, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
                new Coordinate(5, 5),
                new Coordinate(6, 6),
                new Coordinate(7, 7),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(3, 5),
                new Coordinate(2, 6),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const queen = pieces[0]
            const actualOpenMoves = queen.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Queen with own piece in its way diagonally", () => {
            const pieces = [
                new Queen("White", 4, 4),
                new Knight("White", 3, 5)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 4),
                new Coordinate(6, 4),
                new Coordinate(7, 4),
                new Coordinate(3, 4),
                new Coordinate(2, 4),
                new Coordinate(1, 4),
                new Coordinate(0, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 6),
                new Coordinate(4, 7),
                new Coordinate(4, 3),
                new Coordinate(4, 2),
                new Coordinate(4, 1),
                new Coordinate(4, 0),
                new Coordinate(5, 5),
                new Coordinate(6, 6),
                new Coordinate(7, 7),
                new Coordinate(3, 3),
                new Coordinate(2, 2),
                new Coordinate(1, 1),
                new Coordinate(0, 0),
                new Coordinate(5, 3),
                new Coordinate(6, 2),
                new Coordinate(7, 1),
            ];
            const queen = pieces[0]
            const actualOpenMoves = queen.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });
    });
    
    describe("move", () => {
        it("Move queen without taking piece", () => {
            const pieces = [
                new Queen("White", 1, 6)
            ];
            const board = new Board(pieces);
            const queen = pieces[0]
            const actualBoard = queen.move(new Coordinate(1, 3), board);
            const expectedPieces = [
                new Rook("White", 1, 3)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move queen and take piece", () => {
            const pieces = [
                new Queen("Black", 1, 6),
                new Knight("White", 4, 6)
            ];
            const board = new Board(pieces);
            const queen = pieces[0]
            const actualBoard = queen.move(new Coordinate(4, 6), board);
            const expectedPieces = [
                new Queen("Black", 4, 6)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

    });

});

describe("Knight", () => {
    describe("getOpenMoves", () => {

        it("Knight with no pieces around", () => {
            const pieces = [
                new Knight("White", 4, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(6, 5),
                new Coordinate(5, 6),
                new Coordinate(6, 3),
                new Coordinate(5, 2),
                new Coordinate(2, 5),
                new Coordinate(3, 6),
                new Coordinate(2, 3),
                new Coordinate(3, 2),
            ];
            const knight = pieces[0]
            const actualOpenMoves = knight.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Knight with opposing piece in its way", () => {
            const pieces = [
                new Knight("Black", 4, 4),
                new Pawn("White", 5, 6)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(6, 5),
                new Coordinate(5, 6),
                new Coordinate(6, 3),
                new Coordinate(5, 2),
                new Coordinate(2, 5),
                new Coordinate(3, 6),
                new Coordinate(2, 3),
                new Coordinate(3, 2),
            ];
            const knight = pieces[0]
            const actualOpenMoves = knight.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("Knight with own piece in its way", () => {
            const pieces = [
                new Knight("White", 4, 4),
                new Queen("White", 2, 5)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(6, 5),
                new Coordinate(5, 6),
                new Coordinate(6, 3),
                new Coordinate(5, 2),
                new Coordinate(3, 6),
                new Coordinate(2, 3),
                new Coordinate(3, 2),
            ];
            const knight = pieces[0]
            const actualOpenMoves = knight.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

    });
    
    describe("move", () => {
        it("Move knight without taking piece", () => {
            const pieces = [
                new Knight("White", 1, 6)
            ];
            const board = new Board(pieces);
            const knight = pieces[0]
            const actualBoard = knight.move(new Coordinate(3, 5), board);
            const expectedPieces = [
                new Knight("White", 3, 5)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move rook and take piece", () => {
            const pieces = [
                new Knight("Black", 1, 6),
                new Queen("White", 2, 4)
            ];
            const board = new Board(pieces);
            const knight = pieces[0]
            const actualBoard = knight.move(new Coordinate(2, 4), board);
            const expectedPieces = [
                new Knight("Black", 2, 4)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

    });

});

describe("King", () => {
    describe("getOpenMoves", () => {

        it("King with no pieces around", () => {
            const pieces = [
                new King("White", 4, 4)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 5),
                new Coordinate(3, 5),
                new Coordinate(5, 3),
                new Coordinate(3, 3),
                new Coordinate(5, 4),
                new Coordinate(3, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 3),
            ];
            const king = pieces[0]
            const actualOpenMoves = king.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("King with opposing piece in its way", () => {
            const pieces = [
                new King("Black", 4, 4),
                new Pawn("White", 4, 5)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(5, 5),
                new Coordinate(3, 5),
                new Coordinate(5, 3),
                new Coordinate(3, 3),
                new Coordinate(5, 4),
                new Coordinate(3, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 3),
            ];
            const king = pieces[0]
            const actualOpenMoves = king.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

        it("King with own piece in its way", () => {
            const pieces = [
                new King("White", 4, 4),
                new Queen("White", 5, 5)
            ];
            const board = new Board(pieces);
            const expectedOpenMoves = [
                new Coordinate(3, 5),
                new Coordinate(5, 3),
                new Coordinate(3, 3),
                new Coordinate(5, 4),
                new Coordinate(3, 4),
                new Coordinate(4, 5),
                new Coordinate(4, 3),
            ];
            const king = pieces[0]
            const actualOpenMoves = king.getOpenMoves(board);

            compareCoordinates(actualOpenMoves, expectedOpenMoves);

        });

    });
    
    describe("move", () => {
        it("Move king without taking piece", () => {
            const pieces = [
                new King("White", 1, 6)
            ];
            const board = new Board(pieces);
            const king = pieces[0]
            const actualBoard = king.move(new Coordinate(2, 5), board);
            const expectedPieces = [
                new King("White", 2, 5)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

        it("Move king and take piece", () => {
            const pieces = [
                new King("Black", 1, 6),
                new Queen("White", 1, 5)
            ];
            const board = new Board(pieces);
            const king = pieces[0]
            const actualBoard = king.move(new Coordinate(1, 5), board);
            const expectedPieces = [
                new King("Black", 1, 5)
            ];
            const expectedBoard = new Board(expectedPieces);

            assert(compareBoards(actualBoard, expectedBoard));
    
        });

    });

});

describe("inCheck", () => {
    it("White in check", () => {
        const pieces = [
            new King("White", 5, 0),
            new King("Black", 5, 7),
            new Rook("Black", 7, 0)
        ];
        const board = new Board(pieces);
        assert(inCheck("White", board), "White is not in check but should be")
    });

    it("White not in check", () => {
        const pieces = [
            new King("White", 5, 0),
            new King("Black", 5, 7),
            new Bishop("Black", 5, 1)
        ];
        const board = new Board(pieces);
        assert(!inCheck("White", board), "White is in check but should not be")
    });

    it("Black in check", () => {
        const pieces = [
            new King("White", 5, 0),
            new King("Black", 5, 7),
            new Knight("White", 4, 5)
        ];
        const board = new Board(pieces);
        assert(inCheck("Black", board), "Black is not in check but should be")
    });

    it("White not in check", () => {
        const pieces = [
            new King("White", 5, 0),
            new King("Black", 5, 7),
            new Queen("White", 4, 5)
        ];
        const board = new Board(pieces);
        assert(!inCheck("Black", board), "Black is in check but should not be")
    });

});

describe("getAvailableMoves", () => {
    it("No opposing pieces can reach king", () => {
        const pieces = [
            new Bishop("White", 4, 4),
            new King("White", 6, 7),
            new King("Black", 1, 0),
            new Knight("Black", 1, 2)
        ];
        const board = new Board(pieces);
        const expectedAvailableMoves = [
            new Coordinate(5, 5),
            new Coordinate(6, 6),
            new Coordinate(7, 7),
            new Coordinate(3, 3),
            new Coordinate(2, 2),
            new Coordinate(1, 1),
            new Coordinate(0, 0),
            new Coordinate(3, 5),
            new Coordinate(2, 6),
            new Coordinate(1, 7),
            new Coordinate(5, 3),
            new Coordinate(6, 2),
            new Coordinate(7, 1),
        ];
        const bishop = pieces[0]
        const actualAvailableMoves = getAvailableMoves(bishop, board);

        compareCoordinates(actualAvailableMoves, expectedAvailableMoves);
    });

    it("Piece can take piece putting king in check", () => {
        const pieces = [
            new Bishop("White", 4, 5),
            new King("White", 4, 4),
            new King("Black", 1, 0),
            new Knight("Black", 5, 6)
        ];
        const board = new Board(pieces);
        const expectedAvailableMoves = [
            new Coordinate(5, 6),
        ];
        const bishop = pieces[0]
        const actualAvailableMoves = getAvailableMoves(bishop, board);

        compareCoordinates(actualAvailableMoves, expectedAvailableMoves);
    });

    it("Moving piece could put king in check", () => {
        const pieces = [
            new Queen("White", 4, 4),
            new King("White", 6, 6),
            new King("Black", 1, 0),
            new Queen("Black", 1, 1)
        ];
        const board = new Board(pieces);
        const expectedAvailableMoves = [
            new Coordinate(5, 5),
            new Coordinate(3, 3),
            new Coordinate(2, 2),
            new Coordinate(1, 1),
        ];
        const bishop = pieces[0]
        const actualAvailableMoves = getAvailableMoves(bishop, board);

        compareCoordinates(actualAvailableMoves, expectedAvailableMoves);
    });
});

describe("inCheckmate", () => {
    it("Not in check", () => {
        const pieces = [
            new King("White", 5, 0),
            new King("Black", 5, 7),
            new Rook("Black", 7, 1)
        ];
        const board = new Board(pieces);
        assert(!inCheckmate("White", board));
    });

    it("In check, but king can take a piece putting it in check", () => {
        const pieces = [
            new King("White", 5, 0),
            new King("Black", 5, 7),
            new Rook("Black", 7, 0),
            new Queen("Black", 6, 1)
        ];
        const board = new Board(pieces);
        assert(!inCheckmate("White", board));
    });

    it("In check, but other piece can take a piece putting king in check", () => {
        const pieces = [
            new King("White", 4, 0),
            new King("Black", 5, 7),
            new Rook("Black", 7, 0),
            new Queen("Black", 6, 2),
            new Bishop("White", 4, 3)
        ];
        const board = new Board(pieces);
        assert(!inCheckmate("White", board));
    });

    it("In checkmate", () => {
        const pieces = [
            new King("Black", 4, 0),
            new King("White", 5, 7),
            new Rook("White", 7, 0),
            new Queen("White", 6, 1)
        ];
        const board = new Board(pieces);
        assert(inCheckmate("Black", board));
    });
});

describe("inStalemate", () => {
    it("Not in check or stalemate", () => {
        const pieces = [
            new King("White", 5, 0),
            new King("Black", 5, 7),
            new Rook("Black", 7, 1)
        ];
        const board = new Board(pieces);
        assert(!inStalemate("White", board));
    });

    it("In checkmate", () => {
        const pieces = [
            new King("Black", 4, 0),
            new King("White", 5, 7),
            new Rook("White", 7, 0),
            new Queen("White", 6, 1)
        ];
        const board = new Board(pieces);
        assert(!inStalemate("Black", board));
    });

    it("In stalemate", () => {
        const pieces = [
            new King("Black", 5, 0),
            new King("White", 5, 7),
            new Rook("White", 7, 1),
            new Queen("White", 4, 5),
            new Rook("White", 6, 3)
        ];
        const board = new Board(pieces);
        assert(inStalemate("Black", board));
    });
});

function compareCoordinates(actualCoordinates: Coordinate[], expectedCoordinates: Coordinate[]): boolean {
    let is_open_move;
    for (let openMove of actualCoordinates) {
        is_open_move = false;
        for (let expectedOpenMove of expectedCoordinates) {
            if (openMove.equals(expectedOpenMove)) {
                is_open_move = true;
            }
        }
        assert(is_open_move, `Did not expect to find ${openMove.getString()} but did`);
    }

    for (let expectedOpenMove of expectedCoordinates) {
        is_open_move = false;
        for (let openMove of actualCoordinates) {
            if (openMove.equals(expectedOpenMove)) {
                is_open_move = true;
            }
        }
        assert(is_open_move, `Expected to find ${expectedOpenMove.getString()} but didn't`);
    }

    return true;
}

function compareBoards(actualBoard: Board, expectedBoard: Board): boolean {
    let containsPiece;
    for (let actualPiece of actualBoard.getPieces()) {
        containsPiece = false;
        for (let expectedPiece of expectedBoard.getPieces()) {
            if (actualPiece.position.equals(expectedPiece.position)) {
                if (actualPiece.color === expectedPiece.color) {
                    if (typeof(actualPiece) === typeof(expectedPiece)) {
                        containsPiece = true;
                    }
                }
                
            }
        }
        if (!containsPiece) {
            return false;
        }
    }

    for (let expectedPiece of expectedBoard.getPieces()) {
        containsPiece = false;
        for (let actualPiece of actualBoard.getPieces()) {
            if (actualPiece.position.equals(expectedPiece.position)) {
                if (actualPiece.color === expectedPiece.color) {
                    if (typeof(actualPiece) === typeof(expectedPiece)) {
                        containsPiece = true;
                    }
                }
                
            }
        }
        if (!containsPiece) {
            return false;
        }
    }

    return true;
}