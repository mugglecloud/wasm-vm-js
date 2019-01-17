const pipeline = require('../base/pipeline');
const PreambleDecoder = require('./preamble');

async function decode(inputStream) {
    return await pipeline(
        inputStream,
        new PreambleDecoder(),
    );
}

module.exports = {
    decode,
    PreambleDecoder
};