/*
Author: Ezra Fast
Date:   January 17, 2025
Description: This script contains the implementation of the dropdown toggles for each term on glossary-definitions.html
*/

// this functionality is straight-forward; toggle the ".term-definition-div p.shown" class on and off on button press
$( function() {
    $(".definition-toggle").on("click", function() {
        var definitionParagraph = $(this).siblings('p');
        if (!definitionParagraph.hasClass('shown')) {
            definitionParagraph.addClass('shown');
            $(this).text("Hide Definition");
        } else if (definitionParagraph.hasClass('shown')) {
            definitionParagraph.removeClass('shown');
            $(this).text("Show Definition");
        }
    })
})
