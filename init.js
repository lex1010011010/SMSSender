const sql = require('mssql');
const config = require('./config.json');


const cfgDB = config.configDB,
    cfgDbBase = config.configDB.database,
    logTableName = config.logTable;

const init = async function () {
    console.log(`Create table in batebase...`);
    try {
        const pool = await sql.connect(cfgDB)
        await pool.request().query(`CREATE TABLE [${cfgDbBase}].[dbo].[${logTableName}] (ReservationID int  PRIMARY KEY NOT NULL, PhoneNumber nchar(11) NULL, SentDate datetime NULL)`);

        const lastReservationID = await pool.request().query(`SELECT TOP 1 [ID] FROM [${cfgDbBase}].[dbo].[Reservation] ORDER BY [ID] DESC`);

        console.log(`Last ReservationID add in table ${lastReservationID.recordset[0].ID}`);

        await pool.request().query(`INSERT [${cfgDbBase}].[dbo].[${logTableName}] ([ReservationID]) VALUES (${lastReservationID.recordset[0].ID})`);
        console.log(`Success`);
        sql.close();
    } catch (err) {
        console.log(err);
        sql.close();
    }
}
sql.on('error', err => {
    console.log(err)
})
init()
