const fs = require("fs");
const getLocalISOTime = require('./localISOTime');


const writeMessageLog = function (msg) {
    fs.appendFile("./log/message.log", `${msg}\n`, function (error) {
        if (error) throw error; // если возникла ошибка
    });
}

module.exports = writeMessageLog;
