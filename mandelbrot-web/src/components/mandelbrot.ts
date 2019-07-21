import { html, customElement } from "lit-element";
import throttle from "lodash-es/throttle";

import { BaseElement } from "./base_element";
import init, {
  render as renderWasm,
  mouseCoords
} from "../../../mandelbrot-core/pkg";

let initPromise: Promise<void> | undefined;

async function untilInit() {
  if (initPromise) {
    await initPromise;
  } else {
    initPromise = new Promise(async resolve => {
      await init("mandelbrot_core_bg.wasm");
      resolve();
    });
    await initPromise;
  }
}

@customElement("x-mandelbrot")
export class Mandelbrot extends BaseElement {
  canvas: HTMLCanvasElement | null = null;
  centreX = -0.666;
  centreY = 0;
  zoom = 0;
  maxIterations = 100;
  throttledHandleResize = throttle(this.handleResize.bind(this), 1000, {
    leading: false
  });

  constructor() {
    super();
    console.log("constructor");
  }

  connectedCallback() {
    console.log("connected");
    super.connectedCallback();
    window.addEventListener("resize", this.throttledHandleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.throttledHandleResize);
  }

  firstUpdated() {
    console.log("firstUpdated");
    this.canvas = this.querySelector("canvas");
    this.resizeCanvas();
    this.updateCanvas();
  }

  render() {
    console.log("render");
    return html`
      <canvas
        @click=${this.handleLeftClick}
        @contextmenu=${this.handleRightClick}
      ></canvas>
    `;
  }

  async handleLeftClick(event: MouseEvent) {
    if (this.canvas) {
      const multiplier = window.devicePixelRatio || 1;
      const relX = event.pageX - this.canvas.offsetLeft;
      const relY = event.pageY - this.canvas.offsetTop;
      console.log("relX", relX, "relY", relY);
      await untilInit();
      const point = mouseCoords(
        this.canvas.width,
        this.canvas.height,
        this.centreX,
        this.centreY,
        this.zoom,
        relX * multiplier,
        relY * multiplier
      );
      this.centreX = point.x;
      this.centreY = point.y;
      point.free();
      this.zoom += 1;
      this.updateCanvas();
    }
  }

  handleRightClick(event: MouseEvent) {
    event.preventDefault();
    if (this.zoom > 0) {
      this.zoom -= 1;
      if (this.zoom === 0) {
        this.centreX = -0.666;
        this.centreY = 0.0;
      }
      this.updateCanvas();
    }
  }

  handleResize() {
    console.log("handleResize");
    if (this.resizeCanvas()) {
      this.updateCanvas();
    }
  }

  resizeCanvas(): boolean {
    console.log("resizeCanvas");
    if (this.canvas) {
      const multiplier = window.devicePixelRatio || 1;
      const width = (this.canvas.clientWidth * multiplier) | 0;
      const height = (this.canvas.clientHeight * multiplier) | 0;
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
        return true;
      }
    }
    return false;
  }

  async updateCanvas() {
    console.log("updateCanvas");
    if (this.canvas) {
      await untilInit();
      const data = renderWasm(
        this.canvas.width,
        this.canvas.height,
        this.centreX,
        this.centreY,
        this.zoom,
        this.maxIterations
      );
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        this.canvas.width,
        this.canvas.height
      );
      const ctx = this.canvas.getContext("2d");
      ctx && ctx.putImageData(imageData, 0, 0);
    }
  }
}
