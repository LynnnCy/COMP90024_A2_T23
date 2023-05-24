/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
const express = require('express')
const cron = require('node-cron');
const { harvestTweets, harvestTrendingTopics } = require('./harvest-tweets')
const { harvestMastadonTweets, harvestMastadonTrends } = require('./harvest-mastadon-tweets')
const { getByDateFromDB, getByDateFromDBForLastThreeDays } = require('./view-trending-by-date')
const { stream, addRuleForUser } = require('./stream')
let cors = require('cors')

const PORT = 3000;

const app = express()

app.use(cors())

stream()

// Run Everyday at midnight
cron.schedule('0 0 * * *', () => {
    harvestTweets();
    harvestMastadonTweets();
});

// Run 15 mins past midnight
cron.schedule('15 0 * * *', () => {
    harvestTrendingTopics();
    harvestMastadonTrends();
});

app.use('/trendingTopics', async (req, res) => {
    try {
        let numTries = 0;
        let date = new Date()
        date.setDate(date.getDate());
        let result = await getByDateFromDB(date, 'tweet-trends');
        while (result.rows.length === 0 && numTries < 10) {
            date.setDate(date.getDate() - 1);
            result = await getByDateFromDB(date, 'tweet-trends');
            numTries++;
        }
        res.json(result.rows)
    } catch (err) {
        console.log(err);
    }
});

app.use('/recentTopics', async (req, res) => {
    try {
        let numTries = 0;
        let date = new Date()
        date.setDate(date.getDate());
        //Twitter Trends
        let twitterResult = await getByDateFromDBForLastThreeDays(date, 'tweet-trends');
        while (twitterResult.rows.length === 0 && numTries < 10) {
            date.setDate(date.getDate() - 1);
            let newResult = await getByDateFromDB(date, 'tweet-trends');
            twitterResult.concat(newResult)
            numTries++;
        }
        let mastadonResult = await getByDateFromDBForLastThreeDays(date, 'mastadon-trends');
        //Mastadon Trends
        numTries = 0;
        while (mastadonResult.rows.length === 0 && numTries < 10) {
            date.setDate(date.getDate() - 1);
            let newResult = await getByDateFromDB(date, 'mastadon-trends');
            mastadonResult.concat(newResult)
            numTries++;
        }
        res.json(twitterResult.rows)
    } catch (err) {
        console.log(err);
    }
});

app.use('/streamData', async (req, res) => {
    try {
        let filteredUserData = []
        let date = new Date()
        date.setDate(date.getDate());
        let result = await getByDateFromDB(date, 'twitter-stream-data');
        if(result.rows.length === 0) {
            date.setDate(date.getDate() - 1)
            result = await getByDateFromDB(date, 'twitter-stream-data');
        }
        if (req.query.username) {
            if (req.query.username !== "null") {
                addRuleForUser(req.query.username)
                result.rows.forEach(row => {
                    if (row.value.username.toString().valueOf() === req.query.username.toString().valueOf()) {
                        filteredUserData.push(row)
                    }
                })
            }
            res.json(filteredUserData)
            return;
        }
        res.json(result.rows)
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Twitter Harvestor Server started on port ${PORT}`);
})