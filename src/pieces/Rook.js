import { Piece } from "./Piece.js";

export class Rook extends Piece {
  constructor(color) {
    super(color, "r", color === "w" ? "♖" : "♜");
  }

  getPossibleMoves(row, col, board) {
    const moves = []; // 1. Inicializar el arreglo de movimientos

    const directions = [
      [-1, 0], // Arriba
      [1, 0], // Abajo
      [0, -1], // Izquierda
      [0, 1], // Derecha
    ];

    for (const [dr, dc] of directions) {
      // 2. Sumar la dirección a la posición inicial (NO multiplicar)
      let r = row + dr;
      let c = col + dc;

      while (this.isWithinBoard(r, c)) {
        const target = board[r][c];

        if (target === null) {
          moves.push([r, c]);
        } else {
          if (target.color !== this.color) {
            moves.push([r, c]); // Captura pieza enemiga
          }
          break; // Detener el rayo si encuentra cualquier pieza
        }

        r += dr;
        c += dc;
      }
    }

    return moves;
  }
}
