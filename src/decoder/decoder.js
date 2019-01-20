const pipeline = require('../common/pipeline');
const PreambleDecoder = require('./preamble');
const {SectionDecoder} = require('./section');

async function decode(inputStream, wasmModule = null) {
  return await pipeline(
    inputStream,
    new PreambleDecoder({wasmModule}),
    new SectionDecoder({wasmModule})
  );
}

module.exports = {
  decode
};
