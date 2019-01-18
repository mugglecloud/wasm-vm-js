const {Section, SectionCode} = require('./section');

class FunctionSection extends Section {
  constructor(data) {
    super(SectionCode.FUNCTION, data);
  }

  decodeImpl() {
    console.log('decode function');
  }
}

module.exports = {
  FunctionSection
};
