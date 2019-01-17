const { Transform } = require('stream');
const leb128 = require('../base/leb128');

class SectionPayload {
    constructor() {
        this.name = '';
        this.data = Buffer.from([]);
    }

    get length() {
        return this.name.length + this.data.length;
    }
}

class Section {
    constructor(){
        this.id = 0;
        this.payload = null;
    }
}

class SectionDecoder extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(buffer, encode, callback) {
        console.log(buffer.length);
        buffer = SectionDecoder.decode(buffer);
        console.log(buffer.length);
        callback(null, buffer);
    }

    static decode(buffer) {
      const id = SectionDecoder.decodeId(buffer);
      buffer = buffer.slice(1);

      const payloadLen = SectionDecoder.decodePayloadLen(buffer);
      buffer = buffer.slice(payloadLen.length);

      let name = '';
      let nameLenSize = 0;
      if (id === 0) {
        const nameLen = SectionDecoder.decodeNameLen(buffer);
        nameLenSize = nameLen.value;
        name = buffer.toString('utf8', 0, nameLen.length);
        buffer = buffer.slice(nameLen.length);
      }

      const payloadDataSize = payloadLen.value - nameLenSize - name.length;
      let payload = buffer.toString('utf8', 0, payloadDataSize);
      buffer = buffer.slice(payloadDataSize);

      return buffer;
    }

    static decodeId(buffer) {
        return buffer.readUInt8(0);
    }

    static decodePayloadLen(buffer) {
        return leb128.decode(buffer.slice(0, 4));
    }

    static decodeNameLen(buffer) {
        return leb128.decode(buffer);
    }
}

module.exports = {
    SectionDecoder
};