const fs = require('fs')
const process = require('process');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const stream = new fs.WriteStream('02-write-file/data.txt', { encoding: 'utf-8' });

fs.writeFile('02-write-file/data.txt', '', 'utf8', (err) => {
    if (err) throw err;
    console.log('Pls write some text')
})

rl.on('line', (input) => {
    if (input !== 'exit') {
        stream.write(`${input}\n`)
    } else {
        console.log('The end')
        rl.close()
    }
})

rl.on('SIGINT', () => {
    console.log('The end')
    rl.close()
})




