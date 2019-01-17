function hex(i) {
    return `0x${i.toString(16)}`;
}

function log(...args) {
    console.log(...args);
}

function logHex(...args) {
    let arr = args.map(a => hex(a));
    log(...arr);
}

module.exports = {
    log,
    logHex
};