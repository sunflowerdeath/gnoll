# Gnoll

Tool for fast and easy bootstraping Webpack & React projects. 

It can build code in production and development modes,
and perform other tasks like linting and formatting.

It includes all required dependencies, so you don't need to install them manually.

It contains default config, but if you need to add some plugins or loaders,
you can override it by creating `webpack.config.js` in your project.

Example:

```js
let config = require('clear-ui-builder/src/configs/webpack')

// add pluging
config.plugins.push(...)

// add loader
config.module.rules.push({
	test: /\.json$/,
	loader: 'json-loader'
})

module.exports = config
```

## Commands

### build [--config path]

Creates optimized production build.

Optionally you can provide path to different webpack config.
Without `config` option it uses default config,
or `webpack.config.json` from project's directory if present.

### watch [--config path]

Creates development build and rebuilds on changes.

### start [--config path]

Starts webpack development server.

### lint

Checks source code with ESLint

### format

Format source code using Prettier.

## Included loaders

### Javascript

Babel
	env last 2 versions
	stage-0
	react
	legacy-decorators

### JSON

Json-loader

### Static files

`.png`
`.jpg`
`.webp`
