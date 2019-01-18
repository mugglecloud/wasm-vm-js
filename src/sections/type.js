const {Section, SectionCode} = require('./section');

class TypeSection extends Section {
  constructor(data) {
    super(SectionCode.TYPE, data);
  }

  decodeImpl() {
    console.log('decode type');
  }
}

module.exports = {
  TypeSection
};
