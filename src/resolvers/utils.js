var crypto = require("crypto");


function now() {
    var date = new Date();
    return date.toISOString();
}


function hashString(str) {
    var hasher = crypto.createHash('sha256');
    hasher.update(str);
    return hasher.digest("base64");
}

// This hashes an object, or you can hash by specific keys
const hashAnything = (hashObj, keys = []) => {
    if(keys.length === 0) {
        keys = Object.keys(hashObj)
    }
    let hasher = crypto.createHash('sha256')
    keys.forEach(val => {
        hasher.update(hashObj[val])
    })
    return hasher.digest("base64")
}


exports.hashAnything = hashAnything;
exports.now = now;
exports.hashString = hashString;
