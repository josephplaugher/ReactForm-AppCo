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
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",query: {compact: true}
        }
      }
    ]
  }
  /*,
  externals: {
    'react': 'commonjs react', // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    'axios': 'commonjs axios'  
  }*/
};