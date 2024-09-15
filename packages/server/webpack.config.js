/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { IgnorePlugin } = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  entry: './src/main',
  target: 'node',
  // ffmpeg 是一个外部二进制模块，不能直接打包
  externals: ['@ffmpeg-installer/ffmpeg'],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true }
        }
        // exclude: /node_modules/
      }
    ]
  },
  // 打包后的文件名称以及位置
  output: {
    filename: 'server.cjs',
    path: path.resolve(__dirname, '..', 'client', 'server'),
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      src: path.resolve(__dirname, 'src')
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
          'class-transformer'
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
    new ForkTsCheckerWebpackPlugin()
    // 需要将 ffmpeg 依赖复制到项目中，不同安装模式下路径不一，建议直接手动复制
    // new CopyPlugin({
    //   patterns: [
    //     // npm 安装
    //     {
    //       from: './node_modules/@ffmpeg-installer',
    //       to: '../client/server/node_modules/@ffmpeg-installer'
    //     },
    //     // pnpm 安装
    //     {
    //       from: './node_modules/.pnpm/@ffmpeg-installer+ffmpeg@1.1.0',
    //       to: '../client/server/node_modules/@ffmpeg-installer'
    //     }
    //   ]
    // })
  ]
}
/**
 * 值得注意的是，这里打包结果是没有包含环境变量的
 * 也没办法在服务端打包时对环境变量进行硬编码，因为拿到 electron 启动时，那边的环境变量也会覆盖掉硬编码的数据
 */
