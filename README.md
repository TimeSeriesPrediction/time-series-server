# Time Series Prediction Server

[![Build Status](https://travis-ci.org/TimeSeriesPrediction/time-series-server.svg?branch=dev)](https://travis-ci.org/TimeSeriesPrediction/time-series-server)
[![Code Climate](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server/badges/gpa.svg)](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server)
[![Test Coverage](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server/badges/coverage.svg)](https://codeclimate.com/github/codeclimate/codeclimate/coverage)
[![dependencies Status](https://david-dm.org/TimeSeriesPrediction/time-series-server/status.svg)](https://david-dm.org/TimeSeriesPrediction/time-series-server)
[![devDependencies Status](https://david-dm.org/TimeSeriesPrediction/time-series-server/dev-status.svg)](https://david-dm.org/TimeSeriesPrediction/time-series-server?type=dev)

[![View us at waffle.io](https://img.shields.io/badge/View%20our%20issue%20board%20at-Waffle.io-blue.svg)](http://waffle.io/TimeSeriesPrediction/time-series-server)
[![License](https://img.shields.io/github/license/TimeSeriesPrediction/time-series-server.svg)](https://raw.githubusercontent.com/TimeSeriesPrediction/time-series-server/master/LICENSE)

This repository contains the source code for the server of the Time Series Prediction project.

## Configuration

The application makes use of the [node-config](https://github.com/lorenwest/node-config) library for easier configuration handling. This allows for things such as:

- Environment specific file overrides
- Get and Has methods for configurations with error handling
- Comments allowed in the configuration file

The `default.json` is the standard configuration file, and should contain no personal information. The `dev.json` contains overrides which should be used during development, and has been added into the `.gitignore` to prevent people accidentaly uploading personal details. To change configurations simply add the `dev.json` file, and replace the desired options as needed.

## Testing

To attach the debugger for jasmine tests:

```bash
JASMINE_CONFIG_PATH="spec/support/jasmine.json" node --debug-brk --no-lazy node_modules/jasmine/bin/jasmine.js
```

## Documentation

### apidoc.js

Install apidoc with:
`npm install -g apidoc`

Update documentation with:
`apidoc -i app/ -o apidoc/`

View at:
`apidoc/index.html`

More information:
`http://apidocjs.com/`

