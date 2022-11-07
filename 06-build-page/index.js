const fs = require('fs');
const path = require('node:path');
const fsPromises = require("fs").promises;
const readline = require('readline');
const direct = path.join(__dirname, 'project-dist');
const datamassCss = [];
const datamassComponents = {};
const basikHtml = [];

fs.access(direct, fs.constants.F_OK, (err) => {
    if (err && err.code === 'ENOENT') {
        fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
            if (err) throw err;
        })
    }
})

function deletFile(directory) {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            if (file.isDirectory()) {
                deletFile(path.join(directory, file.name))
            } else {
                fs.unlink(path.join(directory, file.name), (err) => {
                    if (err) throw err;
                });
            }
        }
    })
}
deletFile(direct)

function copyAssets(directory, folderName) {
    fs.readdir(directory, { withFileTypes: true }, (error, dirEntryList) => {
        if (!error) {
            (async () => {
                await (async () => {
                    try {
                        await fsPromises.access(path.join(direct, folderName), fs.constants.F_OK)
                    } catch (error) {
                        fs.mkdir(path.join(direct, folderName), (err) => {
                            if (err) throw err;
                            console.log('createDir')
                        })
                    }
                })();
                dirEntryList.forEach((item) => {
                    console.log('2')
                    if (item.isDirectory()) {
                        copyAssets(path.join(__dirname, folderName, item.name), path.join(folderName, item.name))
                    } else {
                        fs.copyFile(path.join(directory, item.name), path.join(direct, folderName, item.name), (err) => {
                            if (err) throw err;
                        })
                    }
                })
            })();
        } else {
            console.error(error)
        }
    })
}

copyAssets(path.join(__dirname, 'assets'), 'assets');

(async () => {
    try {
        const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
        for (const file of files) {
            if (path.extname(file.name) === '.css') {
                (async () => {
                    try {
                        const data = fsPromises.readFile(path.join(__dirname, 'styles', file.name), 'utf-8')
                        datamassCss.push(data)
                    } catch (err) {
                        console.error(err.message);
                    }
                })();
            }
        }
        (async () => {
            let promise = await Promise.all(datamassCss)
            fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), promise.join``, (err) => {
                if (err) throw err;
                console.log('done')
            })
        })();
    } catch (err) {
        console.error(err.message);
    }
})();

(async () => {
    try {
        const files = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
        for (const file of files) {
            if (path.extname(file.name) === '.html') {
                await (async () => {
                    try {
                        let name = (file.name).split`.`
                        const data = await fsPromises.readFile(path.join(__dirname, 'components', file.name), 'utf-8')
                        datamassComponents[name[0]] = (data)
                    } catch (err) {
                        console.error(err.message);
                    }
                })();
            }
        };
        (async () => {
            try {
                const file = readline.createInterface({
                    input: fs.createReadStream(path.join(__dirname, 'template.html'), { encoding: 'utf-8' }),
                    output: process.stdout,
                    terminal: false
                });
                file.on('line', (line) => {
                    if (line.trim().includes('{{')) {
                        for (let key in datamassComponents) {
                            if (line.trim() === `{{${key}}}`) {
                                basikHtml.push(datamassComponents[key])
                                line = datamassComponents[key]
                            }
                        }
                    } else {
                        basikHtml.push(line)
                    }
                    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), basikHtml.join`\n`, (err) => {
                        if (err) throw err;
                    })
                });
            } catch (err) {
                console.error(err.message)
            };
        })();
    } catch (err) {
        console.error(err.message)
    }
})();

//console.log(basikHtml.join`\n`)










