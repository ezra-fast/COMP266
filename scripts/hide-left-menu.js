/*
Author: Ezra Fast
Date:   January 16, 2024
Description: 
        - This script leverages jquery to dynamically hide the left menu on each page (with a simple animation) if the menu overlaps with the main content
        - This is accomplished by comparing the left bound of the main content with the right bound of the left menu and hiding/showing the left menu accordingly.
*/

/*
This functionality is implemented on each html page via the inclusion of:

<script src="scripts/jquery.js"></script>
<script src="scripts/hide-left-menu.js"></script>

*/

/* 
class="left-menu" contains the left menu that needs to be hidde

resource used for ready() method: https://www.w3schools.com/jquery/event_ready.as

.offset() returns the left (and top) position of the given element
    - https://www.w3schools.com/jquery/css_offset.as

Exact answer on how to find left and right coordinates of a given element:
    - https://stackoverflow.com/questions/3043102/how-to-get-right-offset-of-an-element-jquery

Resource for rounding floating point numbers (needed for .main-index left and right coordinates)
    - https://stackoverflow.com/questions/9453421/how-to-round-float-numbers-in-javascript

*/

// .$(document).ready() is deprecated syntax according to: https://api.jquery.com/ready/
$( function() {
    function hideLeftMenu() {

        var leftMenu = $(".left-menu");
        // var leftMenuLeftBound = leftMenu.offset().left;
        var leftMenuRightBound = leftMenu.offset().left + leftMenu.outerWidth();
        
        var mainIndex = $(".main-index");

        // Math.round() is required in both instances because the main index floats in the middle of the page so its offsets are decimals
        var mainIndexLeftBound = Math.round(mainIndex.offset().left);
        // var mainIndexRightBound = Math.round(mainIndex.offset().left + mainIndex.outerWidth());

        // +20 is added in both cases to give a small buffer so that the menu cannot encroach right up to the main content
        if (mainIndexLeftBound <= (leftMenuRightBound + 20)) {      // if the left bound of the main div is smaller or equal to the right bound of the left menu
            leftMenu.hide('slow');                                  // 'slow' adds a nice animation without requiring additional CSS
        }
        if (mainIndexLeftBound >= (leftMenuRightBound + 20)) {      // if the left bound of the main div is greater or equal to the right bound of the left menu
            leftMenu.show('slow');
        }
    }
    
    hideLeftMenu();                             // this call is necessary for situations when the page is loaded in a window that is too small

    $(window).on("resize", function() {         // hideLeftMenu() acts as a callback for the resize event
        hideLeftMenu();
    })

});

