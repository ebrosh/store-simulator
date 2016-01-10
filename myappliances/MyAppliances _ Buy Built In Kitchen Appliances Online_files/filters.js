$(document).ready(function(){

	$('.filter').each(function(){

		open=false;
		if($(this).find('.expand-link').hasClass('filter-collapse')) open=true;

		$(this).find('.expand-box').each(function(){

			$(this).find('.nav-tabs li').each(function(index){
				$(this).attr('data-index',index)
				if($(this).hasClass('active')) onIndex=index;
			});

			h=999;
			$(this).find('div.filter-content').each(function(index){
				$(this).attr('data-index',index)
				if(index!=onIndex) $(this).css('display','none');
				if($(this).height()<h) h=$(this).height();
			});

			$(this).find('div.filter-content').css('height',h+'px');

			$(this).attr('data-height',$(this).height());

			if(open) $(this).attr('data-open',1);
			else $(this).css('height',0);

		});

	});

	$('.expand-box .nav-tabs li').click(function(){

		p=$(this).parents('.expand-box');

		$(p).find('div.filter-content').css('display','block');
		$(p).find('li').removeClass('active');
		$(this).addClass('active');

		$(p).find('.nav-tabs li').each(function(index){
			$(this).attr('data-index',index)
			if($(this).hasClass('active')) onIndex=index;
		});

		$(p).find('div.filter-content').each(function(index){
			$(this).attr('data-index',index)
			if(index!=onIndex) $(this).css('display','none');
		});

	});

	$('.filter .expand-link').click(function(){

		p=$(this).parents('.filter').find('.expand-box');

		if($(p).attr('data-open')=='1'){

			$(this).removeClass('filter-collapse');
			$(p).attr('data-open',0).animate({height:'-='+$(p).attr('data-height')+'px'},200, "swing",function(){
				$(this).addClass('closed');
			});

		}else{

			$(p).removeClass('closed');
			$(this).addClass('filter-collapse');
			$(p).attr('data-open',1).animate({height:'+='+$(p).attr('data-height')+'px'},200, "swing");

		}

	});

	$('.filters .clear-button').click(function(){

		$('.filters').find('input').each(function(){
			$(this).attr('checked',false);
		});

		$('.filters').find('li').each(function(){
			$(this).removeClass('checked');
		});

		$("[data-toggle='filter']").removeClass('selected');

		ShowHideClear();

	});

	$('.filters input').click(function(){

		ShowHideClear();

		if($(this).prop('checked')){
			$(this).parent().addClass('checked');
			$("[data-toggle='filter'][data-target='#"+$(this).attr('id')+"']").addClass('selected');
		}else{
			$(this).parent().removeClass('checked');
			$("[data-toggle='filter'][data-target='#"+$(this).attr('id')+"']").removeClass('selected');
		}

	});

	$("[data-toggle='filter']").click(function(){

		tar=$(this).attr('data-target');

		if($(tar).prop('checked')){
			$(this).removeClass('selected');
			$(tar).prop('checked',false);
			$(tar).parent().removeClass('checked');
		}else{
			$(this).addClass('selected');
			$(tar).prop('checked',true);
			$(tar).parent().addClass('checked');
		}

		ShowHideClear();

	});

	ShowHideClear=function(){

		showClear=false;
		$('.filters').find('input').each(function(){
			if($(this).prop('checked')) showClear=true;
		});

		if(showClear) $('.filters .clear-button').removeClass('disabled');
		else $('.filters .clear-button').addClass('disabled');

	}

});