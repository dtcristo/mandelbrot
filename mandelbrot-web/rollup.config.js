import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.ts",
  output: {
    dir: "dist/",
    format: "esm",
    sourcemap: true
  },
  plugins: [
    resolve({
      browser: true,
      modulesOnly: true
    }),
    typescript(),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
