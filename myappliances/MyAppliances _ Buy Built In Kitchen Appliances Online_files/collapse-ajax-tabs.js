(function($, window) {

    'use strict';

	var pluginName = 'TabPlugin';
	
	var TabPlugin = (function() {
	
		// All of the possible options for this plugin and their defaults
		// Change these only if you want the default for everything changed, otherwise pass in where TabPlugin is called below.
		var defaults = {
			cycleInterval: 30000,
			cycle: false,
			productTemplate: '',
			serviceUrl: '',
			navSelector: '.tab-nav',
			navItemSelector: 'li',
			activeTabItemClass: 'active',
			activatePaneItemClass: 'active',
			contentSelector: '.tab-content',
			tabPageSelector: '.tab-pane',
			desktopBreakpoint: 992,
			productListSelector: '.product-list-results',
			collapseTitleSelector: '.collapse-title',
			mobileContentSelector: '.oj-content, .ct-content',
			collapseClass: 'collapse',
			switchSelectorActiveSelector: '.switch-view .active',
			valueIndicators: [
				""
			]
		};
	
		// Constructor, called when plugin is used.
		var tabPlugin = function(element, options) {
			this.$el = $(element);
			this.options = $.extend( {}, defaults, options);
			this.init();
		};
		
		(function(p) {
			
			p.init = function() {
				this.bindDom();
				this.browserResized();
				
				if (!this.isMobile()) {
					this.selectFirstItem();
				}
				
				if (this.options.cycle) {
					this.enableRotation();
				}
			};
			
			// Enables interval which iterates tabs
			p.enableRotation = function() {
				var $tabNav = this.$tabNav, // Get the tab nav
					$tabNavItems = this.$tabNavItems,
					$tabContent = this.$tabContent, // Get the tab content
					isOver = $tabNav.is(':hover') || $tabContent.is(':hover'); // Detect if we're over either on load

					$tabContent.hover(function() { isOver = true; },function() { isOver = false; }); // Toggle isOver if mouse over
					$tabNav.hover(function() { isOver = true; },function() { isOver = false; });

					var self = this;
					
					// Start our interval
					this.rotationInterval = setInterval(function() {

						// If is over, do nothing.
						if (isOver || self.isMobile()) {
							return;
						}

						// Find the active tab
						var $activeTab = $tabNavItems.filter('.' + self.options.activeTabItemClass);

						if ($activeTab.length) {

							// Find our next sibling, if any
							var $next = $activeTab.next(self.options.navItemSelector);

							// If no sibling, start over
							if (!$next.length) {
								$next = $activeTab.siblings().first();
							}

							// Click next if we can
							if (!isOver) {
								$next.click();
							}
						}

				}, this.options.cycleInterval); // Every x seconds
			};
			
			p.clearRotationInterval = function() {
				if (this.rotationInterval) {
					clearInterval(this.rotationInterval);
					this.rotationInterval = 0;
				}
			};
			
			p.isMobile = function() {
				return this.$el.hasClass('mobile');
			};
			
			p.bindDom = function() {
				// First try find the nav
				this.$tabNav = this.$el.find(this.options.navSelector);
				
				// If the nav does not exist, throw an exception. Should always exist.
				if (!this.$tabNav.length) {
					throw 'navSelector not found.';
				}
				
				// Find all of the nav items in the nav
				this.$tabNavItems = this.$tabNav.find(this.options.navItemSelector);
				
				// If no items found, throw an exception.
				if (!this.$tabNavItems.length) {
					throw 'navItemSelector not found.';
				}
				
				this.$tabContent = this.$el.find(this.options.contentSelector);
				
				// If the nav does not exist, throw an exception. Should always exist.
				if (!this.$tabContent.length) {
					throw 'contentSelector not found.';
				}
				
				// Collect all of the tab pages
				this.$tabPanes = this.$tabContent.find(this.options.tabPageSelector);
				
				// If no items found, throw an exception.
				if (!this.$tabPanes.length) {
					throw 'tabPageSelector not found.';
				}
				
				// Find all of the mobile collapse titles
				this.$collaspseTitles = this.$tabContent.find(this.options.collapseTitleSelector);
				
				// If no collapse titles, throw an error.
				if (!this.$collaspseTitles.length) {
					throw 'collapseTitleSelector not found.';
				}
				
				// Find all mobile content
				this.$mobileContent = this.$tabContent.find(this.options.mobileContentSelector);
				
				// If mobile content not found, throw an error.
				if (!this.$mobileContent.length) {
					throw 'mobileContentSelector not found.';
				}
				
				var self = this;
				
				// If a nav item is clicked, prevent default and trigger our logic.
				this.$tabNavItems.on('click', function(e) {
					e.preventDefault();
					
					if (e.clientX) {
						self.clearRotationInterval();
					}
					
					self.tabNavItemClicked(e.target);
					return false;
				});
				
				// Try to get the html of our template
				var templateHtml = $(this.options.productTemplate).html();
				
				// If the template does not exist or is empty, throw an error.
				if (!templateHtml) {
					throw 'Unable to find productTemplate';
				}
				
				// Compile our template with Handlebars
				this.productTemplate = Handlebars.compile(templateHtml);
				
				// If the browser is resized, handle it.
				$(window).on('resize', function() {
					self.browserResized();
				});
				
				// Queue this class to be added (for styling purposes, we don't want the jQuery events on it.
				setTimeout(function() {
					self.$el.addClass('oj-collapse-tabs');
				}, 0);
				
				this.$collaspseTitles.on('click', function(e) {
					e.preventDefault();
					
					self.clearRotationInterval();
					
					var $target = $(e.target).closest(self.options.collapseTitleSelector);
					
					self.mobileTitleClicked($target);
					
					return false;
				});
			};
			
			p.ensureProperView = function($pane) {
				var $btn = $pane.find(this.options.switchSelectorActiveSelector),
					classToSet = 'switchIt ' + $btn.data('class');
				$pane.find('.switchIt').attr('class', classToSet);
			}
			
			p.mobileTitleClicked = function($title) {
			
				var $pane = $title.closest(this.options.tabPageSelector),
					isPaneActive = $pane.is('.' + this.options.activeTabItemClass);
				
				this.markAllTabsInactive();
				this.markAllPanesInactive();
				
				if (isPaneActive) {
					return;
				}
				
				var index = $pane.index(),
						button = this.$tabNavItems.get(index),
						$button = $(button);
						
				this.markTabActive($button);
				this.showTabPane($button);
				this.ensureTabPageData($button);
			
			};
			
			p.browserResized = function() {
			    // Get breakpoint if set - if not use default
				var breakpoint = this.options.desktopBreakpoint;

				// Check if width is larger/smaller than breakpoint
				if (w < breakpoint && this.$el.hasClass('desktop')) {
				
					// Remove the desktop class selected
					this.$el.removeClass('desktop');
					
					// Add mobile class to main collapse tabs
					this.$el.addClass('mobile');
					
				} else if (this.$el.hasClass('mobile')) {
				
					// remove the mobile class currently applied
					this.$el.removeClass('mobile');
					
					// Add desktop class to main collapse tabs
					this.$el.addClass('desktop');
					
					// Make sure we have a tab selected
					this.ensureTabIsSelected();
				}
			};
			
			// Tries to find a activate tab item, if unable, clicks the first one
			p.ensureTabIsSelected = function() {
				// Find the active tab item
				if (!this.$tabNavItems.filter('.' + this.options.activeTabItemClass).length) {
				
					// If nothing is active, get the first tab item and click it.
					var first = this.$tabNavItems.get(0);
					$(first).click();
					
				}
			};
			
			// Select the first nav item
			p.selectFirstItem = function() {
				var $firstNavItem = this.$tabNavItems.first();
				$firstNavItem.click();
			};
			
			// Will remove the active class from all nav items
			p.markAllTabsInactive = function() {
				this.$tabNavItems.removeClass(this.options.activeTabItemClass);
                this.$mobileContent.removeClass('in').addClass('collapse').css('height', 0);
			};
			
			// Will make the passed tab item active and 
			p.markTabActive = function($tabButton) {
				$tabButton.addClass(this.options.activeTabItemClass);
			};
			
			// Hide all tabs
			p.markAllPanesInactive = function() {
				this.$tabPanes.removeClass(this.options.activatePaneItemClass);
			};
			
			// Finds the tab page that is at the same index as the button passed in
			p.getTabPaneForButton = function($tabButton) {
				var indexOfPane = $tabButton.index(),
					pane = this.$tabPanes.get(indexOfPane),
					$pane = $(pane);
				return $pane;
			};
			
			// Show the tab page that is at the same index as the tab button
			p.showTabPane = function($tabButton) {
				var $pane = this.getTabPaneForButton($tabButton);
					
				if ($pane.length) {
					$pane.addClass(this.options.activatePaneItemClass);
					
					var $content = $pane.find(this.options.mobileContentSelector);
					
					if ($content.length) {
						$content.addClass('in').removeClass('collapse').css('height', 'auto');
					}
				}
			};

			// Logic for when a nav item is clicked
			p.tabNavItemClicked = function(navItem) {
				// Find the actual nav item from whatever is passed in
				var $navItem = $(navItem).closest('li');
				
				// If we have a nav item
				if ($navItem.length) {
					this.markAllTabsInactive();
					this.markAllPanesInactive();
					this.markTabActive($navItem);
					this.showTabPane($navItem);
					this.ensureTabPageData($navItem);
				}
			};
			
			// Method for actually returning data
			p.requestData = function($button) {
				
				var parts = [],
					data = $button.data(),
					qs = '';
				
				$.each(data, function(name, value) {
					parts.push(name + '=' + value);
				});
				
				qs = parts.join('&');
				
				// Just return an ajax promise so we can wait on it in other places
				return $.ajax({
				  dataType: "json",
				  url: this.options.serviceUrl + '?' + qs
				});
				
			};
			
			p.bindProductEvents = function($productList) {
			
				var $swappingImages = $productList.find('.imgswap');
				
				$swappingImages.hover(function() {
					var other = $(this).data('srcOver');
					if (other) {
						$(this).attr('src', other);
					}
				}, function() {
					var other = $(this).data('srcOut');
					if (other) {
						$(this).attr('src', other);
					}
				});
				
				var $moreInfo = $productList.find('[data-role=more-info], [data-url]');
				
				$moreInfo.on('click', function(e) {
					var url = $(e.target).data('url');
					
					if (url) {
						window.location.href = url;
					}
				});
				
				$productList.ProductHeight();
			};
			
			// Loads data from the web service if we need it.
			p.ensureTabPageData = function($tabButton) {
				var $pane = this.getTabPaneForButton($tabButton);
				
				// If the tab has an ID and it hasn't been requested already
				if (!$pane.data('requested')) {
				
					// Mark the tab as requested
					$pane.data('requested', true);
					
					// Find the destination for our data
					var $productList = $pane.find(this.options.productListSelector);
					
					var self = this;
					
					// Reuqest our data, handle the promise that comes back.
					this.requestData($tabButton).done(function(response) {
					
						// Variable to hold all of our template data
						var allHtml = '';
						
						// Iterate all of the response products
						$.each(response.products, function(index, value) {
						
							var i = Math.floor(self.options.valueIndicators.length*Math.random()),
								indicator = self.options.valueIndicators[i];
						
							var viewData = $.extend(value, {
								ValueIndicator: indicator
							});
						
							// Render the template on each one
							allHtml += self.productTemplate(value);
							
						});
						
						allHtml += '<div class="clear"></div>';
						
						// After we've iterated all of the products, set all of the html we collected.
						$productList.html(allHtml);
						
						// Make sure the list view is selected
						self.ensureProperView($pane);
						
						// Ensure our products have the proper events
						self.bindProductEvents($productList);
						
						if (typeof compareFunctionality_initialize !== 'undefined') {
							compareFunctionality_initialize();
						}
					});
					
				}
			};
			
		})(tabPlugin.prototype);
		
		return tabPlugin;
	
	})();
	
	$.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new TabPlugin( this, options ));
            }
        });
    }

	$(function() {
		$('[data-role=home-tabs]').TabPlugin({
			cycle: true,
			serviceUrl: '/services/productservice.asp',
			productTemplate: '#tpl-product-list-item'
		});
		
		$('[data-role=category-tabs]').TabPlugin({
			cycle: false,
			serviceUrl: '/services/categoryservice.asp',
			productTemplate: '#tpl-product-list-item'
		});
		
	});
	
	Handlebars.registerHelper('subtract', function(first, second) {
	  return parseInt(first - second);
	});
	
	Handlebars.registerHelper('get-savings', function(first, second) {
	  return parseFloat(first - second).toFixed(2);
	});
	
	Handlebars.registerHelper('rating-count', function(number) {
	  return number || 0;
	});
	
	Handlebars.registerHelper('rating-percent', function(first, second) {
	  return Math.min((Math.ceil(first / second) * 5) * 100, 100);
	});
	
	Handlebars.registerHelper('is-flagged', function(number, options) {
	  if (number == '1') {
		return options.fn(this);
	  }
	});
	
	Handlebars.registerHelper('is-above-zero', function(number, options) {
	  if (number > 0) {
		return options.fn(this);
	  }
	});

	Handlebars.registerHelper('is-zero', function(number, options) {
	  if (number == 0) {
		return options.fn(this);
	  }
	});

	Handlebars.registerHelper('is-above-other-number', function(number, secondNumber, options) {
   if (number > secondNumber) {
  return options.fn(this);
   }
 });
	 
	 Handlebars.registerHelper('is-string-true', function(toCheck, options) {
   if (toCheck == "True") {
  return options.fn(this);
   }
 });


Handlebars.registerHelper('unescape', function(options) {
	 var decoded = $("<div/>").html(options.fn(this)).text();
	 return new Handlebars.SafeString(decoded);
	});

})(jQuery, window);
