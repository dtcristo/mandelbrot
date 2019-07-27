import { html, customElement, property } from "lit-element";

import BaseElement from "./base_element";
import "./mandelbrot";

@customElement("x-navbar")
export default class Navbar extends BaseElement {
  @property() burgerActive = false;

  onBurgerClick() {
    console.log("burger clicked");
    this.burgerActive = !this.burgerActive;
  }

  render() {
    return html`
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <h1 class="title is-4">mandelbrot</h1>
          </a>
          <a
            role="button"
            class="navbar-burger${this.burgerActive ? " is-active" : ""}"
            aria-label="menu"
            aria-expanded="${this.burgerActive ? "true" : "false"}"
            @click=${this.onBurgerClick}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div class="navbar-menu${this.burgerActive ? " is-active" : ""}">
          <div class="navbar-start">
            <a
              class="navbar-item${this.burgerActive ? "" : " is-tab"} is-active"
            >
              <span class="icon has-text-primary">
                <i class="fas fa-compass"></i>
              </span>
              <span>
                Explore
              </span>
            </a>

            <a class="navbar-item${this.burgerActive ? "" : " is-tab"}">
              <span class="icon has-text-warning">
                <i class="fas fa-star"></i>
              </span>
              <span>
                Gallery
              </span>
            </a>

            <a class="navbar-item${this.burgerActive ? "" : " is-tab"}">
              <span class="icon has-text-info">
                <i class="fas fa-info"></i>
              </span>
              <span>
                About
              </span>
            </a>
          </div>

          <div class="navbar-end">
            <!-- <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                <span class="icon">
                  <i class="fas fa-cog"></i>
                </span>
                <span>
                  Configure
                </span>
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item">
                  About
                </a>
                <a class="navbar-item">
                  Jobs
                </a>
                <a class="navbar-item">
                  Contact
                </a>
                <hr class="navbar-divider" />
                <a class="navbar-item">
                  Report an issue
                </a>
              </div>
            </div> -->
            <div class="navbar-item">
              <div class="buttons">
                <!-- <a class="button is-info">
                  <strong>Sign up</strong>
                </a>
                <a class="button is-dark">
                  Log in
                </a> -->
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
