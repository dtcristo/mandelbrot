#!/bin/sh
set -ex

# Install Rust dependencies
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --force

# Install web frontend dependencies
cd mandelbrot-web/
npm install
cd ../

# Setup location for installing global npm packages
if [ "$CIRCLECI" = "true" ]; then
  npm set prefix=/home/circleci/npm
  echo 'export PATH="/home/circleci/npm/bin:$PATH"' >>$BASH_ENV
  . $BASH_ENV
fi

# Install development and deployment tools
npm install -g firebase-tools
