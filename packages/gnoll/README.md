# Gnoll :japanese_ogre:

Tool for fast and easy bootstraping Webpack & React projects. 
It can perform basic tasks without any configuration files.
But if you need to change some settings, you can create config files 
in the your project and extend the default configuration.

- [Install](#install)
- [Commands](#commands)
- [Configuration](#configuration)

## Install

```
npm install gnoll
```

## Commands

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

### build

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

### watch

Creates development build and rebuild on changes.
<br>
This command has same options as `build`, but
default value for the `--env` option is `development`

### start

Starts webpack development server.
<br>
This command has the same options as `build` except for
`--env` (it always is set to `development`) and `--target` (always is `web`)

### lib

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

### Env vars

```
NODE_ENV
GNOLL_TARGET
GNOLL_ASSETS_CACHING
GNOLL_DEV_SERVER
GNOLL_LIB
```

### Webpack

It builds entry `src/index.js` and outputs results to directory
`build/web` or `build/node` depending on the target options value.

You can read in next section what is included in default config.
If you want to change something in it, for example, add plugins or loaders,
you can extend default config by creating `webpack.config.js` in your project.

This example uses 
[webpack-merge](https://github.com/survivejs/webpack-merge) package,

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

Javascript

Styles:

Static files:

These formats are built using `file-loader`:

- images: `png` `svg` `jpg` `jpeg` `gif` `webp`
- fonts: `eot` `ttf` `woff` `woff2`
- media: `mp4` `ogg` `webm` `mp3`

### Babel

Javascript is compiled using Babel.
<br>
In addition to ES6 syntax features, it also supports:

- Unfinished proposals to the ES standard
	([`babel-preset-stage-0`](https://babeljs.io/docs/plugins/preset-stage-0/))
- JSX syntax

When building for production code is minified by UglifyJS.

## License

Public domain, see the LICENCE file.
