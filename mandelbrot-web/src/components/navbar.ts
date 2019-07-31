import { html, customElement, property } from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import "@appnest/web-router/router-link";

import BaseElement from "./base_component";

@customElement("x-navbar")
export default class Navbar extends BaseElement {
  @property() burgerActive = false;

  onBurgerClick() {
    console.log("burger clicked");
    this.burgerActive = !this.burgerActive;
  }

  render() {
    const burgerClass = {
      "navbar-burger": true,
      "is-active": this.burgerActive
    };
    const menuClass = {
      "navbar-menu": true,
      "is-active": this.burgerActive
    };
    const itemClass = {
      "navbar-item": true,
      "is-tab": !this.burgerActive
    };

    return html`
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link class="navbar-item" path="explore">
            <h1 class="title is-4">mandelbrot</h1>
          </router-link>
          <a
            role="button"
            class=${classMap(burgerClass)}
            aria-label="menu"
            aria-expanded="${this.burgerActive ? "true" : "false"}"
            @click=${this.onBurgerClick}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div class=${classMap(menuClass)}>
          <div class="navbar-start">
            <router-link path="explore">
              <a class=${classMap({ ...itemClass, "is-active": false })}>
                <span class="icon has-text-primary">
                  <i class="fas fa-compass"></i>
                </span>
                <span>Explore</span>
              </a></router-link
            >

            <router-link path="gallery">
              <a class=${classMap({ ...itemClass, "is-active": false })}>
                <span class="icon has-text-warning">
                  <i class="fas fa-star"></i>
                </span>
                <span>Gallery</span>
              </a></router-link
            >

            <router-link path="about">
              <a class=${classMap({ ...itemClass, "is-active": false })}>
                <span class="icon has-text-info">
                  <i class="fas fa-info"></i>
                </span>
                <span>About</span>
              </a>
            </router-link>

            <router-link path="guestbook">
              <a class=${classMap({ ...itemClass, "is-active": false })}>
                <span class="icon has-text-danger">
                  <i class="fas fa-book"></i>
                </span>
                <span>Guestbook</span>
              </a></router-link
            >
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a
                  class="button is-light"
                  href="https://github.com/dtcristo/mandelbrot"
                  target="_blank"
                >
                  <span class="icon">
                    <i class="fab fa-lg fa-github-alt"></i>
                  </span>
                  <span>Source</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}
