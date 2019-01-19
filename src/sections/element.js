const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');
const {InitExpr} = require('../core/lang-types');

const logger = require('../common/logger').getLogger('section.element');


class ElemSegment {
  constructor(index, offset, num, elems) {
    this.index = index;
    this.offset = offset;
    this.num = num;
    this.elems = elems;
  }

  static decode(buffer) {
    const index = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(index.length);
    const offset = InitExpr.decode(buffer);
    buffer = offset.buffer;
    const numElem = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(numElem.length);
    let elems = [];
    for (let i = 0; i < numElem.value; i++) {
      let e = leb128.decode(buffer.slice(0, 4));
      buffer = buffer.slice(e.length);
      elems.push(e.value);
    }
    const elem = new ElemSegment(index.value, offset.value, numElem.value, elems);
    return {value: elem, buffer};
  }

  getOffset() {

  }
}

class ElementSection extends Section {
  constructor(data) {
    super(SectionCode.ELEMENT, data);

    this.entries = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    for (let i = 0; i < this.count; i++) {
      let elem = ElemSegment.decode(buffer);
      this.entries.push(elem.value);
      buffer = elem.buffer;
    }

    logger.debug(this.count, this.entries);
  }
}

module.exports = {
  ElementSection
};
