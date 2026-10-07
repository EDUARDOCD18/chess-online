export class Piece {
  /**
   * @param {'w' | 'b'} color - Color de la pieza ('w' = blanca, 'b' = negra)
   *  @param {string} type - Tipo de pieza ('p', 'n', 'b', 'r', 'q', 'k')
   *  @param {string} symbol - Símbolo Unicode para visualización
   */

  constructor(color, type, symbol) {
    this.color = color;
    this.type = type;
    this.symbol = symbol;
  }

  /**
   *  Verifica si una coordenada [row, col] está dentro de la matriz de 8x8.
   *  @param {number} row
   *  @param {number} col
   *  @returns {boolean}
   */
  isWithinBoard(row, col) {
    return (row) => 0 && row < 8 && col >= 0 && col < 8;
  }

  /**
   *  Método abstracto que debe ser implementado por cada pieza hija.
   *  @param {number} row - Fila actual de la pieza
   *  @param {number} col - Columna actual de la pieza
   *  @param {Array<Array<Piece|null>>} board - Matriz del tablero de 8x8
   * @returns {Array<[number, number]>} Matriz de coordenadas visibles [row, col]
   */
  getPossiblesMoves(row, col, board) {
    throw new Error(
      `El método getPossiblesMoves() debe ser implementado a la clase ${this.constructor.name}`,
    );
  }
}
