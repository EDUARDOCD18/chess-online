export class GameState {
  constructor() {
    this.turn = "w"; // 'w' para Blancas, 'b' para Negras
    this.enPassantTarget = null; // Coordenada [row, col] si un peón avanzó 2 casillas en el turno anterior
    this.castlingRights = {
      w: { kingSide: true, queenSide: true },
      b: { kingSide: true, queenSide: true },
    };
    this.halfMoveClock = 0; // Regla de los 50 movimientos
    this.fullMoverNumber = 1; // Contador de jugadas completas
  }

  /**
   * Cambia el turno del jugador activo.
   */

  switchTurn() {
    this.turn = this.turn === "w" ? "b" : "w";
    if (this.turn === "w") {
      this.fullMoverNumber++;
    }
  }

  /**
   * Localiza las coordenadas [row, col] del Rey de un color específico en el tablero.
   * @param {'w' | 'b'} color
   * @param {Array<Array<Object|null>>} board
   * @returns {[number, number]|null}
   */
  findKing(color, board) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === "k" && piece.color === color) {
          return [r, c];
        }
      }
    }

    return null;
  }

  /**
   * Evalúa si una casilla específica está siendo atacada por el bando enemigo.
   * @param {number} row
   * @param {number} col
   * @param {'w' | 'b'} defenderColor - Color del jugador atacado
   * @param {Array<Array<Object|null>>} board
   * @returns {boolean}
   */
  isSquareAttacked(row, col, defenderColor, board) {
    const attackerColor = defenderColor === "w" ? "b" : "w";

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === attackerColor) {
          // Obtiene movimientos pseudo-legales de la pieza enemiga
          const moves = piece.getPossibleMoves(r, c, board);

          // Tratamiento especial para el peón enemigo (solo ataca en diagonales)
          if (piece.type === "p") {
            const direction = piece.color === "w" ? -1 : 1;
            const pawnAttacks = [
              [r + direction, c - 1],
              [r + direction, c + 1],
            ];
            if (pawnAttacks.some(([ar, ac]) => ar === row && ac === col)) {
              return true;
            }
          } else {
            if (moves.some(([mr, mc]) => mr === row && mc === col)) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * Verifica si el Rey del jugador activo se encuentra actualmente en Jaque.
   * @param {'w' | 'b'} color
   * @param {Array<Array<Object|null>>} board
   * @returns {boolean}
   */
  isInCheck(color, board) {
    const kingPos = this.findKing(color, board);
    if (!kingPos) return false;
    return this.isSquareAttacked(kingPos[0], kingPos[1], color, board);
  }
}
