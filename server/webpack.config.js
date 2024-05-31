/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { IgnorePlugin, DefinePlugin } = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  entry: './src/main',
  target: 'node',
  externals: [],
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
    // path: path.resolve(__dirname, 'process'),
    path: path.resolve(__dirname, '..', 'client', 'electron', 'server'),
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
    new ForkTsCheckerWebpackPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // port
      'process.env.SERVER_PORT': process.env.SERVER_PORT,
      // database
      'rocess.env.DB_USERNAME': process.env.DB_USERNAME,
      'process.env.DB_PASSWORD': process.env.DB_PASSWORD,
      'process.env.DB_HOST': process.env.DB_HOST,
      'process.env.DB_PORT': process.env.DB_PORT,
      'process.env.DB_DATE_BASE': process.env.DB_DATE_BASE, // // host node18+ 的 localhost 默认 ipv6 可能会导致数据库连接出现问题
      'process.env.DB_SYNCHRONIZE': process.env.DB_SYNCHRONIZE,
      'process.env.DB_RETRY_DELAY': process.env.DB_RETRY_DELAY,
      'process.env.DB_RETRY_ATTEMPTS': process.env.DB_RETRY_ATTEMPTS,
      'process.env.DB_AUTO_LOAD_ENTITIES': process.env.DB_AUTO_LOAD_ENTITIES,
      // common
      'process.env.V_CODE_OPEN': process.env.V_CODE_OPEN, // 是否开启验证码
      'process.env.USER_DIR': process.env.USER_DIR, // 用户目录
      'process.env.PUBLIC_DIR': process.env.PUBLIC_DIR, // 公共目录
      'process.env.STATIC_RESOURCE_PREFIX': process.env.STATIC_RESOURCE_PREFIX,
      'process.env.PRIVATE_DIR': process.env.PRIVATE_DIR, // 私有目录
      'process.env.LOG_DIR': process.env.LOG_DIR, // 日志目录
      'process.env.LOG_OPEN': process.env.LOG_OPEN, // 是否开启系统日志
      // auth
      'process.env.JWT_SECRET': process.env.JWT_SECRET,
      'process.env.JWT_EXPIRES_IN': process.env.JWT_EXPIRES_IN
    })
  ]
}
