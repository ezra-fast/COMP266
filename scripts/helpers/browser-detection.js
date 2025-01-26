// source for regex: https://medium.com/@JavaScript-World/javascript-regex-20-practical-examples-60b23e703e24
// source for looping over key:values : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

<script>
const regexLookup = {
    Firefox: /firefox/i,
    Safari: /safari/i
};

function detectBrowser () {
    const testUserAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0";

    for (let [browser, regex] of Object.entries(regexLookup)) {
        if (regex.test(testUserAgent)) {
            console.log("Return value: " + browser);
        }
    }
    return null; 
}

detectBrowser();

</script>
