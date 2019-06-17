// rollup.config.js
import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd'
  },
  plugins: [
    typescript()
  ]
}