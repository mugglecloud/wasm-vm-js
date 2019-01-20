const SectionClasses = require('./classes');
const leb128 = require('../common/leb128');

const SectionCode = {
  CUSTOM: 0,
  TYPE: 1,
  IMPORT: 2,
  FUNCTION: 3,
  TABLE: 4,
  MEMORY: 5,
  GLOBAL: 6,
  EXPORT: 7,
  START: 8,
  ELEMENT: 9,
  CODE: 10,
  DATA: 11
};

class SectionPayload {
  constructor(name = '', data = Buffer.from([])) {
    this.name = name;
    this.data = data;

    this.count = 0;
  }

  get length() {
    return this.name.length + this.data.length;
  }
}

class Section {
  constructor(id, payload) {
    this.id = id;
    this.payload = payload;

    this.$buffer = null;
    this.$wasmModule = null;
  }

  get count() {
    return this.payload.count;
  }

  static createSection(id, name, payload) {
    let data = new SectionPayload(name, payload);
    let cls = SectionClasses.get(id);
    if (!cls) return null;
    return new cls(data);
  }

  bindWasmModule(wasmModule) {
    this.$wasmModule = wasmModule;
  }

  emit(type, ...args) {
    if (this.$wasmModule) this.$wasmModule.emit(type, ...args);
  }

  decode() {
    this.decodeCount();
    this.decodeImpl();
  }

  /**
   * decode section count of entries, start section should override this
   */
  decodeCount() {
    let buffer = this.payload.data;
    let count = leb128.decode(buffer.slice(0, 4));
    this.$buffer = buffer.slice(count.length);
    this.payload.count = count.value;
  };

  /**
   * abstract method, should be override.
   * decode rest of section.
   */
  decodeImpl() {
    throw `Not Implemented: ${this.id}`;
  }
}

module.exports = {
  SectionPayload,
  Section,
  SectionCode
};
