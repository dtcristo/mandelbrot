import throttle from "lodash-es/throttle";

import init, {
  render as renderWasm,
  mouse_coords as mouseCoords
} from "../../mandelbrot-core/pkg";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

let centreX = -0.666;
let centreY = 0;
let zoom = 0;
let maxIterations = 100;

async function main() {
  await init("mandelbrot_core_bg.wasm");
  resizeCanvas();
  render();
  window.onresize = throttle(handleResize, 1000, { leading: false });
  canvas.onclick = handleLeftClick;
  canvas.oncontextmenu = handleRightClick;
}

function handleLeftClick(event: MouseEvent) {
  let point = mouseCoords(
    canvas.width,
    canvas.height,
    centreX,
    centreY,
    zoom,
    event.clientX,
    event.clientY
  );
  centreX = point.x;
  centreY = point.y;
  point.free();
  zoom += 1;
  render();
}

function handleRightClick(event: MouseEvent) {
  event.preventDefault();
  if (zoom > 0) {
    zoom -= 1;
    if (zoom === 0) {
      centreX = -0.666;
      centreY = 0.0;
    }
    render();
  }
}

function handleResize() {
  if (resizeCanvas()) {
    render();
  }
}

function resizeCanvas(): boolean {
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

function render() {
  const data = renderWasm(
    canvas.width,
    canvas.height,
    centreX,
    centreY,
    zoom,
    maxIterations
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
