$('.clk').click(function(){
document.location.href=$(this).attr('data-url');	
});

$(window).on('load',function(){

	$('.hide-on-load').each(function(){
		$(this).removeClass('hide-on-load');
	});

});

var getQS=function(){

	var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },

    urlParams = {};
    while (match = search.exec(window.location.search.substring(1))){
       urlParams[decode(match[1])] = decode(match[2]);
    }

    return urlParams;
}

function addItemToBasket(productID, optionID, quantity, redirectToBasket) {

    //alert('addItemToBasket');

    $.ajax({
        url: "/includes/ajax_responder.asp",
        type: "POST",
        data: { a: 'add_to_basket',
            prodID: productID,
            optID: optionID,
            quant: quantity
        },
        success: function(data) {
            if (data + '' == '1') {
                //alert(data + '');
                if (redirectToBasket) {
                    window.location = '/viewbasket.asp';
                }
            } else {
                //alert(data + '');
            }
        }
    });
    
}

function compareFunctionality_initialize() {

    // Initiate slide out plugin
    $('.prod-compare').SlideOut({
        pos: 'bottom',
        auto_close: 10
    });

    $('.prod-compare .close-compare').click(function() {
        $('.prod-compare').SlideOut('hide');
    });

    $('.prod-compare, ul.compare').on('click', '.remove a[rel="remove"], a.remove', function() {

        prod = $(this).parents('.prod').attr('data-prod') ? $(this).parents('.prod').attr('data-prod') : $(this).parents('.compare').attr('data-prod');

        $("[data-prod='" + prod + "'].compare").removeClass('active');
        //$(".prod-compare [data-prod='" + prod + "']").remove();

        $.ajax({
            url: "/includes/ajax_responder.asp",
            type: "POST",
            data: { a: 'remove_compare', prod: prod },
            success: function(data) {
                $('.prod-compare .prods').empty();
                $('.prod-compare .prods').append(data);
                if (!$('.prod-compare .prods').html()) $('.prod-compare').SlideOut('hide');
            }
        });

    });

    $('ul.compare .add a').click(function() {

        p = $(this).parents('.compare');
        prod = $(p).attr('data-prod');

        if (!$(p).hasClass('active')) {

            //this makes visual selection of given "Add to compare" link active
            //(enabling the product to be removed from selection and go to compare page link visible)
            $(p).addClass('active');

            $.ajax({
                url: "/includes/ajax_responder.asp",
                type: "POST",
                data: { a: 'add_compare', prod: prod },
                success: function(data) {
                    //alert(data);
                    //server gets us current set of items, so delete current content
                    $('.prod-compare .prods').empty();
                    $('.prod-compare .prods').append(data);
                    $('.prod-compare').SlideOut('show');
                }
            });

        }

    });
    
}


