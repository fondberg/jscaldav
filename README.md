# jscaldav

CalDav client library with support for basic discovery actions and handling of calendar events for node.js.

### Discovery support:
- Calendar home discovery through DAV principle URL
- List calendars from known calendarhome URL
- Get a calendar URL from calendar name

### Event support
- List events (currently only from the last 60 days)
- Create event from iCalendar string
- Update event

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
