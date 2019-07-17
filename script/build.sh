#!/bin/sh
set -ex

# Build Rust shared WASM library
wasm-pack build mandelbrot-core --target web

# Build web frontend
cd mandelbrot-web/
npm run build
cd ../
