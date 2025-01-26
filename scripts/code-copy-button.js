/*
Author: Ezra Fast
Date:   January 17, 2025
Description: This script provides the functionality to copy the contents of a code snippet to the user's clipboard with a button press.

successfully tested on: January 24, 2025

// primary resource: https://html-online.com/articles/copy-to-clipboard-website-button-jquery/

*/

// .click() is deprecated according to: https://api.jquery.com/click/#on1
// helpful resource for traversing siblings: https://stackoverflow.com/questions/7463242/how-do-i-select-a-sibling-element-using-jquery
// helpful resource for clipboard writes: https://web.dev/patterns/clipboard/copy-text
// resource used to revert original button text after 3 seconds: https://www.w3schools.com/jsref/met_win_settimeout.asp


// this function copies the corresponding code snippet on button click, and displays an indication of that to the user for 2 seconds
// copy operations will not work if this is served over http (navigator.clipboard is undefined in insecure contexts)
$( function() {
    $(".copy-code").on("click", function() {
        var buttonText = $(this).text();
        var codeBlockContents = $(this).siblings('div').find('code').text();
        var selfReference = this;                       // alot of troubleshooting went into this...
        // performing the write to the clipboard
        // THIS FEATURE REQUIRES TLS (HTTPS)! navigator.clipboard will be undefined if the context is not secure...
        navigator.clipboard.writeText(codeBlockContents).then(() => {           // the text should only be changed once the promise is fulfilled
            // console.log("[+] Wrote: " + codeBlockContents);
            $(this).text("Copied!");
            setTimeout(function() {
                $(selfReference).text(buttonText);                      // selfReference is required because 'this' isn't valid in this sub-context
            }, 2000);
        })
    })
})


