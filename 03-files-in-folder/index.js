const fs = require('fs')
const path = require('node:path');
const fsPromises = require("fs").promises;

fs.readdir('03-files-in-folder/secret-folder', { withFileTypes: true }, (error, dirEntryList) => {
    if (!error) {
        dirEntryList.forEach((item) => {
            if (item.isFile()) {
                (async () => {
                    try {
                        const stats = await fsPromises.stat(path.join('03-files-in-folder/secret-folder', item.name));
                        let name = item.name.split`.`
                        let extname = path.extname(item.name).split``.splice(1, path.extname(item.name).length)
                        console.log(`${name[0]} - ${extname.join``} - ${stats.size}b`)
                    }
                    catch (error) {
                        console.log(error);
                    }
                })();
            }
        })
    } else {
        console.error(error)
    }
})
