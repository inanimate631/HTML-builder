const fs = require('fs')
const path = require('node:path');
const direktory = path.join(__dirname, 'text.txt')

const stream = new fs.ReadStream(direktory, { encoding: 'utf-8' });

stream.on('readable', function () {
    var data = stream.read()
    if (data !== null) {
        console.log(data)
    }
})

console.log(direktory)
