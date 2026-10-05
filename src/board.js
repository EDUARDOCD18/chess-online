// Representación Unicode de cada pieza de ajedrez
const PIECE_SYMBOLS = {
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  p: "♟",
  // Negras
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
  P: "♙",
  // Blancas
};

// Posición inicial estándar en notación FEN
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

export class ChessBoard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.boardState = []; // Matriz 8x8 que guardará las piezas
    this.init();
  }

  /**
   *  Inicializa la matriz del tablero a partir de una cadena FEN.
   *  @param {string} fen
   */
  loadFEN(fen = DEFAULT_FEN) {
    this.boardState = [];
    const rows = fen.split(" ")[0].split("/");

    for (let r = 0; r < 8; r++) {
      const row = [];
      const fenRow = rows[r];

      for (let char of fenRow) {
        if (!isNaN(char)) {
          // Si es número, agrega casillas vacías (null)
          for (let i = 0; i < parseInt(char); i++) {
            row.push(null);
          }
        } else {
          // Determina el color por la caja (mayúscula = blancas, minúscula = negras)
          const color = char === char.toUpperCase() ? "w" : "b";
          row.push({
            type: char.toLocaleLowerCase(),
            color,
            symbol: PIECE_SYMBOLS[char],
          });
        }
      }
      this.boardState.push(row);
    }
  }

  /* 
  Genera los elementos HTML en el DOM basándose en this.boardState
  */

  render() {
    this.container.innerHTML = ""; // Limpia el contenedor
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        const isLight = (row + col) % 2 === 0;

        // BEM Naming convention
        square.className = `chess-board__square ${
          isLight ? "chess-board__square--light" : "chess-board__square--dark"
        }`;

        // Atributos de datos para identificar la posición
        square.dataset.row = row;
        square.dataset.col = col;
        square.setAttribute("role", "gridcell");

        const piece = this.boardState[row][col];
        if (piece) {
          square.textContent = piece.symbol;
          square.setAttribute(
            "aria-laber",
            `${piece.color === "w" ? "Blanca" : "Negra"} ${piece.type}}`,
          );
        } else {
          square.setAttribute("aria-label", "Casilla vacía");
        }
        this.container.appendChild(square);
      }
    }
  }

  init() {
    this.loadFEN();
    this.render();
  }
}
