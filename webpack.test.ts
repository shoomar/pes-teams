
import { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import common from './webpack.common';

const testServer: DevServerConfiguration = {
	devMiddleware : {
		stats : 'minimal',
	},
	client : {
		overlay : true,
	},
	port               : 3000,
	host               : '0.0.0.0',
	historyApiFallback : true,
	static             : './docs',
	hot                : true
};

const test: Configuration = merge(common, {
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
	devServer : testServer
});

export default test;