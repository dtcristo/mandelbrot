import { html, customElement, property } from "lit-element";

import BaseElement from "./base_component";
import "./mandelbrot";
import { MandelbrotLocation } from "../types";

@customElement("x-gallery-card")
export default class GalleryCard extends BaseElement {
  @property() mandelbrot!: MandelbrotLocation;

  path(): string {
    return `explore/${this.mandelbrot.centreX}/${this.mandelbrot.centreY}/${
      this.mandelbrot.zoom
    }/${this.mandelbrot.maxIterations}`;
  }

  render() {
    return html`
      <div class="card">
        <x-mandelbrot
          .centreX=${this.mandelbrot.centreX}
          .centreY=${this.mandelbrot.centreY}
          .zoom=${this.mandelbrot.zoom}
          .maxIterations=${this.mandelbrot.maxIterations}
        ></x-mandelbrot>
        <footer class="card-footer">
          <a href=${this.path()} class="card-footer-item">
            <span class="icon has-text-primary">
              <i class="fas fa-compass"></i>
            </span>
            <span>Explore</span>
          </a>
        </footer>
      </div>
    `;
  }
}
