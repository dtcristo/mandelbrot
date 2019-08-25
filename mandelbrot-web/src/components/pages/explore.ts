import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";
import "../mandelbrot";

@customElement("x-explore")
export default class Explore extends BaseComponent {
  private location!: {
    params: {
      centreX: string;
      centreY: string;
      zoom: string;
      maxIterations: string;
    };
  };

  render() {
    const { centreX, centreY, zoom, maxIterations } = this.location.params;
    return html`
      <x-mandelbrot
        .centreX=${parseFloat(centreX)}
        .centreY=${parseFloat(centreY)}
        .zoom=${parseInt(zoom)}
        .maxIterations=${parseInt(maxIterations)}
        .navigable=${true}
      ></x-mandelbrot>
    `;
  }
}
