import React, { useEffect, useState } from 'react';
import WordCloud from '../Components/WordCloud';
import PageTransition from '../Components/PageTransition';
const Home = () => {
    const [tweets, setTweets] = useState([]);
    useEffect(() => {
        async function fetchTweets() {
            try {
                const response = await fetch('http://localhost:3000/recentTopics');
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
        <PageTransition>
            <WordCloud tweets={tweets}></WordCloud>
        </PageTransition>
    )
};

export default Home;