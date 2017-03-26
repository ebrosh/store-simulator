/**
 jsonp quick by Eyal 
*/
 
 
function add_script(scriptURL, onloadCB) {
    // TODO Ron Gross 24/10/2012 - currently on some browsers (e.g. IE8), onloadCB can be called also on 404
    // We need to add a parameter to it that tells it whether the script was loaded successfully or not.

  var called;
  var scriptEl    = document.createElement("script");
  scriptEl.type   = "text/javascript";
  scriptEl.src    = scriptURL;
  scriptEl.async  = true;

  function calltheCBcmn() {
      if (onloadCB) {
        onloadCB(scriptURL);
      }
  }

  if(typeof(scriptEl.addEventListener) != 'undefined') {
	/* The FF, Chrome, Safari, Opera way */
	scriptEl.addEventListener('load',calltheCBcmn,false);
  }
  else {
      // MS IE 8+
      // TODO - test with previous versions
      // Make sure to prevent double invocations
      called = false;
      scriptEl.attachEvent('onreadystatechange', function() {
          if (called) {
              return;
          }
          if (scriptEl.readyState == 'loaded' || scriptEl.readyState == 'complete') {
              called = true;
              calltheCBcmn();
          }
      });
  }
  document.getElementsByTagName("head")[0].appendChild(scriptEl);
}
