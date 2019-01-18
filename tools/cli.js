const path = require("path");
require('../src/init');

async function run(args) {
    let mod = path.resolve(__dirname, '../src', args.shift(), 'cli.js');
    let cli = require(mod);
    await cli(...args);
}

run(process.argv.slice(2)).catch(err => console.error(err));
