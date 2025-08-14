const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/bj-pass-auth-widget.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bj-pass-auth-widget.min.js',
    library: {
      name: 'BjPassAuthWidget',
      type: 'umd',
      export: 'default',
      umdNamedDefine: true
    },
    globalObject: 'this', // Changed from 'window' to 'this' for better SSR compatibility
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not dead']
                },
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ]
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        },
        extractComments: false,
      }),
    ],
  },
  resolve: {
    extensions: ['.js']
  },
  externals: {
    // Add any framework-specific externals if needed
  },
  devtool: 'source-map'
};