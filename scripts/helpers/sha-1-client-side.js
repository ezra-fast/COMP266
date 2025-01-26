// hash the password
// call https://api.pwnedpasswords.com/range/{first 5 hash chars}
// search the results for the SUFFIX (the end) of the same digest
// if the suffix is in the results, the number after the colon on that line is the number of times that password has been breached
// else if the suffix is not in the results that password has not been breached
//
// resource for finding other endpoints: https://github.com/public-apis/public-apis
//
// find the ISP of a given IP based on this call: https://api.techniknews.net/ipgeo/{IPv4 address}

function clientSideHash() {
        let test = "test string";
        let encoder = new TextEncoder();
        let encodedString = encoder.encode(test);

        async function sha1(str) {
                const hash = await crypto.subtle.digest('SHA-1', str);

                const hashArray = Array.from(new Uint8Array(hash));
                const hexRep = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                console.log(hexRep);

        }

        sha1(encodedString);
}

