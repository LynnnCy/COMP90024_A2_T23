import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';

const  App = () => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    async function fetchTweets() {
      const data = [];
      // setTweets(data);
    }
    // fetchTweets();
    setTweets(['this is a test', 'this is another test', "this is quite nice actually",])
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
      <h1 style={{textAlign: 'center'}} className="mb-4">Trending Words</h1>
      <TagCloud style={{ width: '100%', height: '400px' }} className="tag-cloud">
        {tweets.map((tweet) =>
          tweet.split(' ').map((word) => (
            <div key={word} style={tagCloudStyles}>
              {word}
            </div>
          ))
        )}
      </TagCloud>
    </Container>
  );
}

export default App;
