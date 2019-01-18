const util = require('util');
const {pipeline} = require('stream');

module.exports = util.promisify(pipeline);