//Преобразование доты из формата IOS в необходимый
const transformDate = function (ISODate) {

    //Добавляем ноль, если число с одним знаком
    const addZero = function (item) {
        if (item.toString().length <= 1) {
            item = `0${item}`;
        } else {
            item = `${item}`
        }
        return item
    }

    //Получает временную зону текущего часового пояса
    const getTimeZone = function (offset) {
        if (offset > 0) {
            return `+${offset}:00`
        } else {
            return `${offset}:00`
        }
    }
    const TimezoneOffset = -(new Date()).getTimezoneOffset() / 60;
    const timeZone = getTimeZone(TimezoneOffset)

    const tmpDate = new Date(ISODate);
    const localUTC = tmpDate.toISOString().slice(0, -1) + timeZone;
    const timeUTC = new Date(localUTC);

    return `${addZero(timeUTC.getDate())}.${addZero(timeUTC.getMonth() + 1)}.${addZero(timeUTC.getFullYear())} ${addZero(timeUTC.getHours())}:${addZero(timeUTC.getMinutes())}`
}

module.exports = transformDate;
