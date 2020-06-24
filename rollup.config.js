import babel from '@rollup/plugin-babel';

import pkg, { peerDependencies } from './package.json';

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
    babel({ babelHelpers: 'bundled' })
  ]
}
