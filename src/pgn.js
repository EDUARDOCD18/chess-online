export class PGNGenerator {
  constructor() {
    this.history = []; // Arreglo de objetos { moveNumber, white, black }
    this.rawMoves = []; // Historial de movimientos individuales
  }
  /**
   * Convierte coordenadas de matriz [row, col] a casillas algebraicas (ej: [7, 4] -> 'e1').
   * @param {number} row
   * @param {number} col
   * @returns {string}
   */
  static coordsToAlgebraic(row, col) {
    const file = String.fromCharCode(97 + col); // 0 -> 'a', 1 -> 'b', ..., 7 -> 'h'
    const rank = 8 - row; // 0 -> '8', 7 -> '1'
    return `${file}${rank}`;
  }

  /**
   * Construye la cadena en Notación Algebraica para un movimiento dado.
   * @param {Object} moveData
   * @returns {string} Cadena formateada (ej: "Nf3", "exd5", "O-O")
   */
  formatMove(moveData) {
    const {
      piece,
      from,
      to,
      isCapture,
      isCastlin,
      isPromotion,
      isCheck,
      isCheckmate,
      promotedTo,
    } = moveData;

    // 1\. Manejo del Enroque
    if (isCastlin) {
      return to[1] > from[1] ? "O-O" : "O-O-O";
    }

    let notation = "";
    const destSquare = PGNGenerator.coordsToAlgebraic(to[0], to[1]);
    const pieceTypeUpper = piece.type.toUpperCase();

    // 2. Prefijo de Pieza
    // Si el peón captura, lleva la letra de la columna de origen (ej: "exd5")
    if (isCapture) {
      const fromFile = String.fromCharCode(97 + from[1]);
      notation += `${fromFile}x`;
    } else {
      notation += pieceTypeUpper;
      if (isCapture) notation += "x";
    }

    // 3\. Casilla Destino
    notation += destSquare;

    // 4\. Promoción de Peón
    if (isPromotion && promotedTo) {
      notation += `=${promotedTo.toUpperCase()}`;
    }

    // 5\. Jaque y Jaque Mate
    if (isCheckmate) {
      notation += "#";
    } else if (isCheck) {
      notation += "0";
    }

    return notation;
  }

  /**
   * Registra una nueva jugada en la notación de la partida.
   * @param {Object} moveData
   */
  addMove(moveData) {
    const algebraic = this.formatMove(moveData);
    this.rawMoves.push(algebraic);

    // CORRECCIÓN: Usar 'moveData.piece' y comparación '==='
    const isWhite = moveData.piece.color === "w";

    if (isWhite) {
      const moveNumber = Math.floor(this.rawMoves.length / 2) + 1;
      this.history.push({
        number: moveNumber,
        white: algebraic,
        black: "",
      });
    } else {
      const lastEntry = this.history[this.history.length - 1];
      if (lastEntry) {
        lastEntry.black = algebraic;
      }
    }

    return algebraic;
  }

  /**
   * Genera el texto completo de la partida en formato de archivo .pgn
   * @returns {string}
   */

  exportPGN() {
    let pgn = `[Evento "Ajedrez Winter Arc"]\n`;
    pgn += `[Sitio "Localhost Web"]\n`;
    pgn += `[Date "${new Date().toISOString().split("T")[0]}"]\n`;
    pgn += `[Resultado "*"]\n\n`;

    this.history.forEach((entry) => {
      pgn += `${entry.number}. ${entry.white} ${entry.black} `.trim() + " ";
    });

    return pgn.trim();
  }

  /**
   * Reinicia el historial de notación.
   */

  reset() {
    this.history = [];
    this.rawMoves = [];
  }
}
