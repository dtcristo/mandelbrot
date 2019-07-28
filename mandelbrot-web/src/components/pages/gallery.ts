import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";

@customElement("x-gallery")
export default class Gallery extends BaseComponent {
  render() {
    return html`
      <h2>Gallery</h2>
    `;
  }
}
