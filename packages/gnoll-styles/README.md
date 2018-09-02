# gnoll-styles

Adds support for CSS and SCSS for Gnoll.

## Install

```
npm i gnoll-styles
```

## Usage

You need to create `webpack.config.js` file in the your project
and add extend base config with scss plugin:

```js
//webpack.config.js
const merge = require('webpack-merge')
const baseConfig = require('gnoll/config/webpack')
const stylesConfig = require('gnoll-styles')

module.exports = merge(baseConfig, stylesConfig)
```

Files with extensions `.module.css` or `.module.scss` use 
[CSS Modules](https://github.com/css-modules/css-modules)

## Postcss configuration

Postcss config includes following plugins:

- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
- minification with `css-nano` in production mode

If you want to change config, you can create file `postcss.config.js` in the
your project directory and extend the default config:

```js
// postcss.config.js
const baseConfig = require('gnoll-styles/config/postcss')

module.exports = {
    ...baseConfig,
    plugins: [
        ...baseConfig.plugins,
        'some-plugin'
    ]
}
```

## License

Public domain, see the LICENCE file.
