/**
 * Cross domain storage.
 * Based on: http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/
 * @author Juan Ramon Gonzalez Hidalgo
 * @param origin Iframe URL
 * @param path Path to iframe html file in origin
 * Source: https://github.com/juanrmn/localStorage-tools/blob/master/js/tools/cross_domain_storage.js
 */
 
 !function(a){"use strict";function b(a){l(function(){throw a})}function c(b){return this.then(b,a)}function d(b){return this.then(a,b)}function e(b,c){return this.then(function(a){return m(b)?b.apply(null,n(a)?a:[a]):v.onlyFuncs?a:b},c||a)}function f(a){function b(){a()}return this.then(b,b),this}function g(a){return this.then(function(b){return m(a)?a.apply(null,n(b)?b.splice(0,0,void 0)&&b:[void 0,b]):v.onlyFuncs?b:a},function(b){return a(b)})}function h(c){return this.then(a,c?function(a){throw c(a),a}:b)}function i(a,b){var c=q(a);if(1===c.length&&n(c[0])){if(!c[0].length)return v.fulfilled([]);c=c[0]}var d=[],e=v(),f=c.length;if(f)for(var g=function(a){c[a]=v.promisify(c[a]),c[a].then(function(g){d[a]=b?c[a]:g,--f||e.resolve(d)},function(g){b?(d[a]=c[a],--f||e.resolve(d)):e.reject(g)})},h=0,i=f;i>h;h++)g(h);else e.resolve(d);return e.promise}function j(a,b){return a.then(m(b)?b:function(){return b})}function k(a){var b=q(a);1===b.length&&n(b[0])&&(b=b[0]);for(var c=v(),d=0,e=b.length,f=v.resolved();e>d;d++)f=j(f,b[d]);return c.resolve(f),c.promise}var l,m=function(a){return"function"==typeof a},n=function(a){return Array.isArray?Array.isArray(a):a instanceof Array},o=function(a){return!(!a||!(typeof a).match(/function|object/))},p=function(b){return b===!1||b===a||null===b},q=function(a,b){return[].slice.call(a,b)},r="undefined",s=typeof TypeError===r?Error:TypeError;if(typeof process!==r&&process.nextTick)l=process.nextTick;else if(typeof MessageChannel!==r){var t=new MessageChannel,u=[];t.port1.onmessage=function(){u.length&&u.shift()()},l=function(a){u.push(a),t.port2.postMessage(0)}}else l=function(a){setTimeout(a,0)};var v=function(b){function i(){if(0!==r){var a,b=t,c=0,d=b.length,e=~r?0:1;for(t=[];d>c;c++)(a=b[c][e])&&a(n)}}function j(a){function b(a){return function(b){return c?void 0:(c=!0,a(b))}}var c=!1;if(r)return this;try{var d=o(a)&&a.then;if(m(d)){if(a===u)throw new s("Promise can't resolve itself");return d.call(a,b(j),b(k)),this}}catch(e){return b(k)(e),this}return q(function(){n=a,r=1,i()}),this}function k(a){return r||q(function(){try{throw a}catch(b){n=b}r=-1,i()}),this}var n,q=(a!==b?b:v.alwaysAsync)?l:function(a){a()},r=0,t=[],u={then:function(a,b){var c=v();return t.push([function(b){try{p(a)?c.resolve(b):c.resolve(m(a)?a(b):v.onlyFuncs?b:a)}catch(d){c.reject(d)}},function(a){if((p(b)||!m(b)&&v.onlyFuncs)&&c.reject(a),b)try{c.resolve(m(b)?b(a):b)}catch(d){c.reject(d)}}]),0!==r&&q(i),c.promise},success:c,error:d,otherwise:d,apply:e,spread:e,ensure:f,nodify:g,rethrow:h,isPending:function(){return 0===r},getStatus:function(){return r}};return u.toSource=u.toString=u.valueOf=function(){return n===a?this:n},{promise:u,resolve:j,fulfill:j,reject:k}};v.deferred=v.defer=v,v.nextTick=l,v.alwaysAsync=!0,v.onlyFuncs=!0,v.resolved=v.fulfilled=function(a){return v(!0).resolve(a).promise},v.rejected=function(a){return v(!0).reject(a).promise},v.wait=function(a){var b=v();return setTimeout(b.resolve,a||0),b.promise},v.delay=function(a,b){var c=v();return setTimeout(function(){try{c.resolve(m(a)?a.apply(null):a)}catch(b){c.reject(b)}},b||0),c.promise},v.promisify=function(a){return a&&m(a.then)?a:v.resolved(a)},v.all=function(){return i(arguments,!1)},v.resolveAll=function(){return i(arguments,!0)},v.sequence=function(){return k(arguments)},v.nodeCapsule=function(a,b){return b||(b=a,a=void 0),function(){var c=v(),d=q(arguments);d.push(function(a,b){a?c.reject(a):c.resolve(arguments.length>2?q(arguments,1):b)});try{b.apply(a,d)}catch(e){c.reject(e)}return c.promise}},typeof window!==r&&(window.D=v),typeof module!==r&&module.exports&&(module.exports=v)}();

 
