const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",//keeping react files around, but we're not going to use them for now
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  externals: {
    'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    },
  watch: true,
  mode: 'production',
  devtool: 'source-map'
};