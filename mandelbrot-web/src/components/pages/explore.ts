import { html, customElement } from "lit-element";
import { Params, queryParentRouterSlot } from "@appnest/web-router";

import BaseComponent from "../base_component";
import "../mandelbrot";

@customElement("x-explore")
export default class Explore extends BaseComponent {
  get params(): Params {
    return queryParentRouterSlot(this)!.match!.params;
  }

  render() {
    return html`
      <x-mandelbrot
        .centreX=${parseFloat(this.params.centreX)}
        .centreY=${parseFloat(this.params.centreY)}
        .zoom=${parseInt(this.params.zoom)}
        .maxIterations=${parseInt(this.params.maxIterations)}
        .navigatable=${true}
      ></x-mandelbrot>
    `;
  }
}
