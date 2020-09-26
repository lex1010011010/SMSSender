const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

const getLocalISOTime = function () {
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime
}

module.exports = getLocalISOTime;
