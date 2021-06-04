import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';

const dev: Configuration = merge(common, {
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
		stats              : 'minimal',
		port               : 5500,
		host               : '0.0.0.0',
		overlay            : true,
		historyApiFallback : true,
		contentBase        : './docs',
		hot                : true
	},
});

export default dev;