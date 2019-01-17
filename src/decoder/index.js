const pipeline = require('../base/pipeline');
const PreambleDecoder = require('./preamble');
const {SectionDecoder} = require('./section');

async function decode(inputStream) {
  return await pipeline(
    inputStream,
    new PreambleDecoder(),
    new SectionDecoder()
  );
}

module.exports = {
  decode,
  PreambleDecoder
};