const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');
const {FunctionSignature} = require('./function');

const logger = require('../common/logger').getLogger('section.type');

class TypeSection extends Section {
  constructor(data) {
    super(SectionCode.TYPE, data);

    this.entries = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    for (let i = 0; i < this.count; i++) {
      let entry = FunctionSignature.decode(buffer);
      this.entries.push(entry.signature);
      buffer = entry.buffer;
    }

    logger.debug(this.count, this.entries);
  }
}

module.exports = {
  TypeSection
};
