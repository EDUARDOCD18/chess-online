import { Piece } from "./Piece";

export class Pawn extends Piece {
  constructor(color) {
    super(color, "p", color === "w" ? "♙" : "♟");
  }

  getPossiblesMoves(row, color, board) {
    const moves = [];
    // Dirección del avance: Blancas disminuyen fila (-1), Negras aumentan fila (+1)
    const direction = this.color === "w" ? -1 : 1;
    const startRow = this.color === "w" ? 6 : 1;

    // 1\ Avance simple de 1 casilla
    const forwardRow = row + direction;
    if (
      this.isWithinBoard(forwardRow, col) &&
      board[forwardRow][col] === null
    ) {
      moves.push([forwardRow, col]);
    }

    // 2. Avance doble inicial (solo si el paso de 1 casilla también está libre)
    const doubleForwardRow = row + direction * 2;
    if (row === startRow && board[doubleForwardRow][col] === null) {
      moves.push([doubleForwardRow, col]);
    }

    // 3. Capturas diagonales (Izquierda y Derecha)
    const captureCols = [col - 1, col + 1];
    for (const c of captureCols) {
      if (this.isWithinBoard(forwardRow, c)) {
        const target = board[forwardRow][c];

        // Solo captura si hay una pieza presente Y es del equipo contrario
        if (target !== null && target.color !== this.color) {
          moves.push([forwardRow, c]);
        }
      }
    }

    return moves;
  }
}
