import { customElement, html, query, PropertyValues } from "lit-element";
import { Router } from "@vaadin/router";

import BaseComponent from "./base_component";
import "./navbar";
import "./pages/explore";
import "./pages/gallery";
import "./pages/guestbook";
import "./pages/about";

const ROUTES = [
  { path: "explore", redirect: "explore/-0.666/0/0/100" },
  {
    path: "explore/:centreX/:centreY/:zoom/:maxIterations",
    component: "x-explore"
  },
  { path: "gallery", component: "x-gallery" },
  { path: "about", component: "x-about" },
  { path: "guestbook", component: "x-guestbook" },
  { path: "(.*)", redirect: "explore" }
];

@customElement("x-app")
export default class App extends BaseComponent {
  @query("main") private $main!: HTMLElement;
  private router: any;

  firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this.router = new Router(this.$main);
    this.router.setRoutes(ROUTES);
  }

  render() {
    return html`
      <header>
        <x-navbar></x-navbar>
      </header>
      <main role="main"></main>
    `;
  }
}
