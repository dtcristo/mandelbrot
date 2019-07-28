import { customElement, html, query, PropertyValues } from "lit-element";
import "@appnest/web-router";
import { IRoute } from "@appnest/web-router";
import { RouterSlot } from "@appnest/web-router/router-slot";

import BaseComponent from "./base_component";
import "./navbar";
import Explore from "./pages/explore";
import Gallery from "./pages/gallery";
import About from "./pages/about";

const ROUTES: IRoute[] = [
  { path: "explore", component: Explore },
  { path: "gallery", component: Gallery },
  { path: "about", component: About },
  { path: "**", redirectTo: "explore" }
];

@customElement("x-app")
export default class App extends BaseComponent {
  @query("router-slot") $routerSlot!: RouterSlot;

  firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this.$routerSlot.routes = ROUTES;
  }

  render() {
    return html`
      <header>
        <x-navbar></x-navbar>
      </header>
      <main role="main">
        <router-slot></router-slot>
      </main>
    `;
  }
}
