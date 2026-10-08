import { Pawn } from "./Pawn.js";
import { Knight } from "./Knight.js";
import { Bishop } from "./Bishop.js";
import { Rook } from "./Rook.js";
import { Queen } from "./Queen.js";
import { King } from "./King.js";

export class PieceFactory {
  /**
   * Crea una instancia de Pieza a partir del carácter FEN.
   * @param {string} char - Carácter FEN ('p', 'P', 'r', 'R', etc.)
   * @returns {Piece|null}
   */

  static createPiece(char) {
    if (!char) return null;

    const color = char === char.toUpperCase() ? "w" : "b";
    const type = char.toLowerCase();

    switch (type) {
      case "p":
        return new Pawn(color);
      case "n":
        return new Knight(color);
      case "b":
        return new Bishop(color);
      case "r":
        return new Rook(color);
      case "q":
        return new Queen(color);
      case "k":
        return new King(color);
      default:
        return null;
    }
  }
}
