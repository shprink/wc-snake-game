# app-game



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                    | Default |
| -------- | --------- | ----------- | ----------------------- | ------- |
| `size`   | `size`    |             | `10 or 100 or 20 or 50` | `10`    |


## Events

| Event    | Description | Type                                                |
| -------- | ----------- | --------------------------------------------------- |
| `change` |             | `CustomEvent<{ score: number; state: GameState; }>` |


## Dependencies

### Depends on

- [wc-snake-game](../app-game)
- [app-pixel](../app-pixel)

### Graph
```mermaid
graph TD;
  wc-snake-game-worker --> wc-snake-game
  wc-snake-game-worker --> app-pixel
  wc-snake-game --> wc-snake-game
  wc-snake-game --> app-pixel
  style wc-snake-game-worker fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
