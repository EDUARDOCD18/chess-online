import { ChessBoard } from "./board.js";

document.addEventListener("DOMContentLoaded", () => {
  const board = new ChessBoard("chess-board");
  console.log("Tablero cargado:", board.boardState);
});
