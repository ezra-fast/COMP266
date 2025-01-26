/*

Author: Ezra Fast
Date    January 1, 2024
Description: 
    - This script file contains the definition of the ResourceSearch class, which contains the logic that allows a user to 
      search for resources by keyword. Keywords of length 2 or greater are compared as substrings against the keywords associated
      with each resource.

*/
/*

The implementation of ResourceSearch is as follows:

methods (functions):
    - findRelatedResources()                            --> take the user's input string and return an object associating resources with the number
                                                            of keywords each is associated with (only containing resources associated with >= 1 keyword)
    - displayResults()                                  --> take the object from findRelatedResources() and populate a dropdown display of related results

properties (data):
    - resourceKeywordObj                                --> an Object mapping each resource to an array of keywords
    - userInput                                         --> the string typed into the search bar by the user

*/

class ResourceSearch {
    constructor() {
        this.resourceKeywordObj = {
            '<a href="https://cheatsheet.haax.fr/">Haax</a>' : ["hacking", "walkthrough", "network", "reverse shell"],
            '<a href="https://book.hacktricks.wiki/en/index.html">HackTrickz</a>' : ["wiki", "reverse shell", "tunneling", "fuzzing", "scanning", "network"],
            '<a href="https://pentestmonkey.net/">Pentest Monkey</a>' : ["penetration testing", "pentest", "privilege escalation", "mimikatz"],
            '<a href="https://viz.greynoise.io/">Greynoise Visualizer</a>' : ["hacking", "exploit", "network", "CVE", "malicious"],
            '<a href="https://leakix.net/">LeakIX</a>' : ["hacking", "security", "monitor", "investigate", "public"],
            '<a href="https://en.fofa.info/">FOFA Search Engine</a>' : ["internet", "public", "research", "hacking", "security", "service"],
            '<a href="https://www.kali.org/tools/">Kali Tooling</a>' : ["hacking", "linux", "tool", "offensive security", "docs"],
            '<a href="https://tails.net/">The TAILS OS</a>' : ["security", "privacy", "tor", "linux", "operating system", "encryption"],
            '<a href="https://cheatsheet.haax.fr/">Honeyd: Virtual Honeypots</a>' : ["security", "defense", "honey pot", "network", "administration"],
            '<a href="https://wigle.net/">Wigle: Wireless Geographic Logging Engine</a>' : ["hacking", "wireless", "search engine", "internet", "map"],
        };
        const searchBar = document.getElementById("resource-search-bar");
        // arrow function is used so that the use of this.* can be preserved
        // resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        searchBar.addEventListener('input', () => {
            this.userInput = searchBar.value;
            this.displayResults(this.findRelatedResources());
        });
        // the Object mapping resources to keywords will be hardcoded for speed
        //      although less tidy than constructing it dynamically at runtime, once there are many resources
        //      it has the potential to be a choke point if it is constructed at runtime
    }
    // checking for substrings resource: https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
    // checking for substrings of length > 3 is more pleasant than strictly checking for matching strings
    findRelatedResources() {                            // years of programming produced this beautiful algorithm
        var relevantResources = {};
        var tokens = this.userInput.split(" ");             // each token is considered a keyword
        for (let i = 0; i < tokens.length; i++) {                                               // for each token
            if (tokens[i].length <= 1) {continue;}                                              // tokens should be 2 characters or longer
            for (const [resource, keywords] of Object.entries(this.resourceKeywordObj)) {       // for each resource
                for (let k = 0; k < keywords.length; k++) {                                     // for each possible keyword
                    if (keywords[k].toLowerCase().includes(tokens[i].toLowerCase())) {          // if the token (user keyword) matches a resource keyword...
                        if (!(resource in relevantResources)) {
                            relevantResources[resource] = 1;                                    // add it to the object if it doesn't exist
                        } else {
                            relevantResources[resource] += 1;                                   // otherwise just increase the association counter
                        }
                    }
                }
            }
        }
        // console.log(relevantResources);             // at this point, the keys of relevantResources are the resources related to the user's keywords
        return relevantResources;
    }
    displayResults(relevantResources) {                // append each resource as a new <p> in the search-results div
        // this function is very similar to LogProcessor.outputResults() in log-processing.js
        const dropdownDisplay = document.getElementById("search-results");
        dropdownDisplay.innerHTML = ""; // clear the dropdown display; note that displayResults() is being called constantly whenever the user is giving input
        for (const [resource, count] of Object.entries(relevantResources)) {
            const dropdownLine = document.createElement('p');                   // create the element
            dropdownLine.innerHTML = resource;                                  // populate it with the resource's anchor tag
            dropdownDisplay.appendChild(dropdownLine);                          // append it to the parent
        }
    }
}

function searchResources() {
    new ResourceSearch();                   // this runs after the left-menu.js functionality finishes
}


