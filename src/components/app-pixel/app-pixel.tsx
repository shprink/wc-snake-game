import { Component, h, Prop } from "@stencil/core";

import { IPixelTypes } from "../app-game/engine";

@Component({
  tag: "app-pixel",
  styleUrls: ["app-pixel.scss"],
  shadow: true
})
export class AppPixel {
  @Prop() type: IPixelTypes;
  render() {
    return <div class={`type-${this.type}`}></div>;
  }
}
