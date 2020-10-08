module.exports = {
	presets: [require('./babel')],
	plugins: [
		// Stage 0
		require('@babel/plugin-proposal-function-bind').default,

		// Stage 1
		require('@babel/plugin-proposal-export-default-from').default,
		require('@babel/plugin-proposal-logical-assignment-operators').default,
		[
			require('@babel/plugin-proposal-pipeline-operator').default,
			{ proposal: 'minimal' }
		],
		require('@babel/plugin-proposal-do-expressions').default,

		// Stage 2
		[
			require('@babel/plugin-proposal-decorators').default,
			{ legacy: true }
		],
		require('@babel/plugin-proposal-function-sent').default,
		require('@babel/plugin-proposal-export-namespace-from').default,
		require('@babel/plugin-proposal-numeric-separator').default,
		require('@babel/plugin-proposal-throw-expressions').default,

		// Stage 3
		require('@babel/plugin-syntax-import-meta').default,
		[
			require('@babel/plugin-proposal-class-properties').default,
			{ loose: true }
		],
		require('@babel/plugin-proposal-json-strings').default
	]
}
