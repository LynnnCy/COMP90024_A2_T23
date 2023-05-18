import React, { useEffect, useState } from 'react';
// import WordCloud from '../Components/WordCloud';
import WordCloud from '../Components/WordCloud';
import PageTransition from '../Components/PageTransition';
import { getWordCloudValueList } from '../StringUtil'
import LoadingSpinner from '../Components/LoadingSpinner';

const Today = () => {
    const [wordCloudValueList, setWordCloudValueList] = useState([])
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
                        tweetWordMap.set(currentKey, 1)
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
            {/* <StaticWordCloud tweets={tweets} height={"20rem"} title={"What are people talking about today?"}></StaticWordCloud> */}
            {
                wordCloudValueList.length > 0
                    ?
                    <WordCloud words={wordCloudValueList} title={"What are people talking about today?"}/>
                    :
                    <LoadingSpinner />
            }
        </PageTransition>
    )
};

export default Today;