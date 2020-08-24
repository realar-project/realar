import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import assembly from "./assembly/rollup-plugin";
import prep from "./prep/rollup-plugin";
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
    assembly(),
    prep(),
    ...(
      process.env.REALAR_BUILD_TERSER
        ? [terser()]
        : []
    )
  ]
}
