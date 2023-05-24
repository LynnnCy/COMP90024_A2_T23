/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
const { twitterToken } = require('./bearer-tokens.json')
const { ETwitterStreamEvent, TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const { addStreamDataToDB } = require('./save-tweets-couchdb')

const appOnlyClient = new TwitterApi(twitterToken);

exports.addRuleForUser = (username => {
    let data = JSON.stringify({
        "add": [
            {
                "value": `from:${username}`
            }
        ]
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.twitter.com/2/tweets/search/stream/rules',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${twitterToken}`,
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
});

exports.stream = () => {
    appOnlyClient.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id', 'created_at'], expansions: ['referenced_tweets.id'],
        'user.fields': ['username']
    }).then(stream => {
        stream.on(
            // Emitted when a Twitter payload (a tweet or not, given the endpoint).
            ETwitterStreamEvent.Data,
            eventData => {
                // console.log('Twitter has sent something:', eventData.data)
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://api.twitter.com/2/users?ids=${eventData.data.author_id}&user.fields=username`,
                    headers: {
                        'Authorization': `Bearer ${twitterToken}`,
                    }
                };
                axios.request(config)
                    .then((response) => {
                        const data = eventData.data
                        data['username'] = response.data.data[0].username
                        data['name'] = response.data.data[0].name
                        addStreamDataToDB(data, 'twitter-stream-data')
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        );
    });
}
