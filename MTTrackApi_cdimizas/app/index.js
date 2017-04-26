(function () {
    //NAV BAR ON CLICK EXPAND RELATIVE SECTOR
    $('#work-experience-anchor').on('click', function(){

        var toBeShown = $('#work-experience .row.row-content');
        var targetSection = $('#work_expand');

        if(targetSection.not(":visible")){
            targetSection.find('span.bold').addClass('clicked-title green-background');
            $("html, body").animate({scrollTop: targetSection.offset().top},500);
            toBeShown.slideDown(1500);
        }
    });

    $('#education-coursework-anchor').on('click', function(){
        var toBeShown = $('#education-coursework .row.row-content');
        var targetSection = $('#education_expand');

        if(targetSection.not(":visible")){
            targetSection.find('span.bold').addClass('clicked-title yellow-background');
            $("html, body").animate({scrollTop: targetSection.offset().top},500);
            toBeShown.slideDown(1500);
        }
    });

    $('#skills-anchor').on('click', function(){
        var toBeShown = $('#skills .row.row-content');
        var targetSection = $('#skills_expand');

        if(targetSection.not(":visible")){
            targetSection.find('span.bold').addClass('clicked-title red-background');
            $("html, body").animate({scrollTop: targetSection.offset().top},500);
            toBeShown.slideDown(1500);
        }
    });

    $('#interests-anchor').on('click', function(){
        var toBeShown = $('#interests .row.row-content');
        var targetSection = $('#interests_expand');

        if(targetSection.not(":visible")){
            targetSection.find('span.bold').addClass('clicked-title blue-background');
            $("html, body").animate({scrollTop: targetSection.offset().top},500);
            toBeShown.slideDown(1500);
        }
    });

    $('#contact-anchor').on('click', function(){
        var toBeShown = $('#contact .row.row-content');
        var targetSection = $('#contact_expand');

        if(targetSection.not(":visible")){
            targetSection.find('span.bold').addClass('clicked-title light-green-background');
            $("html, body").animate({scrollTop: targetSection.offset().top},500);
            toBeShown.slideDown(1500);
        }
    });


    /*
     * ON CLICK SHOW INFO AND CHANGE STYLES ACCORDINGLY
     */

    $('#work_expand').on('click', function(){
        var toBeShown = $(this).closest('h3').closest('.title-collapse').closest('.container').next('.container').find('.row.row-content')
        $(this).find('span.bold').toggleClass('clicked-title green-background');
        toBeShown.slideToggle(500, function(){
            if(toBeShown.is(":visible")){
                $("html, body").animate({scrollTop: $(this).offset().top},500);
            }
        });
        return false;
    });

    $('#education_expand').on('click', function(){
        var toBeShown = $(this).closest('h3').closest('div .title-collapse').closest('.container').next('.row.row-content');
        $(this).find('span.bold').toggleClass('clicked-title yellow-background');
        toBeShown.slideToggle(500, function(){
            if(toBeShown.is(":visible")){
                $("html, body").animate({scrollTop: $(this).offset().top},500);
            }
        });
        return false;
    });

    $('#skills_expand').on('click', function(){
        var toBeShown = $(this).closest('h3').closest('div .title-collapse').closest('.container').next('.row.row-content');
        $(this).find('span.bold').toggleClass('clicked-title red-background');
        toBeShown.slideToggle(500, function(){
            if(toBeShown.is(":visible")){
                $("html, body").animate({scrollTop: $(this).offset().top},500);
            }
        });
        return false;
    });

    $('#interests_expand').on('click', function(){
        var toBeShown = $(this).closest('h3').closest('div .title-collapse').closest('.container').next('.row.row-content');
        $(this).find('span.bold').toggleClass('clicked-title blue-background');
        toBeShown.slideToggle(500, function(){
            if(toBeShown.is(":visible")){
                $("html, body").animate({scrollTop: $(this).offset().top},500);
            }
        });
        return false;
    });

    $('#contact_expand').on('click', function(){
        var toBeShown = $(this).closest('h3').closest('div .title-collapse').closest('.container').next('.row.row-content');
        $(this).find('span.bold').toggleClass('clicked-title light-green-background');
        toBeShown.slideToggle(500, function(){
            if(toBeShown.is(":visible")){
                $("html, body").animate({scrollTop: $(this).offset().top},500);
            }
            else{
                $("html, body").animate({scrollTop: $(this).offset().top},500);
            }
        });
        return false;
    });


    $('#scify_projects').slideUp();
    $('#show_more').on('click', function(){
        $('#scify_projects').slideToggle();
        $(this).toggleClass('visible');
        if($(this).hasClass('visible')){
            $(this).text('Less');
        } else {
            $(this).text('More');
        }
    });

    $(function(){
        var $elems = $('.animateblock');
        var winheight = $(window).height();
        var fullheight = $(document).height();

        $(window).scroll(function(){
            animate_elems();
        });

        function animate_elems() {
            wintop = $(window).scrollTop(); // calculate distance from top of window

            // loop through each item to check when it animates
            $elems.each(function(){
                $elm = $(this);

                if($elm.hasClass('animated')) { return true; } // if already animated skip to the next item

                topcoords = $elm.offset().top; // element's distance from top of page in pixels

                if(wintop > (topcoords - (winheight*.75))) {
                    // animate when top of the window is 3/4 above the element
                    $elm.addClass('animated');
                }
            });
        } // end animate_elems()
    });


// Smooth scrolling when clicking an anchor link
    $('a').click(function(){
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top}, 500);
        return false;
    });

//  BACK TO TOP BUTTON FUNCTIONALITY
    $(document).ready(function() {
        var offset = 250;
        var duration = 300;
        $(window).scroll(function() {
            if ($(this).scrollTop() > offset) {
                $('.back-to-top').fadeIn(duration);
            } else {
                $('.back-to-top').fadeOut(duration);
            }
        });

        $('.back-to-top').click(function(event) {
            event.preventDefault();
            $('html, body').animate({scrollTop: 0}, duration);
            return false;
        })
    });
})();





