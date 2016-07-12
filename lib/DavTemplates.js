"use strict";
var moment = require('moment');


module.exports = {


  getPrinciplePropfindXML: function() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<A:propfind xmlns:A="DAV:">
    <A:prop>
        <B:calendar-home-set xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <B:calendar-user-address-set xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <A:current-user-principal/>
        <A:displayname/>
        <C:email-address-set xmlns:C="http://calendarserver.org/ns/" />
        <C:notification-URL xmlns:C="http://calendarserver.org/ns/" />
        <A:principal-collection-set/>
        <A:principal-URL/>
        <A:resource-id/>
        <B:schedule-inbox-URL xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <B:schedule-outbox-URL xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <A:supported-report-set/> </A:prop>
</A:propfind>
`;
  },

  getCalendersPropfindXML: function() {
    return `<A:propfind xmlns:A="DAV:">
    <A:prop>
        <A:add-member />
        <C:allowed-sharing-modes xmlns:C="http://calendarserver.org/ns/" />
        <D:autoprovisioned xmlns:D="http://apple.com/ns/ical/" />
        <E:bulk-requests xmlns:E="http://me.com/_namespace/" />
        <B:calendar-alarm xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <D:calendar-color xmlns:D="http://apple.com/ns/ical/" />
        <B:calendar-description xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <B:calendar-free-busy-set xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <D:calendar-order xmlns:D="http://apple.com/ns/ical/" />
        <B:calendar-timezone xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <A:current-user-privilege-set />
        <B:default-alarm-vevent-date xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <B:default-alarm-vevent-datetime xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <A:displayname />
        <C:getctag xmlns:C="http://calendarserver.org/ns/" />
        <C:invite xmlns:C="http://calendarserver.org/ns/" />
        <D:language-code xmlns:D="http://apple.com/ns/ical/" />
        <D:location-code xmlns:D="http://apple.com/ns/ical/" />
        <A:owner />
        <C:pre-publish-url xmlns:C="http://calendarserver.org/ns/" />
        <C:publish-url xmlns:C="http://calendarserver.org/ns/" />
        <C:push-transports xmlns:C="http://calendarserver.org/ns/" />
        <C:pushkey xmlns:C="http://calendarserver.org/ns/" />
        <A:quota-available-bytes />
        <A:quota-used-bytes />
        <D:refreshrate xmlns:D="http://apple.com/ns/ical/" />
        <A:resource-id />
        <A:resourcetype />
        <B:schedule-calendar-transp xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <B:schedule-default-calendar-URL xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <C:source xmlns:C="http://calendarserver.org/ns/" />
        <C:subscribed-strip-alarms xmlns:C="http://calendarserver.org/ns/" />
        <C:subscribed-strip-attachments xmlns:C="http://calendarserver.org/ns/" />
        <C:subscribed-strip-todos xmlns:C="http://calendarserver.org/ns/" />
        <B:supported-calendar-component-set xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <B:supported-calendar-component-sets xmlns:B="urn:ietf:params:xml:ns:caldav" />
        <A:supported-report-set />
        <A:sync-token />
    </A:prop>
</A:propfind>
`;

  },
  getEventListXML: function(start, end) {
    return `<?xml version="1.0" encoding="utf-8" ?>
<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
    <D:prop>
        <C:calendar-data/>
        <D:getetag />
    </D:prop>
    <C:filter>
        <C:comp-filter name="VCALENDAR">
            <C:comp-filter name="VEVENT">
                <C:time-range start="${start}" end="${end}" />
            </C:comp-filter>
        </C:comp-filter>
    </C:filter>
</C:calendar-query>
`;
  },
  getICalenderFromTemplate: function(uid, start, end, summary, description) {
    var dtstamp = moment().format("YYYYMMDDTHHmmssZ");
    var dtstart = moment(start).format("YYYYMMDDTHHmmss");
    var dtend = moment(end).format("YYYYMMDDTHHmmss");
 //20160412T193000  
 //20160408T130743Z   
    return `BEGIN:VCALENDAR
PRODID:-//vireone/ora//NONSGML v1.0//EN
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Europe/Stockholm
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
DTSTART:19810329T020000
TZNAME:GMT+2
TZOFFSETTO:+0200
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
DTSTART:19961027T030000
TZNAME:GMT+1
TZOFFSETTO:+0100
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
CREATED:${dtstamp}
UID:${uid}
DTEND;TZID=Europe/Stockholm:${dtend}
TRANSP:OPAQUE
X-CREATED-BY:ORA Timereporting by Vireone
SUMMARY:${summary}
DESCRIPTION:${description}
DTSTART;TZID=Europe/Stockholm:${dtstart}
DTSTAMP:${dtstamp}
SEQUENCE:1
LAST-MODIFIED:${dtstamp}
END:VEVENT
END:VCALENDAR
`;
  }

}
