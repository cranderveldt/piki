/*!
 * Piki PACKAGED v0.0.5
 * http://cranderveldt.github.co/piki/
 *
 * Non-commercial use is licensed under the GPL v3 License
 *
 * Copyright 2013 Cranderveldt
 */

(function ($) {
    $.fn.piki = function(options) {
        var settings = $.extend({
            icon: "&varr;"
            , skin: 'default'
        }, options);
        if(!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g,'');
            };
        }
        var styles = {
            'default': '<style>.piki-container{display:inline-block;*vertical-align:auto;zoom:1;*display:inline;position:relative}.piki-search,.piki-options{display:none}.piki-options{box-sizing:border-box;position:absolute;top:26px;left:0;max-height:200px;overflow-y:scroll;width:100%;background:#FFF;border:1px solid #a6a6a6;text-align:left}.piki-options ul{margin:0;list-style:none;padding:0}.piki-options ul li{display:none;margin:0;list-style:none;padding:5px;cursor:pointer}.piki-options ul li.piki-match{display:block}.piki-options ul li.piki-highlight{background:#d4eef8}.piki-search-field{box-sizing:border-box;width:100%;padding:5px 10px;margin:0}.piki-select{display:inline-block;*vertical-align:auto;zoom:1;*display:inline;box-sizing:border-box;width:100%;border:1px solid #a6a6a6;background-color:#f2f2f2;background-position:0 0;background-repeat:repeat-x;background-image:url("fallback.png");background-image:-webkit-gradient(linear, left top, left bottom, from(#fff), to(#f2f2f2));background-image:-webkit-linear-gradient(top, #fff, #f2f2f2);background-image:-moz-linear-gradient(top, #fff, #f2f2f2);background-image:-o-linear-gradient(top, #fff, #f2f2f2);background-image:linear-gradient(to bottom, #ffffff,#f2f2f2);cursor:default;border-radius:5px;font:-webkit-small-control;padding:2px 15px 3px 5px;cursor:pointer}.piki-icon{position:absolute;top:3px;right:5px}</style>'
        };
        $('body').prepend(styles[settings.skin]);
        return this.each(function() {
            var $this = $(this);
            var markup = 
            '<div class="piki-container">' +
                '<div class="piki-select">';
            var selectedTitle = $this.find('option:selected').text();
            if (selectedTitle.trim() === '') {
                selectedTitle = '&nbsp;';
            }

            markup = markup +
                    '<div class="piki-title" data-piki-default="' + selectedTitle + '">' + selectedTitle + '</div>' +
                    '<span class="piki-icon">' + settings.icon + '</span>' +
                '</div>' +
                '<div class="piki-search">' +
                    '<input class="piki-search-field" type="text" placeholder="Search for options" />' +
                '</div>' +
                '<div class="piki-options">' +
                    '<ul>';
            $this.find('option[disabled!="disabled"]').each(function(){
                if ($(this).text().trim() !== '') {
                    var $option = $(this);
                    var attrString = '';
                    $.each(this.attributes, function(i, attrib){
                        var name = attrib.name;
                        var value = attrib.value;
                        attrString = attrString + ' data-piki-' + name + '="' + value + '"';
                    });
                    markup = markup + '<li class="piki-match"' + attrString + '>' + $option.text() +'</li>';
                }
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
                var $selected = $container.find('.piki-highlight').data('piki-selected', 'selected').removeClass('piki-highlight').siblings().data('piki-selected', '').addClass('piki-match').end();
                if ($selected.length > 0) {
                    $container.find('.piki-title').text($selected.text());
                    $container.find('option[value="' + $selected.data('piki-value') + '"]').prop('selected', 'selected');
                } else {
                    var $title = $container.find('.piki-title');
                    $title.text($title.data('piki-default'));
                }
                $('body').off();
                $container.find('.piki-select').show().siblings().hide();
                $container.find('.piki-search-field').val('');
            };
            var moveHighlight = function($container, dir) {
                var $current = $container.find('.piki-highlight');
                var $matches = $container.find('.piki-match');
                if ($current.length > 0) {
                    if ($matches.length > 1) {
                        var index = $matches.index($current);
                        var $next = $($matches[index + dir]);
                        if ($next === undefined) {
                            $next = $current;
                        }
                        $current.removeClass('piki-highlight');
                        $next.addClass('piki-highlight');
                    }
                } else {
                    if ($container.find('.piki-match').length > 0) {
                        $container.find('.piki-match:first').addClass('piki-highlight');
                    }
                }
            };
            // Listeners
            // Prevent form submit on enter
            $scope.on('keypress', '.piki-search-field', function(e){
               if (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40) { e.preventDefault(); }
            });
            // Narrow search results on keyup
            $scope.on('keyup', '.piki-search-field', function(e){
                var highlightHasBeenMoved = false;
                var $container = $(this).parent().parent();
                var list = $container.find('.piki-options ul li');
                // Enter
                if (e.keyCode === 13) {
                    setSelectTitle($container);
                }
                var search = $(this).val().toLowerCase();
                list.each(function(){
                    var text = $(this).text().toLowerCase();
                    if (text.indexOf(search) === -1) {
                        $(this).removeClass('piki-match');
                    } else {
                        $(this).addClass('piki-match');
                    }
                });
                // Up
                if (e.keyCode === 38) {
                    highlightHasBeenMoved = true;
                    moveHighlight($container, -1);
                }
                // Down
                if (e.keyCode === 40) {
                    highlightHasBeenMoved = true;
                    moveHighlight($container, 1);
                }
                if (!highlightHasBeenMoved) {
                    $container.find('.piki-match:first').addClass('piki-highlight').siblings().removeClass('piki-highlight');
                }
            });
            // Click on a match
            $scope.on('click', '.piki-match', function(){
                $(this).addClass('piki-highlight').siblings().removeClass('piki-highlight');
                setSelectTitle($(this).parent().parent().parent());
            });
            // Click on the title to reveal the search and dropdown
            $scope.on('click', '.piki-select', function(){
                $(this).hide().siblings().show().end().parent().find('.piki-search-field').focus();
                var $boundary = $(this).parent();
                // Click anywhere outside the piki elements to close
                $('body').on('click', function(e){
                    var insideSelect = false;
                    $(e.target).parents().each(function(){
                        if (this === $boundary.get(0)) {
                            insideSelect = true;
                        }
                    });
                    if(!insideSelect) {
                        $('body').off();
                        $scope.find('.piki-select').show().siblings().hide();
                    }
                });
            });
        });
    };
}( jQuery ));