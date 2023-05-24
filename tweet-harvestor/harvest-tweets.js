/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
const Twit = require('twit');
const secrets = require('./secrets')
const { insertTweetToDB, insertTrendsToDB } = require('./save-tweets-couchdb')
const TREND_DB_NAME = 'tweet-trends';
// Set API credentials
const client = new Twit({
    ...secrets.twitterCredentials,
    timeout_ms: 60 * 1000,
    strictSSL: true,
});

//Place Id from twitter for Melbourne, Victoria
const PLACE_ID = 1103816;

const harvestTweets = () => {
    //Total amounts of tweet to harvest per day
    const TOTAL_TWEETS_CAPS = 1000;

    //Total amounts of tweet to harvest per topic
    const TOTAL_TWEETS_PER_TOPIC = 100;

    let numTweetsCollected = 0;
    client.get('/trends/place', { id: PLACE_ID }, (error, result, response) => {
        // console.log(response.headers)
        if (!error) {
            // let query = ''
            //collect tweets for top 10 trending topics
            result[0].trends.slice(0, 11).forEach(trend => {
                // Search for tweets by trending topic queries
                client.get('search/tweets', { q: trend.name, lang: 'en', tweet_mode: 'extended', count: TOTAL_TWEETS_PER_TOPIC }, function (err, data, response) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    const tweets = data.statuses;
                    while (numTweetsCollected < TOTAL_TWEETS_CAPS) {
                        tweets.forEach((tweet) => {
                            insertTweetToDB(tweet, 'twitter-harvested-data', true)
                            // console.log(tweet.full_text);
                            // console.log(numTweetsCollected)
                            numTweetsCollected++;
                        });
                        //break if no more tweets are left to be found
                        break;
                    }
                });
                // query = query + ' ' + trend.name + ' OR '
            });
            // query = query.trim().replace(/\sOR$/, '')
            // console.log(query)
        } else {
            console.log(error);
        }
    });
}

const harvestTrendingTopics = () => {
    client.get('/trends/place', { id: PLACE_ID }, (error, result, response) => {
        // console.log(response.headers)
        if (!error) {
            const latestTrends = new Set(result[0].trends);
            //Remove the ones with no tweet volume
            latestTrends.forEach((trend) => {
                if (new String(trend.tweet_volume).valueOf() == new String("null").valueOf()) {
                    trend.tweet_volume = 1
                }
            })
            insertTrendsToDB(latestTrends, TREND_DB_NAME)
        }
    });
}

module.exports = { harvestTweets, harvestTrendingTopics }