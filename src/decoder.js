const stream = require('stream');
const util = require('util');
const fs = require('fs');

const pipeline = util.promisify(stream.pipeline);

class PreambleDecoder extends stream.Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encode, callback) {
        console.log(typeof chunk, encode);
        callback(null, chunk);
    }
}

async function decode(inputStream, moduleInstance) {
    await pipeline(
        inputStream,
        new PreambleDecoder(),
    );
    console.log('Pipeline succeeded.');
}

async function cli(filename) {
    await decode(fs.createReadStream(filename));
}

module.exports = {
    cli,
    decode,
    PreambleDecoder
}