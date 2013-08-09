/*
BUGLIST

-keys don't work at all including enter and arrows

*/

(function ($) {
    $.fn.blueSelect = function(options) {
        var settings = $.extend({
            icon: "&varr;"
            , skin: 'default'
        }, options);
        return this.each(function() {
            
            var $this = $(this);
            var markup = 
            '<div class="blsl-container">' +
                '<div class="blsl-select">';
            var selectedTitle = $this.find('option:selected').text();
            if (selectedTitle === '') {
                selectedTitle = $this.find('option:first').text();
            }

            markup = markup +
                    '<div class="blsl-title" data-blsl-default="' + selectedTitle + '">' + selectedTitle + '</div>' +
                    '<span class="blsl-icon">' + settings.icon + '</span>' +
                '</div>' +
                '<div class="blsl-search">' +
                    '<input class="blsl-search-field" type="text" placeholder="Search for options" />' +
                '</div>' +
                '<div class="blsl-options">' +
                    '<ul>';
            $this.find('option[disabled!="disabled"]').each(function(){
                var $option = $(this);
                var attrString = '';
                $.each(this.attributes, function(i, attrib){
                    var name = attrib.name;
                    var value = attrib.value;
                    attrString = attrString + ' data-blsl-' + name + '="' + value + '"';
                });
                markup = markup + '<li class="blsl-match"' + attrString + '>' + $option.text() +'</li>';
            });
            markup = markup +
                    '</ul>' +
                '</div>' +
            '</div>';
            $this.hide().after(markup);
            var $scope = $this.next();
            // Functions
            var setSelectTitle = function($container) {
                // TODO: need to check if $selected is empty
                var $selected = $container.find('.blsl-highlight').data('blsl-selected', 'selected').removeClass('blsl-highlight').siblings().data('blsl-selected', '').addClass('blsl-match').end();
                if ($selected.length > 0) {
                    $container.find('.blsl-title').text($selected.text());
                    $container.find('option[value="' + $selected.data('blsl-value') + '"]').prop('selected', 'selected');
                } else {
                    var $title = $container.find('.blsl-title');
                    $title.text($title.data('blsl-default'));
                }
                $('body').off();
                $container.find('.blsl-select').show().siblings().hide();
                $container.find('.blsl-search-field').val('');
            };
            var highlightNext = function($container) {
                var $current = $container.find('.blsl-highlight');
                if ($current.length > 0) {
                    var $next = $current.next('.blsl-match');
                    if ($next.length > 0) {
                        $current.removeClass('blsl-highlight').next('.blsl-match').addClass('blsl-highlight');
                        $next.scrollTop(1000);
                    }
                } else {
                    if ($container.find('.blsl-match').length > 0) {
                        $container.find('.blsl-match:first').addClass('blsl-highlight');
                    }
                }
            };
            var highlightPrev = function($container) {
                var $current = $container.find('.blsl-highlight');
                if ($current.length > 0) {
                    var $prev = $current.prev('.blsl-match');
                    if ($prev.length > 0) {
                        $current.removeClass('blsl-highlight').prev('.blsl-match').addClass('blsl-highlight');
                    }
                } else {
                    if ($container.find('.blsl-match').length > 0) {
                        $container.find('.blsl-match:first').addClass('blsl-highlight');
                    }
                }
            };
            // Listeners
            // Prevent form submit on enter
            $scope.on('keypress', '.blsl-search-field', function(e){
               if (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40) { e.preventDefault(); }
            });
            // Narrow search results on keyup
            $scope.on('keyup', '.blsl-search-field', function(e){
                var highlightHasBeenMoved = false;
                var $container = $(this).parent().parent();
                var list = $container.find('.blsl-options ul li');
                // Enter
                if (e.keyCode === 13) {
                    setSelectTitle($container);
                }
                var search = $(this).val().toLowerCase();
                list.each(function(){
                    var text = $(this).text().toLowerCase();
                    if (text.indexOf(search) === -1) {
                        $(this).removeClass('blsl-match');
                    } else {
                        $(this).addClass('blsl-match');
                    }
                });
                // Up
                if (e.keyCode === 38) {
                    highlightHasBeenMoved = true;
                    highlightPrev($container);
                }
                // Down
                if (e.keyCode === 40) {
                    highlightHasBeenMoved = true;
                    highlightNext($container);
                }
                if (!highlightHasBeenMoved) {
                    $container.find('.blsl-match:first').addClass('blsl-highlight').siblings().removeClass('blsl-highlight');
                }
            });
            // Click on a match
            $scope.on('click', '.blsl-match', function(){
                $(this).addClass('blsl-highlight').siblings().removeClass('blsl-highlight');
                setSelectTitle($(this).parent().parent().parent());
            });
            // Click on the title to reveal the search and dropdown
            $scope.on('click', '.blsl-select', function(){
                $(this).hide().siblings().show().end().parent().find('.blsl-search-field').focus();
                // Click anywhere outside the blsl elements to close
                $('body').on('click', function(e){
                    var insideSelect = false;
                    $(e.target).parents().each(function(){
                        if ($(this).hasClass('blsl-container')) {
                            insideSelect = true;
                        }
                    });
                    if(!insideSelect) {
                        $('body').off();
                        $scope.find('.blsl-select').show().siblings().hide();
                    }
                });
            });
        });
    };
}( jQuery ));