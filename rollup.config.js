import { nodeResolve } from "@rollup/plugin-node-resolve";
import u32 from "./u32/rollup-plugin";
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
    nodeResolve(),
    u32()
  ]
}
