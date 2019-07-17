#!/bin/bash
set -e
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --force
cd mandelbrot-web/ && npm install && cd ../
if [ "$CIRCLECI" == "true" ]; then
  npm set prefix=/home/circleci/npm
  echo 'export PATH="/home/circleci/npm/bin:$PATH"' >> $BASH_ENV
  source $BASH_ENV
fi
npm install -g firebase-tools
