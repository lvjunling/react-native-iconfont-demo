const path = require('path');

const oldPath = path.resolve(__dirname, 'iconfont.css');
const newPath = path.resolve(__dirname, 'iconfont.json');

var gen = module.exports = function () {
    const readline = require('readline');
    const fs = require('fs');

    const fRead = fs.createReadStream(oldPath);
    const fWrite = fs.createWriteStream(newPath, {flags: 'w+', defaultEncoding: 'utf8'});

    const objReadLine = readline.createInterface({
        input: fRead
    });

    var ret = {};

    objReadLine.on('line', line => {
        line = line && line.trim();
        if( !line.includes(":before") || !line.includes("content") ) return;
        var keyMatch = line.match(/\.(.*?):/);
        var valueMatch = line.match(/content:.*?\\(.*?);/);
        var key = keyMatch && keyMatch[1];
        var value = valueMatch && valueMatch[1];
        value = parseInt(value, 16);
        key && value && (ret[key] = value);
    });

    objReadLine.on('close', () => {
        console.log('readline close');
        fWrite.write(JSON.stringify(ret), 'utf8');
    });
};

gen();