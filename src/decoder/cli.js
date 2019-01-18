const fs = require('fs');
const {decode} = require('./decoder');

module.exports = async function cli(filename) {
  return await decode(fs.createReadStream(filename));
};
