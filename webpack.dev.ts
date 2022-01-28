import webpack from 'webpack';
import { Configuration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import common from './webpack.common';

const dev: webpack.Configuration & Configuration  = merge(common, {
	mode    : 'development',
	devtool : 'eval-source-map',
	output  : {
		publicPath : '/',
	},
	module : {
		rules : [
			{
				test : /\.s[ac]ss$/i,
				use  : [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			}
		]
	},
	devServer : {
		devMiddleware : {
			stats : 'minimal'
		},
		client : {
			overlay : true
		},
		static             : [ 'docs' ],
		port               : 5500,
		host               : '0.0.0.0',
		historyApiFallback : true,
		hot                : true,
		watchFiles         : 'src/index.html'
	},
});

export default dev;