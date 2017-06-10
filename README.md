# Time Series Prediction Server

[![Build Status](https://travis-ci.org/TimeSeriesPrediction/time-series-server.svg?branch=dev)](https://travis-ci.org/TimeSeriesPrediction/time-series-server)
[![Code Climate](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server/badges/gpa.svg)](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server)
[![Test Coverage](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server/badges/coverage.svg)](https://codeclimate.com/github/codeclimate/codeclimate/coverage)
[![dependencies Status](https://david-dm.org/TimeSeriesPrediction/time-series-server/status.svg)](https://david-dm.org/TimeSeriesPrediction/time-series-server)
[![devDependencies Status](https://david-dm.org/TimeSeriesPrediction/time-series-server/dev-status.svg)](https://david-dm.org/TimeSeriesPrediction/time-series-server?type=dev)

This repository contains the source code for the server of the Time Series Prediction project.

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

