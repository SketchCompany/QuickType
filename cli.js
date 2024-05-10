#! /usr/bin/env node
const [,, ...args] = process.argv
require("./dist/index.js").run(args[0])