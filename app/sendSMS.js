const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const getLocalISOTime = require('./localISOTime');
const parse = require('xml-parser');
const writeMessageLog = require('./logMessage.js');
const config = require('../config.json');
const writeServiceLog = require('./logService');



const sendSMS = function (phone, reservation, event, start, ReservationID) {

    const xhr = new XMLHttpRequest();
    let reservationNumber = reservation,
        phoneNumber = phone,
        cinemaName = config.cinema,
        eventName = event,
        eventStart = start,
        resID = ReservationID;

    let message = `Бронь №${reservationNumber} \"${eventName}\" ${eventStart} ${cinemaName}`;

    const body =
        'msid=' + phoneNumber +
        '&message=' + message +
        '&naming=' + 'kino-khv' +
        '&login=' + '' +
        '&password=' + config.TOKEN;

    xhr.open("POST", 'https://api.mcommunicator.ru/m2m/m2m_api.asmx/SendMessage');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    xhr.onload = function () {
        if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
            console.log(`Ошибка ${xhr.status}`); // Например, 404: Not Found
        } else { // если всё прошло гладко, выводим результат
            console.log(`Сообщение отправлено`);
            let smsId = parse(xhr.responseText).root.content
            let logMessage = `${getLocalISOTime()}---smsId=${smsId}---rId=${reservationNumber}---phone=${phoneNumber}---len=${message.length}---${eventName}---${cinemaName}---${eventStart}`
            writeServiceLog(`Sented message---ReservationId=${resID}---smsID=${smsId}---phone=${phoneNumber}`);
            writeMessageLog(logMessage);
        }
    };
    xhr.onerror = function () { // происходит, только когда запрос совсем не получилось выполнить
        console.log(`Ошибка соединения`);
    };
}

module.exports = sendSMS;