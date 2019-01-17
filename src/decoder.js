const stream = require('stream');
const util = require('util');
const fs = require('fs');

const logger = require('./logger');

const pipeline = util.promisify(stream.pipeline);


class PreambleDecoder extends stream.Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encode, callback) {
        let magic = chunk.readUInt32LE(0);
        let version = chunk.readUInt32LE(4);
        logger.logHex(magic, version);
        callback(null, chunk.slice(8));
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
};