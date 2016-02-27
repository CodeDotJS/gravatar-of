var jsonfile = require('jsonfile')
var util = require('util')
 
var file = 'rishi.json'
 
console.dir(jsonfile.readFileSync(file))