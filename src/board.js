import { Piece } from "./pieces/Piece";
import { PieceFactory } from "./pieces/PieceFactory";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

export class ChessBoard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.boardState = [];
    this.init();
  }

  loadFEN(fen = DEFAULT_FEN) {
    this.boardState = [];
    const rows = fen.split(" ")[0].split("/");

    for (let r = 0; r < 8; r++) {
      const row = [];
      const fenRow = rows[r];

      for (let char of fenRow) {
        if (!isNaN(char)) {
          for (let i = 0; i < parseInt(char); i++) {
            row.push(null);
          }
        } else {
          // ✅ Ahora carga instancias reales con PieceFactory
          row.push(PieceFactory.createPiece(char));
        }
      }
      this.boardState.push(row);
    }
  }

  executeMove(fromRow, fromCol, toRow, toCol, gameState) {
    const piece = this.boardState[fromRow][fromCol];
    if (!piece) return;

    // 1. Detección y ejecución de Peón al Paso
    if (
      piece.type === "p" &&
      gameState.enPassantTarget &&
      toRow === gameState.enPassantTarget[0] &&
      toCol === gameState.enPassantTarget[1]
    ) {
      const capturedPawnRow = piece.color === "w" ? toRow + 1 : toRow - 1;
      this.boardState[capturedPawnRow][toCol] = null;
    }

    // 2. Establecer objetivo de Peón al Paso
    if (piece.type === "p" && Math.abs(toRow - fromRow) === 2) {
      const targetRow = piece.color === "w" ? fromRow - 1 : fromRow + 1;
      gameState.enPassantTarget = [targetRow, fromCol];
    } else {
      gameState.enPassantTarget = null;
    }

    // 3. Detección y ejecución del Enroque
    if (piece.type === "k" && Math.abs(toCol - fromCol) === 2) {
      if (toCol > fromCol) {
        // Enroque Corto
        const rook = this.boardState[fromRow][7];
        this.boardState[fromRow][5] = rook;
        this.boardState[fromRow][7] = null;
      } else {
        // Enroque Largo
        const rook = this.boardState[fromRow][0];
        this.boardState[fromRow][3] = rook;
        this.boardState[fromRow][0] = null;
      }
    }

    // 4. Actualización de derechos de enroque
    if (piece.type === "k") {
      gameState.castlingRights[piece.color].kingSide = false;
      gameState.castlingRights[piece.color].queenSide = false;
    } else if (piece.type === "r") {
      if (fromCol === 0)
        gameState.castlingRights[piece.color].queenSide = false;
      if (fromCol === 7) gameState.castlingRights[piece.color].kingSide = false;
    }

    // 5. Desplazamiento en la matriz
    this.boardState[toRow][toCol] = piece;
    this.boardState[fromRow][fromCol] = null;

    // 6. Promoción de Peón
    if (piece.type === "p" && (toRow === 0 || toRow === 7)) {
      promotePawn(toRow, toCol, "q", piece.color, this.boardState);
    }
  }

  render() {
    this.container.innerHTML = "";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        const isLight = (row + col) % 2 === 0;

        square.className = `chess-board__square ${
          isLight ? "chess-board__square--light" : "chess-board__square--dark"
        }`;

        square.dataset.row = row;
        square.dataset.col = col;
        square.setAttribute("role", "gridcell");

        const piece = this.boardState[row][col];
        if (piece) {
          square.textContent = piece.symbol;
          square.setAttribute(
            "aria-label",
            `${piece.color === "w" ? "Blanca" : "Negra"} ${piece.type}`,
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

export function promotePawn(row, col, newType, color, board) {
  const char = color === "w" ? newType.toUpperCase() : newType.toLowerCase();
  board[row][col] = PieceFactory.createPiece(char);
}
