const {Transform} = require('stream');
const leb128 = require('../common/leb128');
const {Section} = require('../sections/section');

const logger = require('../common/logger').getLogger('decoder.section');

class SectionDecoder extends Transform {
  constructor(options) {
    super(options);
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
    let payload = buffer.slice(0, payloadDataSize);
    buffer = buffer.slice(payloadDataSize);

    logger.debug(`code: ${id}, name: ${name}, length: ${payload.length}`);

    let sec = Section.createSection(id, name, payload);
    sec && sec.decode();

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

  _transform(buffer, encode, callback) {
    while (buffer.length > 0) {
      buffer = SectionDecoder.decode(buffer);
    }
    callback(null, buffer);
  }
}

module.exports = {
  SectionDecoder
};
