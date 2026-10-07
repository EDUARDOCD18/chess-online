import { Piece } from "./Piece";

export class Bishop extends Piece {
  constructor(color) {
    super(color, "b", color === "w" ? "♗" : "♝");
  }

  getPossiblesMoves(row, col, board) {
    const moves = [];
    // Direcciones diagonales: [deltaRow, deltaCol]
    const directions = [
      [-1, -1],
      [-1, 1], // Arriba-Izquierda, Arriba-Derecha
      [1, -1],
      [1, 1], // Abajo-Izquierda, Abajo-Derecha]
    ];

    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;

      while (this.isWithinBoard(r, c)) {
        const target = board[r][c];

        if (target === null) {
          // Casilla vacía: movimiento válido, continuar deslizando
          moves.push([r, c]);
        } else {
          if (target.color !== this.color) {
            // Pieza enemiga: captura válida, pero detiene el deslizamiento
            moves.push([r, c]);
          }
          // Pieza aliada u enemiga: se bloquea el paso más allá
          break;
        }

        r += dr;
        c += dc;
      }
    }

    return moves;
  }
}
