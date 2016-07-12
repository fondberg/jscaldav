var test = require('tape');
var sinon = require('sinon');

var fs = require('fs');
var path = require('path');

//const proxyquire = require('proxyquire');
var JsCalDav = require('../jscaldav.js');

var CalDavUtils = require("../lib/CalDavUtils.js")

test('CalDavUtils.generateUUID() should return string of 37', function(t) {
    var uid = CalDavUtils.generateUUID();
    t.equal(uid.length, 36, 'length of uuid');
    t.end();
});


test('CalDavUtils.getRequestOptions() should return object with overidden properties', function(t) {
    var reqOpts = CalDavUtils.getRequestOptions({ //options, url, method, contentType, xml
        username: "username",
        password: "password",
        url: "url"
    }, "http://url", "REPORT", "text/calendar", "bodystring");
    t.equal(typeof reqOpts, 'object', 'should be an object');
    t.equal(reqOpts.method, "REPORT", "method should be REPORT");
    t.equal(reqOpts.headers["Content-type"], "text/calendar", "contentType should be text/calendar");
    t.end();
});


test('CalDavForUnit principle fruux sets correct calendarhome', function(t) {
    //var getUser = sinon.spy();
    var client = new JsCalDav({ url: "http://fruux.url" });
    var xml = fs.readFileSync(path.resolve(__dirname, 'files/fruux_principle_propfind.xml')).toString();

    sinon.stub(client, "makeRequest", function(options, callback, successString) {
        setTimeout(function() {
            callback(null, xml);
        }, 0);
    })

    client.getCalenderHome(function(err, list) {
        //console.log(client.config);
        t.equal(client.config.calendarsurl, "http://fruux.url/calendars/a3298235990/", "Calendars URL")
    })
    t.end();
});


// const fs = proxyquire('fs', {
//   writeFile: function(name, data, cb) {
//     cb(null, 'huzzah')
//   }
// })

// test('fs.writeFile() should be stubbed', function(t) {
//   t.plan(2)
//   fs.writeFile(null, null, function(err, body) {
//     t.ifError(err, 'no error')
//     t.equal(body, 'huzzah', 'body value')
//   })
// })
