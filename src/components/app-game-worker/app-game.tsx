import {
  Component,
  h,
  Prop,
  Listen,
  State,
  Event,
  EventEmitter
} from "@stencil/core";
import { GameState, IPixelTypes, IGameSizes } from "../model";

// enum GameState {
//   IDLE = "IDLE",
//   RUNNING = "RUNNING",
//   OVER = "OVER",
//   WON = "WON"
// }

// type IGameSizes = 10 | 20 | 50 | 100;
// enum IPixelTypes {
//   "VOID" = "░",
//   "TAIL" = "█",
//   "APPLE" = "✪"
// }

@Component({
  tag: "wc-snake-game-worker",
  styleUrls: ["app-game.scss"],
  shadow: true
})
export class AppGame {
  @Prop() size: IGameSizes = 10;
  @State() grid: IPixelTypes[][] = [];
  @State() gameState: GameState;
  @State() score: number = 0;
  @Event() change: EventEmitter<{
    score: number;
    state: GameState;
  }>;
  worker: Worker;
  gameDiv: HTMLDivElement;

  @Listen("keydown") handleKeyDown(ev: KeyboardEvent) {
    this.worker.postMessage(["keydown", ev.key]);
  }
  @Listen("focus") handleFocus() {
    this.worker.postMessage(["start"]);
  }
  componentWillLoad() {
    this.worker = new Worker("./engine.worker.js");
    this.worker.postMessage(["init", this.size]);
    this.worker.onmessage = e => {
      // console.log("onmessage", e.data);
      const { state, grid, score } = e.data;
      grid && (this.grid = grid);
      score && (this.score = score);
      state && (this.gameState = state);
      if (state || score) {
        this.change.emit({
          state: this.gameState,
          score: this.score
        });
      }
      this.render();
    };
  }
  play = (ev: Event) => {
    ev.preventDefault();
    this.gameDiv.focus();
  };
  restart = (ev: Event) => {
    ev.preventDefault();
    this.worker.postMessage(["restart"]);
  };
  render() {
    if (!this.size)
      return (
        <p>
          <pre>
            <code>
              <wc-snake-game></wc-snake-game>
            </code>
          </pre>
        </p>
      );
    return (
      <div
        style={{
          width: `${25 * this.size}px`
        }}
      >
        <div
          class="game"
          tabindex="0"
          ref={el => (this.gameDiv = el as HTMLDivElement)}
          style={{
            gridTemplateColumns: `repeat(${this.size}, minmax(25px, 1fr))`
          }}
        >
          {this.grid.map(row =>
            row.map((pixelType: IPixelTypes) => (
              <app-pixel type={pixelType}></app-pixel>
            ))
          )}
        </div>
        {this.gameState === GameState.RUNNING && (
          <div class="score">{this.score}</div>
        )}
        {this.gameState === GameState.IDLE && (
          <div class="title" onClick={this.play}>
            Play
          </div>
        )}
        {this.gameState === GameState.OVER && (
          <div class="title">
            <div>Game over</div>
            <small>Score: {this.score}</small>
            <button onClick={this.restart}>Restart</button>
          </div>
        )}
        {this.gameState === GameState.WON && (
          <div class="title">
            <div>🎉 You Won, congrats!</div>
            <small>Score: {this.score}</small>
            <button onClick={this.restart}>Restart</button>
          </div>
        )}
      </div>
    );
  }
}
