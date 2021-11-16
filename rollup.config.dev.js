// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/demo-app.ts',
  output: {
    file: './demo/bundle.js',
    format: 'umd'
  },
  plugins: [
    typescript()
  ]
}