import { ChessBoard } from "./board.js";
import { PieceFactory } from "./pieces/PieceFactory.js";

document.addEventListener("DOMContentLoaded", () => {
  const board = new ChessBoard("chess-board");

  console.log("Tablero cargado:", board.boardState);

  // Ejemplo: Obtener movimientos posibles de un Peón Blanco inicial en [6, 4] (e2)
  const pawn = PieceFactory.createPiece("P");
  const moves = pawn.getPossibleMoves(6, 4, board.boardState);

  console.log("Movimientos calculados para el Peón en e2:", moves);
  // Debería imprimir: [[5, 4], [4, 4]] (e3 y e4)
});
