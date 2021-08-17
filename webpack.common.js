const path = require('path');

module.exports = {
  entry: {
    app: './src/color.js',
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
  output: {
    filename: 'danehansen-color.min.js',
    globalObject: 'this',
    library: ['danehansen', 'color'],
    libraryTarget: 'umd',
    path: __dirname,
  },
  externals: [
    {
      '@danehansen/format': {
        amd: '@danehansen/format',
        commonjs: '@danehansen/format',
        commonjs2: '@danehansen/format',
        root: ['danehansen', 'format'],
      },
    },
  ],
}
