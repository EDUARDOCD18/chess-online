import { MoveValidator } from "../moveValidator";
import { UIRenderer } from "./render";
import { DragAndDropHandler } from "./dragDrop";
import { ChessTimer } from "../timer";
import { PGNGenerator } from "../pgn";

export class InteractionHandler {
  constructor(chessBoard, gameState) {
    this.board = chessBoard;
    this.gameState = gameState;
    this.renderer = new UIRenderer(chessBoard.container);
    this.selectedSquare = null;
    this.currentLegalMoves = [];
    this.pgn = new PGNGenerator();

    this.timer = new ChessTimer(
      5,
      3,
      this.updateClockUI.bind(this),
      this.handleTimeOut.bind(this),
    );

    this.init();
  }

  init() {
    this.board.container.addEventListener("click", this.handleClick.bind(this));

    this.dragHandler = new DragAndDropHandler(
      this.board.container,
      this.handleMoveAttempt.bind(this),
      this.handleSelectPiece.bind(this),
    );

    this.updateDraggablePieces();
  }

  updateClockUI(whiteTimerStr, blackTimeStr) {
    const whiteClock = document.getElementById("white-clock");
    const blackClock = document.getElementById("black-clock");

    if (whiteClock) whiteClock.textContent = whiteTimerStr;
    if (blackClock) blackClock.textContent = blackTimeStr;

    const whiteCard = document.getElementById("white-timer-card");
    const blackCard = document.getElementById("black-timer-card");

    if (whiteCard && blackCard) {
      whiteCard.classList.toggle(
        "timer-card--active",
        this.gameState.turn === "w",
      );
      blackCard.classList.toggle(
        "timer-card--active",
        this.gameState.turn === "b",
      );
    }
  }

  handleTimeOut(loserColor) {
    const winner = loserColor === "w" ? "Negras" : "Blancas";
    alert(`¡Tiempo agotado! Ganan las ${winner}.`);
  }

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

  handleSelectPiece(row, col) {
    const piece = this.board.boardState[row][col];

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

    this.renderer.highlightsLegalMoves(
      row,
      col,
      this.currentLegalMoves,
      this.board.boardState,
    );

    return true;
  }

  handleMoveAttempt(fromRow, fromCol, toRow, toCol) {
    const isLegal = this.currentLegalMoves.some(
      ([r, c]) => r === toRow && c === toCol,
    );

    if (isLegal) {
      if (!this.timer.isRunning) {
        this.timer.start();
      }

      const piece = this.board.boardState[fromRow][fromCol];
      const targetPiece = this.board.boardState[toRow][toCol];
      const isCapture = targetPiece !== null;
      const isCastling = piece.type === "k" && Math.abs(toCol - fromCol) === 2;
      const isPromotion = piece.type === "p" && (toRow === 0 || toRow === 7);

      this.board.executeMove(fromRow, fromCol, toRow, toCol, this.gameState);

      const isCheck = this.gameState.isInCheck(
        this.gameState.turn,
        this.board.boardState,
      );
      const isCheckmate = MoveValidator.isCheckmate(
        this.board.boardState,
        this.gameState,
      );

      const notation = this.pgn.addMove({
        piece,
        from: [fromRow, fromCol],
        to: [toRow, toCol],
        isCapture,
        isCastling,
        isPromotion,
        promotedTo: isPromotion ? "q" : null,
        isCheck,
        isCheckmate,
      });

      this.updatePGNUI();

      this.timer.switchTurn(this.gameState.turn);

      this.board.render();
      this.renderer.clearHighlights();

      if (isCheck) {
        const kingPos = this.gameState.findKing(
          this.gameState.turn,
          this.board.boardState,
        );
        this.renderer.updateCheckWarning(kingPos);
      } else {
        this.renderer.updateCheckWarning(null);
      }

      if (isCheckmate) {
        this.timer.stop();
        alert(
          `¡Jaque Mate! Victoria para las ${this.gameState.turn === "w" ? "Negras" : "Blancas"}.`,
        );
      }

      this.updateDraggablePieces();
      this.resetSelection();
    } else {
      this.resetSelection();
      this.renderer.clearHighlights();
    }
  }

  updatePGNUI() {
    const pgnContainer = document.getElementById("pgn-list");
    if (!pgnContainer) return;

    pgnContainer.innerHTML = "";
    this.pgn.history.forEach((item) => {
      const row = document.createElement("div");
      row.className = "pgn-row";
      row.innerHTML = `
      <span class="pgn-row__num">${item.number}.</span>
      <span>${item.white}</span> 
      <span>${item.black}</span>
      `;
      pgnContainer.appendChild(row);
    });

    pgnContainer.scrollTop = pgnContainer.scrollHeight;
  }

  handleClick(e) {
    const square = e.target.closest(".chess-board__square");
    if (!square) return;

    const row = parseInt(square.dataset.row, 10);
    const col = parseInt(square.dataset.col, 10);

    if (this.selectedSquare === null) {
      this.handleSelectPiece(row, col);
    } else {
      const clickedPiece = this.board.boardState[row][col];
      if (clickedPiece && clickedPiece.color === this.gameState.turn) {
        this.handleSelectPiece(row, col);
      } else {
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
