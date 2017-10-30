const webpack = require('webpack')
const path = require('path')

module.exports = (options = {}) => ([
  {
    entry: './scripts/bte.js',
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bte.js'
    },
    module: {
        loaders: [
           {test: /\.json$/, loader: "json-loader"},
           {
               test: /\.js$/,
               exclude: /(node_modules|bower_components)/,
               loader: 'babel-loader',
               query: {
                  presets: ['babel-preset-latest'],
                  comments: false
                }
            }
        ]
    },
    node: {
        console: true
    },
    plugins: []
  }
])
