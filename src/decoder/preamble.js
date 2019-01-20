const {Transform} = require('stream');
const logger = require('../common/logger').getLogger('decoder.preamble');

module.exports = class PreambleDecoder extends Transform {
  constructor(options) {
    super(options);

    this.$wasmModule = options.wasmModule;
  }

  _transform(chunk, encode, callback) {
    let magic = chunk.readUInt32LE(0);
    let version = chunk.readUInt32LE(4);
    // logger.debug(`0x${magic.toString(16)}, 0x${version.toString(16)}`);
    if (this.$wasmModule) this.$wasmModule.emit('decode.preamble', magic, version);
    callback(null, chunk.slice(8));
  }
};
