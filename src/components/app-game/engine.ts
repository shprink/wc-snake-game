import scaleLinear from "d3-scale/src/linear";

export enum GameState {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  OVER = "OVER",
  WON = "WON"
}

export type IGameSizes = 10 | 20 | 50 | 100;
export enum IPixelTypes {
  "VOID" = "░",
  "TAIL" = "█",
  "APPLE" = "✪"
}

export type ISnakeDirection = "left" | "right" | "up" | "down";

class Apple {
  position: number[] = [0, 0];
}

class Snake {
  public positions: number[][] = []; // HEAD always first
  direction: ISnakeDirection = "left";
  pendingUpdate: boolean = false;
  constructor(private gridSize: IGameSizes) {
    const middle = Math.floor(this.gridSize / 2);
    this.positions = [
      [middle, middle],
      [middle + 1, middle],
      [middle + 2, middle],
      [middle + 3, middle]
    ];
    // Simulate game win
    // this.direction = "down";
    // this.positions.push([0, 0]);
    // for (let y = 0; y < this.gridSize; y++) {
    //   if (y % 2) {
    //     for (let x = this.gridSize - 1; x > 0; x--) {
    //       this.positions.push([x, y]);
    //     }
    //   } else {
    //     for (let x = 1; x < this.gridSize; x++) {
    //       this.positions.push([x, y]);
    //     }
    //   }
    // }
  }
  changeDirection(newDirection: ISnakeDirection) {
    if (this.pendingUpdate) {
      // can't change direction twice
      return;
    }
    if (
      (newDirection === "down" && this.direction !== "up") ||
      (newDirection === "up" && this.direction !== "down") ||
      (newDirection === "left" && this.direction !== "right") ||
      (newDirection === "up" && this.direction !== "down") ||
      (newDirection === "right" && this.direction !== "left")
    ) {
      this.direction = newDirection;
      this.pendingUpdate = true;
    }
  }
  pop() {
    this.positions.pop();
  }
  move(): number[] {
    const head = this.positions[0];
    let newPosition;
    switch (this.direction) {
      case "up":
        newPosition = [head[0], head[1] - 1];
        break;
      case "down":
        newPosition = [head[0], head[1] + 1];
        break;
      case "left":
        newPosition = [head[0] - 1, head[1]];
        break;
      case "right":
        newPosition = [head[0] + 1, head[1]];
        break;
    }

    if (
      newPosition[0] < 0 ||
      newPosition[0] >= this.gridSize ||
      newPosition[1] < 0 ||
      newPosition[1] >= this.gridSize
    ) {
      throw new Error("Edge");
    }

    for (let i = 0; i < this.positions.length; i++) {
      const [x, y] = this.positions[i];
      if (newPosition[0] === x && newPosition[1] === y) {
        throw new Error("Collision");
      }
    }

    this.positions.unshift(newPosition);
    this.pendingUpdate = false;

    return newPosition;
  }
}

export class Game {
  private apple: Apple;
  private snake: Snake;
  private grid: Grid;
  private state: GameState = GameState.IDLE;
  private score = 0;
  private speedScale: any;

  constructor(
    private size: IGameSizes,
    private onAfterMove: (grid: IPixelTypes[][], score: number) => void,
    private onStateChange: (state: GameState) => void
  ) {
    this.restart();
    this.speedScale = scaleLinear()
      .domain([this.getEmptyPixels(), 0]) // 4 = snake size at the beginning
      .range([400, 100]);
  }

  private getEmptyPixels = () =>
    this.size * this.size - this.snake.positions.length - 1; // 1 begin the apple

  changeState(newState: GameState) {
    this.state = newState;
    this.onStateChange(newState);
  }

  public restart() {
    this.changeState(GameState.IDLE);
    this.score = 0;
    this.apple = new Apple();
    this.snake = new Snake(this.size);
    this.grid = new Grid(this.size, this.snake, this.apple);
    this.grid.respawn();
    this.onAfterMove(this.grid.drawGameFrame(), this.score);
  }

