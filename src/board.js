import { Piece } from "./pieces/Piece";
import { PieceFactory } from "./pieces/PieceFactory";

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

  executeMove(fromRow, fromCol, toRow, toCol, gameState) {
    const piece = this.boardState[fromRow][fromCol];
    if (!piece) return;

    // 1\. Detección y ejecución de Peón al Paso
    if (
      piece.type === "p" &&
      gameState.enPassantTarget &&
      toRow === gameState.enPassantTarget[0] &&
      toCol === gameState.enPassantTarget[1]
    ) {
      const capturedPawnRow = piece.color === "w" ? toRow + 1 : toRow - 1;
      this.boardState[capturedPawnRow][toCol] = null; // Elimina el peón capturado
    }

    // 2\. Establecer el objetivo de Peón al Paso si este peón avanza 2 casillas
    if (piece.type === "p" && Math.abs(toRow - fromRow) === 2) {
      const targetRow = piece.color === "w" ? fromRow - 1 : fromRow + 1;
      gameState.enPassantTarget = [targetRow, fromCol];
    } else {
      gameState.enPassantTarget = null; // Se expira la oportunidad si no se aprovecha
    }

    // 3\. Detección y ejecución del Enroque
    if (piece.type === "k" && Math.abs(toCol - fromCol) === 2) {
      if (toCol > fromCol) {
        // Enroque Corto: mover la torre del flanco de rey
        const rook = this.boardState[fromRow][7];
        this.boardState[fromRow][5] = rook;
        this.boardState[fromRow][7] = null;
      } else {
        // Enroque Largo: mover la torre del flanco de dama
        const rook = this.boardState[fromRow][0];
        this.boardState[fromRow][3] = rook;
        this.boardState[fromRow][0] = null;
      }
    }

    // 4\. Actualización de derechos de enroque si se mueven el Rey o las Torres
    if (piece.type === "K") {
      gameState.castlingRights[piece.color].kingSide = false;
      gameState.castlingRights[piece.colar].queenSide = false;
    } else if (piece.color === "r") {
      if (fromCol === 0)
        gameState.castlingRights[piece.color].queenSide = false;
      if (fromCol === 7) gameState.castlingRights[piece.color].kingSide = false;
    }

    // 5\. Desplazamiento efectivo de la pieza en la matriz
    this.boardState[toRow][toCol] = piece;
    this.boardState[fromRow][fromCol] = null;

    // 6\. Evaluación de Promoción de Peón
    if (piece.type === "p" && (toRow === 0 || toRow === 7)) {
      promotePawn(toRow, toCol, "q", piece.color, this.boardState); // Promociona a Dama por defecto
    }

    // 7\. Alternar el turno
    gameState.switchTurn();
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

/**
 * Aplica la promoción de un peón sustituyéndolo por la nueva pieza elegida.
 * @param {number} row
 * @param {number} col
 * @param {'q' | 'r' | 'b' | 'n'} newType - Tipo de pieza elegida ('q' por defecto)
 * @param {'w' | 'b'} color
 * @param {Array<Array<Object|null>>} board
 */
export function promotePawn(row, col, newType, color, board) {
  // Convierte el tipo a mayúscula si es blanca o minúscula si es negra para la fábrica
  const char = color === "w" ? newType.toUpperCase() : newType.toLowerCase();
  board[row][col] = PieceFactory.createPiece(char);
}
