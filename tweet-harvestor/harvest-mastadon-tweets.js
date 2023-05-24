/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
const axios = require('axios');
const { insertTweetToDB, insertTrendsToDB } = require('./save-tweets-couchdb')

const authToken = "-uf89fbX1oMP5s9OZzO4chM1pD-WRaCeXhQQzupKpz4";
const SINGLE_TAG_REQUEST_LIMIT = 100;
let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://mastodon.social/api/v1/trends/tags`,
    headers: {
        'Authorization': `Bearer ${authToken}`
    }
};

const harvestMastadonTweets = () => {
    axios.request(config)
        .then((response) => {
            response.data.forEach(tag => {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://mastodon.social/api/v1/timelines/tag/${tag.name}?limit=${SINGLE_TAG_REQUEST_LIMIT}`,
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                };
                axios.request(config)
                    .then((response) => {
                        let count = 0;
                        response.data.forEach(tweet => {
                            if (count <= 10) {
                                insertTweetToDB(tweet, 'mastadon-harvested-data', false)
                                count++;
                            }
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

const harvestMastadonTrends = () => {
    axios.request(config)
        .then((response) => {
            response.data.forEach(data => {
                totalUses = 0;
                data.history.forEach(history => {
                    totalUses += +history.uses
                })
                data['tweet_volume'] = totalUses
            })
            insertTrendsToDB(response.data, 'mastadon-trends')
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.harvestMastadonTweets = harvestMastadonTweets;

exports.harvestMastadonTrends = harvestMastadonTrends;