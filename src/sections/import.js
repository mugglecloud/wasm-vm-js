const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');
const {ExternalKind, TableType, MemoryType, GlobalType} = require('../core/lang-types');

const logger = require('../common/logger').getLogger('section.import');


class ImportEntry {
  constructor(moduleName, fieldName, externalKind, type) {
    this.moduleName = moduleName;
    this.fieldName = fieldName;
    this.externalKind = externalKind;
    this.type = type;
  }

  static decode(buffer) {
    const moduleLen = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(moduleLen.length);
    const moduleStr = buffer.toString('utf8', 0, moduleLen.value);
    buffer = buffer.slice(moduleLen.value);

    const fieldLen = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(fieldLen.length);
    const fieldStr = buffer.toString('utf8', 0, fieldLen.value);
    buffer = buffer.slice(fieldLen.value);

    const kind = buffer.readUInt8(0);
    buffer = buffer.slice(1);

    const type = ImportEntry.decodeType(buffer, kind);
    buffer = type.buffer;

    let entry = new ImportEntry(moduleStr, fieldStr, kind, type.value);
    return {entry, buffer};
  }

  static decodeType(buffer, kind) {
    let value = null;
    switch (kind) {
      case ExternalKind.FUNCTION:
        let r = leb128.decode(buffer.slice(0, 4));
        buffer = buffer.slice(r.length);
        value = r.value;
        break;
      case ExternalKind.TABLE:
        let table = TableType.decode(buffer);
        value = table.value;
        buffer = table.buffer;
        break;
      case ExternalKind.MEMORY:
        let memory = MemoryType.decode(buffer);
        value = memory.value;
        buffer = memory.buffer;
        break;
      case ExternalKind.GLOBAL:
        let g = GlobalType.decode(buffer);
        value = g.value;
        buffer = g.buffer;
        break;
      default:
        break;
    }
    // logger.debug('type:', value, 'kind:', kind);
    return {value, buffer};
  }
}

class ImportSection extends Section {
  constructor(data) {
    super(SectionCode.IMPORT, data);

    this.entries = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    // logger.debug(this.count, buffer.length);
    for (let i = 0; i < this.count; i++) {
      let entry = ImportEntry.decode(buffer);
      // logger.debug(entry.entry.moduleName, entry.entry.fieldName, entry.entry.externalKind, entry.entry.type);
      this.entries.push(entry.entry);
      buffer = entry.buffer;
    }

    logger.debug(this.count, this.entries);
  }
}

module.exports = {
  ImportSection
};
