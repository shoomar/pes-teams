import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const common: Configuration = {
	entry  : './src/index.ts',
	module : {
		rules : [
			{
				test   : /\.html$/i,
				loader : 'html-loader',
			},
			{
				test : /\.tsx?$/,
				use  : 'ts-loader',
			},
		]
	},
	resolve : { extensions: [ '.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json' ] },
	plugins : [
		new HtmlWebpackPlugin({
			template : './src/index.html',
			hash     : true,
		})
	],
};

export default common;