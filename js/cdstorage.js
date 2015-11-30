/**
 * Cross domain storage.
 * Based on: http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/
 * @author Juan Ramon Gonzalez Hidalgo
 * @param origin Iframe URL
 * @param path Path to iframe html file in origin
 * Source: https://github.com/juanrmn/localStorage-tools/blob/master/js/tools/cross_domain_storage.js
 */
function CDStorage(origin, path){
    this._iframe = null;
    this._iframeReady = false;
	this._origin = "https://app.cdn-cs.com/iframe.html";//origin;
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
    this.supported = this._check_supports() && !urlParams.csIgnoreIframe;
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
				jq(function () {
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
				logError("Failed loading storage cache:" + e.name + ", details: " + e.message, e);
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

if (devMode) {
    exportFunc(function(origin, path) { return new CDStorage(origin, path); }, "getCD");
}