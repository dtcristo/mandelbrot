import { html, customElement, query, PropertyValues } from "lit-element";
import { throttle } from "lodash-es";

import BaseElement from "./base_component";
import init, {
  render as renderWasm,
  pixelToCoords
} from "../../../mandelbrot-core/pkg";

let initPromise = new Promise(async resolve => {
  await init("mandelbrot_core_bg.wasm");
  resolve();
});

@customElement("x-mandelbrot")
export default class Mandelbrot extends BaseElement {
  centreX = -0.666;
  centreY = 0;
  zoom = 0;
  maxIterations = 100;
  navigatable = false;

  @query("canvas") private $canvas!: HTMLCanvasElement;

  private throttledHandleResize = throttle(this.handleResize.bind(this), 1000, {
    leading: false
  });

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.throttledHandleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.throttledHandleResize);
  }

  firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this.resizeCanvas();
    this.renderCanvas();
  }

  async handleLeftClick(event: MouseEvent) {
    if (this.navigatable) {
      const multiplier = window.devicePixelRatio || 1;
      const relX = event.pageX - this.$canvas.offsetLeft;
      const relY = event.pageY - this.$canvas.offsetTop;
      await initPromise;
      const point = pixelToCoords(
        relY * multiplier,
        relX * multiplier,
        this.$canvas.width,
        this.$canvas.height,
        this.centreX,
        this.centreY,
        this.zoom
      );
      this.centreX = point.x;
      this.centreY = point.y;
      point.free();
      this.zoom += 1;
      this.navigate();
    }
  }

  handleRightClick(event: MouseEvent) {
    if (this.navigatable) {
      event.preventDefault();
      if (this.zoom > 0) {
        this.zoom -= 1;
        if (this.zoom === 0) {
          this.centreX = -0.666;
          this.centreY = 0.0;
        }
        this.navigate();
      }
    }
  }

  navigate() {
    history.pushState(
      null,
      "",
      `explore/${this.centreX}/${this.centreY}/${this.zoom}/${
        this.maxIterations
      }`
    );
  }

  handleResize() {
    if (this.resizeCanvas()) {
      this.renderCanvas();
    }
  }

  resizeCanvas(): boolean {
    const multiplier = window.devicePixelRatio || 1;
    const width = (this.$canvas.clientWidth * multiplier) | 0;
    const height = (this.$canvas.clientHeight * multiplier) | 0;
    if (this.$canvas.width !== width || this.$canvas.height !== height) {
      this.$canvas.width = width;
      this.$canvas.height = height;
      return true;
    }
    return false;
  }

  async renderCanvas() {
    await initPromise;
    const data = renderWasm(
      this.$canvas.width,
      this.$canvas.height,
      this.centreX,
      this.centreY,
      this.zoom,
      this.maxIterations
    );
    const imageData = new ImageData(
      new Uint8ClampedArray(data),
      this.$canvas.width,
      this.$canvas.height
    );
    const ctx = this.$canvas.getContext("2d");
    ctx && ctx.putImageData(imageData, 0, 0);
  }

  render() {
    return html`
      <canvas
        @click=${this.handleLeftClick}
        @contextmenu=${this.handleRightClick}
      ></canvas>
    `;
  }
}
