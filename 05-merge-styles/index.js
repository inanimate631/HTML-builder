const fs = require('fs');
const path = require('node:path');
const fsPromises = require("fs").promises;
const datamass = [];

(async () => {
    try {
        const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
        for (const file of files) {
            if (path.extname(file.name) === '.css') {
                (async () => {
                    try {
                        const data = fsPromises.readFile(path.join(__dirname, 'styles', file.name), 'utf-8')
                        datamass.push(data)
                    } catch (err) {
                        console.error(err.message);
                    }
                })();
            }
        }
        (async () => {
            let promise = await Promise.all(datamass)
            fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), promise.join``, (err) => {
                if (err) throw err;
                console.log('done')
            })
        })();
    } catch (err) {
        console.error(err.message);
    }
})();
