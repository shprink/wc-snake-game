/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  GameState,
  IGameSizes,
  IPixelTypes,
} from './components/app-game/engine';

export namespace Components {
  interface AppPixel {
    'type': IPixelTypes;
  }
  interface WcSnakeGame {
    'size': IGameSizes;
  }
}

declare global {


  interface HTMLAppPixelElement extends Components.AppPixel, HTMLStencilElement {}
  var HTMLAppPixelElement: {
    prototype: HTMLAppPixelElement;
    new (): HTMLAppPixelElement;
  };

  interface HTMLWcSnakeGameElement extends Components.WcSnakeGame, HTMLStencilElement {}
  var HTMLWcSnakeGameElement: {
    prototype: HTMLWcSnakeGameElement;
    new (): HTMLWcSnakeGameElement;
  };
  interface HTMLElementTagNameMap {
    'app-pixel': HTMLAppPixelElement;
    'wc-snake-game': HTMLWcSnakeGameElement;
  }
}

declare namespace LocalJSX {
  interface AppPixel {
    'type'?: IPixelTypes;
  }
  interface WcSnakeGame {
    'onChange'?: (event: CustomEvent<{
      score: number;
      state: GameState;
    }>) => void;
    'size'?: IGameSizes;
  }

  interface IntrinsicElements {
    'app-pixel': AppPixel;
    'wc-snake-game': WcSnakeGame;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'app-pixel': LocalJSX.AppPixel & JSXBase.HTMLAttributes<HTMLAppPixelElement>;
      'wc-snake-game': LocalJSX.WcSnakeGame & JSXBase.HTMLAttributes<HTMLWcSnakeGameElement>;
    }
  }
}


