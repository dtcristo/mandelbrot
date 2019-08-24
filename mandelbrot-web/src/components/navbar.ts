import { html, customElement, property } from "lit-element";
import { classMap } from "lit-html/directives/class-map";

import BaseElement from "./base_component";

@customElement("x-navbar")
export default class Navbar extends BaseElement {
  @property() private burgerActive = false;
  @property() private activeRoute = "explore";

  private onNavigationEnd = (e: any) => {
    this.activeRoute = e.detail.match.fragments.consumed;
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("navigationend", this.onNavigationEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("navigationend", this.onNavigationEnd);
  }

  onBurgerClick() {
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
      <nav
        class="navbar is-light"
        role="navigation"
        aria-label="main navigation"
      >
        <div class="navbar-brand">
          <a href="" class="navbar-item">
            <h1 class="title is-4">mandelbrot</h1>
          </a>
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
            <a
              href="explore"
              class=${classMap({
                ...itemClass,
                "is-active": this.activeRoute.startsWith("explore")
              })}
            >
              <span class="icon has-text-primary">
                <i class="fas fa-compass"></i>
              </span>
              <span>Explore</span>
            </a>
            <a
              href="gallery"
              class=${classMap({
                ...itemClass,
                "is-active": this.activeRoute.startsWith("gallery")
              })}
            >
              <span class="icon has-text-warning">
                <i class="fas fa-star"></i>
              </span>
              <span>Gallery</span>
            </a>
            <a
              href="about"
              class=${classMap({
                ...itemClass,
                "is-active": this.activeRoute.startsWith("about")
              })}
            >
              <span class="icon has-text-info">
                <i class="fas fa-info"></i>
              </span>
              <span>About</span>
            </a>
            <a
              href="guestbook"
              class=${classMap({
                ...itemClass,
                "is-active": this.activeRoute.startsWith("guestbook")
              })}
            >
              <span class="icon has-text-danger">
                <i class="fas fa-book"></i>
              </span>
              <span>Guestbook</span>
            </a>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a
                  class="button"
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
