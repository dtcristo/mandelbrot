#!/bin/sh
set -e
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --force
cd mandelbrot-web/ && npm install && cd ../
npm install -g firebase-tools
