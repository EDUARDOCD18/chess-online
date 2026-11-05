export class UIRenderer {
  constructor(boardContainer) {
    this.container = boardContainer;
  }

  clearHighlights() {
    const squares = this.container.querySelectorAll(".chess-board__square");

    squares.forEach((sq) => {
      sq.classList.remove(
        "chess-board__square--selected",
        "chess-board__square--possible-move",
        "chess-board__square--capture",
        "chess-board__square--dragging",
      );
    });
  }

  highlightsLegalMoves(selectedRow, selectedCol, legalMoves, boardState) {
    this.clearHighlights();

    const originSquare = this.getSquareElement(selectedRow, selectedCol);
    if (originSquare) {
      originSquare.classList.add("chess-board__square--selected");
    }

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

  updateCheckWarning(kingPos) {
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

  getSquareElement(row, col) {
    return this.container.querySelector(
      `[data-row="${row}"][data-col="${col}"]`,
    );
  }
}
