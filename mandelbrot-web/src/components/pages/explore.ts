import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";
import "./../mandelbrot";

@customElement("x-explore")
export default class Explore extends BaseComponent {
  render() {
    return html`
      <x-mandelbrot></x-mandelbrot>
    `;
  }
}
