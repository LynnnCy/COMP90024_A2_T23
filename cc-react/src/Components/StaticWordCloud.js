/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import { Container } from 'react-bootstrap';
import TagCloud from 'react-tag-cloud';

const StaticWordCloud = ({ tweets, height, title }) => {
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
            <h1 style={{ textAlign: 'center' }} className="mb-4">{title ? title : 'What are people talking about?'}</h1>
            <TagCloud style={{ width: '100%', height: height ? height : '50rem' }} className="tag-cloud">
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

export default StaticWordCloud;