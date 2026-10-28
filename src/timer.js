export class ChessTimer {
  /**
   * @param {number} initialMinutes - Tiempo inicial por jugador en minutos (ej: 5 para Blitz)
   * @param {number} incrementSeconds - Tiempo de incremento por jugada en segundos (ej: 3)
   * @param {Function} onTick - Callback ejecutado cada segundo (whiteTime, blackTime)
   * @param {Function} onTimeOut - Callback ejecutado cuando a un jugador se le acaba el tiempo
   */
  constructor(
    initialMinutes = 5,
    incrementSeconds = 0,
    onTick = null,
    onTimeOut = null,
  ) {
    this.initialSeconds = initialMinutes * 60;
    this.increment = incrementSeconds;
    this.whiteTime = this.initialSeconds;
    this.blackTime = this.initialSeconds;
    this.activePlayer = "w";
    this.intervalId = null;
    this.isRunnig = false;
    this.onTick = onTick;
    this.onTimeOut = onTimeOut;
  }
  /**
   * Inicia o reanuda la cuenta regresiva del jugador activo.
   */
  start() {
    if (this.isRunnig) return;
    this.isRunnig = true;

    this.intervalId = setInterval(() => {
      if (this.activePlayer === "w") {
        this.whiteTime--;
        if (this.whiteTime <= 0) {
          this.whiteTime = 0;
          this.stop();
          if (this.onTimeOut) this.onTimeOut("w");
        }
      } else {
        this.blackTime--;
        if (this.blackTime <= 0) {
          this.blackTime = 0;
          this.stop();
          if (this.onTimeOut) this.onTimeOut("b");
        }
      }

      if (this.onTick) {
        this.onTick(
          this.formatTime(this.whiteTime),
          this.formatTime(this.blackTime),
        );
      }
    }, 1000);
  }

  /**
   * Pausa el temporizador activo.
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunnig = false;
  }

  /**
   * Alterna el reloj hacia el siguiente jugador e inyecta el incremento de tiempo.
   * @param {'w' | 'b'} nextTurn
   */

  switchTurn(nextTurn) {
    // Aplica el incremento de tiempo al jugador que acaba de mover
    if (this.isRunnig && this.increment > 0) {
      if (this.activePlayer === "w") {
        this.whiteTime += this.increment;
      } else {
        this.blackTime += this.increment;
      }
    }

    this.activePlayer = nextTurn;

    // Dispara actualización visual inmediata del incremento
    if (this.onTick) {
      this.onTick(
        this.formatTime(this.whiteTime),
        this.formatTime(this.blackTime),
      );
    }
  }

  /**
   * Reinicia los temporizadores a su estado inicial.
   */

  reset(minutes = null, increment = null) {
    this.stop();
    if (minutes !== null) this.initialSeconds = minutes * 60;
    if (increment !== null) this.increment = increment;

    this.whiteTime = this.initialSeconds;
    this.blackTime = this.initialSeconds;

    this.activePlayer = "w";

    if (this.onTick) {
      this.onTick(
        this.formatTime(this.whiteTime),
        this.formatTime(this.blackTime),
      );
    }
  }

  /**
   * Convierte un total de segundos a un formato legibles MM:SS.
   * @param {number} totalSeconds
   * @returns {string} Ejemplo: "04:59"
   */
  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (num) => num.toString().padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}
