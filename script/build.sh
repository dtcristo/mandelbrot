#!/bin/sh
set -e
wasm-pack build mandelbrot-core --target web
cd mandelbrot-web/ && npm install && npm run build
