/* 
Author: Ezra Fast
Date:   December 31, 2024
Description: This script file contains the implementation of the LeftMenu class, which shows the user their location and browser type when the page loads.
*/

/*

As per the JS design documentation found on my Landing page, the design of the LeftMenu class is as follows:

data (properties):
    - userIpAddress                         --> the user's public IP address based on an API call to https://api.ipify.org?format=json
    - userUaString                          --> the user's user-agent string
    - browserLookupObj                      --> an object mapping browser types to regular expressions that detect browser types in UA strings

functions (methods):
    - getUserBrowser()                      --> return the browser type of the user based on a user-agent string
    - getUserLocation()                     --> return the user's general location based on an API call to ip-api.com
    - outputResults()                       --> populate the table in the left menu with the results of getUserBrowser() and getUserLocation()

*/

// grabbing the client's public IP address: https://www.geeksforgeeks.org/how-to-get-client-ip-address-using-javascript/
// grabbing the client's user-agent string: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent

// use of async and await in the constructor: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

class LeftMenu {
    constructor() {
        this.userUaString = window.navigator.userAgent;
        // UA strings generally contain their own browser type FIRST, before the mention of framework/kit names that could be interpreted as browser.
        // regex cheat sheet: https://fireship.io/lessons/regex-cheat-sheet-js/
        // UA string resource: https://explore.whatismybrowser.com/useragents/explore/
        this.browserLookupObj = {
            "Firefox" : /firefox|FxiOS/i,               // FxiOS is firefox on mobile
            "Brave" :  /brave(safari)?(chrome)?/i,
            "DuckDuckGo" : /(chrome)?duckduckgo/i,
            "Edge" : /(chrome)?(safari)?edg/i,
            "Opera" : /(Chrome)?(Safari)?OPR/,
            // these two are last because they are more encompassing than the other expressions
            "Chrome" : /(chrome|CriOS)(?!.*(duckduckgo|edg|OPR))/i,                 // CriOS on mobile; Chrome will appear first otherwise
            "Safari" : /safari/i,                               // last because this will generate false positives for other browsers
        };
        // this.getUserLocation();
        this.outputResults();
    }
    // best not to try and access this.userIpAddress outside of this function because it may return Undefined.
    async getUserLocation() {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
            return "Error retrieving IP.";
        }
        const jsonObj = await response.json();
        this.userIpAddress = jsonObj.ip;
        /*
        The geolocation API call had to be changed to account for secure contexts, which disallow mixed origin content and CORS violations.
        OLD CALL: const locationCall = await fetch("http://ip-api.com/json/" + this.userIpAddress);
        documentation for the new endpoint: https://docs.freeipapi.com/request.html#endpoint
        */
        const locationCall = await fetch("https://freeipapi.com/api/json/" + this.userIpAddress);
        if (!locationCall.ok) {
            return "Error retrieving location.";
        }
        const jsonObj2 = await locationCall.json();
        return jsonObj2.cityName + ", " + jsonObj2.regionName;
    }
    getUserBrowser() {
        for (const [browser, expression] of Object.entries(this.browserLookupObj)) {
            let result = expression.test(this.userUaString);
            if (result) {
                return browser;                 // the first positive match is returned; this means that the order of expressions in the lookup Object matters!
            }
        }
        return "Unkown browser";                    // return "unkown browser" if this point is reached.
    }
    // resource used for structuring the ajax call: https://stackoverflow.com/questions/9436534/ajax-tutorial-for-post-and-get
    // This is the unit 7 external data source addition:
    // calls to https://api.techniknews.net/ipgeo/{userIpAddress} only returned JSON data for certain ISPs
    // calls to https://ipwhois.app/json/{userIpAddress} seem to work more consistently
    getUserISP(userIpAddress) {
        $("#user-isp").text("Buffering...");
        $.ajax({
            url : "https://ipwhois.app/json/" + userIpAddress,
            cache : false,
            success : async (response) => {
                $('#user-isp').text(response.isp);
        }});
    }
    // tested successfully on Firefox, Chromium, Edge, and Safari
    async outputResults() {
        this.userLocation = await this.getUserLocation();           // without await here, this.userLocation is either undefined or a Promise
        this.userBrowser = this.getUserBrowser();
        document.getElementById("user-browser").innerHTML = this.userBrowser;
        document.getElementById("user-location").innerHTML = this.userLocation;
        this.getUserISP(this.userIpAddress);        // this is the call to populate the user's ISP
    }
}

function populateLeftMenu() {
    new LeftMenu();
}

