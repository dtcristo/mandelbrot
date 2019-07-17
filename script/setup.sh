#!/bin/sh
set -e
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --force
cd mandelbrot-web/ && npm install && cd ../
if [ "$CIRCLECI" = "true" ]; then
  npm set prefix=/home/circleci/npm
  echo 'PATH=/home/circleci/npm/bin:$PATH' >> /home/circleci/.profile
  source /home/circleci/.profile
fi
npm install -g firebase-tools
