(function($) {

	$(function() {
	
		$('.calendar .cell').on('click', function(e) {
			e.preventDefault();
		
			var $this = $(this),
				$parent = $this.closest('.colousel-inner'),
				$active = $parent.find('.calendar .active'),
				$cell = $this.closest('.cell');
			
			if ($cell.length && !$cell.is('.inactive')) {
				if ($active.length) {
					$active.removeClass('active');
				}
				
				$cell.addClass('active');
				
				var date = $cell.data('date');
				
				if (date) {
					var url = '/services/select-delivery-date.asp?date=' + date;
					
					$.get(url).done(function() {
						console.log('delivery date requested for ' + date);
					});
				}
			}
		
			return false;
		});
	
	});

})(jQuery);