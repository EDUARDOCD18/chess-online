import { ChessBoard } from "./board.js";
import { GameState } from "./gameState.js";
import { MoveValidator } from "./moveValidator.js";

document.addEventListener("DOMContentLoaded", () => {
  const board = new ChessBoard("chess-board");
  const gameState = new GameState();
  console.log("--- DÍA 3: ESTADO DEL JUEGO CARGADO ---");
  console.log("Turno inicial:", gameState.turn === "w" ? "Blancas" : "Negras");

  // Obtener movimientos legales de la Dama o del Peón de Rey (e2)
  const e2Moves = MoveValidator.getLegalMoves(
    5,
    4,
    board.boardState,
    gameState,
  );
  console.log("Movimientos legales del Peón en e2 (e3, e4):", e2Moves); // Ejecutar e2 -&gt; e4

  board.executeMove(6, 4, 4, 4, gameState);
  console.log(
    "Nuevo turno tras e4:",
    gameState.turn === "w" ? "Blancas" : "Negras",
  );
  console.log(
    "Objetivo de Peón al paso activado en e3:",
    gameState.enPassantTarget,
  );
});
