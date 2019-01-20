const EventEmitter = require('events');
const {decode} = require('../decoder/decoder');
const {ExternalKind} = require('../core/lang-types');

class WasmModule extends EventEmitter {
  constructor(binaryStream) {
    super();

    this.magic = null;
    this.version = null;
    this.$wasmBinaryStream = binaryStream;
  }

  static createInstance(binaryStream) {
    let mod = new WasmModule(binaryStream);
    mod.instantiate();
    return mod;
  }

  instantiate() {
    setImmediate(async () => {
      await decode(this.$wasmBinaryStream, this);
    });

    this.once('decode.preamble', (magic, version) => {
      this.magic = magic;
      this.version = version;
    });

    this.once('decode.import', (entry) => {
      if (entry.kind === ExternalKind.FUNCTION) {
      }
    });
  }
}

module.exports = {
  WasmModule
};
