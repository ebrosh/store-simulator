$(function() {

	'use strict';

	var imgResonsive=function(){

		$("img[data-src^='{']").each(function() {

			var t = $(this);

			if (t.attr('data-src')) {

				var src = jQuery.parseJSON(t.attr('data-src'));

				var device = !! $('body').attr('data-current-device') ? $('body').attr('data-current-device') : 'xs';

				t.attr('src', src[device]);

			}

		});

	}

	$(window).on('resize',imgResonsive);

	imgResonsive();

});