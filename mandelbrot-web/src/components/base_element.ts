import { LitElement } from "lit-element";

export class BaseElement extends LitElement {
  createRenderRoot() {
    return this;
  }
}
