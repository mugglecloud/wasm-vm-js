const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');

const logger = require('../common/logger').getLogger('section.export');


class LocalEntry {
  constructor(count, type) {
    this.count = count;
    this.type = type;
  }

  static decode(buffer) {
    let count = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(count.length);

    let valueType = leb128.decode(buffer.slice(0, 1));
    buffer = buffer.slice(1);

    let entry = new LocalEntry(count.value, valueType.value);
    return {entry, buffer};
  }
}

class FunctionBody {
  constructor(size, locals, code) {
    this.bodySize = size;
    this.locals = locals;
    this.code = code;
  }

  static decode(buffer) {
    let bodySize = leb128.decode(buffer.slice(0, 4));
    let restBuffer = buffer.slice(bodySize.value + bodySize.length);
    buffer = buffer.slice(bodySize.length, bodySize.value + bodySize.length);

    if (buffer.readUInt8(bodySize.value - 1) !== 0x0b) {
      throw "Invalid Function Body";
    }

    let localCount = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(localCount.length);

    let locals = [];
    for (let i = 0; i < localCount.value; i++) {
      let local = LocalEntry.decode(buffer);
      locals.push(local.entry);
      buffer = local.buffer;
    }

    let body = new FunctionBody(bodySize.value, locals, buffer);
    return {body, buffer: restBuffer};
  }
}

class CodeSection extends Section {
  constructor(data) {
    super(SectionCode.CODE, data);

    this.count = 0;
    this.bodies = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    for (let i = 0; i < this.count; i++) {
      let body = FunctionBody.decode(buffer);
      this.bodies.push(body.body);
      buffer = body.buffer;
    }

    logger.debug(this.count, this.bodies);
  }
}

module.exports = {
  CodeSection
};
