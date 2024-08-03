import typescriptEslint from 'typescript-eslint';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory     : __dirname,
	recommendedConfig : js.configs.recommended,
	allConfig         : js.configs.all
});

export default [
	{
		ignores : [ 'public', 'dist', 'build', 'node_modules' ],
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	),
	{
		plugins : {
			'@typescript-eslint' : typescriptEslint.plugin,
		},

		languageOptions : {
			globals : {
				...globals.browser,
				Atomics           : 'readonly',
				SharedArrayBuffer : 'readonly',
			},

			parser : typescriptEslint.parser,
			// ecmaVersion : 5,
			// sourceType  : 'script',

			parserOptions : {
				project : [ './tsconfig.json' ],
			},
		},

		settings : {},

		rules : {
			'array-bracket-newline' : [ 'error', 'consistent' ],

			'array-bracket-spacing' : [ 'error', 'always', {
				objectsInArrays : true,
				arraysInArrays  : true,
			} ],

			'arrow-parens'  : 'error',
			'arrow-spacing' : 'error',

			'brace-style' : [ 'error', 'stroustrup', {
				allowSingleLine : true,
			} ],

			'comma-spacing' : [ 'error', {
				before : false,
				after  : true,
			} ],

			'generator-star-spacing' : [ 'error', {
				before : true,
				after  : false,
			} ],

			indent : [ 'error', 'tab', {
				SwitchCase : 1,
			} ],

			'jsx-quotes' : [ 'error', 'prefer-double' ],

			'key-spacing' : [ 'error', {
				singleLine : {
					beforeColon : false,
					afterColon  : true,
				},

				multiLine : {
					beforeColon : true,
					afterColon  : true,
					align       : 'colon',
				},
			} ],

			'keyword-spacing' : 'error',
			'linebreak-style' : [ 'error', 'unix' ],
			'no-extra-parens' : 'off',

			'object-curly-newline' : [ 'error', {
				consistent : true,
				multiline  : true,
			} ],

			'object-curly-spacing' : [ 'error', 'always', {
				arraysInObjects  : true,
				objectsInObjects : true,
			} ],

			'object-property-newline' : [ 'error', {
				allowAllPropertiesOnSameLine : true,
			} ],

			'prefer-const' : [ 'error', {
				'destructuring'          : 'any',
				'ignoreReadBeforeAssign' : false
			} ],

			quotes : [ 'error', 'single', {
				avoidEscape           : true,
				allowTemplateLiterals : true,
			} ],

			'@typescript-eslint/member-delimiter-style' : 'error',

			'@typescript-eslint/no-extra-parens' : [ 'error', 'all', {
				ignoreJSX                   : 'multi-line',
				enforceForArrowConditionals : false,
				returnAssign                : false,
				nestedBinaryExpressions     : false,
				conditionalAssign           : false,
			} ],

			'@typescript-eslint/no-extra-semi' : [ 'error' ],

			'@typescript-eslint/no-misused-promises' : [ 'error', {
				checksVoidReturn : false,
			} ],

			'@typescript-eslint/no-non-null-assertion'   : 'warn',
			'@typescript-eslint/no-unsafe-call'          : 'warn',
			'@typescript-eslint/no-unsafe-member-access' : 'warn',
			'@typescript-eslint/no-unused-vars'          : 'error',

			'@typescript-eslint/restrict-template-expressions' : [ 'error', {
				allowNullish : true,
			} ],

			'@typescript-eslint/semi'                    : [ 'error' ],
			'@typescript-eslint/type-annotation-spacing' : 'error',
			semi                                         : [ 'off' ],
			'space-before-blocks'                        : [ 'error', 'always' ],

			'space-infix-ops' : [ 'error', {
				int32Hint : true,
			} ],
		},
	},
	{
		files : [ '**/*.js', '**/*.mjs' ],

		rules : {
			'@typescript-eslint/no-var-requires'               : 'off',
			'@typescript-eslint/no-unsafe-member-access'       : 'warn',
			'@typescript-eslint/no-unsafe-assignment'          : 'warn',
			'@typescript-eslint/no-unsafe-call'                : 'warn',
			'@typescript-eslint/restrict-template-expressions' : 'warn',
		},
	}
];