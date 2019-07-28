import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";

@customElement("x-explore")
export default class Explore extends BaseComponent {
  render() {
    return html`
      <h2>Explore</h2>
    `;
  }
}
