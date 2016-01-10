$(document).ready(function(){

	var $passwordInput = $('.password-input');
	
	if ($passwordInput.length) {
		$passwordInput.collapse({
			toggle: false
		});
	}
	
	var $quantities = $('.update-bundle-quantities');
	
	$quantities.on('click', function(e) {
		var $target = $(e.target),
			$form = $target.closest('form'),
			$hidden = $form.find('[name=UpdateQuantities]');
		$hidden.val('1');
		$form.submit();
	});

});

$(window).load(function(){
    
	$(window).resize(function(){

		/** Basic check to see if browser is modern or not */
		if(Modernizr.websockets && Modernizr.canvas){
			$('body').addClass('modern');
		}else{
			$('body').addClass('old');
		}

		/** Mobile First Images */
		if($('body').attr('data-current-device')!='xs'){
			$('.mobile-first').each(function(){
				$(this).attr('src',$(this).attr('data-src')).addClass('active');
			});
		}

		$('.fullheight').each(function(){
			$(this).css('height','');
			$(this).css('height',$(this).parent().css('height'));
		});

    }).resize();

    pxRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
    if(pxRatio>1){
    
        $('.x2').each(function(){ $(this).attr('src', $(this).attr('src').replace(".","@2x.")); });
        $('body').addClass('x2');
    
    }

    $('.mobile-menu,.mobile-mask').click(function(){
		
    	if($('.mobile-menu').attr('data-open')=='1'){
    		$('.mobile-menu').attr('data-open',0);
    		$('.mobile-menu').removeClass('active');
    		$('.mobile-nav').animate({right:'-250px'},200, "swing");
    		$('.mobile-mask').animate({opacity:0},100, "swing",function(){ $('.mobile-mask').css('height',0); });
    	}else{
    		$('.mobile-menu').attr('data-open',1);
    		$('.mobile-menu').addClass('active');
    		$('.mobile-nav').animate({right:0},200, "swing");
    		$('.mobile-mask').css({height:'100%',opacity:0});
    		$('.mobile-mask').animate({opacity:1},100, "swing");
    	}

	});

    $('.imgswap').each(function(){
    	$(this).attr('data-src-out',$(this).attr('src'));
	});
	
	$('body').on('mouseenter','.imgswap',function(){
		if($('body').attr('data-current-type')=='desktop') $(this).attr('src',$(this).attr('data-src-over'));
	}).on('mouseleave','.imgswap',function(){
		$(this).attr('src',$(this).attr('data-src-out'));
	});

	$('.mo').mouseenter(function(){
		$(this).animate({opacity:0.9},100, "swing");
	}).mouseleave(function(){
		$(this).animate({opacity:1},100, "swing");
	});

	/** Force click on touch devices instead of hover event */
	$('.touchclk').on('touchend', function(e) {
	   $(this).click();
	});

	/** Submit */
	$('.submit').click(function(){
		$(this).parents('form').submit();
	});
	
	/** Click */
	$('body').on('click','.clk',function(){
		document.location.href=$(this).attr('data-url');						 
	});

	/** Scale */
	$('.scale').each(function(){
		$(this).addClass('forceblock');
		w=$(this).width()-($(this).outerWidth()-$(this).width());
		$(this).removeClass('forceblock');
	});

});

function isDesktop(){

	if($('body').hasClass('device-lg')) return true; else return false;

}

function isModern(){

	if($('body').hasClass('modern')) return true; else return false;

}

function Ratio(x,y,a){
	
	return y*(a/x);

}

// cookie functions from http://www.w3schools.com/js/js_cookies.asp
function setCookie(cname,cvalue,exdays)
{
var d = new Date();
d.setTime(d.getTime()+(exdays*24*60*60*1000));
var expires = "expires="+d.toGMTString();
document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++)
{
var c = ca[i].trim();
if (c.indexOf(name)==0) return c.substring(name.length,c.length);
}
return false;
}

function getQS(){

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