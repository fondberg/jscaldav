"use strict";

module.exports = {
  /**
  * Generate a UUID
  */
  generateUUID: function() {
    var d = new Date().getTime();

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },

  /**
  * get the options to use for the request function
  */
  getRequestOptions: function(options, url, method, contentType, xml) {
    var opts = {
      auth: {
        user: options.username,
        pass: options.password
      },
      url: url ? url : options.url,
      followAllRedirects: true,
      rejectUnauthorized: false,
      body: xml,
      method: method ? method : 'PROPFIND',
      headers: {
        "Content-type": contentType ? contentType : "text/xml",
        "User-Agent": "niklasDavClient",
        "Depth": "1",
        "Prefer": "return=minimal"
      }
    };
    return opts;
  }
};

