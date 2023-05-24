/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import React, { useEffect, useState } from 'react';
// import WordCloud from '../Components/WordCloud';
import WordCloud from '../Components/WordCloud';
import PageTransition from '../Components/PageTransition';
import { getWordCloudValueList } from '../StringUtil'
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorModal from "../Components/ErrorModal";

const Today = () => {
    const [wordCloudValueList, setWordCloudValueList] = useState([])
    const [errorModalVisible, setErrorModalVisible] = useState(false)
    useEffect(() => {
        async function fetchTweets() {
            try {
                const response = await fetch('http://172.26.130.99:3000/trendingTopics');
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
                setErrorModalVisible(true)
                console.log(err)
            }
        }
        fetchTweets();
    }, []);

    return (
        <PageTransition>
            {/* <StaticWordCloud tweets={tweets} height={"20rem"} title={"What are people talking about today?"}></StaticWordCloud> */}
            {
                wordCloudValueList.length > 0
                    ?
                    <WordCloud words={wordCloudValueList} title={"What are people talking about today?"} />
                    :
                    <LoadingSpinner />
            }
            <ErrorModal visible={errorModalVisible} setVisible={setErrorModalVisible} />
        </PageTransition>
    )
};

export default Today;