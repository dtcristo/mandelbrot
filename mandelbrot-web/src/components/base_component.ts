import { LitElement } from "lit-element";

export default class BaseComponent extends LitElement {
  createRenderRoot() {
    return this;
  }
}
