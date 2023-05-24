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
const TREND_DB_NAME = 'tweet-trends';
const utils = require('./utils')

const insertTweetToDB = (tweet, dbName, twitter) => {
    couchDBInstance.db.list((err, dbNames) => {
        if (err) {
            console.error('Error connection to database:', err);
            return;
        }
        let db;
        if (dbNames.includes(dbName)) {
            db = couchDBInstance.db.use(dbName);
            addTweet(tweet, db, twitter);
        } else {
            couchDBInstance.db.create(dbName, (err) => {
                if (err) {
                    console.error('Error creating database:', err);
                    return;
                }
                console.log(`Database '${dbName}' created successfully`);
                db = couchDBInstance.use(dbName);
                addTweet(tweet, db);
            });
        }
    })
}

const insertTrendsToDB = (trends, dbName) => {
    couchDBInstance.db.list((err, dbNames) => {
        if (err) {
            console.error('Error connection to database:', err);
            return;
        }
        let db;
        if (dbNames.includes(dbName)) {
            db = couchDBInstance.db.use(dbName);
            addTrends(trends, db);
        } else {
            couchDBInstance.db.create(dbName, (err) => {
                if (err) {
                    console.error('Error creating database:', err);
                    return;
                }
                console.log(`Database '${dbName}' created successfully`);
                db = couchDBInstance.use(dbName);
                addTrends(trends, db);
            });
        }
    })
}

const addTweet = (tweet, db, twitter) => {
    if (twitter) {
        db.get(tweet.id_str, (err, doc) => {
            if (err) {
                if (err.statusCode === 404 && err.error === 'not_found') {
                    // Save to CouchDB database if not already exists
                    db.insert({ "_id": tweet.id_str, ...tweet }, (err, body) => {
                        if (err) {
                            if (err.statusCode === 409 && err.error === 'conflict') {
                                console.log("Document Already exists, skipping.")
                            } else {
                                console.log('DB INSERTION ERROR!')
                                console.error(err);
                            }
                        } else {
                            console.log(`Saved document with ID ${body.id}`);
                        }
                    });
                } else {
                    console.error('Error querying database:', err);
                    return;
                }
            }
        });
    } else {
        db.get(tweet.id, (err, doc) => {
            if (err) {
                if (err.statusCode === 404 && err.error === 'not_found') {
                    // Save to CouchDB database if not already exists
                    db.insert({ "_id": tweet.id, ...tweet }, (err, body) => {
                        if (err) {
                            if (err.statusCode === 409 && err.error === 'conflict') {
                                console.log("Document Already exists, skipping.")
                            } else {
                                console.log('DB INSERTION ERROR!')
                                console.error(err);
                            }
                        } else {
                            console.log(`Saved document with ID ${body.id}`);
                        }
                    });
                } else {
                    console.error('Error querying database:', err);
                    return;
                }
            }
        });
    }

}

const addTrends = (trends, db) => {
    trends.forEach(trend => {
        const doc = { ...trend, created_at: utils.getCurrentDate() }
        db.insert(doc), (err, body) => {
            if (err) {
                console.log('ERROR Inserting Trend!', err)
            }
            else {
                console.log(`Saved document with ID ${body.id}`);
            }
        };
    })
}

const addStreamDataToDB = (streamData, dbName) => {
    couchDBInstance.db.list((err, dbNames) => {
        if (err) {
            console.error('Error connection to database:', err);
            return;
        }
        let db;
        if (dbNames.includes(dbName)) {
            db = couchDBInstance.db.use(dbName);
            addStreamData({ ...streamData, created_at: utils.getCurrentDate() }, db);
        } else {
            couchDBInstance.db.create(dbName, (err) => {
                if (err) {
                    console.error('Error creating database:', err);
                    return;
                }
                console.log(`Database '${dbName}' created successfully`);
                db = couchDBInstance.use(dbName);
                addStreamData(streamData, db);
            });
        }
    })
}

const addStreamData = (streamedData, db) => {
    db.insert(streamedData), (err, body) => {
        if (err) {
            console.log('ERROR Inserting Streamed Tweet!', err)
        }
        else {
            console.log(`Saved document with ID ${body.id}`);
        }
    };
}

module.exports = { insertTweetToDB, insertTrendsToDB, addStreamDataToDB }




