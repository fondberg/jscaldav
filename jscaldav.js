"use strict";

var https = require("https");
var xmljs = require("libxmljs");
var request = require('request');
var URL = require('url');
var moment = require('moment');

var DavTemplates = require('./lib/DavTemplates.js');
var CalDavUtils = require('./lib/CalDavUtils.js');

/**
 * Create a new JsCalDav instance
 * @constructor
 * @param config.url Principle URL for the Dav collection
 * @param config.username
 * @param config.password
 * @param config.calendarName
 */
var JsCalDav = module.exports = function(config) {
    if (!config.url) {
        throw new Error("No URL specified");
    }
    this.config = config;
    var inUrl = URL.parse(config.url);
    this.config.host = inUrl.protocol + '//' + inUrl.hostname + (inUrl.port ? ':' + inUrl.port : '');

};

(function() {
    /**
     * Get principle information 
     * Gets the calendar home URL, writes it to config.calendarsurl together with config.email
     */
    this.getCalenderHome = function(cb) {
        var xml = DavTemplates.getPrinciplePropfindXML();

        var reqOptions = CalDavUtils.getRequestOptions(this.config, this.config.url, 'PROPFIND', "text/xml", xml);
        var self = this;
        this.makeRequest(reqOptions, function(err, body, response) {
            if (err) {
                cb("Couldn't fetch principle information: " + err + " " + body, null);
            }

            var reslist = [];
            try {
                var xmlDoc = xmljs.parseXml(body);
                //console.log(xmlDoc.toString() );
                var resp = xmlDoc.find("a:response", { a: 'DAV:', cal: 'urn:ietf:params:xml:ns:caldav' });
                for (var i in resp) {
                    var el = resp[i];
                    var href = el.get("a:href", { a: 'DAV:' });
                    var displayName = el.get("a:propstat/a:prop/a:displayname", { a: 'DAV:' });
                    var calhome = el.get("a:propstat/a:prop/cal:calendar-home-set/a:href", {
                        a: 'DAV:',
                        cal: 'urn:ietf:params:xml:ns:caldav'
                    });

                    var emailAdress = el.get("a:propstat/a:prop/cs:email-address-set/cs:email-address", {
                        a: 'DAV:',
                        cal: 'urn:ietf:params:xml:ns:caldav',
                        cs: 'http://calendarserver.org/ns/'
                    });
                    if (displayName) {
                        var resobj = {};
                        resobj.displayName = displayName.text();
                        resobj.href = href.text();
                        if (calhome && emailAdress) {
                            resobj.calendarHome = calhome.text();
                            self.config.calendarsurl = self.config.host + calhome.text();
                            self.config.email = emailAdress.text()
                        }
                        reslist.push(resobj);
                    }
                }
                cb(null, reslist);
            } catch (e) {
                cb("Error parsing response0:" + e, null)
            }
        });
    };

    /**
     * Get principle information 
     * Convinience method to get the calendar with name
     */
    this.getCalender = function(calendarName, cb) {
        this.getCalenders((err, calendars) => {
            if (err) {
                return cb(err, null)
            }
            var retCal = null;
            calendars.forEach((cal) => {
                if (cal.displayName === calendarName &&
                    cal.caldav_resource == true) {
                    retCal = cal;
                }
            })
            if (retCal)
                return cb(null, retCal);
            else
                return cb(calendarName + " not found", null);
        });

    }

    /**
     * Get calendars.
     * config.calendarsurl is mandatory. Either set through {@link getCalenderHome} or manually set in config object
     * @param cb callback is called with the calendars as a list
     */
    this.getCalenders = function(cb) {
        var xml = DavTemplates.getCalendersPropfindXML();
        var reqOptions = CalDavUtils.getRequestOptions(this.config, this.config.calendarsurl, 'PROPFIND', "text/xml", xml);
        var self = this;

        this.makeRequest(reqOptions, function(err, body, response) {
            if (err) {
                cb("Couldn't fetch calendar information: " + err + " " + body, null);
            }

            var reslist = [];
            try {
                var xmlDoc = xmljs.parseXml(body);
                //console.log(xmlDoc.toString() );
                var resp = xmlDoc.find("a:response", { a: 'DAV:', cal: 'urn:ietf:params:xml:ns:caldav' });
                for (var i in resp) {
                    var el = resp[i];
                    var href = el.get("a:href", { a: 'DAV:' });
                    var displayName = el.get("a:propstat/a:prop/a:displayname", { a: 'DAV:' });
                    var caldavResrc = el.get("a:propstat/a:prop/a:resourcetype/cal:calendar", {
                        a: 'DAV:',
                        cal: 'urn:ietf:params:xml:ns:caldav'
                    });

                    if (displayName) {
                        var resobj = {};
                        resobj.displayName = displayName.text();
                        resobj.href = href.text();

                        var calurl = self.config.host + href.text();
                        resobj.url = calurl;
                        resobj.caldav_resource = caldavResrc ? true : false;
                        reslist.push(resobj);
                    } else {
                        reslist.push({ displayName: "not set" });
                    }
                }
                cb(null, reslist);
            } catch (e) {
                cb("Error parsing response:" + e, null)
            }
        });
    };

    /**
     * Get principle information 
     */
    this.getEvents = function(url, cb) {
        var end = moment().format("YYYYMMDDTHHmmss") + 'Z';
        var start = moment().subtract(60, 'days').format("YYYYMMDDTHHmmss") + 'Z'

        var xml = DavTemplates.getEventListXML(start, end)

        var reqOptions = CalDavUtils.getRequestOptions(this.config, url, 'REPORT', "text/xml", xml);
        var self = this;

        this.makeRequest(reqOptions, function(err, body, response) {
            if (err) {
                cb("Couldn't fetch events: " + err + " " + body, null);
            }

            var reslist = [];
            try {
                var xmlDoc = xmljs.parseXml(body);
                //console.log(xmlDoc.toString());
                var resp = xmlDoc.find("a:response", { a: 'DAV:', cal: 'urn:ietf:params:xml:ns:caldav' });

                for (var i in resp) {
                    var el = resp[i];
                    var href = el.get("a:href", { a: 'DAV:' });
                    var ics = el.get("a:propstat/a:prop/c:calendar-data", { a: 'DAV:', c: "urn:ietf:params:xml:ns:caldav" });
                    var etag = el.get("a:propstat/a:prop/a:getetag", { a: 'DAV:', c: "urn:ietf:params:xml:ns:caldav" });
                    var status = el.get("a:propstat/a:status", { a: 'DAV:', c: "urn:ietf:params:xml:ns:caldav" });
                    var evs = ics.text().match(/BEGIN:VEVENT[\s\S]*END:VEVENT/gi);
                    var events = [];
                    for (var x in evs) {
                        var evobj = {};
                        var evstr = evs[x];
                        evstr = evstr.split("\n");
                        for (var y in evstr) {
                            var evpropstr = evstr[y];
                            if (evpropstr.match(/BEGIN:|END:/gi)) {
                                continue;
                            }
                            var sp = evpropstr.split(":");
                            var key = sp[0];
                            var val = sp[1];
                            if (key && val) {
                                evobj[key] = val;
                            }

                        }
                        events.push(evobj)
                    }
                    reslist.push({
                        events: events,
                        status: status.text(),
                        etag: etag.text(),
                        href: href.text(),
                        ics: ics.text()
                    });
                }
                cb(null, reslist);
            } catch (e) {
                cb("Error parsing response2:" + e, null)
            }

        });
    }


    /**
     * Get principle information 
     */
    this.createEvent = function(calUrl, start, end, summary, description, cb) {
        var uid = CalDavUtils.generateUUID();
        var ical = DavTemplates.getICalenderFromTemplate(uid, start, end, summary, description);
        var url = calUrl + uid + '.ics';

        var reqOptions = CalDavUtils.getRequestOptions(this.config, url, 'PUT', "text/calendar", ical);

        //override for create
        reqOptions.headers = {
            "Content-type": "text/calendar",
            "User-Agent": "niklasDavClient",
            "If-None-Match": "*",
        }

        this.makeRequest(reqOptions, function(err, body, response) {
            if (err) {
                return cb("Couldn't create calendar event: " + err + " " + body, null);
            }
            return cb(null, ical);
        });
    }

    /**
    * @param url is the href to the event
    */
    this.updateEvent = function(url, etag, ics, cb) {
        var url = calUrl + uid + '.ics';
        var reqOptions = CalDavUtils.getRequestOptions(this.config, url, 'PUT', "text/calendar", ics);

        //override headers for update
        reqOptions.headers = {
                "Content-type": "text/calendar",
                "User-Agent": "niklasDavClient",
                "If-Match": etag,
            }

        var self = this;

        this.makeRequest(reqOptions, function(err, body, response) {
            if (err) {
                return cb("Couldn't update calendar event: " + err + " " + body, null);
            }
            return cb(null, ical);
        });

    }

    /**
    * To be developed
    */
    this.deleteEvent = function(url, user, pass, etag, cb) {
        /*
        DELETE /SOGo/dav/username/Calendar/personal/uuid.ics HTTP/1.1
        Host: calendarserver.vireone.se
        Accept-Encoding: gzip, deflate
        Authorization: Basic bmlrbGFzOmhvYmJlMTIzNA==
        Connection: keep-alive
        Proxy-Connection: keep-alive
        Accept: **
        User-Agent: Mac+OS+X/10.11.4 (15E65) CalendarAgent/361.2
        If-Match: "gcs00000001"
        Content-Length: 0
        Accept-Language: en-us
        */
    }



    //####   Helper functions

    /**
     * Make a request to the Dav API and call back with it's response.
     *
     * @method makeRequest
     * @memberOf DavClient#
     * @param options The request options.
     * @param callback Called with the APIs response.
     * @param {string} [successString] If supplied, this is reported instead of the response body.
     */
    this.makeRequest = function(options, callback, successString) {
        request(options, function(err, response, body) {
            if (err || response.statusCode.toString()[0] != 2) {
                return callback(err ? err : body, null, response);
            }

            return callback(null, body, response);
        });
    };

}).call(JsCalDav.prototype);
