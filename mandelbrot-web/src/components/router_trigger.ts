import { customElement, LitElement } from "lit-element";

@customElement("router-trigger")
export default class RouterTrigger extends LitElement {
  onClick = (event: MouseEvent) => {
    // ignore the click if the default action is prevented
    if (event.defaultPrevented) {
      return;
    }

    // ignore the click if not with the primary mouse button
    if (event.button !== 0) {
      return;
    }

    // ignore the click if a modifier key is pressed
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // find the <a> element that the click is at (or within)
    let anchor = event.target;
    for (const target of event.composedPath()) {
      if (target instanceof HTMLAnchorElement) {
        anchor = target;
        break;
      }
    }

    // ignore the click if not at an <a> element
    if (!anchor || !(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    // ignore the click if the target is external to the app
    if (anchor.origin !== window.location.origin) {
      return;
    }

    // ignore the click if the <a> element has a non-default target
    if (anchor.target && anchor.target.toLowerCase() !== "_self") {
      return;
    }

    // ignore the click if the <a> element has the 'download' attribute
    if (anchor.hasAttribute("download")) {
      return;
    }

    // ignore the click if the target URL is a fragment on the current page
    if (
      anchor.pathname === window.location.pathname &&
      anchor.search === window.location.search &&
      anchor.hash !== ""
    ) {
      return;
    }

    // if none of the above, convert the click into a navigation event
    event.preventDefault();
    history.pushState(null, "", anchor.pathname + anchor.search + anchor.hash);
  };

  connectedCallback() {
    super.connectedCallback();
    window.document.addEventListener("click", this.onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.document.removeEventListener("click", this.onClick);
  }
}
