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
    library: ['danehansen', 'color'],
    libraryTarget: 'umd',
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
