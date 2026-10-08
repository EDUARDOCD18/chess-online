import { Piece } from "./Piece.js";

export class Knight extends Piece {
  constructor(color) {
    super(color, "n", color === "w" ? "♘" : "♞");
  }

  getPossiblesMoves(row, col, board) {
    // Las 8 posiciones posibles en "L"
    const offsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const [dr, dc] of offsets) {
      const r = row + dr;
      const c = col + dc;

      if (this.isWithinBoard(r, c)) {
        const target = board[r][c];

        // Puede mover si la casilla está vacía o contiene una pieza enemiga
        if (target === null || target.color !== this.color) {
          moves.push([r, c]);
        }
      }
    }

    return moves;
  }
}
