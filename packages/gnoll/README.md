# Gnoll :japanese_ogre:

Tool for fast and easy bootstraping Webpack & React projects. 
It can perform basic tasks without any configuration files.
But if you need to change some settings, you can create config files 
in the your project and extend the default configuration.

## Table of content

- [Install](#install)
- [Commands](#commands)
- [Configuration](#configuration)
- [License](#license)

## Install

```
npm install gnoll
```

Gnoll has command line interface.
You can add commands to the `package.json` file:

```json
{
  "scripts": {
    "start": "gnoll start",
    "build": "gnoll build"
  }
}
```

## Commands

### gnoll build

Creates optimized production build.

#### Options

- `-e, --entry path`
  <br>
  Default: `./src/index.js`
  <br>
  Webpack entry file.

- `-o, --out path`
  <br>
  Default: `./build`
  <br>
  Path to the output directory.

- `--html path/to/index.html`
  <br>
  Default: `./src/index.html` (if exists)
  <br>
  Page that will be bundled with automatically injected assets 
  using `html-webpack-plugin`.
  <br>
  If you want to explicitly disable building html, use option `--no-html`.

- `--config path/to/webpack.config.js`
  <br>
  This option allows to provide path to the custom webpack config file.

- `--env=development|production`
  <br>
  Default: `production`
  <br>
  Value of the `NODE_ENV` environment variable.

- `--target=web|node`
  <br>
  Default: `web`
  <br>
  This options allows to specify target platform.
  - `babel-preset-env` transpiles for node target
  - sets webpack:
  	libraryTarget commonjs
  	target: node

- `--assets-caching`
  <br>
  This option enables optimizations for long term caching of static assets.
  <br>
  Optimizations are based on this guide from webpack documentation &ndash;
  https://webpack.js.org/guides/caching/
    - It inserts hash of file content in its filename.
    This allows to cache files forever, because changed files will always have
    different names.
    - Generates `manifest.json` file that maps original filenames to hashed 
	ones.

### gnoll watch

Creates development build and rebuild on changes.
<br>
This command has same options as `build`, but
default value for the `--env` option is `development`

### gnoll start

Starts webpack development server.
<br>
This command has the same options as `build` except for
`--env` (it always is set to `development`) and `--target` (always is `web`)

### gnoll lib

Use this command if you want to build library that should provide modules.
<br>
When building library, js files are compiled by Babel.
Format of the modules is changed to CommonJS.
All other files are copied as is. Result is placed in the `lib` directory.

**Options:**

`--target=web|node`

`-e, --entry`
<br>
Default: `./src`

`-o, --out`
<br>
Default: `./lib`

`--watch`
<br>
Starts watcher that recompiles files on changes.

`--source-maps`
<br>
Embed inline source maps into compiled files.

## Configuration

This section describes how you can change configuration.

### Webpack

Default webpack config includes following loaders:

- `babel-loader` for `js` and `jsx` files
- `file-loader` for the following formats:
	- images: `png` `svg` `jpg` `jpeg` `gif` `webp`
	- fonts: `eot` `ttf` `woff` `woff2`
	- media: `mp4` `ogg` `webm` `mp3`

Building styles is not included in gnoll by default, but you can add it with 
[gnoll-scss](https://github.com/sunflowerdeath/gnoll/tree/master/packages/gnoll-scss) plugin.

If you want to change something in the webpack config, you can create
`webpack.config.js` in your project and extend the default config.
For convenience, you can use 
[webpack-merge](https://github.com/survivejs/webpack-merge)
for merging several webpack configs.

```js
const merge = require('webpack-merge')
const baseConfig = require('gnoll/config/webpack')

module.exports = merge(baseConfig, {
    plugins [
        somePlugin
    ],
    module: {
        rules: [
            { test: /\.smth$/, loader: 'some-loader' }
        ]
    }
}
```

#### Extracting vendor and runtime chunks

_TODO_

### Babel

Javascript is compiled with Babel.
Default config uses following presets:
- `babel-preset-env` (ES6 syntax features)
- `babel-preset-react` (JSX syntax)
- `babel-preset-stage-0` (Unfinished proposals to the ES standard)

If you want to change change babel config, you can create `.babelrc` or
`babel.config.js` file in the your project or set `babel` property 
in the `package.json`.

For example, this is how you can add support for decorators:
```js
// babel.config.js
const baseConfig = require('gnoll/config/babel')

module.exports = {
    ...baseConfig,
    plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-proposal-decorators',
    ]
}
```

### Browsers

_TODO_

### Env vars

```
NODE_ENV
GNOLL_TARGET
GNOLL_ASSETS_CACHING
GNOLL_DEV_SERVER
GNOLL_LIB
```

## License

Public domain, see the LICENCE file.
