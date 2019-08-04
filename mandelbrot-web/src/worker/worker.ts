import init, { render } from "../../../mandelbrot-core/pkg/mandelbrot_core";

const initPromise = new Promise(async resolve => {
  await init("mandelbrot_core_bg.wasm");
  resolve();
});

addEventListener("message", async message => {
  const {
    instanceId,
    width,
    height,
    centreX,
    centreY,
    zoom,
    maxIterations
  } = message.data;
  await initPromise;
  const data = render(width, height, centreX, centreY, zoom, maxIterations);
  const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
  postMessage({ instanceId, imageData });
});
