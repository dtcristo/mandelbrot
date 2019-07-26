import { LitElement } from "lit-element";

export default class BaseElement extends LitElement {
  createRenderRoot() {
    return this;
  }
}