function CDStorage(origin, path){
	siteId = "AAAAAA";
    this._iframe = null;
    this._iframeReady = false;
	this._origin = "https://perscdn.taboola.com/static/iframe.html";//origin;
    this._path = path;
    this._queue = [];
    this._requests = {};
	this._cache = {};
    this._id = 0;
	this._cachePromise = D();
    this._cookieItems= ["chosenVariants", "chosenVariantId", "context.session.visitState", "context.user.visitCount", "context.session.isAtSessionStart",
        "context.user.referrer.url", "context.user.referrer.search", "context.user.landingPage.url", "context.user.landingPage.search", "context.session.splitPage.url"];

    this._check_supports = function(){
        try{
            return window.postMessage && window.JSON && window.localStorage !== null;
        }catch(e){
            return false;
        }
    };
    this.supported = this._check_supports() ;
}

/** 
 * Cross domain storage
 */
CDStorage.prototype = {
    constructor: CDStorage,
    init: function(){
        var that = this;


		if(!this._iframe && this.supported){
			this._iframe = document.createElement("iframe");
			this._iframe.style.cssText = "display:none;position:absolute;width:1px;height:1px;left:-9999px;";
			this._iframe.width = 0;
			this._iframe.height = 0;
			if (document && document.readyState && (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive"))
				document.body.appendChild(that._iframe);
			else {
				jQuery(function () {
					document.body.appendChild(that._iframe);
				});
			}
			if(window.addEventListener){
				this._iframe.addEventListener("load", function(){ that._iframeLoaded(); }, false);
				window.addEventListener("message", function(event){ that._handleMessage(event); }, false);
			}else if(this._iframe.attachEvent){
				this._iframe.attachEvent("onload", function(){ that._iframeLoaded(); }, false);
				window.attachEvent("onmessage", function(event){ that._handleMessage(event); });
			}
			this._iframe.src = this._origin + this._path;
			this.extendSession();
			this._loadCache();
		}
	},

    extendSession: function(callback) {
        var request = {
            type: 'extendSession'
        };
        return this._buildRequest(request, callback);
    },

    endSession: function(callback) {
        var request = {
            type: 'endSession'
        };
        return this._buildRequest(request, callback);
    },

	getAllItems: function(callback) {
		var request = {
            type: 'getAll'
		};
		return this._buildRequest(request, callback);
	},

    fillContextWithCookieValues: function(context) {
        for (var i=0; i<this._cookieItems.length; i++) {
            var key = this._cookieItems[i];
            var value = this.getItem(key);
            if (value) {
                context.setValue(key, value);
            }
        }
    },

	getItem: function(key) {
		if (key.indexOf("cookie.")!==0 && !this._cache[key] && this.storedInCookie(key)) {
			key = "_cs."+siteId+"."+key;
			return getCookie(key);
		}
		return this._cache[key];
	},

	getAllItemsFromCache: function() {
		var all = {};
		for (var i in this._cache){
			all[i] = this._cache[i];
		}
		return all;
	},

    setItem: function(key, value, persistence){
		// persistence=true means: store forever. false=store for session (default value: 30 mins). otherwise, it should be a number in milliseconds.
		// but iframe.html expects the opposite (due to backward compatibility - old code was false: don't persist, true: persist. new code is true: persist forever. false: persist for session)
		// so we need to flip true and false before sending
		var fromCookie = key.indexOf("cookie.")===0;
		this._cache[key] = value;
		key = siteId+"."+key;
		if (!fromCookie && this.storedInCookie(key)) {
			key = "_cs."+key;
			var persistenceTime = persistence;
			if (persistence===true) {
				persistenceTime = persistentCookieDuration;
			}
			if (persistence===false) {
				persistenceTime = Duration.minutes(30);
			}
			setCookie(key, value, persistenceTime, null);
		} else {
			var that = this;
			this.onCacheReady().then(function() {
				if (persistence === true) {
					persistence = false;
				} else if (persistence === false) {
					persistence = true;
				}
				if (persistence === null) {
					persistence = false;
				}

				var request = {
					type: 'set',
					key: key,
					value: value,
					persistence: persistence
				};
				that._buildRequest(request);
			});
		}
    },

	unsetItem: function(key) {
		// todo: Need to delete from cache as well?
		key = siteId+"."+key;
		var request = {
				type: 'unset',
				key: key
		};
		return this._buildRequest(request);
	},

	unsetDomain: function(domain) {
		// todo: Need to delete from cache as well?
		var request = {
			type: 'unsetDomain',
			key: domain
		};
		return this._buildRequest(request);
	},

	onCacheReady: function() {
		return this._cachePromise.promise;
	},

    //private methods
    _sendRequest: function(data){
        if(this._iframe){
            this._requests[data.request.id] = data;
            this._iframe.contentWindow.postMessage(JSON.stringify(data.request), this._origin);
        }
    },

    _iframeLoaded: function(){
        this._iframeReady = true;
        if(this._queue.length){
			while (this._queue.length) {
                this._sendRequest(this._queue.shift());
            }
        }
        this.onCacheReady().then((function() {
            for (var i = 0; i < this._cookieItems.length; i++) {
                var key = siteId + "." + this._cookieItems[i];
                var cookieKey = "_cs." + key;
                var cookieValue = getCookie(cookieKey);
                if (cookieValue) {
                    var request = {
                        type: 'set',
                        key: key,
                        value: cookieValue,
                        persistence: false
                    };
                    this._buildRequest(request);
                }
            }
        }).bind(this));
    },

    _handleMessage: function(event){
        if(this._origin.indexOf(event.origin) !== -1) {
            var data = JSON.parse(event.data);
            if(typeof this._requests[data.id].deferred != 'undefined'){
                this._requests[data.id].deferred.resolve(data.value);
            }
            if(typeof this._requests[data.id].callback == 'function'){
                this._requests[data.id].callback(data.key, data.value);
            }
            delete this._requests[data.id];
        }
    },

	_buildRequest:function (request, callback) {
		if (this.supported) {
			request.id = ++this._id;
			var data = {
				request: request,
				callback: callback
			};
			data.deferred = D();

			if(this._iframeReady){
				this._sendRequest(data);
			}else{
				this._queue.push(data);
			}

			return data.deferred.promise;
		}
		return null;
	},

	_loadCache: function() {
		var that = this;
		this.getAllItems(function(key, value) {
			try {
				var valueJson = JSON.parse(value);

				for (var k in valueJson) {
					if (valueJson.hasOwnProperty(k)) {
						// remove siteId, compare it to this siteId and store only the ones that match
						var _value = valueJson[k];
						k = k.split(".");
						var _siteId = k.shift();
						if (_siteId===siteId) {
							var finalKey = k.join(".");
							// Don't overwrite values that already exist (e.g. goe)
							if (!that._cache.hasOwnProperty(finalKey)) {
								that._cache[finalKey] = _value;
							}
						}
					}
				}
				that._cachePromise.resolve(that._cache);
			}catch(e) {
				console.log("Failed loading storage cache:" + e.name + ", details: " + e.message, e);
			}
		});
	},
	storedInCookie: function(key) {
		for (var k in this._cookieItems) {
            if (this._cookieItems.hasOwnProperty(k) && key.indexOf(this._cookieItems[k])>-1) {
				return true;
			}
		}
		return false;
	}
};

