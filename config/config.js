const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue) {
    return stringValue;
});
/*
//delivery_db
const databaseConfig = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'delivery_db',
    'user': 'postgres',
    'password': '12345'
};
*/

//delivery_db

const databaseConfig = {
    'host': 'containers-us-west-131.railway.app',
    'port': 5761,
    'database': 'railway',
    'user': 'postgres',
    'password': 'o0NH9HNCeNHSmRlvrU41',
    'ssl': { rejectUnauthorized: false }
};






/*
const databaseConfig = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres',
    'password': '93214326'
};
*/
const db = pgp(databaseConfig);

module.exports = db;