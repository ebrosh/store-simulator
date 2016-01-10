(function($) {

    $(function() {

        var respnavtmr;

        var ResetNav=function(){

          $('.resp-nav nav').css('left',0);
          $('.resp-nav').find('li').removeClass('open');
          $('.resp-nav').attr('data-open',0);

        }

        var HidePageMask=function(){

          $('.resp-nav .page-mask').stop(true,false);
          $('.resp-nav .page-mask').attr('data-open',0).animate({ opacity:0 },50,function(){
            $('.resp-nav .page-mask').css({ display:'none' });
          });

        }

        $(window).resize(function() {

            w = $(window).width();
            h = $(window).height();

            $('.resp-nav, .resp-nav-load').removeClass('desktop mobile');

            if (w < 992) {

                $('.resp-nav, .resp-nav-load').addClass('mobile');

                $('.resp-nav, .resp-nav-mask').css('height', h + 'px');

            } else {

                $('.resp-nav').addClass('desktop').css({
                    height: '',
                    visibility:'',
                    left:''
                });

                $('.resp-nav-mask').css('display','none');

                ResetNav();
            }

        }).resize();

        $('.resp-nav-load').click(function(event){

          $('.resp-nav').css({visibility:'visible',left:'-100%'})
          $('.resp-nav').attr('data-open',1).animate({left:0},200, "swing");
          $('.resp-nav-mask').css({display:'block', opacity:0});
          $('.resp-nav-mask').animate({opacity:1},200, "swing");

          event.stopPropagation();

        });

        $('.resp-nav-mask').click(function(event){

          $('.resp-nav').animate({left:'-100%'},200, "swing",function(){
            $('.resp-nav').css({visibility:'hidden'});
          });

          $('.resp-nav-mask').animate({opacity:0},200, "swing",function(){
            $('.resp-nav-mask').css('display','none');
          });

          ResetNav();

          event.stopPropagation();

        });

        $('.resp-nav a').click(function() {

            if($(this).parents('.resp-nav').hasClass('mobile')){

              p = $(this).parent();

              if ($(p).find('.sub').length) {

                $(p).addClass('open');
                $('.resp-nav nav').animate({
                    left: '-=100%'
                }, 200, "swing");

                $(p).find('.fwd').attr('data-url', $(this).attr('href'));
                return false;

              }

            }

        });

        $('.resp-nav .bwd').click(function() {

            p = $(this).closest('li');

            $('.resp-nav nav').animate({
                left: '+=100%'
            }, 200, "swing", function() {
                $(p).removeClass('open');
            });

        });

        $('.resp-nav .fwd').click(function() {

            document.location.href = $(this).attr('data-url');

        });

        $('.resp-nav-mask').on('wheel mousewheel touchmove', function(event) {

            event.preventDefault();

        });

        $('.resp-nav nav, .resp-nav nav *').mouseover(function(){
          clearTimeout(respnavtmr);
          if($('.resp-nav .page-mask').attr('data-open')!='1'){
            $('.resp-nav .page-mask').stop(true,false);
            $('.resp-nav .page-mask').attr('data-open',1).css({ display:'block', opacity:0 }).animate({ opacity:1 },100);
          }
        });

        $('.resp-nav .page-mask').mouseover(function(){
          respnavtmr=setTimeout(HidePageMask,10);
        });

    });

}(jQuery));

$(function() {

    'use strict';

    // Stop parent scroll
    $('.stop-parent-scroll').on('mousewheel touchend', function(event) {

      var dir = event.originalEvent.wheelDelta;
      var $t = $(this);

      if (dir > 0 && $t.scrollTop() === 0) {
          event.preventDefault();
      }

      if (dir < 0 && ($t.scrollTop() == $t.get(0).scrollHeight - $t.innerHeight())) {
          event.preventDefault();
      }

      event.stopPropagation();

    });

    $('.stop-parent-scroll').on('touchstart', function(event) {

      var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

      $(this).data('pageY',touch.pageY);

    });

    $('.stop-parent-scroll').on('touchmove', function(event) {

      event.preventDefault();

      event.stopPropagation();

      var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

      var move=($(this).data('pageY')-touch.pageY)/5;

      $(this).scrollTop( $(this).scrollTop()+move );

    });

});