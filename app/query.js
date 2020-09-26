const sql = require('mssql');
const sendSMS = require('./sendSMS');
const validPhoneNumber = require('./validPhoneNumber');
const transformDate = require('./transformDate');
const config = require('../config.json');
const getLocalISOTime = require('./localISOTime');
const writeServiceLog = require('./logService');



const cfgDB = config.configDB,
    cfgDbBase = config.configDB.database,
    logTableName = config.logTable;


const query = function () {
    const megaQuery = async function () {

        writeServiceLog('Start listening database')

        try {
            const pool = await sql.connect(cfgDB)

            writeServiceLog('Connecting sucess')

            lastReservation = await pool.request().query(`SELECT TOP 1 * FROM [${cfgDbBase}].[dbo].[${logTableName}] ORDER BY ReservationID DESC`);

            let request = ` SELECT DISTINCT [Reservation].[ID] as [ReservationID], [Reservation].[ReservationNumber], [Reservation].[ReservationWord], [Reservation].[SecretQuery] as [PhoneNumber], [Performance].[name] as [PerformanceName], [PerformanceTimeframe].[StartTime]
                            FROM [${cfgDbBase}].[dbo].[Performance], [${cfgDbBase}].[dbo].[Reservation],  [${cfgDbBase}].[dbo].[ReservedSeat], [${cfgDbBase}].[dbo].[PerformanceTimeframe]
                            WHERE [Reservation].[id] = [ReservedSeat].[ReservationID] and [ReservedSeat].[PerformanceID] = [Performance].[id] and [Performance].[id] = [PerformanceTimeframe].[PerformanceId] and [PerformanceTimeframe].[PerformanceTimeframeTypeID] = 1 and [Reservation].[id]  > ${lastReservation.recordset[0].ReservationID} and [Reservation].[SecretQuery] != '' ;`;

            let reservation = await pool.request().query(request)


            if (reservation.recordset !== []) {
                writeServiceLog(`New message is no found `)
            }

            for (let i = 0; reservation.recordset.length > i; i++) {
                let element = reservation.recordset[i];

                sendSMS(validPhoneNumber(element.PhoneNumber), element.ReservationNumber, element.PerformanceName, transformDate(element.StartTime), element.ReservationID)

                await pool.request().query(`INSERT [${cfgDbBase}].[dbo].[${logTableName}] ([ReservationID], [PhoneNumber], [SentDate]) VALUES (${reservation.recordset[i].ReservationID}, '${validPhoneNumber(element.PhoneNumber)}', '${getLocalISOTime()}')`);

            }

            sql.close();
        } catch (err) {
            console.log(err);
            sql.close();
        }
    }
    megaQuery();

    sql.on('error', err => {
        console.log(err)
    })
}

module.exports = query;
