/* 
Author: Ezra Fast
Date:   December 30, 2024
Description:
    - this JavaScript file contains the LogProcessor class, which uses regular expressions to inspect user-given log files for security events.
    - when a security event is detected it is added to a collection of detected events, which is then shown to the user.
    - the regular expressions used for detection are elementary, as developing production ready detection capabilities would be a hefty task.
    - the design documentation for this functionality can be found at: https://landing.athabascau.ca/blog/view/26243559/unit-5-javascript-design-documentation
    - tested on December 30, 2024 using scripts/testing-log-processing.log
*/

// classes in JS: https://www.w3schools.com/js/js_classes.asp
// objects in JS: https://www.w3schools.com/js/js_objects.asp
// regex in JS: https://www.w3schools.com/js/js_regexp.asp

/* 

As per the JavaScript design documentation found on my Landing page, the structure of LogProcess is as follows:

data (properties):
    - userInput                                             --> the input of the user, stored as a string
    - securityEventStrings                                  --> an object mapping types of security events to strings/regex that would indicate their presence in a log
    - flaggedEvents                                         --> an empty array destined to be populated by checkTokens()

functions (methods):
    - tokenizeInput()                                       --> take the user input and return an array of tokens (lines in the log delimited by '\n')
    - checkTokens()                                         --> take the array of tokens and check each token for the presence of security events based on
                                                                case-insensitive comparisons to the members of securityEventStrings; populate the flaggedEvents
                                                                array with sub-arrays associating a given token with a type of security event (if the comparisons)
                                                                produce a hit.
    - outputResults()                                       --> take the populated flaggedEvents array and display the results to the user. The output should 
                                                                consist of each line associating a given token (line in the log file) with a security event, if 
                                                                one is detected.

*/

class LogProcessor {
    constructor(userInput) {                         // this constructor function contains the logic of the functionality and is automatically called by runLogProcessor()
        this.userInput = userInput;
        // the detection capabilities of this object are at the prototype level, and many security events would go undetected.
        // production level detection capabilities would take significant time to develop.
        // most used javascript regex resource: https://fireship.io/lessons/regex-cheat-sheet-js/
        this.securityEventStrings = {
            "XSS" : /alert(1)|<script|\/script>|onerror|onload/i,
            "SQLi" : /OR 1=1|union select|and 1=1|[A-Z]+--|Internal Server Error/i,
            "Command Injection" : /[\`]{2,}|^powershell|^sh|^bash|whoami/i,                 // [\`]{2,} detects the presence of 2 backticks, often used to enclose shell commands
            // shell access ipv4 regex taken from: https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
            // trying to craft an original ipv4 regex was a complete nightmare
            "Shell Access" : /\b(bash|perl|python|sh|powershell|ruby|ash).*(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,      // [command] [options] [ip address]
            "Unauthorized Access" : /authentication failure/i,               // based on /var/log/auth.log, which stores SSH authentication attempts
        };
        this.flaggedEvents = [];               // update dynamically with this.flaggedEvents.push("update")

        this.checkTokens();
        this.outputResults();
    }

    tokenizeInput() {                               // return an array containing each line of the user's input
        return this.userInput.split('\n');
    }

    checkTokens() {
        // case-insensitivity is derived automatically from the regular expressions in this.securityEventStrings
        // resource used for iterating over an object: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        // resource used for regex testing: https://www.w3schools.com/jsref/jsref_regexp_test.asp
        const tokens = this.tokenizeInput();
        for (let i = 0; i < tokens.length; i++) {
            for (const [type, expression] of Object.entries(this.securityEventStrings)) {
                let result = expression.test(tokens[i]);            // true upon match, false if no match.
                if (result) {
                    this.flaggedEvents.push([type, tokens[i]]);     // push the type of event and the line it was found on 
                }
            }
        }
        // no need for a return value as the object's flaggedEvents object is updated directly.
    }

    // This is a last minute function largely inspired from: https://www.educative.io/answers/how-to-escape-unescape-html-characters-in-string-in-javascript
    // this escaping is required so that outputResults() does not have an XSS vulnerability...
    escapeCharacters(inputStr) {
        let retStr = inputStr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        return retStr;
    }

    // the approach taken in this function is roughly based on: https://stackoverflow.com/questions/56872151/add-paragraph-with-a-for-loop
    outputResults() {
        const outputHeading = document.getElementById("processing-results-heading");
        outputHeading.textContent = "Processing Results:"
        const outputArea = document.getElementById("processing-results");           // this is a paragraph (<p>)
        if (this.flaggedEvents.length == 0) {                                       // if no results to display
            outputArea.textContent = "No security events detected!";                // inform the user of that fact
            return;                                                                 // and return 
        }
        outputArea.textContent = "";                                                // clearing previous content
        for (let i = 0; i < this.flaggedEvents.length; i++) {                       // for every detected security event...
            const outputLine = document.createElement("p");                         // create a new paragraph
            // innerHTML is used here because it is easier to set formatting than with textContent
            // the call to this.escapeCharacters() was added during final testing
            outputLine.innerHTML = "<strong>Event type: </strong>" + this.flaggedEvents[i][0] + "</br>" + "<strong>Line: </strong>" + this.escapeCharacters(this.flaggedEvents[i][1]) + "</br>";
            outputArea.appendChild(outputLine);                                     // append that paragraph to the output div after setting its content
        }
    }
}

function runLogProcessor() {                // this function is called on button press, which in turn instantiates LogProcessor, calling the constructor
    new LogProcessor(document.getElementById("user-input").value);                     // this is the entry point of the functionality.
}

