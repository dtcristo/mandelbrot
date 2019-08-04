import copy from "rollup-plugin-copy";
import nodeResolve from "rollup-plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";
import postcss from "rollup-plugin-postcss";
import minifyHTML from "rollup-plugin-minify-html-literals";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/main.ts",
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: true
    },
    plugins: [
      copy({
        targets: [
          {
            src: [
              "src/index.html",
              "../mandelbrot-core/pkg/mandelbrot_core_bg.wasm"
            ],
            dest: "dist"
          }
        ],
        verbose: true
      }),
      nodeResolve({ modulesOnly: true }),
      ts({ tsconfig: "tsconfig.json" }),
      postcss({
        extract: true,
        sourceMap: true,
        minimize: production
      }),
      production && minifyHTML(),
      production && terser(),
      !production && livereload("dist")
    ],
    watch: { clearScreen: false }
  },
  {
    input: "src/worker/worker.ts",
    output: {
      dir: "dist",
      format: "iife",
      sourcemap: true
    },
    plugins: [
      nodeResolve({ modulesOnly: true }),
      ts({ tsconfig: "src/worker/tsconfig.json" }),
      production && terser()
    ]
  }
];
