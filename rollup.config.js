import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/bj-pass-auth-widget.js',
  output: [
    {
      file: 'dist/bj-pass-auth-widget.cjs.js',
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: 'dist/bj-pass-auth-widget.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/bj-pass-auth-widget.umd.js',
      format: 'umd',
      name: 'BjPassAuthWidget'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
};