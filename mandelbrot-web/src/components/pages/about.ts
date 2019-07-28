import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";

@customElement("x-about")
export default class About extends BaseComponent {
  render() {
    return html`
      <h2>About</h2>
    `;
  }
}
