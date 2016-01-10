var jnxtac = {};

(function() {
	function nxt_js_loader(script_array, position, is_sequential, final_process) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = script_array[position];

		if (is_sequential != true) {
			if (position+1 < script_array.length) {
				nxt_js_loader(script_array, position+1, false, null);
			}
		}
		else {
			if (position+1 < script_array.length) {
				if (typeof script.addEventListener === 'function') {
					script.addEventListener('load', function () {
						nxt_js_loader(script_array, position+1, is_sequential, final_process);
					}, false);
				}
				else {
					script.onreadystatechange = function() {
						if (script.readyState in {loaded: 1, complete: 1}) {
							script.onreadystatechange = null;
							nxt_js_loader(script_array, position+1, is_sequential, final_process);
						}
					}
				}
			}
			else if (typeof final_process === 'function') {
				if (typeof script.addEventListener === 'function') {
					script.addEventListener('load', function () {
						final_process();
					}, false);
				}
				else {
					script.onreadystatechange = function() {
						if (script.readyState in {loaded: 1, complete: 1}) {
							script.onreadystatechange = null;
							final_process();
						}
					}
				}
			}
		}
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	nxt_js_loader(['//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'],0,true,function() {
		jnxtac = jQuery.noConflict(true);
		nxt_js_loader(['//d2brc35ftammet.cloudfront.net/autocomplete/nxt-ac-js-ui-3.2j-min.js'], 0, true, function() {
			var cssFiles = ['//d2brc35ftammet.cloudfront.net/autocomplete/ac-3.0-theme4-min.css','//nxtcfm.s3.amazonaws.com/5c611512eb2f30d0beaead6f365e5f79-ac.css'];
			for (i = 0; i < cssFiles.length; i++) {
				var icssFiles = document.createElement('link');
				icssFiles.type = 'text/css';
				icssFiles.rel = 'stylesheet';
				icssFiles.media = 'screen';
				icssFiles.href = cssFiles[i];
				document.getElementsByTagName('head')[0].appendChild(icssFiles);
			}
			jnxtac(document).ready(function() {
				jnxtac(".search-box input.input-style.input-md.text-m").nxt_autocomplete({cid:'5c611512eb2f30d0beaead6f365e5f79'});
				jnxtac(".search-box input.input-style.input-md.text-m").nxt_autocomplete("option", "footer", '');
				jnxtac.ui.nxt_autocomplete.prototype._setPosition = function () {
					this.ac_main_container.position({
						my: "left top",
						at: "left bottom",
						of: this.element,
						offset: "0 0",
						collision: "none"
					});
				};
			});

		});		
	});
})();