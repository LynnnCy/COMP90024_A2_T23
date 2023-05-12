import { Container } from 'react-bootstrap';
import TagCloud from 'react-tag-cloud';

const WordCloud = ({ tweets }) => {
    const tagCloudStyles = {
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <Container className="my-5">
            <h1 style={{ textAlign: 'center' }} className="mb-4">What are people talking about?</h1>
            <TagCloud style={{ width: '100%', height: '50rem' }} className="tag-cloud">
                {tweets !== null ? tweets.map((tweet) => {
                    const name = tweet.value.name;
                    return (<div key={tweet.id} style={tagCloudStyles}>
                        <span>{name}</span>
                    </div>)
                }
                ) : null}
            </TagCloud>
        </Container>
    )
}

export default WordCloud;