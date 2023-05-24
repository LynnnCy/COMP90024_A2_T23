/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
const fs = require('fs')
let bearerTokens = JSON.parse(fs.readFileSync('./bearer-tokens.json', 'utf-8'));
let couchDBCredentials = JSON.parse(fs.readFileSync('./couch-db.json', 'utf-8'));
let twitterCredentials = JSON.parse(fs.readFileSync('./twitter-secrets.json', 'utf-8'));

module.exports = { bearerTokens: bearerTokens, couchDBCredentials: couchDBCredentials, twitterCredentials: twitterCredentials }