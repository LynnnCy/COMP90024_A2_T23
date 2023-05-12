import React, { useEffect, useState } from 'react';
import WordCloud from '../Components/WordCloud';
const Today = () => {
    const [tweets, setTweets] = useState([]);
    useEffect(() => {
        async function fetchTweets() {
            try {
                const response = await fetch('http://localhost:3000/trendingTopics');
                const data = await response.json()
                const tweetMap = new Map()
                data.forEach(tweet => {
                    tweetMap.set(tweet.value.name.trim(), tweet)
                })
                setTweets(Array.from(tweetMap.values()));
            } catch (err) {
                console.log(err)
            }
        }
        fetchTweets();
    }, []);

    return (
        <WordCloud tweets={tweets} height={"20rem"} title={"What are people talking about today?"}></WordCloud>
    )
};

export default Today;