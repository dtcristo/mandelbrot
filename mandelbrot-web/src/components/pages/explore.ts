import { html, customElement } from "lit-element";
import { Params, queryParentRouterSlot } from "@appnest/web-router";

import BaseComponent from "../base_component";
import "./../mandelbrot";

@customElement("x-explore")
export default class Explore extends BaseComponent {
  get params(): Params {
    return queryParentRouterSlot(this)!.match!.params;
  }

  render() {
    const centreX = parseFloat(this.params.centreX);
    const centreY = parseFloat(this.params.centreY);
    const zoom = parseInt(this.params.zoom);
    const maxIterations = parseInt(this.params.maxIterations);
    return html`
      <x-mandelbrot
        .centreX=${centreX}
        .centreY=${centreY}
        .zoom=${zoom}
        .maxIterations=${maxIterations}
        .navigatable=${true}
      ></x-mandelbrot>
    `;
  }
}
