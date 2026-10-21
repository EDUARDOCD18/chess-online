export class UIRenderer {
  /**
   * @param {HTMLElement} boardContainer - Elemento contenedor #chess-board
   */
  constructor(boardContainer) {
    this.container = boardContainer;
  }

  /**
   * Remueve todas las clases CSS de resaltado activo en las casillas del tablero.
   */
  clearHighlights() {
    const squares = this.container.querySelectorAll(".chess-board__square");

    squares.forEach((squares) => {
      squares.classList.remove(
        "chess-board__square--selected",
        "chess-board__square--possible-move",
        "chess-board__square--capture",
        "chess-board__square--dragging",
      );
    });
  }

  /**
   * Resalta la casilla seleccionada y las casillas de destino legalmente permitidas.
   * @param {number} selectedRow
   * @param {number} selectedCol
   * @param {Array<[number, number]>} legalMoves - Lista de coordenadas [row, col]
   * @param {Array<Array<Object|null>>} boardState - Matriz actual del tablero
   */
  highlightsLegalMoves(selectedRow, selectedCol, legalMoves, boardState) {
    this.clearHighlights();

    // 1\. Resaltar la casilla origen
    const originSquare = this.getSquareElement(selectedRow, selectedCol);
    if (originSquare) {
      originSquare.classList.add("chess-board__square--selected");
    }

    // 2\. Resaltar los destinos válidos
    legalMoves.forEach(([r, c]) => {
      const square = this.getSquareElement(r, c);
      if (square) {
        const isCapture = boardState[r][c] !== null;
        if (isCapture) {
          square.classList.add("chess-board__square--capture");
        } else {
          square.classList.add("chess-board__square--possible-move");
        }
      }
    });
  }

  /**
   * Aplica o remueve la advertencia visual de Jaque sobre la casilla del Rey.
   * @param {[number, number]|null} kingPos - Coordenadas [row, col] del Rey en jaque
   */
  updateCheckWarning(kingPos) {
    // Limpia cualquier advertencia previa de jaque
    const prevCheck = this.container.querySelector(
      ".chess-board__square--check",
    );
    if (prevCheck) {
      prevCheck.classList.remove("chess-board__square--check");
    }

    if (kingPos) {
      const [r, c] = kingPos;
      const square = this.getSquareElement(r, c);
      if (square) {
        square.classList.add("chess-board__square--check");
      }
    }
  }

  /**
   * Helper para obtener el nodo del DOM correspondiente a una coordenada [row, col].
   * @param {number} row
   * @param {number} col
   * @returns {HTMLElement|null}
   */
  getSquareElement(row, col) {
    return this.container.querySelector(
      `[data-row="${row}"][data-col="${col}"]`,
    );
  }
}
