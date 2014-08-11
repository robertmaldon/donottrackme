var USER_AGENT_KEY = "User-Agent";
var USER_AGENT_VAL = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
var REFERER_KEY = "Referer";
var REFERER_VAL = "https://www.google.com/";
var COOKIE_KEY = "Cookie";

// Test if a string ends with a given suffix
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var uri = new Uri(details.url);
    var host = uri.host();
    var path = uri.path();

    if (endsWith(host, ".nytimes.com")) {
      // Block the main metering script: http://meter-svc.nytimes.com/meter.js?callback=...&_=...
      if (path == "/meter.js") {
        return {cancel: true};
      }

      if (endsWith(path, ".html")) {
        // If there is a query param of "_r=0" then this is the first rediret after the auto login
        if (uri.getQueryParamValue("_r") == null) {

          // Remove all cookies for the domain
          chrome.cookies.getAll({
            domain: "nytimes.com"
            }, function(cookies) {
              var cookie, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = cookies.length; _i < _len; _i++) {
                cookie = cookies[_i];
                _results.push(chrome.cookies.remove({
                  url: "" + uri.protocol() + "://" + uri.host() + cookie.path,
                  name: cookie.name
                }));
              }
              return _results;
          });

          uri.setQuery("");

          return {redirectUrl: uri.toString()};
        }
      }
    } else if (endsWith(host, ".newyorker.com")) {
      // Strip any query parameters
      if (path != "") {
          uri.setQuery("");
          return {redirectUrl: uri.toString()};        
      }
    }
  },
  {urls: ["*://*.newyorker.com/*",
          "*://*.nytimes.com/*"]},
  ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    var uri = new Uri(details.url);
    var host = uri.host();

    // Check for existing 'User-Agent', 'Referer' or 'Cookie' headers
    var foundRefererHeader = false;
    for (var i = 0; i < details.requestHeaders.length; i++) {

      if (!endsWith(host, ".wsj.com")) {
        if (details.requestHeaders[i].name === USER_AGENT_KEY) {
          details.requestHeaders[i].value = USER_AGENT_VAL;
        }
      }

      if (details.requestHeaders[i].name === REFERER_KEY) {
        details.requestHeaders[i].value = REFERER_VAL;
        foundRefererHeader = true;
      }

      // Do not send any cookies
      if (details.requestHeaders[i].name === COOKIE_KEY) {
        details.requestHeaders.splice(i, 1);
      }
    }

    // Insert referer if not already present
    if (!foundRefererHeader) {
      details.requestHeaders.push({name: REFERER_KEY, value: REFERER_VAL});
    }

    // Return modified headers
    return {requestHeaders: details.requestHeaders};
  }, 
  { urls: ["*://*.news.com.au/*",
           "*://*.newyorker.com/*",
           "*://*.nyt.com/*",
           "*://*.theguardian.co.uk/*",
           "*://*.theguardian.com/*",
           "*://*.smh.com.au/*",
           "*://*.wired.com/*",
           "*://*.wsj.com/*"] },
  ["blocking", "requestHeaders"]
);