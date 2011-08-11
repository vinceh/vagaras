$(document).ready( function() {
    $(".footer").addClass(".footerbottom");
});

$(window).load(function() {
	
    var starredDescriptions = new Array();
	var descriptions = new Array();

    if ( !window.location.hash ) {
        window.location.hash = "hfeatured";
    }

    $("#static").hide();

    initialSearch();
	loadStarred();

    if ( window.location.hash == "#hsearchitem" || window.location.hash == "#hstarreditem"){
        processFooter();
    }
    else processHeader();

    // Getters and setters
    function currentHash() {
        return window.location.hash.substring(2);
    }
	
    function currentArea() {
        return $("body").data("area");
    }
	
    function currentLocation() {
        return $("body").data("location");
    }
	
    function updateLocation(area, ele) {

        $("body").data("area", area);
        $("body").data("location", ele);
    }

    // Event binding
    $(".topmenuitem a, .bottommenuitem").click( function(){
        window.location.hash = "h"+$(this).attr("id");
        return false;
    });

    $(".topmenuitem a").click( function() {
        processHeader();
        return false;
    });

    $(".bottommenuitem").click( function() {
        processFooter();
        return false;
    });

    // Header stuff
    function processHeader() {

        if ( currentLocation() == currentHash() )
            return;

        // Update certain attributes
        var hash = currentHash();
        addCurrentstaticLink(hash);

        exitFromLast("header", function() {
            // Get static content
            // $("#static")
            $("#static").fadeIn(150);
        });

        // Set up exit sequence
        $("body").data("exitLast", function(local, next) {

            $("#static").fadeOut(150, next);
            removeStatcLink(hash);
        });

        updateLocation("header", hash);
    }

    function exitFromLast(area, next) {

        if ( currentArea() ) {
            // Local change (same area)
            if ( area == currentArea() )
                $("body").data("exitLast")(true, next);
            // Non local change (change in area)
            else
                $("body").data("exitLast")(false, next);
        }
        else {
            next();
        }
    }

    function removeStatcLink(hash) {

        var element = $("#"+hash);
        element.css("color", "#828487");

        element.mouseenter( function() {
            $(this).css("color", "black");
        });

        element.mouseleave( function() {
            $(this).css("color", "#828487");
        });
    }

    function addCurrentstaticLink( hash ) {
        $("#"+hash).unbind("mouseleave mouseenter");
        $("#"+hash).css("color", "black");
    }

    function addCurrentBottomLink(hash) {

        $("#"+hash).unbind("mouseenter mouseleave");
        $("#"+hash+" .icon").css("background-image", "url('public/images/icons/"+hash+"_black.png')");

        $("#"+hash).css("color", "black");
    }

    function removeBottomLink(hash) {

        $("#"+hash+" .icon").css("background-image", "url('public/images/icons/"+hash+"_grey.png')");

        $("#"+hash).mouseenter( function() {

            $("#"+$(this).attr("id")+" .icon").css("background-image", "url('public/images/icons/"+hash+"_black.png')");
        });

        $("#"+hash).mouseleave( function() {

            $("#"+$(this).attr("id")+" .icon").css("background-image", "url('public/images/icons/"+hash+"_grey.png')");
        });

        $("#"+hash).css("color", "#707070");
    }

    function getContent( hash ) {
		
		switch ( hash ) {
			
			case "hfeatured":
				break;
			case "habout":
				break;
			case "hfilmandtv":
				break;
			case "hsubmissions":
				break;
			case "hcontacts":
				break;
			default:
				break;
		}
    }

    // Footer stuff
    function processFooter() {

        if ( currentLocation() == currentHash() )
            return;

        // Update certain attributes
        var hash = currentHash();
        addCurrentBottomLink(hash);

        var content;

        // Queue up animations
        exitFromLast("footer", function() {

            $(".footer").animate( {
				height: $(window).height()-100
			}, 400, function() {

				$("body").css("background", "white");
				$("div.footer").css("top", "100px");
				$("div.footer").css("bottom", "auto");
				$("div.footer").css("height", "75px");
				$(".bottommenuitem").css("height", 55);
                content = getContent(hash);

				$("#"+hash+"content").fadeIn(150);
				
                if ( hash == "starreditem" ) {

                    if ( $("#starreditems").children().length == 0 ) {
                        $("#starreditemcontent").append("<span class='nostar'>You do not have any starred art. Press the <div class='helpstar'></div> icon when you view art in the Search Art section to add to your starred page.</span>");
                    }
                    else {
                        $(".nostar").remove();
                    }

					$("#starreditems").unglorify();
                    $("#starreditems").glorify(starredDescriptions);
				}
				else {
					$('#searchresults').unglorify();
					$('#searchresults').glorify(descriptions);
				}
			});
        });

        // Set up exit sequence
        $("body").data("exitLast", function(local, next) {

            var disband;

            if ( local ) {
                disband = next;
            }
            else {
                disband = function() {

                    $("div.footer").css("height", $(window).height()-100);
                    $("body").css("background", "#707070");
                    $("div.footer").animate( {
                        top: $(window).height()-100
                        }, 500, function() {
                            $(".bottomcontent").hide();
                            $("#static").show();
                            $("div.footer").css("bottom", "0px");
                            $("div.footer").css("top", "auto");
                            $("div.footer").css("height", "100px");
                            $(".bottommenuitem").css("height", 80);
                            next();
                    });
                };
            }

            $("#"+hash+"content").fadeOut(150, disband);
            removeBottomLink(hash);
        });

        updateLocation("footer", hash);
    }

    // load the initial starred art from cookies
	function loadStarred() {

        // After this line of code, make sure images will contain all the images that are starred from cookies
        var images;

        var i;

        //for (i=0; i<images.length(); i++ ) {
        //    addToStarredPage(images[i]);
        //}
	}
	
    function initialSearch() {

        // After this line of code, make sure images will contain all the image elements from searching the featured artist
        var images;

        createImages(images);
	}
	
	function newArtSearch() {
	
		// Get the search filters from #searchcriteria and make the search, then create the images
		var images;
		
		var filters = $("#searchcriteria").children("select");
		
		createImages(images);
	}

    // creates the images in the search area
    function createImages(images) {

        // clears the previous search
        $('#searchresults').children().remove();

        var i=1,
        img,
        container;
		descriptions = new Array();
        container = $('#searchresults');

        var counter = 0;
        if (container[0]) {

            // Change this for loop so that it reflects the current search of the current featured artist
            // and generate all the images for that featured artist

            for ( i=1; i<=22; i++ ) {

                var item = i%22+1;

                img = $('<img>', {
                    load: function() {
                        counter++;
                        if ( counter == 22 ) {

                            $('#searchresults').boxify();
                            $('#searchresults img').show();
                            $('#searchresults').magnify(null, null, descriptions);
                            $('.bottomcontent').hide();
                            $('.bottomcontent').css("opacity", 1);
                        }
                    }
                }).appendTo(container);

                img.hide();

                var desc = buildDescription(i);

                descriptions.push(desc);

                img[0].src = 'public/images/temp/'+item + '.jpg';
            }
        }
    }
	
	// builds the description of the art
    function buildDescription(imgid) {
		
        // Set the right attributes for the description of this piece of art based on imgid
        var artist = "RobertKwon";
        var title = "Sophia Series 09";
        var medium = "Mixed Media on Panel";
        var size = "36\" x 24\"";

        var star = $("<div data-tooltip='Starred' class='starred'></div>");
        if ( isStarred(imgid) )
            star = $("<div data-tooltip='Star this' class='star'></div>");

        var featured = "";
        if ( isFeatured() ) {
            featured = $("<div data-tooltip='Featured Art' class='featured'></div>");
			toolTip(featured, "top");
		}

        var description = $("<div id='artist'>"+artist+"</div>" +
                        "<div id='title'>"+title+"</div>" +
                        "<div id='medium'>"+medium+"</div>" +
                        "<div id='size'>"+size+"</div>");

        var icons = $("<div data-artid='"+imgid+"' id='descicons'></div>");
        icons.append(featured);
        icons.append(star);

        toolTip(star, "top");

        icons = icons.add(description);

        icons.children(".star").click( function() {

            addToStarredPage($(this).parent("#descicons").attr("data-artid"), description);
			var starred = $("<div data-tooltip='Starred' class='starred'></div>");
			$(this).replaceWith(starred);
			toolTip(starred, "top");
			
			if( !$.browser.mozilla && !$.browser.msie )
				starred.mouseenter();
						
            starred.unbind("click").click( function() {
                return false;
            });

            return false;
        });

        icons.children(".featured").mouseenter( function() {

            $(this).css("cursor", "default");
            return false;
        });

        icons.children(".featured").unbind("click").click( function() {
            return false;
        });

        return icons;
    }

    function toolTip(element, position) {

        var box;

        element.mouseenter( function() {

            box = $("<div class='tooltip'></div>");
            box.css("opacity", "0");
            var offset = element.offset();
            box.html($(this).attr("data-tooltip"));
            box.appendTo("body");

            if ( position == "top" )
                box.css("top", offset.top-box.outerHeight(true));
                box.css("left", offset.left-(box.outerWidth()-$(this).outerWidth(true))/2);

            box.animate({

                top: "-=3",
                opacity: 1
            });
        });

        element.mouseleave( function() {
            box.remove();
        });

        element.click( function() {
            box.remove();
        });
    }

    function unstar(imgid, description) {

        var i=0;

        for ( i=0; i<descriptions.length; i++) {


            if ( $(descriptions[i].find('*').andSelf().filter("#descicons")[0]).attr("data-artid") == imgid ) {


                var star = $("<div data-tooltip='Star this' class='star'></div>");

                toolTip(star, "top");

                star.click( function() {

                    addToStarredPage($(this).parent("#descicons").attr("data-artid"), description);
                    var starred = $("<div data-tooltip='Starred' class='starred'></div>");
                    $(this).replaceWith(starred);
                    toolTip(starred, "top");
					
                    starred.unbind("click").click( function() {
                        return false;
                    });

                    return false;
                });

                $(descriptions[i].find('*').andSelf().filter(".starred")[0]).replaceWith(star);
                return;
            }
        }
    }

	// adds the piece of art to the starred page and adds it to their cookies
    function addToStarredPage(imgid, description) {

        var image = $("<img/>").hide();
        image.appendTo("body");

        var piece = $("<div class='starredPiece' data-artid='"+imgid+"'><div class='starredart'></div><div data-tooltip='Remove' class='deleteStarred'></div></div>");
        piece.appendTo("#starreditems");

        var descWrap = $("<div class='starredItemDesc'/>");

        descWrap.append(description.clone());
        piece.append(descWrap);

        piece.mouseenter( function() {
            $(this).find(".deleteStarred").css("opacity", "1");
        });

        piece.find(".deleteStarred").click( function() {
            starredDescriptions = starredDescriptions.slice(0,piece.index()).concat(starredDescriptions.slice(piece.index()+1));
            piece.remove();
            unstar(imgid, description);
            return false;
        });

        toolTip(piece.find(".deleteStarred"), "top");

        piece.mouseleave( function() {
            $(this).find(".deleteStarred").css("opacity", "0");
        });

        image.attr("src", $("#mag img").attr("src")).load(function() {

            var width = piece.find(".starredart").width();
            var height = piece.find(".starredart").height();

            if ( $(this).width()/$(this).height()*height < width )
                $(this).css("width", width);
            else
                $(this).css("height", height);

            $(this).show();
            $("body").find(image).detach();
            piece.find(".starredart").append(image);

            starredDescriptions.push(description);
        });
    }
	
	// returns whether this image is starred by the user
    function isStarred(imgid) {
        return true;
    }

    // checks whether or not this art is by a featured artist
    function isFeatured(img) {
        return true;
    }

    $("#emailicon").click( function() {

        if ( $("#emailicon").data("expanded") ){
            $("#emailicon").data("expanded", false);
            $("#starredicons").stop(true, true).animate({
                height: 50
            }, 200, function() {
            });
        }

        else {
            $("#emailicon").data("expanded", true);
            $("#starredicons").stop(true, true).animate({
                height: 300
            }, 200, function() {
            });
        }
    });

    // Display all the pieces of art
    $(".displayAllArt").click( function() {

        // Use createImages here after creating the query to get all art
    });
});