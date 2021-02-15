import { customElement, html, query, PropertyValues } from "lit-element";
import { Router } from "../vendor/vaadin-router";

import BaseComponent from "./base_component";
import "./navbar";
import "./pages/explore";
import "./pages/gallery";
import "./pages/about";

const ROUTES: Router.Route[] = [
  { path: "explore", redirect: "explore/-0.666/0/0/100" },
  {
    path: "explore/:centreX/:centreY/:zoom/:maxIterations",
    component: "x-explore"
  },
  { path: "gallery", component: "x-gallery" },
  { path: "about", component: "x-about" },
  { path: "(.*)", redirect: "explore" }
];

@customElement("x-app")
export default class App extends BaseComponent {
  @query("main") private $main!: HTMLElement;
  private router!: Router;

  firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this.router = new Router(this.$main, { purgeOutlet: true });
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
