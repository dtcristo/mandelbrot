import throttle from "lodash-es/throttle";

import init, { render } from "../../mandelbrot-core/pkg";

let initDone = false;
let centre_x = -0.666;
let centre_y = 0;
let zoom = 0;
let max_iterations = 100;

async function main() {
  await untilInit();
  window.onresize = throttle(handleResize, 1000, { leading: false });
  handleResize();
}

async function untilInit() {
  if (!initDone) {
    await init("mandelbrot_core_bg.wasm");
    initDone = true;
  }
}

function handleResize() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (resizeCanvas(canvas)) {
    renderToCanvas(canvas);
  }
}

function resizeCanvas(canvas: HTMLCanvasElement): boolean {
  const multiplier = window.devicePixelRatio || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

function renderToCanvas(canvas: HTMLCanvasElement) {
  const data = render(
    canvas.width,
    canvas.height,
    centre_x,
    centre_y,
    zoom,
    max_iterations
  );
  const imageData = new ImageData(
    new Uint8ClampedArray(data),
    canvas.width,
    canvas.height
  );
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.putImageData(imageData, 0, 0);
}

main();
