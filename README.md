# Gnoll

Tool for fast and easy bootstraping Webpack & React projects. 

- It can build code in production and development modes,
and perform other tasks like linting and formatting.
- It includes all required dependencies, so you don't need to install them manually.
- It contains default configuration, but if you need to change some settings,
you can override them in your project.


## Commands

### build [--config path]

Create optimized production build.

This command uses default gnoll config.
You can read in next section what is included in default config.
<br>
If you want to change something, for example, add plugins or loaders,
you can extend default config by creating `webpack.config.js` in your project.

```js
// webpack.config.js

// default config
let config = require('gnoll/config/webpack')

// add plugin
config.plugins.push(plugin)

// add loader
config.module.rules.push({
    test: /\.smth$/,
    loader: 'some-loader'
})

module.exports = config
```

Optionally you can provide path to different webpack config file.

### watch [--config path]

Create development build and rebuild on changes.

### start [--config path]

Start webpack development server.

### lint

Check source code with [ESLint](https://eslint.org).

Default config is based on `eslint-config-airbnb` config, with `eslint-config-prettier`,
which removes all rules related to formatting and replaces them with rule
that gives error when source code doesn't match autoformatted output from the Prettier.

If you need to integrate linting with your IDE or editor plugin, you should
create `.eslintrc.js` file in your project, and extend it from the default config like this:

```js
// .eslintrc.js
module.exports = {
    extends: [
        './node_modules/gnoll/config/eslint.js'
    ]
}
```

Also, you can override any ESLint settings in this file, if you want.

If you want to change Prettier settings, you can create `.prettierrc` (JSON format)
or `prettier.config.js` (JS module) in your project.

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
