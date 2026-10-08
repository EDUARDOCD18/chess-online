import { Piece } from "./Piece.js";

export class King extends Piece {
  constructor(color) {
    super(color, "k", color === "w" ? "♔" : "♚");
  }

  getPossiblesMoves(row, col, board) {
    const moves = [];
    // 8 casillas adyacentes rodeando al Rey
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

      if (this.isWithinBoard) {
        const target = board[r][c];

        if (target === null || target.color !== this.color) {
          moves.push([r, c]);
        }
      }
    }

    return moves;
  }
}
