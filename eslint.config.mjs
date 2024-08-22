import typescriptEslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
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
		ignores : [ 'public', 'dist', 'build', 'node_modules', 'docs' ],
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	),
	{
		plugins : {
			'@typescript-eslint' : typescriptEslint.plugin,
			'@stylistic'         : stylistic
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
			'@stylistic/array-bracket-newline' : [ 'warn', 'consistent' ],

			'@stylistic/array-bracket-spacing' : [ 'warn', 'always', {
				objectsInArrays : true,
				arraysInArrays  : true,
			} ],

			'@stylistic/arrow-parens' : 'warn',

			'@stylistic/arrow-spacing' : 'warn',

			'@stylistic/brace-style' : [ 'warn', 'stroustrup', {
				allowSingleLine : true,
			} ],

			'@stylistic/comma-spacing' : [ 'warn', {
				before : false,
				after  : true,
			} ],

			'@stylistic/function-call-spacing' : [ 'warn', 'never' ],

			'@stylistic/function-call-argument-newline' : [ 'warn', 'consistent' ],

			'@stylistic/function-paren-newline' : [ 'warn', 'consistent' ],

			'@stylistic/generator-star-spacing' : [ 'warn', {
				before : true,
				after  : false,
			} ],

			'@stylistic/indent' : [ 'warn', 'tab', {
				SwitchCase : 1,
			} ],

			'@stylistic/jsx-quotes' : [ 'warn', 'prefer-double' ],

			'@stylistic/key-spacing' : [ 'warn', {
				singleLine : {
					beforeColon : false,
					afterColon  : true,
				},
				multiLine : {
					beforeColon : true,
					afterColon  : true,
					align       : 'colon'
				},
			} ],

			'@stylistic/keyword-spacing' : 'warn',

			'@stylistic/linebreak-style' : [ 'warn', 'unix' ],

			'@stylistic/object-curly-newline' : [ 'warn', {
				consistent : true,
				multiline  : true,
			} ],

			'@stylistic/object-curly-spacing' : [ 'warn', 'always', {
				arraysInObjects  : true,
				objectsInObjects : true,
			} ],

			'@stylistic/object-property-newline' : [ 'warn', {
				allowAllPropertiesOnSameLine : true,
			} ],

			'prefer-const' : [ 'error', {
				'destructuring'          : 'any',
				'ignoreReadBeforeAssign' : false
			} ],

			'@stylistic/quotes' : [ 'warn', 'single', {
				avoidEscape           : true,
				allowTemplateLiterals : true,
			} ],

			'@stylistic/member-delimiter-style' : 'warn',

			'@stylistic/no-extra-parens' : [ 'warn', 'all', {
				ignoreJSX                   : 'multi-line',
				enforceForArrowConditionals : false,
				returnAssign                : false,
				nestedBinaryExpressions     : false,
				conditionalAssign           : false,
			} ],

			'@stylistic/no-extra-semi' : [ 'warn' ],

			'@typescript-eslint/no-misused-promises' : [ 'error', {
				checksVoidReturn : false,
			} ],

			'@typescript-eslint/no-non-null-assertion' : 'warn',

			'@typescript-eslint/no-unsafe-call' : 'warn',

			'@typescript-eslint/no-unsafe-enum-comparison' : 'warn',

			'@typescript-eslint/no-unsafe-member-access' : 'warn',

			'@typescript-eslint/no-unused-vars' : 'error',

			'@typescript-eslint/restrict-template-expressions' : [ 'error', {
				allowNullish : true,
			} ],

			'@stylistic/semi' : [ 'warn' ],

			'@stylistic/type-annotation-spacing' : [ 'warn', {
				overrides : {
					colon : {
						before : false,
						after  : true
					}
				}
			} ],

			'@stylistic/space-before-blocks' : [ 'warn', 'always' ],

			'@stylistic/space-infix-ops' : [ 'warn', {
				int32Hint : true,
			} ],
		},
	},
	{
		files : [ '**/*.js', '**/*.mjs' ],

		rules : {
			'@typescript-eslint/no-var-requires' : 'off',

			'@typescript-eslint/no-unsafe-member-access' : 'warn',

			'@typescript-eslint/no-unsafe-assignment' : 'warn',

			'@typescript-eslint/no-unsafe-call' : 'warn',

			'@typescript-eslint/restrict-template-expressions' : 'warn',
		},
	}
];