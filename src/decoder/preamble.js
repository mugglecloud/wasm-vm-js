const stream = require('stream');
const logger = require('../base/logger');

module.exports = class PreambleDecoder extends stream.Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encode, callback) {
        let magic = chunk.readUInt32LE(0);
        let version = chunk.readUInt32LE(4);
        logger.logHex(magic, version);
        callback(null, chunk.slice(8));
    }
};
