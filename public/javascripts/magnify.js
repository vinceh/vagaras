(function($) {
    $.fn.extend({
        magnify:function( ratio, timeout, descriptions ) {

            ratio = ratio || 1.5;
            timeout = timeout || 300;

            var mag = $("<div id='mag'>").appendTo($("body")).hide();
            var imgcont = $("<div id='imgcont'>").appendTo(mag);
            var magimg = $("<img>").appendTo(imgcont);

            var p = $("<div id='desc'></div>").appendTo(mag);

            mag.css("position", "absolute");

            var content = $(this).children();
            $(content).hover( function() {
                $(this).css("cursor", "pointer");
            });

            var current;
            var timer;
            var mousedown;

            $(content).mousedown( function() {
                mousedown = true;
            });

            mag.mousedown( function() {
               mousedown = false;
            });

            $(content).mouseenter( function() {

                clearTimeout(timer);
                var index = $(this).index();
                current = this;
                var delay = function() { blowup(index) };
                timer = setTimeout( delay, timeout);
            });

            $(content).mouseleave( function() {
                clearTimeout(timer);
            });
			
			mag.mouseup( function() {

                if ( mousedown ) {
                    mag.click();
                    mousedown = false;
                }
			});

            mag.click( function() {

                $(this).hide();
                $(current).click();
			});
			
			mag.mouseleave( function() {
				$(this).hide();
				magimg.attr("src", "");
			});

            function blowup(index) {

                mag.css("left", $(current).offset().left - parseInt(mag.css("padding-left")));
                mag.css("top", $(current).offset().top - parseInt(mag.css("padding-top")));

                var image = $(current).find('*').andSelf().filter("img")[0];

                var imgheight = $(image).height();
                var imgwidth = $(image).width();

                imgcont.css("height", imgheight);
                imgcont.css("width", imgwidth);

                mag.css("height", imgheight);
                mag.css("width", imgwidth);


                magimg.css("height", "100%");
                magimg.attr("src", $(current).attr("src"));

                var magheight = $(mag).height();
                var magwidth = $(mag).width();
                var newheight = Math.floor(magheight*ratio);
                var newwidth = Math.floor(magwidth*ratio);

                if ( $(mag).find("#desc").children().size() > 0 )
                    $(mag).find("#desc").children().detach();
                $(mag).find("#desc").append(descriptions[index]);
                $(mag).find("#desc").css("width", newwidth);

                mag.show();

                var newleft = mag.offset().left-((newwidth-magwidth)/2);
                var newtop = mag.offset().top-((newheight-magheight)/2);

                if ( newleft < 0 )
                    newleft = 0;
                else if ( newleft + newwidth > $(window).width() ) {
                    newleft = $(window).width() - newwidth + $("body").scrollLeft() - parseInt($(mag).css("padding-right")) - parseInt($(mag).css("padding-left"));
                }

                var scrolltop = $("body").scrollTop();
                if($.browser.mozilla || $.browser.msie) 
					scrolltop = $("html,body").scrollTop();

                if ( newtop < 0 )
                    newtop = 0;
                else if ( newtop + newheight - scrolltop > $(window).height() ) {

                    newtop = $(window).height() - newheight + scrolltop - parseInt($(mag).css("padding-bottom")) - parseInt($(mag).css("padding-top"))-$(mag).find("#desc").outerHeight(true)/2;
                }

                mag.animate( {

                    height: newheight+$(mag).find("#desc").outerHeight(true),
                    width: newwidth,
                    left: newleft,
                    top: newtop-$(mag).find("#desc").outerHeight(true)/2

                }, { duration: 100, queue: false });

                imgcont.animate( {

                    height: imgheight*ratio,
                    width: imgwidth*ratio

                }, { duration: 100, queue: false });
            }
        }
    });
})(jQuery);  