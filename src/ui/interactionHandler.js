import { MoveValidator } from "../moveValidator";
import { UIRenderer } from "./render";
import { DragAndDropHandler } from "./dragDrop";

export class InteractionHandler {
  /**
   * @param {ChessBoard} chessBoard
   * @param {GameState} gameState
   */
  constructor(chessBoard, gameState) {
    this.board = chessBoard;
    this.gameState = gameState;
    this.renderer = new UIRenderer(chessBoard.container);
    this.selectedSquare = null; // { row, col } de la pieza activa
    this.currentLegalMoves = []; // Lista de movimientos válidos de la pieza activa

    this.init();
  }

  init() {
    // 1\. Escuchador para interacciones por Clic
    this.board.container.addEventListener("click", this.handleClick.bind(this));

    // 2\. Inicializador de interacciones por Drag &amp; Drop
    this.dragHandler = new DragAndDropHandler(
      this.board.container,
      this.handleMoveAttempt.bind(this),
      this.handleSelectPiece.bind(this),
    );

    // Habilitar atributo draggable en las casillas con piezas
    this.updateDraggablePieces();
  }

  /**
   * Hace que las casillas con piezas del bando activo sean arrastrables.
   */
  updateDraggablePieces() {
    const squares = this.board.container.querySelectorAll(
      ".chess-board__square",
    );
    squares.forEach((sq) => {
      const r = parseInt(sq.dataset.row, 10);
      const c = parseInt(sq.dataset.col, 10);
      const piece = this.board.boardState[r][c];

      if (piece && piece.color === this.gameState.turn) {
        sq.setAttribute("draggable", "true");
      } else {
        sq.removeAttribute("draggable");
      }
    });
  }

  /**
   * Intenta seleccionar una pieza.
   * @returns {boolean} True si la selección fue exitosa
   */
  handleSelectPiece(row, col) {
    const piece = this.board.boardState[row][col];

    // Solo se permite seleccionar piezas del jugador en turno
    if (!piece || piece.color !== this.gameState.turn) {
      return false;
    }

    this.selectedSquare = { row, col };
    this.currentLegalMoves = MoveValidator.getLegalMoves(
      row,
      col,
      this.board.boardState,
      this.gameState,
    );

    // Renderizar feedback visual en el DOM
    this.renderer.highlightsLegalMoves(
      row,
      col,
      this.currentLegalMoves,
      this.board.boardState,
    );

    return true;
  }

  /**
   * Intenta ejecutar una jugada desde (fromRow, fromCol) hasta (toRow, toCol).
   */
  handleMoveAttempt(fromRow, fromCol, toRow, toCol) {
    const isLegal = this.currentLegalMoves.some(
      ([r, c]) => r === toRow && c === toCol,
    );

    if (isLegal) {
      // 1\. Ejecutar el movimiento en el modelo de datos
      this.board.executeMove(fromRow, fromCol, toRow, toCol, this.gameState);

      // 2\. Redibujar el tablero y limpiar resaltados
      this.board.render();
      this.renderer.clearHighlights();

      // 3\. Verificar si el nuevo movimiento deja al Rey contrario en Jaque
      const inCheck = this.gameState.isInCheck(
        this.gameState.turn,
        this.board.boardState,
      );
      if (inCheck) {
        const kingPos = this.gameState.findKing(
          this.gameState.turn,
          this.board.boardState,
        );
        this.renderer.updateCheckWarning(kingPos);
      } else {
        this.renderer.updateCheckWarning(null);
      }

      // 4\. Actualizar estado de arrastre para el nuevo turno
      this.updateDraggablePieces();
      this.resetSelection();
    } else {
      // Si la jugada no es legal, cancela la selección
      this.resetSelection();
      this.renderer.clearHighlights();
    }
  }

  /**
   * Procesa los eventos de Clic del ratón.
   */
  handleClick(e) {
    const square = e.target.closest(".chess-board__square");
    if (!square) return;

    const row = parseInt(square.dataset.row, 10);
    const col = parseInt(square.dataset.col, 10);

    if (this.selectedSquare === null) {
      // PRIMER CLIC: Intentar seleccionar pieza
      this.handleSelectPiece(row, col);
    } else {
      // SEGUNDO CLIC:
      // Si hace clic en otra pieza del mismo equipo, cambia la selección
      const clickedPiece = this.board.boardState[row][col];
      if (clickedPiece && clickedPiece.color === this.gameState.turn) {
        this.handleSelectPiece(row, col);
      } else {
        // Intentar mover a la casilla destino
        this.handleMoveAttempt(
          this.selectedSquare.row,
          this.selectedSquare.col,
          row,
          col,
        );
      }
    }
  }

  resetSelection() {
    this.selectedSquare = null;
    this.currentLegalMoves = [];
  }
}
