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
