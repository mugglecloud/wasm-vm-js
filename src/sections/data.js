const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');
const {InitExpr} = require('../core/lang-types');

const logger = require('../common/logger').getLogger('section.data');


class DataSegment {
  constructor(index, offset, size, data) {
    this.index = index;
    this.offset = offset;
    this.size = size;
    this.data = data;
  }

  static decode(buffer) {
    const index = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(index.length);
    const offset = InitExpr.decode(buffer);
    buffer = offset.buffer;
    const size = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(size.length);
    const data = buffer.slice(0, size.value);
    buffer = buffer.slice(size.value);
    const ds = new DataSegment(index.value, offset.value, size.value, data);
    return {value: ds, buffer};
  }

  getOffset() {

  }
}

class DataSection extends Section {
  constructor(data) {
    super(SectionCode.DATA, data);

    this.entries = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    for (let i = 0; i < this.count; i++) {
      let data = DataSegment.decode(buffer);
      this.entries.push(data.value);
      buffer = data.buffer;
    }

    logger.debug(this.count, this.entries);
  }
}

module.exports = {
  DataSection
};
