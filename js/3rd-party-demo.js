/*
 Small demo for instrumenting a feed and showing 3rd party card options
 Eyal B. 29/7/2017
 
 */
 
(function() {

function initFeed3rdPartyCards() {
	var placement2 = jQuery("#taboola-below-article-thumbnails-pl2 .trc_rbox_container > div");
	var placement3 = jQuery("#taboola-below-article-thumbnails-pl3 .trc_rbox_container > div");
	if (placement2.length !== 1 || placement3.length !== 1) {
		return false;
	}
	
	injectCardIframe(placement2);
	placement3.html("<h1>Hello World placement 3<h1>");
	return true;
}


function injectCardIframe(element) {
	element.html("<iframe style='border:none; width:100%; height:500px;' src='http://eyal.com/pub-simulator/3rd-party-crazy-card.html'></iframe>");

}

function init() {
	feedFound = false;
	var tries = 0;
	
	function tryInit() {
		if  (initFeed3rdPartyCards()) {
			return true;
		} else {
			tries ++ ;
			if (tries<10) {
				setTimeout( tryInit ,1000);
			}
		}
	}
	
	tryInit();
}

init();


})();