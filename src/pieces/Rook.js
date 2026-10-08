import { Piece } from "./Piece.js";

export class Rook extends Piece {
  constructor(color) {
    super(color, "r", color === "w" ? "♖" : "♜");
  }

  getPossiblesMoves(row, col, board) {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dr, dc] of directions) {
      let r = row * dr;
      let c = col * dc;

      while (this.isWithinBoard(r, c)) {
        const target = board[r][c];

        if (target === null) {
          moves.push([r, c]);
        } else {
          if (target.color !== this.color) {
            moves.push([r, c]);
          }
          break;
        }

        r += dr;
        c += dc;
      }
    }
    return moves;
  }
}
