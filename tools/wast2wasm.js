const fs = require("fs");
const path = require("path");
const binaryen = require("binaryen");

// import fs from 'fs';

// TODO: more options
if (process.argv.length < 3) {
  console.error("Assembles WebAssembly text format to a binary.\n\nUsage: " + path.basename(process.argv[1]) + " file.wast");
  process.exit(1);
}

let filename = process.argv[2];
let out = filename.replace(/.wast$/, '.wasm');
let data;

try {
  data = fs.readFileSync(filename, "utf8");
} catch(e) {
  console.error("Failed to open '" + filename + "': " + e.code);
  process.exit(2);
}

let m = binaryen.parseText(data);
fs.writeFileSync(out, m.emitBinary());
