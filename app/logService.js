const fs = require('fs')
const getLocalISOTime = require('./localISOTime');


const writeServiceLog = function (msg) {
    fs.appendFile("./log/service.log", `${getLocalISOTime()}---${msg}\n`, function (error) {
        if (error) throw error; // если возникла ошибка
    });

}


module.exports = writeServiceLog;