  public start() {
    if (this.state !== GameState.IDLE) return;

    this.changeState(GameState.RUNNING);

    let gameOverFrameIndex = 0;
    const gameOverLoop = gameOverFrames => {
      const loopId = setTimeout(gameOverLoop, 50, gameOverFrames);

      try {
        if (gameOverFrames[gameOverFrameIndex]) {
          this.onAfterMove(gameOverFrames[gameOverFrameIndex], this.score);
          gameOverFrameIndex++;
        } else {
          clearTimeout(loopId);
        }
      } catch (error) {
        clearTimeout(loopId);
      }
    };

    const gameLoop = () => {
      const loopId = setTimeout(
        gameLoop,
        this.speedScale(this.getEmptyPixels())
      );

      try {
        const [newX, newY] = this.snake.move();
        if (
          this.apple.position[0] === newY &&
          this.apple.position[1] === newX
        ) {
          this.grid.respawn(); // Apple eaten
          this.score++;
        } else {
          this.snake.pop(); // does not grow
        }

        this.onAfterMove(this.grid.drawGameFrame(), this.score);
      } catch (error) {
        if (this.size * this.size === this.snake.positions.length) {
          this.changeState(GameState.WON);
        } else {
          this.changeState(GameState.OVER);
          setTimeout(gameOverLoop, 0, this.grid.drawGameOverFrames());
        }
        clearTimeout(loopId);
      }
    };
    setTimeout(gameLoop);
  }

  userInput(keyEvent: string) {
    if (keyEvent === "ArrowDown") {
      this.snake.changeDirection("down");
    } else if (keyEvent === "ArrowUp") {
      this.snake.changeDirection("up");
    } else if (keyEvent === "ArrowLeft") {
      this.snake.changeDirection("left");
    } else if (keyEvent === "ArrowRight") {
      this.snake.changeDirection("right");
    }
  }
}

class Grid {
  history: string[];
  constructor(
    private size: IGameSizes,
    private snake: Snake,
    private apple: Apple
  ) {}
  respawn(): void {
    const currentGrid = this.drawGameFrame();
    const emptySpots = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (currentGrid[y][x] === IPixelTypes.VOID) {
          emptySpots.push([y, x]);
        }
      }
    }
    this.apple.position =
      emptySpots[Math.floor(Math.random() * emptySpots.length)];
  }
  drawGameFrame(): IPixelTypes[][] {
    const emptyGrid = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        emptyGrid[y]
          ? (emptyGrid[y][x] = IPixelTypes.VOID)
          : (emptyGrid[y] = [IPixelTypes.VOID]);
      }
    }
    this.snake.positions.forEach((position: number[]) => {
      emptyGrid[position[1]][position[0]] = IPixelTypes.TAIL;
    });

    emptyGrid[this.apple.position[0]][this.apple.position[1]] =
      IPixelTypes.APPLE;

    return emptyGrid;
  }
  drawGameOverFrames(): IPixelTypes[][][] {
    let lastFrame = this.drawGameFrame();
    const lastSnakeHeadPosition = this.snake.positions[0];
    const frames = [lastFrame];
    let blackPixels = 0;
    const alreadyDonePixelCache = {};

    const getPositionsAround = (positions: number[][]) =>
      Object.values<number[]>(
        positions.reduce((prev, current) => {
          const [y, x] = current;
          [
            [y + 1, x],
            [y, x + 1],
            [y - 1, x],
            [y, x - 1]
          ]
            .filter(
              position =>
                position[0] >= 0 &&
                position[1] >= 0 &&
                position[0] < this.size &&
                position[1] < this.size &&
                !alreadyDonePixelCache[`${position[0]}-${position[1]}`]
            )
            .map(position => {
              prev[`${position[0]}-${position[1]}`] = position;
              alreadyDonePixelCache[`${position[0]}-${position[1]}`] = true;
            });
          return prev;
        }, {})
      );

    let positions = [lastSnakeHeadPosition];

    while (blackPixels < this.size * this.size) {
      positions = getPositionsAround(positions);
      const previousFrame = JSON.parse(
        JSON.stringify(frames[frames.length - 1])
      ); // copy frame

      positions.map(
        position => (previousFrame[position[1]][position[0]] = IPixelTypes.TAIL)
      );
      frames.push(previousFrame);
      blackPixels += positions.length;
    }
    return frames;
  }
}
