# Cypress Watch Preprocessor

A simple Cypress preprocessor for watching files. Will not change the files at all, but watches for a file to be saved and notifies Cypress to re-run.

## Installation

Requires [Node](https://nodejs.org) version 6.5.0 or above.

```sh
npm install --save-dev @cypress/watch-preprocessor
```

## Usage

In your project's [plugins file](https://on.cypress.io/guides/guides/plugins.html):

```javascript
const watch = require('@cypress/watch-preprocessor')

module.exports = (on, config) => {
  on('file:preprocessor', watch(config))
}
```

## License

This project is licensed under the terms of the [MIT license](/LICENSE.md).
