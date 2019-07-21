import { LitElement, html, css, customElement } from "lit-element";

import "./mandelbrot";

@customElement("x-app")
export class App extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        height: 100vh;
      }

      :host > * {
        flex: 1;
      }
    `;
  }

  render() {
    return html`
      <x-mandelbrot></x-mandelbrot>
      <x-mandelbrot></x-mandelbrot>
    `;
  }
}
