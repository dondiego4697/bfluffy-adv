import * as path from 'path';
import * as webpack from 'webpack';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

const nodeModulesPath = path.resolve('./node_modules');
const projectPath = path.resolve('./src/client');
const srcPath = path.resolve(projectPath, './src');
const outPath = path.resolve('./out/client');

const babelPlugins = [
	'@babel/plugin-syntax-dynamic-import',
	'@babel/plugin-transform-typescript',
	'@babel/plugin-proposal-class-properties',
	['@babel/plugin-transform-runtime', {
		regenerator: true
	}]
];

const babelOptions = {
	comments: true,
	presets: [
		'@babel/preset-react',
		['@babel/preset-env', {
			modules: 'commonjs',
			loose: true
		}],
		['@babel/preset-typescript', {
			allExtensions: true,
			isTSX: true
		}]
	],
	plugins: babelPlugins
};

const config: webpack.Configuration = {
	mode: 'development',
	devtool: 'source-map',
	target: 'web',
	entry: () => path.resolve(srcPath, './index.tsx'),
	output: {
		path: path.resolve(outPath, './bundles'),
		filename: 'bundle.js'
	},
	plugins: [
		new ExtractTextPlugin('bundle.css'),
	],
	resolve: {
		alias: {
			client: path.resolve(srcPath, './')
		},
		modules: [
			srcPath,
			nodeModulesPath
		],
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	},
	resolveLoader: {
		modules: [nodeModulesPath],
		extensions: ['.js', '.json'],
		mainFields: ['loader', 'main']
	},
	externals: {},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: babelOptions
					},
					{
						loader: 'ts-loader',
						options: {
							configFile: path.resolve(projectPath, './tsconfig.json')
						}
					}
				]
			},
			{
				test: /\.(css|scss)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				})
			}
		]
	}
};

export default (_env: any, argv: any) => {
	if (argv.mode === 'production') {
		config.mode = 'production';
		config.devtool = false;
	} else {
		(config as any).devServer = {
			historyApiFallback: true,
			contentBase: outPath,
			port: 8083
		};
	}

	return config;
};
