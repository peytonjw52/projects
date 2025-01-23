import {Rook, King, Board, getAvailableMoves} from "../src/pieces.ts"
import assert from "assert"

describe("pawn", () => {
    
})

const pieces = [
    new Rook("White", 0, 0),
    new King("White", 1, 0),
    new King("Black", 7, 7),
];

const rook = pieces[0]
const board = new Board(pieces);


for (let coordinate of getAvailableMoves(rook, board)) {
    console.log(coordinate.column + ", " + coordinate.row);
}