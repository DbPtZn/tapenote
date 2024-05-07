/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { IgnorePlugin } = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/main',
  target: 'node',
  // 置为空即可忽略webpack-node-externals插件
  externals: {
    // 'PouchDB': 'pouchdb-node'
  },
  module: {
    // noParse: /pouchdb-node/,
    rules: [
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true }
        },
        exclude: /node_modules/
      },
      // {
      //   test: /node-gyp-build\.js$/,
      //   loader: 'string-replace-loader',
      //   options: {
      //     search: /path\.join\(dir, 'prebuilds'/g,
      //     replace: "path.join(__dirname, 'prebuilds'"
      //   }
      // }
    ]
  },
  // 打包后的文件名称以及位置
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      'src': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    // 需要进行忽略的插件
    new IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@fastify/static',
          '@nestjs/microservices',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          'cache-manager',
          'class-validator',
          'class-transformer',
          // 'pouchdb-node'
        ]
        if (!lazyImports.includes(resource)) {
          return false
        }
        try {
          require.resolve(resource, {
            paths: [process.cwd()]
          })
        } catch (err) {
          return true
        }
        return false
      }
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './wasm',
          to: './wasm'
        },
        // {
        //   from: './node_modules/pouchdb-node',
        //   to: './pouchdb-node'
        // }
      ]
    })
  ]
}
