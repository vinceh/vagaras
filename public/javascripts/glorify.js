(function($) {
    $.fn.extend({
		
		unglorify: function() {
			$('#blowupDetails').children().detach();
			$(".overlay").remove();
			$(".overlay #thumbs").remove();
			$(".backdrop").remove();
			$("html").removeClass("overflow");
		},
		
        glorify:function(descriptions) {

            $(this).children().hover( function() {
                $(this).css("cursor", "pointer");
            });

            var childSize = $(this).children().size();
            var children = $(this).children();

            $(this).children().unbind("click").click( function() {

                createBody($(this).index());
            });
			
            function createBody( index ) {

                $("html").addClass("overflow");

                $("body").append("<div class='backdrop'></div>");
                $("body").append("<div class='overlay'></div>");

                $(".overlay").click( function() {
                    close();
                });

                $(".overlay").append("<div id='close'></div>");

                $(".overlay #close").click( function() {
                    close();
                });

                $(".overlay").append("<div class='imageholder'></div>");
                $(".overlay .imageholder").append("<div class='blowup'></div>");
                $(".imageholder .blowup").append("<img/>");
                $(".imageholder .blowup").append("<div id='blowupDetails'/>");


                $(".overlay").append("<div class='thumbholder'></div>");

                $(".overlay .thumbholder").append("<div id='selection'></div>");

                addImages( index );

                $(".overlay").append("<div id='left'></div>");
                $(".overlay").append("<div id='right'></div>");

                $(".overlay #left").click( function() {

                    if ( currentIndex > 0 ) {

                        updateCurrent( currentIndex - 1 );
                        moveToCurrent();
                    }

                    return false;
                });

                $(".overlay #right").click( function() {
                    if ( currentIndex < childSize - 1 ) {
                        updateCurrent( currentIndex + 1 );
                        moveToCurrent();
                    }

                    return false;
                });

                $(".overlay .thumbholder, .imageholder .blowup").click( function() {
                    return false;
                });

                $(window).resize();
            }

            function addImages( index ){

                $(".overlay .thumbholder").append("<div id='thumbs'></div>");

                $(".thumbholder #thumbs").css("height", $(".overlay .thumbholder").height());

                var i=1;

				var width = $(".thumbholder #selection").width()-2;
				var height = $(".thumbholder #selection").height()-2;

                for ( i=1; i <= childSize; i++) {

                    var thumb = "thumb"+i;

                    var image = $(children[i-1]).find('*').andSelf().filter("img")[0];

                    $(".thumbholder #thumbs").append("<div class='thumb' id='"+thumb+"'></div>");
                    // $("#"+thumb).append("<div class='thumb' id='"+thumb+"'></div>");
                    var img = $("<img/>");

                    img.appendTo("#"+thumb);
                    img.hide();
                    img.css("opacity", 0.5);

                    img.attr("src", image.src).load( function() {

                        
						var $this = $(this);
						
                        if ( $this.width()/$this.height()*height < width )
                            $this.css("width", width);
                        else
                            $this.css("height", height);

                        $this.css("margin-left", (width-$this.width())/2);
                        $this.show();
                    });
                }
	
				$thumbs = $("#thumbs .thumb");
                $thumbs.click( function() {

                    updateCurrent($(this).attr("id").substring(5)-1);
                    moveToCurrent();
                });

                $thumbs.css("height", height);
                $thumbs.css("width", width);

                $(".thumbholder #thumbs").css("left", ($(".overlay .thumbholder").width()-$("#thumbs .thumb").width())/2+1);

                $(".thumbholder #thumbs").css("width", childSize*$("#thumbs .thumb").outerWidth(true));

                updateCurrent( index );
                updateThumbOpacity();
                showCurrentImage();
            }

            var current;
            var prevIndex;
            var currentIndex;

            function moveToCurrent() {
                $(".thumbholder #thumb"+(prevIndex+1)+" img").css("opacity", "0.5");

                var image = $(".imageholder .blowup img");
                $('#blowupDetails').hide();

                image.hide();
				
				var newleft = ($(".overlay .thumbholder").width()-$(".thumbholder #selection").width())/2 - current + 2; 
				
                $("#thumbs").animate({
                    left: newleft
                }, 250, function() {
                    $(".thumbholder #thumb"+(currentIndex+1)+" img").css("opacity", "1");
                    showCurrentImage();
                });
            }

            function showCurrentImage() {
			
                var src = $(".thumbholder #thumb"+(currentIndex+1)+" img").attr("src");

                $('#blowupDetails').children().detach();
                $('#blowupDetails').append(descriptions[currentIndex]);

                var image = $(".imageholder .blowup img");

                image.css("width", "auto");
                image.css("height", "auto");

                image.unbind("load");
                image.attr("src", src).load( function() {
                    $(".imageholder .blowup").css("margin-top", ($(".imageholder").height()-$(this).height())/2);
                    image.show();
                    $('#blowupDetails').show();
                    $(window).resize();
                });
            }

            function updateCurrent( index ) {
			
                current = index*$("#thumbs .thumb").outerWidth(true);
                prevIndex = currentIndex;
                currentIndex = index;
            }

            function close() {
                $('#blowupDetails').children().detach();
                $(".overlay").remove();
                $(".overlay #thumbs").remove();
                $(".backdrop").remove();
                $("html").removeClass("overflow");
            }

            function updateThumbOpacity() {

                $(".thumbholder #thumb"+(prevIndex+1)+" img").css("opacity", "0.5");
                $(".thumbholder #thumb"+(currentIndex+1)+" img").css("opacity", "1");
            }

            $(window).unbind("resize").resize( function() {

                var height = $(".overlay .thumbholder").height();
                var width = $(".overlay .thumbholder").width();

                var imgholderheight = $(this).height()-height;
                $(".overlay .imageholder").css("height", $(this).height()-height);
                $(".overlay #left").css("top", imgholderheight/2-$(".overlay #left").height()/2);
                $(".overlay #right").css("top", imgholderheight/2-$(".overlay #right").height()/2);

                $(".thumbholder #selection").css("left", (width-$(".thumbholder #selection").width())/2);
				
				$(".thumbholder #thumbs").css("left", ($(".overlay .thumbholder").width()-$(".thumbholder #selection").width())/2 - current + 2 );
				
                $(".imageholder .blowup").css("margin-top", ($(".imageholder").height()-$(".imageholder .blowup").height())/2);

                if ( $(".blowup").height() + 200 > $(window).height() ) {
                    $(".blowup img").css("width", "auto");
                    $(".blowup img").css("height", $(window).height()-200);
                }

                if ( $(".blowup").width() + 200 > $(window).width() ) {
                    $(".blowup img").css("height", "auto");
                    $(".blowup img").css("width", $(window).width()-200);
                }

                $(".imageholder .blowup").css("margin-top", ($(".imageholder").height()-$(".imageholder .blowup").height())/2);
            });

            $(document).unbind().keydown(function(e){

                var key = e.keyCode;

                switch (key) {
                    case 37:
                    $(".overlay #left").click();
                    break;
                    case 39:
                    $(".overlay #right").click();
                    break;
					case 27:
					close();
					break;
                    default:
                    return true;
                }
                return false;
            });
        }
    });
})(jQuery);  