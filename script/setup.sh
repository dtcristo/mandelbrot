#!/bin/sh
set -e
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --force
cd mandelbrot-web/ && npm install && cd ../
npm set prefix=/home/circleci/npm
echo 'export PATH=/home/circleci/npm/bin:$PATH' >> /home/circleci/.bashrc
npm install -g firebase-tools
