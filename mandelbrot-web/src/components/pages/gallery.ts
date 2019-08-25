import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";
import "../gallery_card";
import { MandelbrotLocation } from "../mandelbrot";

const GALLERY: MandelbrotLocation[] = [
  {
    centreX: -1.0276694024680975,
    centreY: -0.3612717525543448,
    zoom: 9,
    maxIterations: 600
  },
  {
    centreX: -1.5074780564299812,
    centreY: -1.726559291452974e-10,
    zoom: 27,
    maxIterations: 600
  },
  {
    centreX: 0.28601780084978073,
    centreY: -0.011539213838632968,
    zoom: 13,
    maxIterations: 600
  }
];

@customElement("x-gallery")
export default class Gallery extends BaseComponent {
  render() {
    return html`
      <section class="section">
        <div class="container">
          <div class="content">
            <h1>Gallery</h1>
            <p>
              Browse some of the amazing images found within the Mandelbrot set.
            </p>
          </div>

          <div class="columns is-multiline is-centered">
            ${GALLERY.map(
              mandelbrot => html`
                <div class="column is-10-tablet is-5-fullhd">
                  <x-gallery-card .mandelbrot=${mandelbrot}></x-gallery-card>
                </div>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }
}
