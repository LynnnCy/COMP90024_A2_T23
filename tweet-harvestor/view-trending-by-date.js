/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
const { couchDBCredentials } = require('./secrets')
const couchDBInstance = require('nano')(`http://${couchDBCredentials.user}:${couchDBCredentials.password}@${couchDBCredentials.address}`);
const DB_NAME = 'tweet-trends'; //twitter-harvested-data
const utils = require('./utils')

const db = couchDBInstance.db.use(DB_NAME);

const viewByDate = (date) => {
    db.view('tweets', 'by_created_at', {
        startkey: date,
        endkey: date
    }, function (err, body) {
        if (!err) {
            console.log(body);
        } else {
            console.log(err);
        }
    });
}

const getByDateFromDB = async (date, dbName) => {
    try {
        const formattedDate = utils.getFormattedDate(date)
        const db = couchDBInstance.db.use(dbName);
        const result = await db.view('tweets', 'by_created_at', {
            startkey: formattedDate,
            endkey: formattedDate
        });
        return result;
    } catch(err) {
        console.log(err);
    }
}
const getByDateFromDBForLastThreeDays = async (date, dbName) => {
    try {
        const formattedDate = utils.getFormattedDate(date)
        let twoDaysEarlier = new Date()
        twoDaysEarlier.setDate(date.getDate() - 2)
        const formattedDateTwoDaysBefore = utils.getFormattedDate(twoDaysEarlier)
        const db = couchDBInstance.db.use(dbName);
        const result = await db.view('tweets', 'by_created_at', {
            startkey: formattedDateTwoDaysBefore,
            endkey: formattedDate
        });
        return result;
    } catch (err) {
        console.log(err);
    }
}

// viewByDate('05/04/2023')
// getByDateFromDB(new Date(), 'tweet-trends').then((err, body) => {
//     try {
//         numTries = 0;
//         let date = new Date()
//         date.setDate(date.getDate() - 1);
//         let result =  getByDateFromDB(date, 'tweet-trends');
//         while (result.rows.length === 0 && numTries < 10) {
//             date.setDate(date.getDate() - 1);
//             result =  getByDateFromDB(date, 'tweet-trends');
//             numTries++;
//         }
//         res.json(result.rows)
//     } catch (err) {
//         console.log(err);
//     }
// });

module.exports = {
    getByDateFromDB: getByDateFromDB,
    getByDateFromDBForLastThreeDays: getByDateFromDBForLastThreeDays
}

