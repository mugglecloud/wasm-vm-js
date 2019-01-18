const {Section, SectionCode} = require('./section');
const leb128 = require('../common/leb128');
const logger = require('../common/logger').getLogger('section.function');

class FunctionSection extends Section {
  constructor(data) {
    super(SectionCode.FUNCTION, data);

    this.count = 0;
    this.types = [];
  }

  decodeImpl() {
    let buffer = this.$buffer;
    for (let i = 0; i < this.count; i++) {
      let entry = leb128.decode(buffer.slice(0, 4));
      buffer = buffer.slice(entry.length);
      this.types.push(entry.value);
    }

    logger.debug(this.count, this.types);
  }
}

class FunctionSignature {
  constructor(form, params = [], returns = []) {
    this.form = form;
    this.params = params;
    this.returns = returns;
  }

  static decode(buffer) {
    let form = leb128.decode(buffer.slice(0, 1), false);
    buffer = buffer.slice(form.length);

    let params = FunctionSignature.decodeValueType(buffer);
    let returns = FunctionSignature.decodeValueType(params.buffer);

    let signature = new FunctionSignature(form.value, params.values, returns.values);

    return {signature, buffer: returns.buffer};
  }

  static decodeValueType(buffer) {
    let count = leb128.decode(buffer.slice(0, 4));
    let values = new Array(count.value);
    buffer = buffer.slice(count.length);

    for (let i = 0; i < values.length; i++) {
      let valueType = leb128.decode(buffer.slice(0, 1), false);
      values[i] = valueType.value;
    }
    buffer = buffer.slice(count.value);

    return {values, buffer};
  }
}

module.exports = {
  FunctionSection,
  FunctionSignature
};
