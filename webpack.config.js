const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  // UMD build (for browser)
  {
    entry: './src/bj-pass-auth-widget.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bj-pass-auth-widget.umd.js',
      library: {
        name: 'BjPassAuthWidget',
        type: 'umd',
        export: 'default',
        umdNamedDefine: true
      },
      globalObject: 'this',
      clean: false
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
    externals: {},
    devtool: 'source-map'
  },
  
  // ESM build (for modern bundlers)
  {
    name: 'esm',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bj-pass-auth-widget.esm.js',
      library: {
        type: 'module',
      },
      module: true,
      environment: {
        module: true,
        arrowFunction: true,
      },
      clean: false
    },
    experiments: {
      outputModule: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                ['@babel/preset-env', {
                  targets: {
                    esmodules: true
                  },
                  bugfixes: true
                }],
                '@babel/preset-react'
              ]
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    esmodules: true
                  },
                  bugfixes: true
                }]
              ]
            }
          }
        }
      ]
    },
    optimization: {
      minimize: false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    externalsType: 'module',
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    devtool: 'source-map'
  },
  
  // CommonJS build (for Node.js)
  {
    entry: './src/bj-pass-auth-widget.js',
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bj-pass-auth-widget.cjs.js',
      library: {
        type: 'commonjs2'
      },
      clean: false
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
                    node: '18'
                  }
                }]
              ]
            }
          }
        }
      ]
    },
    optimization: {
      minimize: false,
    },
    resolve: {
      extensions: ['.js']
    },
    externals: {},
    devtool: 'source-map'
  }
]; 