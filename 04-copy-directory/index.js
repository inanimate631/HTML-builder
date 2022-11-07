const fsPromises = require("fs").promises;
const fs = require('fs');
const path = require('node:path');

(async () => {
    try {
        await fsPromises.mkdir('04-copy-directory/copy-files', { recursive: true });
    } catch (err) {
        console.error(err.message);
    }
})();

fs.readdir('04-copy-directory/copy-files', (err, files) => {
    if (err) throw err;
    for (const file of files) {
        fs.unlink(path.join('04-copy-directory/copy-files', file), (err) => {
            if (err) throw err;
        });
    }
})

fs.readdir('04-copy-directory/files', { withFileTypes: true }, (error, dirEntryList) => {
    if (!error) {
        dirEntryList.forEach((item) => {
            fsPromises.copyFile(`04-copy-directory/files/${item.name}`, `04-copy-directory/copy-files/${item.name}`)
        })
    } else {
        console.error(error)
    }
})

