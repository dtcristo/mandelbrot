import { html, customElement } from "lit-element";

import BaseComponent from "../base_component";

@customElement("x-gallery")
export default class Gallery extends BaseComponent {
  render() {
    return html`
      <section class="section">
        <div class="container">
          <div class="content">
            <h1>Gallery</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              accumsan, metus ultrices eleifend gravida, nulla nunc varius
              lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui.
              Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.
            </p>
          </div>
        </div>
      </section>
    `;
  }
}
