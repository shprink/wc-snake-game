import { Game, GameState } from "./engine";

// postMessage;
let game: Game;

onmessage = function(e) {
  switch (e.data[0]) {
    case "init":
      game = new Game(
        e.data[1],
        grid => postMessage({ grid }),
        (state: GameState) => postMessage({ state }),
        (score: number) => postMessage({ score })
      );
      break;
    case "keydown":
      game.userInput(e.data[1]);
      break;
    case "start":
      game.start();
      break;
    case "restart":
      game.restart();
      break;

    default:
      break;
  }
};
