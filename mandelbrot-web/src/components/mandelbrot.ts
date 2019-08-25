import {
  html,
  customElement,
  query,
  PropertyValues,
  property
} from "lit-element";
import { throttle } from "lodash-es";

import BaseElement from "./base_component";
import init, { pixelToCoords } from "../../../mandelbrot-core/pkg";

const worker = new Worker("worker.js");

const initPromise = new Promise(async resolve => {
  await init("mandelbrot_core_bg.wasm");
  resolve();
});

let nextInstanceId = 0;

export interface MandelbrotLocation {
  centreX: number;
  centreY: number;
  zoom: number;
  maxIterations: number;
}

@customElement("x-mandelbrot")
export default class Mandelbrot extends BaseElement {
  centreX = -0.666;
  centreY = 0;
  zoom = 0;
  maxIterations = 100;
  navigatable = false;
  @property({ attribute: false }) private imageData?: ImageData;
  @query("canvas") private $canvas!: HTMLCanvasElement;
  private instanceId = nextInstanceId++;

  private throttledHandleResize = throttle(this.handleResize.bind(this), 1000, {
    leading: false
  });

  private handleWorkerMessage = (event: MessageEvent) => {
    if (event.data.instanceId !== this.instanceId) {
      return;
    }
    this.imageData = event.data.imageData;
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.throttledHandleResize);
    worker.addEventListener("message", this.handleWorkerMessage);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.throttledHandleResize);
    worker.removeEventListener("message", this.handleWorkerMessage);
  }

  firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this.resizeCanvas();
    this.triggerWorker();
  }

  updated(props: PropertyValues) {
    super.updated(props);
    this.renderCanvas();
  }

  triggerWorker() {
    worker.postMessage({
      instanceId: this.instanceId,
      width: this.$canvas.width,
      height: this.$canvas.height,
      centreX: this.centreX,
      centreY: this.centreY,
      zoom: this.zoom,
      maxIterations: this.maxIterations
    });
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
      `explore/${this.centreX}/${this.centreY}/${this.zoom}/${this.maxIterations}`
    );
    this.triggerWorker();
  }

  handleResize() {
    if (this.resizeCanvas()) {
      this.triggerWorker();
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

  renderCanvas() {
    if (this.imageData) {
      const ctx = this.$canvas.getContext("2d");
      ctx && ctx.putImageData(this.imageData, 0, 0);
    }
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
