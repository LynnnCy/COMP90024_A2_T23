import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import WordCloud from '../Components/WordCloud';
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
        <WordCloud tweets={tweets}></WordCloud>
    )
};

export default Home;