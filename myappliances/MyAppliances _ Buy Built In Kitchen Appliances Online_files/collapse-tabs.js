$(function() {

    'use strict';

    // Main collapse tab function
    var CollapseTab = function() {

        // Get window width
        var w = $(window).width();

        $(".oj-collapse-tabs").each(function() {

            // Get breakpoint if set - if not use default
            var breakpoint = (typeof $(this).attr('data-breakpoint') !== 'undefined') ? $(this).attr('data-breakpoint') : 992;

            // Remove desktop and mobile classes
            $(this).removeClass('desktop mobile');

            // Check if width is larger/smaller than breakpoint
            if (w < breakpoint) {

                // Add mobile class to main collapse tabs
                $(this).addClass('mobile');

            } else {

                // Add desktop class to main collapse tabs
                $(this).addClass('desktop');

            }

        });

    }

    // Read hash
    var readHash = function() {

        // Set active based on hash
        var hash = window.location.hash.substring(1);

        $('.oj-tabs, .oj-collapse-tabs').each(function(tabsindex) {

            if (hash) {
                if ($(this).find(".tab-nav [data-id='" + hash + "']").length) {

                    $(this).find(".tab-nav [data-id]").removeClass('active');
                    $(this).find(".tab-nav [data-id='" + hash + "']").addClass('active');

                }
            }

            // Get index of active tab
            var index = $(this).find(".tab-nav li.active").index();

            // Store index
            $(this).data('index', index);

            // Make active nav's tab-pane visible
            $(this).find(".tab-pane").removeClass('active');
            $(this).find(".tab-pane").eq(index).addClass('active');


            // Collapse Tab logic
            if ($(this).hasClass('oj-collapse-tabs')) {

                // Remove active collapse classes
                $(this).find('.ct-content').removeClass('in').addClass('collapse').css('height', 0);

                // Add active collapse classes
                $(this).find('.ct-content').eq(index).addClass('in').removeClass('collapse').css('height', 'auto');
            }

        });

    }


    // Added needed HTML markup
    $('.oj-tabs, .oj-collapse-tabs').each(function(tabsindex) {

        $(this).addClass('oj-tabs-' + tabsindex);

        $(this).find('.tab-nav li').each(function(index) {

            $(this).attr('data-target', '.oj-tabs-' + tabsindex + ' .tab-pane-' + index);

        });

        $(this).find('.tab-pane').each(function(index) {

            $(this).addClass('tab-pane-' + index);

        });

        // Check there is an active class
        if (!$(this).find(".tab-nav li.active").length) {
            $(this).find(".tab-nav li").eq(0).addClass('active');
        }

    });

    // Add click listener
    $('.tab-nav li').click(function(event) {

        event.preventDefault();

        // Show tab
        $(this).tab('show');

    });

    // Click event to show collapse
    $('.oj-collapse-tabs .collapse-title').click(function() {

        if ($(this).parents('.oj-collapse-tabs').hasClass('mobile')) {

            $(this).parent().find('.ct-content').collapse('toggle');

        }

    });

    // BS tab shown event
    $('.tab-nav li').on('shown.bs.tab', function(event) {

        // Update active classes
        $(event.target).siblings().removeClass('active');
        $(event.target).addClass('active');

        if ($(event.target).attr('data-id')) {

            // Update hash
            window.location.hash = $(event.target).attr('data-id');

        } else {

            // Manually invoke refresh
            readHash();

        }

    });

    // BS collpase show event to trigger accordion effect
    $('.oj-collapse-tabs .ct-content').on('show.bs.collapse', function() {

        $(this).parent().siblings().find('.ct-content.in').collapse('hide');

    });


    // BS collapse shown event to update hash
    $('.oj-collapse-tabs .ct-content').on('shown.bs.collapse', function() {

        var index = $(this).parent().index();

        var $listItem = $(this).parents('.oj-collapse-tabs').find('.tab-nav li').eq(index);
        window.location.hash = $listItem.attr('data-id');

         $('html, body').animate({ scrollTop: $listItem.offset().top }, 300);
    });


    // Add collapse classes
    $('.oj-collapse-tabs .ct-content').addClass('collapse');

    // Add resize listener
    $(window).on('resize', CollapseTab);

    // Set hashchange event
    $(window).on('hashchange', readHash);

    CollapseTab();
    readHash();

});
