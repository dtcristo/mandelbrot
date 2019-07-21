import copy from "rollup-plugin-copy";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import postcss from "rollup-plugin-postcss";
import minifyHTML from "rollup-plugin-minify-html-literals";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.ts",
  output: {
    file: "dist/bundle.js",
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
      copyOnce: true,
      verbose: true
    }),
    nodeResolve({
      browser: true,
      modulesOnly: true
    }),
    typescript(),
    postcss({
      extract: true,
      sourceMap: true,
      minimize: production
    }),
    production && minifyHTML(),
    production && terser(),
    !production && livereload("dist")
  ],
  watch: {
    clearScreen: false
  }
};
