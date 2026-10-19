import { Piece } from "./Piece.js";

export class King extends Piece {
  constructor(color) {
    super(color, "n", color === "w" ? "♔" : "♚");
  }

  getPossibleMoves(row, col, board) {
    const moves = []; // 1. Inicializar arreglo
    const offsets = [
      [-2, -1], [-2, 1],
      [-1, -2], [-1, 2],
      [1, -2],  [1, 2],
      [2, -1],  [2, 1],
    ];

    for (const [dr, dc] of offsets) {
      const r = row + dr;
      const c = col + dc;

      // 2. Ejecutar la función con sus argumentos (r, c)
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