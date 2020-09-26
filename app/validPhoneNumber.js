const validPhoneNumber = function (number) {
    if (number.length < 11) {
        number = `7${number}`;
    } else {
        number = `7${number.slice(-10)}`;
    }
    return number;
}
module.exports = validPhoneNumber;