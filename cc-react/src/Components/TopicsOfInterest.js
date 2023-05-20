import React, { useEffect, useState } from 'react';
import WordCloud from '../Components/WordCloud';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Container, Row } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { processPropertyKey } from '../StringUtil'
const TopicsOfInterest = () => {
    const [wordCloudValueList, setWordCloudValueList] = useState([])
    const [currentTopic, setCurrentTopic] = useState('news & social concern')
    const allTopics = ['news & social concern', 'diaries & daily life', 'sports', 'film tv & video & music', 'celebrity & pop culture']
    useEffect(() => {
        async function fetchTopics() {
            console.log(`http://172.26.130.99:3000/word_cloud/T_${currentTopic}`)
            try {
                const twitterResp = await fetch(`http://172.26.130.99:8080/word_cloud/T_${currentTopic}`);
                const twitterData = await twitterResp.json();

                const mastadonResp = await fetch(`http://172.26.130.99:8080/word_cloud/M_${currentTopic}`);

                const mastadonData = await mastadonResp.json();
                let allData = twitterData.concat(mastadonData)

                setWordCloudValueList(allData)
            } catch (err) {
                console.log(err)
            }
        }
        fetchTopics()
    }, [currentTopic]);

    return (
        <>
            <Container>
                <br />
                <Row>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Change Topic
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {allTopics.length > 0
                                ? allTopics.map(topic => {
                                    return <Dropdown.Item onClick={() => setCurrentTopic(topic)}>{processPropertyKey(topic)}</Dropdown.Item>
                                })
                                : null
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
            </Container>
            {
                wordCloudValueList.length > 0
                    ?
                    <WordCloud words={wordCloudValueList} title={processPropertyKey(currentTopic)} fontSizes={[25, 120]} />
                    :
                    <LoadingSpinner />
            }
            <br />
        </>
    )
};

export default TopicsOfInterest;