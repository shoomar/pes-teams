import { resolve } from 'path';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import common from './webpack.common';

const production: Configuration = merge(common, {
	mode   : 'production',
	output : {
		path     : resolve(__dirname, 'docs'),
		filename : '[name].[contenthash].js',
		clean    : true,
	},
	module : {
		rules : [
			{
				test : /\.s[ac]ss$/i,
				use  : [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			}
		]
	},
	optimization : {
		moduleIds    : 'deterministic',
		runtimeChunk : 'single',
		splitChunks  : {
			cacheGroups : {
				vendor : {
					test   : /[\\/]node_modules[\\/]/,
					name   : 'vendors',
					chunks : 'all',
				},
			},
		}
	},
	plugins : [ new MiniCssExtractPlugin({
		filename : '[name].[contenthash].css'
	}) ],
});

export default production;