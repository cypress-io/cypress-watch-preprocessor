# Cypress Watch Preprocessor

A simple Cypress preprocessor for watching files. Will not change the files at all, but watches for a file to be saved and notifies Cypress to re-run.

Note that while this is a "preprocessor," it does _not_ transpile or bundle your files at all. It only watches them. They are served to the browser _as-is_. The browser must support any JavaScript features you use or your tests will not be able to run. If you wish to use more advanced JavaScript features that need to be transpiled, use the default preprocessor or the [webpack preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor), which transpile, bundle, and watch your spec files.

## Installation

Requires [Node](https://nodejs.org) version 6.5.0 or above.

```sh
npm install --save-dev @cypress/watch-preprocessor
```

## Usage

Learn more about how the Plugins file works, see [plugins file](https://on.cypress.io/plugins-file).

### Cypress 10.0+

```javascript
const { defineConfig } = require("cypress");
const watch = require("@cypress/watch-preprocessor");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", watch());
    },
  },
});
```

### Prior to Cypress 10.0

```javascript
const watch = require("@cypress/watch-preprocessor");

module.exports = (on) => {
  on("file:preprocessor", watch());
};
```

## Contributing

Run all tests once:

```shell
npm test
```

Run tests in watch mode:

```shell
npm run test-watch
```

## License

This project is licensed under the terms of the [MIT license](/LICENSE.md).
