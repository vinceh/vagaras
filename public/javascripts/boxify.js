(function($) {
    $.fn.extend({
        boxify:function(desiredHeight, leeway) {

            var desiredWidth = $(this).width();
            desiredHeight = desiredHeight ||  parseInt(.17*desiredWidth);
            leeway = leeway || parseInt(.15*desiredHeight);

            var images = $(this).children();

            $(images).css("height", desiredHeight);

            var i;
            var heightBuffer = 0;

            for (i=0; i<images.size();) {

                var widthbuffer = 0;
                var imagebuffer = new Array();

                while ( widthbuffer < desiredWidth && i<images.size() ) {

                    var image = images[i++];
                    imagebuffer.push(image);
                    widthbuffer += parseInt($(image).outerWidth(true));
                }

                if ( widthbuffer > desiredWidth ) {

                     var successcontract = tryContract(imagebuffer, widthbuffer);

                     if ( !successcontract[0] ) {

                         i--;
                         image = images[i];
                         imagebuffer = imagebuffer.slice(0,imagebuffer.length-1);
                         $(image).css("height", desiredHeight);
                         widthbuffer -= parseInt($(image).outerWidth(true));

                         var successexpand = tryExpand(imagebuffer, widthbuffer);

                         if ( !successexpand[0] ) {

                             if ( successexpand[1] > successcontract[1] ) {
                                 imagebuffer.push(image);
                                 changeHeights(imagebuffer, successcontract[1]);
                             }
                             else changeHeights(imagebuffer, successexpand[1]);
                         }
                     }
                }
            }

            function changeHeights(elements, ratio) {

                var i;
                var height = Math.floor(desiredHeight*ratio);

                for ( i=0; i<elements.length; i++ ) {
                    $(elements[i]).css("height", height-2);
                }
            }

            function tryContract(imagebuffer, widthbuffer) {

                var success = new Array();
                var expandratio = desiredWidth / widthbuffer;

                success[1] = expandratio;

                if ( parseInt($(imagebuffer[0]).height()*expandratio) < desiredHeight-leeway ) {
                    success[0] = false;
                    return success;
                }

                changeHeights(imagebuffer, expandratio);
                success[0] = true;
                return success;
            }

            function tryExpand(imagebuffer, widthbuffer) {
                //alert("here");
                var success = new Array();
                var expandratio = desiredWidth / widthbuffer;

                success[1] = expandratio;

                if ( parseInt($(imagebuffer[0]).height()*expandratio) > desiredHeight+leeway ) {
                    success[0] = false;
                    return success;
                }

                changeHeights(imagebuffer, expandratio);
                success[0] = true;
                return success
            }
        }


    });
})(jQuery);  