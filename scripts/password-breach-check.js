/*
Author: Ezra Fast
Date:   January 22, 2025
Description: 
    - this script takes the password that the user entered and produces a SHA-1 digest
    - it then makes a call to https://api.pwnedpasswords.com/range/ with the first 5 characters of the digest
    - if the hash prefix is found in breached data, the endpoint returns a list of all matching hash suffixes;
    - we parse the data for the correct hash suffix in order to confirm that the exact password the user entered is in the response (e.g. hexString.slice(5).toUpperCase())
*/

// the SHA-1 hashing and use of crypto is heavily based on: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

$( function() {

    $(document).on('keypress', function(e) {
        console.log('Arrived here!');
        if (e.which == 13) {
            alert('You pressed enter!');
        }
    })

    $('#check-user-password').on('click', function() {
        $('#call-results-heading').text("");                    // resetting the output elements
        $('#call-results').text("");
        var userPassword = $("#user-password").val();           // .text() will not work here

        var encoder = new TextEncoder();
        var encodedString = encoder.encode(userPassword);

        async function hashAndCheck(inputString) {
            var hashObj = await crypto.subtle.digest('SHA-1', inputString);

            var byteArray = Array.from(new Uint8Array(hashObj));
            var hexString = byteArray.map(byte => byte.toString(16).padStart(2, '0')).join("");

            return hexString;
        }

        // resource for string slicing: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
        hashAndCheck(encodedString).then( async (hexString) => {
            var hashSuffix = hexString.slice(5).toUpperCase();                            // array index 5, not char 5; must be uppercase for comparisons
            $.ajax({
                url : "https://api.pwnedpasswords.com/range/" + hexString.slice(0, 5),
                cache : false,
                success : async (response) => {
                    const responseArray = response.split('\n');
                    for (let item of responseArray) {
                        if (item.split(':')[0] == hashSuffix) {
                            var numberOfMatches = Number(item.split(':')[1]);
                            $('#call-results-heading').text("This password was found to be compromised!");
                            $('#call-results').text('Number of times this password has been leaked: ' + numberOfMatches);
                            return;
                        }
                        $('#call-results-heading').text("This password doesn't appear to have been compromised!");
                    }
                }
            });
        })

    })
})
