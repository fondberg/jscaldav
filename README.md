# jscaldav

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

CalDav client library with support for basic discovery actions and handling of calendar events for node.js.

## Installation

```sh
npm install jscaldav
```

## API

```js
var JsCalDav = require("jscaldav");
var config = {
  url:  "https://calendar.url",
  username: "user",
  password: "pwd",
  calendarName: 'Calendar'
}
var jsCalDav = new JsCalDav(config);

jsCalDav.getCalenderHome(function(err, list) {
    jsCalDav.getCalenders(function(err, calendars) {
        console.log("\n", calendars);
    }); 
    console.log(jsCalDav.config);
})
```

## Tests

```shell
   npm test
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 1.0.0 Initial release