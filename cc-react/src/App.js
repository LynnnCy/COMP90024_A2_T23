import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';
import MapBoxVisualisation from './MapBoxVisualisation'

const App = () => {
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

  const tagCloudStyles = {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 5,
    color: () => randomColor({ hue: 'blue' }),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };


  return (
    <Container className="my-5">
      <h1 style={{ textAlign: 'center' }} className="mb-4">Trending Words</h1>
      <TagCloud style={{ width: '100%', height: '500px' }} className="tag-cloud">
        {tweets !== null ? tweets.map((tweet) => {
          const name = tweet.value.name;
          return (<div key={tweet.id} style={tagCloudStyles}>
            <span>{name}</span>
          </div>)
        }
        ) : null}
      </TagCloud>
      <MapBoxVisualisation/>
    </Container>
  );
}

export default App;
