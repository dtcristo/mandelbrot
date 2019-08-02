import { customElement, html, query, PropertyValues } from "lit-element";
import "@appnest/web-router";
import { IRoute } from "@appnest/web-router";
import { RouterSlot } from "@appnest/web-router/router-slot";

import BaseComponent from "./base_component";
import "./navbar";
import "./router_trigger";
import Explore from "./pages/explore";
import Gallery from "./pages/gallery";
import Guestbook from "./pages/guestbook";
import About from "./pages/about";

const ROUTES: IRoute[] = [
  {
    path: "explore/:centreX/:centreY/:zoom/:maxIterations",
    component: Explore
  },
  { path: "explore", redirectTo: "explore/-0.666/0/0/100" },
  { path: "gallery", component: Gallery },
  { path: "about", component: About },
  { path: "guestbook", component: Guestbook },
  { path: "**", redirectTo: "explore" }
];

@customElement("x-app")
export default class App extends BaseComponent {
  @query("router-slot") private $routerSlot!: RouterSlot;

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
        <router-trigger></router-trigger>
      </main>
    `;
  }
}
