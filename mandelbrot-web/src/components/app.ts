import { html, customElement } from "lit-element";

import BaseElement from "./base_element";
import "./navbar";
import "./mandelbrot";

@customElement("x-app")
export default class App extends BaseElement {
  render() {
    return html`
      <header>
        <x-navbar></x-navbar>
      </header>
      <main>
        <x-mandelbrot></x-mandelbrot>
      </main>
    `;
  }
}
