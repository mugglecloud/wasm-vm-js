const fs = require('fs');
const { decode } = require('.');

module.exports = async function cli(filename) {
    return await decode(fs.createReadStream(filename));
};