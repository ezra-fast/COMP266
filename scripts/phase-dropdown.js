/*
Author: Ezra Fast
Date:   January 17, 2025
Description: this script implements the phase-related dropdown menu on index.html.
*/

// resource used for making a transparent button: https://stackoverflow.com/questions/22672368/how-to-make-a-transparent-html-button

// another function that is very straightforward; on button press, toggle the list to show and change the toggle to read "Hide Phases"
$( function() {
    $(".phase-dropdown").on("click", function() {
        var phaseList = $("#phase-list");
        if (!phaseList.hasClass("shown")) {
            phaseList.addClass("shown");
            $(this).text("Hide Phases");
        } else if (phaseList.hasClass("shown")) {
            phaseList.removeClass("shown");
            $(this).text("Show Phases");
        }
    })
})

