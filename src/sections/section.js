const SectionClasses = require('./classes');

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
  }

  get length() {
    return this.name.length + this.data.length;
  }
}

class Section {
  constructor(id, payload) {
    this.id = id;
    this.payload = payload;
  }

  static createSection(id, name, payload) {
    let data = new SectionPayload(name, payload);
    let cls = SectionClasses.get(id);
    if (!cls) return null;
    return new cls(data);
  }

  decode() {
    this.decodeImpl();
  }

  /**
   * abstract method, should be override.
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
