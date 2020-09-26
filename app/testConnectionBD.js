const sql = require('mssql');
const config = require('../config.json');



const cfgDB = config.configDB,
    cfgDbBase = config.configDB.database,
    logTableName = config.logTable;


const query = function () {
    const megaQuery = async function () {

        // writeServiceLog('Start listening database')

        try {
            const pool = await sql.connect(cfgDB)

            console.log(pool)

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
query()
