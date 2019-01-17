const fs = require("fs");
const path = require("path");

async function run(args) {
    let mod = path.resolve(__dirname, '../src', args.shift());
    let cli = require(mod).cli;
    await cli(...args);
}

run(process.argv.slice(2)).catch(err => console.error(err));