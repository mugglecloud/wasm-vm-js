function decode(chunk, signed=true) {
    let value = 0;
    let shift = 0;
    let length = 0;
    let b;
    
    while(true) {
        b = chunk[length];
        value |= (b & 0x7f) << shift;
        shift += 7;
        length += 1;
        if ((b & 0x80) === 0) {
            break;
        }
    }

    if (signed && shift < length && (b & 0x40) !== 0) {
        value |= ~0 << shift;
    }

    return { value, length };
}

module.exports = {
  decode
};