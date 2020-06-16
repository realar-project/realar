import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

import pkg, { peerDependencies } from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: pkg.source,
  output: [{
    file: pkg.main,
    format: 'cjs'
  },{
    file: pkg.module,
    format: 'es'
  }],
  external: Object.keys(peerDependencies),
  plugins: [
    resolve({ extensions }),
    babel({ extensions }),
  ]
}
