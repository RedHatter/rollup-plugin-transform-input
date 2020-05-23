export default {
  input: 'index.mjs',
  plugins: [],
  external: ['@rollup/pluginutils', 'fs', 'path'],
  output: [{
      file: 'index.js',
      format: 'cjs'
    }
  ]
};
