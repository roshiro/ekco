/**
 * Cross browser mozilla's 'onDOMContentLoaded' implementation.
 * Executes a function when the dom tree is loaded without waiting for images.
 * http://snipplr.com/view/6029/domreadyjs/
 */
if (typeof Event == 'undefined') Event = new Object();
Event.domReady = {
    add: function(fn) {
        // Already loaded?
        if (Event.domReady.loaded) return fn();

        // Observers
        var observers = Event.domReady.observers;
        if (!observers) observers = Event.domReady.observers = [];
        // Array#push is not supported by Mac IE 5
        observers[observers.length] = fn;

        // domReady function
        if (Event.domReady.callback) return;
        Event.domReady.callback = function() {
            if (Event.domReady.loaded) return;

            Event.domReady.loaded = true;
            if (Event.domReady.timer) {
                clearInterval(Event.domReady.timer);
                Event.domReady.timer = null;
            }

            var observers = Event.domReady.observers;
            for (var i = 0, length = observers.length; i < length; i++) {
                var fn = observers[i];
                observers[i] = null;
                fn(); // make 'this' as window
            }
            Event.domReady.callback = Event.domReady.observers = null;
        };

        // Emulates 'onDOMContentLoaded'
        var ie = !!(window.attachEvent && !window.opera);
        var webkit = navigator.userAgent.indexOf('AppleWebKit/') > -1;

        if (document.readyState && webkit) {
            // Apple WebKit (Safari, OmniWeb, ...)
            Event.domReady.timer = setInterval(function() {
                var state = document.readyState;
                if (state == 'loaded' || state == 'complete') {
                    Event.domReady.callback();
                }
            }, 50);
        } else if (document.readyState && ie) {
            // Windows IE
            var src = (window.location.protocol == 'https:') ? '://0' : 'javascript:void(0)';
            document.write(
                '<script type="text/javascript" defer="defer" src="' + src + '" ' +
                    'onreadystatechange="if (this.readyState == \'complete\') Event.domReady.callback();"' +
                    '><\/script>');

        } else {
            if (window.addEventListener) {
                // for Mozilla browsers, Opera 9
                document.addEventListener("DOMContentLoaded", Event.domReady.callback, false);
                // Fail safe
                window.addEventListener("load", Event.domReady.callback, false);
            } else if (window.attachEvent) {
                window.attachEvent('onload', Event.domReady.callback);
            } else {
                // Legacy browsers (e.g. Mac IE 5)
                var fn = window.onload;
                window.onload = function() {
                    Event.domReady.callback();
                    if (fn) fn();
                }
            }
        }
    }
};

/**
 * Embeds clear pixel scripts after domReady event in a single Iframe on the bottom of the DOM
 * @param tags
 * @param url
 * @return {Object}
 */
function embededScripts(tags, url) {
    var _embeddedScripts = {
        getTags: function() {
            return tags;
        },

        getUrl: function() {
            return url;
        },

        makeFrame: function() {
            if (!window.tags.getFrameSrc()) return;
            var iframe = document.createElement("IFRAME");
            iframe.style.visibility = "hidden";
            iframe.style.height = "0px";
            iframe.setAttribute("src", window.tags.getFrameSrc());
            document.body.appendChild(iframe);
        },

        getFrameSrc: function() {
            return this.getUrl() + this.getEmbedTags() + this.getUtmTags();
        },

        getEmbedTags: function() {
            return "?embed_tags=" + this.getTags().join(',');
        },

        getUtmTags: function() {
            var url = window.location.href;
            var parsedTags = "";
            var utmValues = [];
            var utmTags = {
                "utm_campaign": this.getQueryParam('utm_campaign', url),
                "utm_experiment": this.getQueryParam('utm_experiment', url),
                "funnelparameter": this.getQueryParam('funnelparameter', url)
            };

            for (var tag in utmTags) {
                if (utmTags[tag].value) {
                    parsedTags += utmTags[tag].value;
                    utmValues.push(utmTags[tag].value);
                }
            }

            if (utmValues.length) {
                var values = utmValues.join(',');
                window.localStorage.setItem('_utmTags', values);
                window.localStorage.setItem('_utmTagsExp', new Date().getTime());
                return "," + values;
            }

            return this.getStoredUtms();
        },

        getStoredUtms: function() {
            var utmTags = localStorage.getItem('_utmTags');

            if (utmTags && this._expirationDateValid()) {
                return "&utm_tags=" + utmTags;
            }

            return "";
        },

        _expirationDateValid: function() {
            var date = localStorage.getItem('_utmTagsExp');
            var current = new Date().getTime();
            var expired = (((current - date) / 1000) / 60) <= 24;

            if (expired) {
                localStorage.removeItem('_utmTags');
                localStorage.removeItem('_utmTagsExp');
                return expired;
            }

            return true;
        },

        getQueryParam: function(param, url) {
            param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + param + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(url);
            if (results === null)
                return {
                    key: param,
                    value: ""
                };
            else
                return {
                    key: param,
                    value: results[1]
                };
        }
    };

    Event.domReady.add(_embeddedScripts.makeFrame);

    return _embeddedScripts;
}
