import { html, customElement } from "lit-element";

import BaseElement from "./base_element";
import "./mandelbrot";

@customElement("x-app")
export default class App extends BaseElement {
  render() {
    return html`
      <x-mandelbrot></x-mandelbrot>
    `;
  }
}
