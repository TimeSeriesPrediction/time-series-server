# Time Series Prediction Server

[![Stories in Ready](https://badge.waffle.io/TimeSeriesPrediction/time-series-server.svg?label=ready&title=Ready)](http://waffle.io/TimeSeriesPrediction/time-series-server)
[![Build Status](https://travis-ci.org/TimeSeriesPrediction/time-series-server.svg?branch=dev)](https://travis-ci.org/TimeSeriesPrediction/time-series-server)
[![Code Climate](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server/badges/gpa.svg)](https://codeclimate.com/github/TimeSeriesPrediction/time-series-server)
[![dependencies Status](https://david-dm.org/TimeSeriesPrediction/time-series-server/status.svg)](https://david-dm.org/TimeSeriesPrediction/time-series-server)
[![devDependencies Status](https://david-dm.org/TimeSeriesPrediction/time-series-server/dev-status.svg)](https://david-dm.org/TimeSeriesPrediction/time-series-server?type=dev)

This repository contains the source code for the server of the Time Series Prediction project.

## Testing

To attach the debugger for jasmine tests:

```bash
JASMINE_CONFIG_PATH="spec/support/jasmine.json" node --debug-brk --no-lazy node_modules/jasmine/bin/jasmine.js
```