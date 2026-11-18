import { Piece } from "./Piece.js";

export class King extends Piece {
  constructor(color) {
    super(color, "k", color === "w" ? "♔" : "♚");
  }

  getPossibleMoves(row, col, board) {
    const moves = [];
    const offsets = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dr, dc] of offsets) {
      const r = row + dr;
      const c = col + dc;

      if (this.isWithinBoard(r, c)) {
        const target = board[r][c];

        if (target === null || target.color !== this.color) {
          moves.push([r, c]);
        }
      }
    }

    return moves;
  }
}