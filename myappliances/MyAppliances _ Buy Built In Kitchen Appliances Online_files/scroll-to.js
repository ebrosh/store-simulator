/*
 * ScrollTo
 */

(function($){
	
	// Define Global Vars
	var Selectors=[];

	$(window).scroll(function(){

		if(!Selectors.length) return;
		
		for(i in Selectors){
			
	        $(Selectors[i]).each(function(){

	        	settings=$(this).data('scrollTo');

	        	if(settings.scroll_spy) methods['Scroll'].apply(this);

	        });			

	    }

	});

	// Define Methods
	var methods={
	    
	    init: function(options){ 

	    	// Save selector in array
			Selectors.push(this.selector);

			return this.each(function(){

				// Set this
				var $this=$(this);

		    	// Set Options
				var settings=$.extend({

					selector:'a',
					scroller:'body,html',
					listener:'click',
					offset:0,
					scroll_speed:300,
					scroll_spy:true

				},options);

				// Save settings
				$this.data('scrollTo',settings);

				// Add listener
				$(this).on(settings.listener,settings.selector,function(){
					
					methods['Listener'].apply($this,[$(this)]);

					if(settings.scroll_spy) return false; else return true;
				
				});

				$this.find(settings.selector).each(function(){

					vars=methods['getVars'].apply(this,[this,settings]);

					if(window.location.hash.substring(1)==vars.target.substring(1)) $(settings.scroller).scrollTop(vars.position);

				});

			});
	    
	    },
	    
	    Listener: function(_this){

	    	settings=this.data('scrollTo');

	    	vars=methods['getVars'].apply(this,[_this,settings]);

			$(settings.scroller).animate({scrollTop:vars.position},settings.scroll_speed);
	    
	    },

	    Scroll: function(){

	    	var $this=$(this);

	        var settings=$this.data('scrollTo');

	        $this.find(settings.selector).removeClass('active');

	        st={position:0};
			$this.find(settings.selector).each(function(){

				vars=methods['getVars'].apply(this,[this,settings]);

				if($(window).scrollTop()>=vars.position && vars.position>st.position) st={position:vars.position,element:$(this),target:vars.target};

			});
			
			if(st.position){
				$(st.element).addClass('active');
				window.location.hash='#'+st.target.substring(1);
			}else{
				window.location.hash='';
			}

		},

		getVars: function(object,settings){

			offset=$(object).attr('data-offset') ? $(object).attr('data-offset') : settings.offset;
	    	target=$(object).attr('data-target') ? $(object).attr('data-target') : $(object).attr('href');

	    	var toppos=false;

	    	if( $("[data-id='"+target.substring(1)+"']").length ){
	    		
	    		$("[data-id='"+target.substring(1)+"']").each(function(){
	    			
	    			if( $(this).offset().top && !toppos ){
	    				toppos=$(this).offset().top;
	    			}

	    		});

	    	}else if( $(target).length ){
	    		
	    		$(target).each(function(){

	    			if( $(this).offset().top && !toppos ){
	    				toppos=$(this).offset().top;
	    			}

	    		});
	    	
	    	}else{
	    		toppos=0;
	    	}

	    	position=toppos-parseInt(offset);

			return {offset:offset,target:target,position:position};

		}
	
	};

 	$.fn.ScrollTo=function(method){

	    if(methods[method]){
	    
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    
	    }else if( typeof method === 'object' || ! method ){
	    
	      return methods.init.apply( this, arguments );
	    
	    }else{
	    
	      $.error( 'Method ' +  method + ' does not exist on jQuery.Datatable' );
	    
	    }    
  
  	};

}(jQuery));