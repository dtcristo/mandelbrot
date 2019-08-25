import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";

@customElement("x-about")
export default class About extends BaseComponent {
  render() {
    return html`
      <section class="section">
        <div class="container">
          <div class="content">
            <h1>About</h1>
            <p>
              The
              <a
                href="https://en.wikipedia.org/wiki/Mandelbrot_set"
                target="_blank"
                >Mandelbrot set</a
              >
              is a mathematical concept that can produce amazing
              <a href="https://en.wikipedia.org/wiki/Fractal" target="_blank"
                >fractal</a
              >
              patterns that you see here.
            </p>
            <div class="columns is-multiline is-centered">
              <div class="column is-10-tablet is-5-fullhd">
                <x-gallery-card
                  .mandelbrot=${{
                    centreX: -0.666,
                    centreY: 0,
                    zoom: 0,
                    maxIterations: 100
                  }}
                ></x-gallery-card>
              </div>
            </div>

            <div class="content">
              <p>
                This is a project developed by
                <a href="https://dtcristo.com/" target="_blank"
                  >David Cristofaro</a
                >.
              </p>
              <h2>Controls</h2>
              <p>
                While <a href="explore">exploring</a> the Mandelbrot set, use
                the following controls to navigate.
              </p>
              <ul>
                <li>Left click to zoom in.</li>
                <li>Right click to zoom out.</li>
              </ul>

              <h2>Implementation</h2>
              <p>
                Rendering fractals like this can be a computationally expensive.
                A task that JavaScript is not well suited to. Here, the fractal
                rendering logic is written in
                <a href="https://www.rust-lang.org/" target="_blank">Rust</a>, a
                high performance systems programming language. This source is
                then compiled to
                <a href="https://webassembly.org/" target="_blank"
                  >WebAssembly</a
                >
                (also known as WASM), a binary format and runtime environment
                for executing high performance code within a browser.
              </p>
              <p>
                For more details on the implementation, see the source code on
                <a href="https://github.com/dtcristo/mandelbrot" target="_blank"
                  >GitHub</a
                >.
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
