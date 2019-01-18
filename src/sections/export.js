const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');

const logger = require('../common/logger').getLogger('section.export');


const ExternalKind = {
  FUNCTION: 0,
  TABLE: 1,
  MEMORY: 2,
  GLOBAL: 3
};

class ExportEntry {
  constructor(field, externalKind, index) {
    this.field = field;
    this.externalKink = externalKind;
    this.index = index;
  }

  static decode(buffer) {
    const fieldLen = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(fieldLen.length);

    const fieldStr = buffer.toString('utf8', 0, fieldLen.value);
    buffer = buffer.slice(fieldLen.value);

    const kind = buffer.readUInt8(0);
    buffer = buffer.slice(1);

    const index = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(index.length);

    let entry = new ExportEntry(fieldStr, kind, index.value);
    return {entry, buffer};
  }
}

class ExportSection extends Section {
  constructor(data) {
    super(SectionCode.EXPORT, data);

    this.count = 0;
    this.entries = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    for (let i = 0; i < this.count; i++) {
      let entry = ExportEntry.decode(buffer);
      this.entries.push(entry.entry);
      buffer = entry.buffer;
    }

    logger.debug(this.count, this.entries);
  }
}

module.exports = {
  ExportSection
};
