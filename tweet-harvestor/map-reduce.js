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
const DB_NAME = 'twitter-harvested-data';

const db = couchDBInstance.db.use(DB_NAME);

//Map every tweet by date
const mapFunction = function (doc) {
    if (doc.created_at) {
        let date = new Date(doc.created_at);
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        date = mm + '/' + dd + '/' + yyyy;
        emit(date, doc);
    }
};

db.insert({
    views: {
        by_created_at: {
            map: mapFunction.toString()
        }
    }
}, '_design/tweets', function (err, body) {
    if (!err) {
        console.log('View created successfully');
    } else {
        console.log(err)
    }
});


