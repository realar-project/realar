import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import pkg, { peerDependencies } from "./package.json";

export default {
  input: "lib",
  output: [{
    file: pkg.main,
    format: "cjs"
  },{
    file: pkg.module,
    format: "es"
  }],
  external: Object.keys(peerDependencies),
  plugins: [
    resolve(),
    ...(
      process.env.REALAR_BUILD_TERSER
        ? [terser()]
        : []
    )
  ]
}