$(document).ready(function() {

    $(window).scroll(function() {

        if ($(this).scrollTop() > 100) $('body').addClass('isScroll'); else $('body').removeClass('isScroll');

    }).scroll();

    $(window).resize(function(){

		$('.hero .bgr').removeClass('height');
		if($('.hero .bgr').height()<$('.hero').height()) $('.hero .bgr').addClass('height');

		if($('body').hasClass('device-xs') || $('body').hasClass('device-sm')){
			$('.collapse-nav').removeClass('in').addClass('collapse').css('height','0');
		}else{
			$('.collapse-nav').addClass('in').css('height','auto');
		}

		$('footer').css('margin-top','-'+$('footer').outerHeight()+'px');
		$('.content').css('padding-bottom',$('footer').outerHeight()+'px');

		$('.full-height').each(function(){
			if($(this).height()<$(window).height()) $(this).css('height',$(window).height()+'px');
		})

		// Compare Table
		$('.product-comparison .key tr').each(function(index){

			h=$('.product-comparison .data tr:nth-child('+(index+1)+')').height();
			if(h>$(this).height()){
				$(this).height(h);
			}else{
				$('.product-comparison .data tr:nth-child('+(index+1)+')').height($(this).height());
			}

		});
		// End
		
    }).resize();

    // Get Query String
    var QS = getQS();

    $('.backtotop').click(function() {
        $('body').scrollTop(0);
    });

    $('.stop-prop').click(function(event) {
        event.stopPropagation();
    });

    $('header .drop .link').click(function(event) {

        $('header .dropdown').css('display', 'none');
        $(this).parent().find('.dropdown').css('display', 'block');

        event.stopPropagation();

    });
    $('header .drop').on('click touchend', function(event) {

        event.stopPropagation();

    });

    $('body').on('click touchend', function(event) {

        $('header .dropdown').css('display', 'none');

        $('.search .predictive').css('display', 'none');

    });

    $('.header-drop-mask').on('click touchend', function(event) {

        // close drop downs when clicking off
        $(".currency-drop").css('display', 'none');
        $(".mini-cart").css('display', 'none');
        $('.account-drop').css('display', 'none');
        $(".header-drop-mask").css('display', 'none');

    });
	
	// show currency
    cdtmr = '';
    $('.show-currency-drop').click(function(event) {
        $(".header-drop-mask").css('display', 'block');
        $(".mini-cart").css('display', 'none');
        $('.account-drop').css('display', 'none');
        clearTimeout(cdtmr);
        if ($(".currency-drop").css('display') == 'block') $(".currency-drop").css('display', 'none');
        else $(".currency-drop").css('display', 'block');
        event.stopPropagation();
    });
    $(".currency").mouseover(function() {
        clearTimeout(cdtmr);
    }).mouseout(function() {
        cdtmr = setTimeout(function() { $(".currency-drop").css('display', 'none'); $(".header-drop-mask").css('display', 'none'); }, 5000);
    });


    // Header drop downs
	ojdroptmr='';
	$('.oj-has-drop').click(function(event){
		
		if($(this).hasClass('active')){
			$('.oj-has-drop').removeClass('active');
		}else{
			$('.oj-has-drop').removeClass('active');
			$(this).addClass('active');
		}	
		clearTimeout(ojdroptmr);
		ojdroptmr=setTimeout(function(){ $('.oj-has-drop').removeClass('active'); },5000);
		event.stopPropagation();

	});

	$('.oj-drop').mouseenter(function(){
		clearTimeout(ojdroptmr);
	}).mouseleave(function(){
		ojdroptmr=setTimeout(function(){ $('.oj-has-drop').removeClass('active'); },5000);
	});

// Header Mega drop downs
	ojmegatmr='';
	$('.show-nav-drop').mouseenter(function(event){ 
		
		if($($(this).attr('href')).hasClass('in')){
			
			$('.show-nav-drop').removeClass('active');

			$('.header-nav-drop').each(function(){
				if($(this).hasClass('in')) $(this).collapse('hide');
			});
			
		}else{
			
			$('.show-nav-drop').removeClass('active');
			$(this).addClass('active');

			var delay=0;
			$('.header-nav-drop').each(function(){
				if($(this).hasClass('in')){
					$(this).collapse('hide');
					delay=300;
				}
			});

			var target=$(this).attr('href');

			setTimeout(function(){

    			$(target).collapse('show');
    		
    		},delay);
		
		}

		event.preventDefault();
		return false;

	}).mouseleave(function(){

		clearTimeout(ojdroptmr);
		ojdroptmr=setTimeout(function(){
			$('.show-nav-drop').removeClass('active');
			$('.header-nav-drop').each(function(){
				if($(this).hasClass('in'))$(this).collapse('hide');
			});
		},500);		
	});

	$('.header-nav-drop').mouseenter(function(){
		clearTimeout(ojdroptmr);
	}).mouseleave(function(){
		ojdroptmr=setTimeout(function(){
			$('.show-nav-drop').removeClass('active');
			$('.header-nav-drop').each(function(){
				if($(this).hasClass('in'))$(this).collapse('hide');
			});
		},500);
	});

	$('.mini-cart .scroll').slimScroll({
	    height: '100%',
	    color:'#2a2a2a',
	    wheelStep: 80
	});


    // predictive search
    $('.search input').keyup(function() {
        // ajax call here - return some data - and populate predictive
        if ($('.search input').val()) {
            $('.search .predictive, .search .clear').css('display', 'block');
        } else {
            $('.search .predictive, .search .clear').css('display', 'none');
        }
    });

    $('.search .clear').click(function() {
        $('.search .predictive, .search .clear').css('display', 'none');
        $('.search input').val('');
    });

    $('body').MQClass({
        breakpoints: [
			{ 'min-width': 0, 'max-width': 599, 'class': 'device-xs', 'data-current-device': 'xs' },
			{ 'min-width': 599, 'max-width': 992, 'class': 'device-sm', 'data-current-device': 'sm' },
			{ 'min-width': 992, 'max-width': 1200, 'class': 'device-md', 'data-current-device': 'md' },
			{ 'min-width': 1200, 'max-width': 0, 'class': 'device-lg', 'data-current-device': 'lg' },
			{ 'min-width': 0, 'max-width': 992, 'class': 'mobile', 'data-current-type': 'mobile' },
			{ 'min-width': 992, 'max-width': 0, 'class': 'desktop', 'data-current-type': 'desktop' }
		]
    });

    /** Scroll To */
    $('body').ScrollTo({
        selector: '.scrollTo',
        offset: 260,
        scroll_spy: false
    });

    /** Sticky */
    $('#checkout').StickyFix({
        top: 30,
        maxtop: function() { return $('.basket-table').height() + $('.basket-table').offset().top - $('#checkout').height() - options.top },
        devices: { xs: false, sm: false, md: true, lg: true }
    });


    /** Product Lists Class swicthers and fixed heights */

    //$('.switcher').FixedSize([
			//{ selector: '.prod-grid-sm', devices: { xs: false, sm: 2, md: 4, lg: 4} },
			//{ selector: '.prod-grid-md', devices: { xs: 2, sm: false, md: false, lg: false} },
			//{ selector: '.prod-grid-lg', devices: { xs: 3, sm: 4, md: 3, lg: 3} }
		//]);

    // Init class switcher
    $('.switcher').ClassSwitcher({
        selector: '.switchIt'
    });

    // Set class from cookie - if cookie isnt currently set - no action taken
    //$('.switcher').ClassSwitcher(
    //  'setClass', getCookie('va-class-switcher')
    //);

    // Set listener to set cookie when class changes
    $('.switcher').on('change.class-switcher', function(event, settings) {
        //setCookie('va-class-switcher', settings.currentClass, 100);
        //alert(settings.currentClass);
        switcherStyleChanged(settings.currentClass);
        //$('.switcher').FixedSize('fix');
    });

    $('.switcher').ClassSwitcher({
    selector: '.switchIt',
    onSwitch: function(_class) {
    //setCookie('va-grid-view', _class, 365);
	setCookie('va-class-switcher', _class, 365);
    //alert('1: ' + _class);
    switcherStyleChanged(_class);
    //$('.switcher').FixedSize('fix');
    }
    });

/*    $('a[data-toggle="tab"]').on('shown.bs.tab', function() {
        $('.switcher').FixedSize('fix');
    });

    $('.collapse').on('shown.bs.collapse', function() {
        $('.switcher').FixedSize('fix');
    });

    $('.collapse-tab').on('collapsetab.switched', function() {
        $('.switcher').FixedSize('fix');
    });
*/
    /** End */



   /* $('.collapse-tab').CollapseTab({
        breakpoint: 1025
    });*/

/*    $('.fixed-size').FixedSize([
		{ selector: '.col-sm-6', devices: { xs: false, sm: 2, md: 2, lg: 2} },
		{ selector: '.col-sm-6 .col-md-2', devices: { xs: false, sm: 2, md: 6, lg: 6} },
	]);
*/
	/** Compare Table Key Control */
	$('.key-control .hide-key').click(function(){

		$(this).addClass('off');
		$('.key-control .show-key').removeClass('off');
		$('.product-comparison').addClass('hide-key');

	});
	$('.key-control .show-key').click(function(){

		$(this).addClass('off');
		$('.key-control .hide-key').removeClass('off');
		$('.product-comparison').removeClass('hide-key');

	});

	/** Cookie Policy */

		/*
		// Initiate slide out plugin
		$('.cookie-policy').SlideOut({
			pos:'bottom',
			speed:500
		});

		// if cookie not set - show message
		if(getCookie('va-cookie-policy')!='true') $('.cookie-policy').delay(1000).SlideOut('show');

		// click listener for accepting cookie
		$('.cookie-policy .accept').click(function(){
			setCookie('va-cookie-policy','true',365);
			$('.cookie-policy').SlideOut('hide');
		});*/
		
		$('.cookie-policy .accept').click(function(){
			setCookie('va-cookie-policy','true',365);
			$('.cookie-policy').collapse('hide');
		});

	/** End Cookies */

    /** Begin compare */

    compareFunctionality_initialize();

    /** End Compare */

    /* AJX FORM */
//    $('.ajaxform').submit(function(event) {
//
//        event.preventDefault();
//
//        $.post("inc/ajax-form.php", { "data": $(this).serialize() }, function(data) {
//
//            if (data.status == 'OK') {
//
//                $('#AskQuestionProductComplete').PopUp('show');
//                $('#AskQuestionProduct').PopUp('hide');
//
//            } else {
//
//                alert("FORM ERROR");
//
//            }
//
//        }, "json");
//
//        return false;
//
//    });

    /** Popups */

    $('#AskQuestionProduct').PopUp({
        type: 'html',
        width: 640,
        height: 600,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#AskQuestionProductComplete').PopUp({
        type: 'html',
        width: 640,
        height: 600,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#PriceMatchProduct').PopUp({
        type: 'html',
        width: 640,
        height: 710,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#PriceMatchProductComplete').PopUp({
        type: 'html',
        width: 640,
        height: 710,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#DeliveryProduct').PopUp({
        type: 'html',
        width: 640,
        height: 460,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#DeliveryGeneral').PopUp({
        type: 'html',
        width: 640,
        height: 360,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#LoyaltyProduct').PopUp({
        type: 'html',
        width: 640,
        height: 650,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#LoyaltyGeneral').PopUp({
        type: 'html',
        width: 640,
        height: 560,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#ForgottenPassword').PopUp({
        type: 'html',
        width: 640,
        height: 380,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#TermsAndConditions').PopUp({
        type: 'html',
        width: 640,
        height: 460,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#Privacy').PopUp({
        type: 'html',
        width: 640,
        height: 460,
        gutter: 50,
        lock_aspect_ratio: false,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('#YouTube').PopUp({
        type: 'iframe',
        width: 640,
        height: 360,
        gutter: 50,
        scroll: false,
        devices: { xs: false, sm: true, md: true, lg: true }
    });

    $('.popup .popup-inner').slimScroll({
        height: '100%',
        color: '#2a2a2a'
    });

    /** End Popups */

	/** Dom Moves */

		$('#secondnav').DOMovr({
			sm:'#secondnav-mobile',
			md:'#secondnav-desktop'
		});
		
		$('#usp').DOMovr({
			sm:'#usp-mobile',
			md:'#usp-desktop'
		});
		
		$('#promogroup').DOMovr({
			sm:'#promogroup-mobile',
			md:'#promogroup-desktop'
		});

		$('#intro').DOMovr({
			sm:'#intro-mobile',
			md:'#intro-desktop'
		});

		$('#detailtabs').DOMovr({
			sm:'#detailtabs-mobile',
			md:'#detailtabs-desktop'
		});

/** End Dom Moves */



// Init plugin
    $('#recent-product').Colousel({
      type:'normal',
      selector:'div',
      autoplay:false,
      autoplay_delay:2000,
      break_delay_on_click:true,
      transition_speed:100,
      scroll_amount: {xs:0, sm:0, md:8, lg:8 }
    });

// Init plugin
    $('#cross-product').Colousel({
      type:'normal',
      selector:'div',
      autoplay:false,
      autoplay_delay:2000,
      break_delay_on_click:true,
      transition_speed:100,
      scroll_amount: {xs:0, sm:0, md:6, lg:6 }
    });

    $('#brandsfader').Colousel({
      type:'fade',
      selector:'div',
      autoplay:true,
      autoplay_delay:2000,
      transition_speed:100,
      scroll_amount: {xs:2, sm:4, md:8, lg:8 },
      max_in_view:8
    });
	
	$('#delivery-picker').Colousel({
      type:'normal',
      selector:'div',
      autoplay:false,
      autoplay_delay:2000,
      break_delay_on_click:true,
      transition_speed:100,
      scroll_amount: {xs:1, sm:2, md:2, lg:2 }
    });

// Product Reviews	
/*  $('#prodreview').on('show.bs.collapse', function () {
	  $("[data-target='#prodreview'").text('Read less...');
	});
	$('#prodreview').on('hide.bs.collapse', function () {
	  $("[data-target='#prodreview'").text('Read more...');
	});
*/

	// VA Hides
	$('.va-show').click(function(){
		$(this).parents('.va-show-hide').addClass('active');
	});
	$('.va-hide').click(function(){
		$(this).parents('.va-show-hide').removeClass('active');
	});
	

	// Hero 1
	$('.hero-1 .slider').Slider({
	    //animationPreset:'fade',
	    //animationDuration:200,
	    //nextDelay:600,
	    //currentDelay:0,
	    autoplay:true,
	    autoplay_delay: 5000,
	    layers:[{
	    	presetCSS:'fade',
	    	inDelay:600,
	      	outDelay:0,
	      	reverse_for_prev:true
	    },{
	      presetCSS:'fade',
	      inDelay:300,
	      outDelay:300,
	      external:true
	    }]
	 });	 
	 
	// Hero 2
	$('.hero-2 .slider').Slider({
	    //animationPreset:'slide',
	    //animationDuration:200,
	    //nextDelay:0,
	    //currentDelay:0,
	    autoplay:true,
	    autoplay_delay: 5000,
	    layers:[{
	      inDuration:200,
	      outDuration:200,
	      inEasing:'linear',
	      outEasing:'linear',
	      inDelay:0,
	      outDelay:0,
	      baseCSS:{ opacity:0 },
	      inCSS:{ opacity:1 },
	      outCSS:{ opacity:0 }
	    }]
	 });
	 
	 
	// Hero 3
	$('.hero-3 .slider').Slider({
	    //animationPreset:'fade',
	    //animationDuration:200,
	    //nextDelay:600,
	    //currentDelay:0,
	    autoplay:true,
	    autoplay_delay: 5000,
	    layers:[{
	    	presetCSS:'fade',
	    	inDelay:600,
	      	outDelay:0,
	    },{
	      presetCSS:'fade',
	      inDelay:300,
	      outDelay:300,
	      external:true
	    }]
	 });

	$('.hero-1, .hero-2, .hero-3').Swiper({
	    left:true,
	    right:true,
	    sensitivity:'medium'
  	});

	$('.hero-1, .hero-2, .hero-3').on('left.oj.swiper',function(){

		$(this).find('.slider').Slider('next');

	}).on('right.oj.swiper',function(){
		
		$(this).find('.slider').Slider('prev');

	});

	// Popovers
	$('.va-popover').each(function(){
		id='popover'+Math.floor((Math.random()*10000));
		$(this).attr({id:id,'data-container':'#'+id}).popover();
	});


	// Basket Delivery Calendar
	//$('.delivery-time').click(function() {
	    //$('.basket-delivery-time-mask').show();
	    //return false;
   // });
	
	//$('.delivery-time-hide').click(function() {
	    //$('.basket-delivery-time-mask').hide();
	   // return false;
    //});

});

