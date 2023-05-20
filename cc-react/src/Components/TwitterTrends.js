import React, { useEffect, useState } from 'react';
import PageTransition from '../Components/PageTransition';
import WordCloud from '../Components/WordCloud';
import LoadingSpinner from '../Components/LoadingSpinner';
import { getWordCloudValueList } from '../StringUtil'
const TwitterTrends = () => {
    const [wordCloudValueList, setWordCloudValueList] = useState([])
    useEffect(() => {
        async function fetchTweets() {
            try {
                const response = await fetch('http://172.26.130.99:3000/recentTopics');
                const data = await response.json()
                const tweetWordMap = new Map()
                data.forEach(tweet => {
                    let currentKey = tweet.value.name.trim()
                    if (tweetWordMap.has(currentKey)) {
                        tweetWordMap.set(currentKey, tweetWordMap.get(currentKey) + 1)
                    } else {
                        if (tweet.value.tweet_volume) {
                            tweetWordMap.set(currentKey, tweet.value.tweet_volume)
                        }
                    }
                })
                setWordCloudValueList(getWordCloudValueList(tweetWordMap))
            } catch (err) {
                console.log(err)
            }
        }
        fetchTweets();
    }, []);

    return (
        <PageTransition>
            {
                wordCloudValueList.length > 0
                    ?
                    <WordCloud words={wordCloudValueList} title={"What are people talking about lately?"} />
                    :
                    <LoadingSpinner />
            }
        </PageTransition>
    )
};

export default TwitterTrends;