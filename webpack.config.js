const path = require('path')

const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'public')
}
// `npm run build` to build dist or `npm start` to run dev server.
const TARGET = process.env.npm_lifecycle_event

var env = process.env.NODE_ENV || 'development'
var isDev = env === 'development'

// Common to both starting dev server and building for production.
const common = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    // chunkFilename: 'common.js',
    publicPath: '/'
  },
  debug: isDev,
  devtool: isDev ? 'eval' : false,
  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: isDev,
      __DEVELOPMENT__: isDev,
      __DEVTOOLS__: isDev,
      'process.env': {
        NODE_ENV: JSON.stringify(env),
        BABEL_ENV: JSON.stringify(env)
      }
    }),
    new HtmlPlugin({
      template: path.join(PATHS.app, 'index-template.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.NoErrorsPlugin()
  ],
	node: {
		fs: 'empty',
		child_process: 'empty'
		},
  module: {
    //preLoaders: [
	//	{
	//		test: /\.jsx?$/, loader: 'eslint', include: PATHS.app
	//	}
	//],
    loaders: [
      {
        test: /\.styl$/, loader: 'style!css!stylus'
      },
      {
        test: /\.jsx?$/, loader: 'babel?cacheDirectory', include: PATHS.app
      },
      {
        test: /\.(png|gif|ico|jpe?g|svg)$/i, loader: 'url?limit=10000'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=public/fonts/[name].[ext]'
      },
      {
        test: /\.csv$/, loader: 'dsv-loader'
      },
      {
        test: /\.json$/, loader: 'json-loader'
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
}

// Default configuration. We will return this if webpack is called outside
// of npm.
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devServer: {
      contentBase: PATHS.build,
      historyApiFallback: true,
      hot: true,
      compress: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 3000
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })
} else if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    plugins: [
      new CleanPlugin(PATHS.build),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 51200 // ~50kb
      }),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false
        }
      })
    ]
  })
}
