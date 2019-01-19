const leb128 = require("../common/leb128");
const {Opcodes} = require('./opcodes');

const ValueType = {
  I32: 0x7f,
  I64: 0x7e,
  F32: 0x7d,
  F64: 0x7c
};

const ExternalKind = {
  FUNCTION: 0,
  TABLE: 1,
  MEMORY: 2,
  GLOBAL: 3
};

const ElemType = {
  ANY_FUNC: 0x70
};

const Mutability = {
  IMMUTABLE: 0,
  MUTABLE: 1
};

function decodePrimitiveType(buffer) {
  let val = leb128.decode(buffer.slice(0, 1), true);
  return val.value;
}

function decodeMutability(buffer) {
  let val = leb128.decode(buffer.slice(0, 1));
  return val.value;
}

class ResizableLimits {
  constructor(flags, initial, maximum = null) {
    this.flags = flags;
    this.initial = initial;
    this.maximum = maximum;
  }

  static decode(buffer) {
    const flags = leb128.decode(buffer.slice(0, 1));
    buffer = buffer.slice(1);
    const initial = leb128.decode(buffer.slice(0, 4));
    buffer = buffer.slice(initial.length);
    let maximum = {value: null};
    if (flags.value === 1) {
      maximum = leb128.decode(buffer.slice(0, 4));
      buffer = buffer.slice(maximum.length);
    }
    const value = new ResizableLimits(flags.value, initial.value, maximum.value);
    return {value, buffer};
  }
}

class TableType {
  constructor(elementType, limits) {
    this.elementType = elementType;
    this.limits = limits;
  }

  static decode(buffer) {
    const elementType = leb128.decode(buffer.slice(0, 1));
    buffer = buffer.slice(1);
    const limits = ResizableLimits.decode(buffer);
    buffer = limits.buffer;
    const value = new TableType(elementType.value, limits.value);
    return {value, buffer};
  }
}

class MemoryType {
  constructor(limits) {
    this.limits = limits;
  }

  static decode(buffer) {
    const limits = ResizableLimits.decode(buffer);
    buffer = limits.buffer;
    const value = new MemoryType(limits.value);
    return {value, buffer};
  }
}

class GlobalType {
  constructor(contentType, mutability) {
    this.contentType = contentType;
    this.mutability = mutability;
  }

  static decode(buffer) {
    let contentType = decodePrimitiveType(buffer);
    buffer = buffer.slice(1);
    let mutability = decodeMutability(buffer);
    buffer = buffer.slice(1);
    return {value: new GlobalType(contentType, mutability), buffer}
  }
}

class InitExpr {
  constructor(expr) {
    this.expr = expr;
  }

  static decode(buffer) {
    const index = buffer.indexOf(Opcodes.end) + 1;
    const expr = buffer.slice(0, index);
    return {value: new InitExpr(expr), buffer: buffer.slice(index)};
  }
}

module.exports = {
  ValueType,
  ExternalKind,
  ElemType,
  ResizableLimits,
  TableType,
  MemoryType,
  GlobalType,
  InitExpr
};
