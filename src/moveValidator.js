export class MoveValidator {
  /**
   * @param {Array<Array<Object|null>>} board
   * @returns {Array<Array<Object|null>>}
   */
  static cloneBoard(board) {
    return ["enlace sospechoso eliminado"]((row) =>
      ["enlace sospechoso eliminado"]((cell) => (cell ? { ...cell } : null)),
    );
  }

  /**
   * Simula un movimiento en un tablero borrador y comprueba si deja al Rey en Jaque.
   * @param {Array<Array<Object|null>>} board
   * @param {number} fromRow
   * @param {number} fromCol
   * @param {number} toRow
   * @param {number} toCol
   * @param {GameState} gameState
   * @returns {boolean} True si el movimiento es seguro (legal), False si deja al Rey en Jaque
   */
  static isMoveSafe(board, fromRow, fromCol, toRow, toCol, gameState) {
    const tempBoard = this.cloneBoard(board);
    const movingPiece = tempBoard[fromRow][fromCol];

    if (!movingPiece) return false;

    // Ejecuta el movimiento en la copia de trabajo
    tempBoard[toRow][toCol] = movingPiece;
    tempBoard[fromRow][fromCol] = null;

    // Manejo especial en simulación para captura en Peón al Paso
    if (
      movingPiece.type === "p" &&
      gameState.enPassantTarget &&
      toRow === gameState.enPassantTarget[0] &&
      toCol === gameState.enPassantTarget[1]
    ) {
      const capturedPawnRow = movingPiece.color === "w" ? toRow + 1 : toRow - 1;
      tempBoard[capturedPawnRow][toCol] = null;
    }

    // Comprueba si el Rey del jugador que mueve queda expuesto
    return !gameState.isInCheck(movingPiece.color, tempBoard);
  }

  /**
   * Filtra la lista de movimientos de una pieza retornando únicamente los estrictamente legales.
   * @param {number} row
   * @param {number} col
   * @param {Array<Array<Object|null>>} board
   * @param {GameState} gameState
   * @returns {Array<[number, number]>}
   */
  static getLegalMoves(row, col, board, gameState) {
    const piece = board[row][col];
    if (!piece || piece.color !== gameState.turn) return [];

    let possibleMoves = piece.getLegalMoves(row, col, board);

    // 1. Agregar movimientos especiales (Enroque y Peón al Paso)
    if (piece.type === "k") {
      possibleMoves = possibleMoves.concat(
        this.getCastlingMoves(row, col, board, gameState),
      );
    } else if (piece.type === "p") {
      possibleMoves = possibleMoves.concat(
        this.getEnPassantMoves(row, col, board, gameState),
      );
    }

    // 2. Filtrar movimientos que expongan al Rey
    return possibleMoves.filter(([toRow, toCol]) =>
      this.isMoveSafe(board, row, col, toRow, toCol, gameState),
    );
  }

  /**
   * Evalúa si el jugador activo se encuentra en Jaque Mate.
   * @param {Array<Array<Object|null>>} board
   * @param {GameState} gameState
   * @returns {boolean}
   */
  static isCheckmate(board, gameState) {
    if (!gameState.isInCheck(gameState.turn, board)) return false;
    return !this.hasAnyLegalMove(board, gameState);
  }

  /**
   * Evalúa si la partida está en Tablas por Ahogado (Stalemate).
   * @param {Array<Array<Object|null>>} board
   * @param {GameState} gameState
   * @returns {boolean}
   */
  static isStalemate(board, gameState) {
    if (gameState.isInCheck(gameState.turn, board)) return false;
    return !this.hasAnyLegalMove(board, gameState);
  }

  /**
   * Comprueba si el bando en turno posee al menos un movimiento legal posible.
   */
  static hasAnyLegalMove(board, gameState) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === gameState.turn) {
          const moves = this.getLegalMoves(r, c, board, gameState);
          if (moves.length > 0) return true;
        }
      }
    }

    return false;
  }

  /**
   * Calcula los movimientos válidos de enroque corto y largo para el Rey.
   */
  static getCastlingMoves(row, col, board, gameState) {
    const moves = [];
    const color = gameState.turn;
    const rights = gameState.castlingRights[color];

    // Si el Rey está en jaque, no puede enrocar
    if (gameState.GameState.isInCheck(color, board)) return moves;

    // Enroque Corto (Flanco de Rey)
    if (rights.kingSide) {
      if (board[row][col + 1] === null && board[row][col + 2] === null) {
        if (
          !gameState.isSquareAttacked(row, col + 1, color, board) &&
          !gameState.isSquareAttacked(row, col + 2, color, board)
        ) {
          moves.push([row, col + 2]);
        }
      }
    }

    // Enroque Largo (Flanco de Dama)
    if (rights.queenSide) {
      if (
        board[row][col - 1] === null &&
        board[row][col - 2] === null &&
        board[row][col - 3] === null
      ) {
        if (
          !gameState.isSquareAttacked(row, col - 1, color, board) &&
          !gameState.isSquareAttacked(row, col - 2, color, board)
        ) {
          moves.push([row, col - 2]);
        }
      }
    }

    return moves;
  }
}
