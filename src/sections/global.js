const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');
const {GlobalType, InitExpr} = require('../core/lang-types');

const logger = require('../common/logger').getLogger('section.global');


class GlobalEntry {
  constructor(type, init) {
    this.type = type;
    this.init = init;
  }

  static decode(buffer) {
    let g = GlobalType.decode(buffer);
    buffer = g.buffer;

    let init = InitExpr.decode(buffer);
    buffer = init.buffer;

    let entry = new GlobalEntry(g.value, init.value);
    return {entry, buffer};
  }
}

class GlobalSection extends Section {
  constructor(data) {
    super(SectionCode.GLOBAL, data);

    this.globals = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    for (let i = 0; i < this.count; i++) {
      let entry = GlobalEntry.decode(buffer);
      this.globals.push(entry.entry);
      buffer = entry.buffer;
    }

    logger.debug(this.count, this.globals);
  }
}

module.exports = {
  GlobalSection
};
