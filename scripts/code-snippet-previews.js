/*
Author: Ezra Fast
Date:   January 17, 2025
Description: 
    - this script provides the functionality to display a full code snippet on button press; the reveal of the snippet also reveals the 
    'copy to clipboard' button, which doesn't make sense to display without the code snippet being visible
*/

// this function was significantly harder to implement than was previously anticipated, mostly due to the CSS and HTML that was needed along with it.
$( function() {
    $(".view-code").on("click", function () {
        var copyButton = $(this).siblings('button');
        var codeBlocks = $(this).siblings('.code-preview');

        if (!codeBlocks.hasClass("shown")) {
            copyButton.addClass("shown");
            codeBlocks.addClass("shown");
            $(this).text("Hide Full Code");
        } else if (codeBlocks.hasClass("shown")) {
            copyButton.removeClass("shown");
            codeBlocks.removeClass("shown");
            $(this).text("Show Full Code");
        }
    })
})
