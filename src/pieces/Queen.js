import { Piece } from "./Piece.js";
import { Bishop } from "./Bishop.js";
import { Rook } from "./Rook.js";

export class Queen extends Piece {
  constructor(color) {
    super(color, "q", color === "w" ? "♕" : "♛");
  }

  getPossiblesMoves(row, col, board) {
    // La Dama combina las direcciones diagonales (Alfil) y ortogonales (Torre)
    const bishopMoves = new Bishop(this.color).getPossiblesMoves(
      row,
      col,
      board,
    );
    const rookMoves = new Rook(this.color).getPossiblesMoves(row, col, board);

    return [...bishopMoves, ...rookMoves];
  }
}
