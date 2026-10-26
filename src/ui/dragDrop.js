export class DragAndDropHandler {
  /**
   * @param {HTMLElement} boardContainer
   * @param {Function} onMoveAttempt - Callback ejecutado al soltar una pieza (from, to)
   * @param {Function} onSelectPiece - Callback ejecutado al iniciar el arrastre
   */
  constructor(boardContainer, onMoveAttempt, onSelectPiece) {
    this.container = boardContainer;
    this.onMoveAttempt = onMoveAttempt;
    this.onSelectPiece = onSelectPiece;
    this.draggedFrom = null;

    this.initEvents();
  }

  initEvents() {
    // Delegación de eventos en el contenedor del tablero
    this.container.addEventListener(
      "dragstart",
      this.handleDragStart.bind(this),
    );
    this.container.addEventListener("dragover", this.handleDragOver.bind(this));
    this.container.addEventListener(
      "dragleave",
      this.handleDragLeave.bind(this),
    );
    this.container.addEventListener("drop", this.handleDrop.bind(this));
    this.container.addEventListener("dragend", this.handleDragEnd.bind(this));
  }

  handleDragStart(e) {
    const square = e.target.closest(".chess-board__square");
    if (!square) return;

    const row = parseInt(square.dataset.row, 10);
    const col = parseInt(square.dataset.col, 10);

    // Notifica al gestor de interacción cuál pieza se comenzó a arrastrar
    const canDrag = this.onSelectPiece(row, col);
    if (!canDrag) {
      e.preventDefault(); //Cancela el drag si no es el turno o es casilla vacía
      return;
    }

    this.draggedFrom = { row, col };
    square.classList.add("chess-board__square--dragging");

    // Configuración del objeto dataTransfer de HTML5
    e.dataTransfer.setData("text/plain", JSON.stringify(this.draggedFrom));
    e.dataTransfer.effectAllowed = "move";
  }

  handleDragOver(e) {
    // Obligatorio para permitir el evento 'drop' en HTML5
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  handleDragLeave(e) {
    // Reservado para posibles estilos HOVER durante el arrastre
  }

  handleDrop(e) {
    e.preventDefault();
    const targetSquare = e.target.closest(".chess-board__square");
    if (!targetSquare || !this.draggedFrom) return;

    const toRow = parseInt(targetSquare.dataset.row, 10);
    const toCol = parseInt(targetSquare.dataset.col, 10);

    // Ejecuta el callback intentando la jugada
    this.onMoveAttempt(
      this.draggedFrom.row,
      this.draggedFrom.col,
      toRow,
      toCol,
    );
  }

  handleDragEnd(e) {
    if (e.target && e.target.classList) {
      e.target.classList.remove("chess-board__square--dragging");
    }

    this.draggedFrom = null;
  }
}
