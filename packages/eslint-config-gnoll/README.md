# eslint-config-gnoll

Config based on `eslint-config-airbnb` with addition of `eslint-config-prettier`,
which removes all rules related to formatting and replaces them with rule
that gives error when source code doesn't match autoformatted output from the 
Prettier.

## Install

```
npm install eslint-config-gnoll
# peer dependencies
npm install \
    eslint babel-eslint prettier eslint-config-airbnb eslint-config-prettier \
    eslint-import-resolver-webpack eslint-plugin-import \
    eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react
```

Then create `.eslintrc.js`:

```js
module.exports = {
    extends: ['gnoll']
}
```

If you want to change Prettier settings, create `.prettierrc` file
(JSON format) or `prettier.config.js` (JS module).
