# gnoll-sass

Adds support for CSS and SCSS for Gnoll.

## Install

```
npm i gnoll-sass
```

## Usage

You need to create `webpack.config.js` file in the your project
and add extend base config with scss plugin:

```js
//webpack.config.js
const merge = require('webpack-merge')
const baseConfig = require('gnoll/config/webpack')
const sass = require('gnoll-sass')

module.exports = merge(baseConfig, sass({ cssModules: true }))
```

## Configuration

### CSS modules

You can disable or enable CSS-modules with option `cssModules`.

### Postcss

Postcss config includes following plugins:

- [cssnext](https://github.com/MoOx/postcss-cssnext)
- [postcss-global-import](https://github.com/scherebedov/postcss-global-import)
- minification with `css-nano` in production mode

If you want to change config, you can create `postcss.config.js` file in the
your project and extend the default config:

```js
// postcss.config.js
const baseConfig = require('gnoll-sass/config/postcss')

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
