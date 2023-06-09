/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import React, { useEffect, useState } from 'react';
import WordCloud from '../Components/WordCloud';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Container, Row } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { processPropertyKey } from '../StringUtil'
import ErrorModal from "../Components/ErrorModal";

const TopicsOfInterest = () => {
    const [wordCloudValueList, setWordCloudValueList] = useState(null)
    const [twitterWordCloudValueList, setTwitterWordCloudValueList] = useState(null)
    const [mastadonWordCloudValueList, setMastadonWordCloudValueList] = useState(null)
    const [currentTopic, setCurrentTopic] = useState('news & social concern')
    const [currentDataSource, setCurrentDataSource] = useState('Twitter')
    const [errorModalVisible, setErrorModalVisible] = useState(false)
    const allTopics = ['news & social concern', 'diaries & daily life', 'sports', 'film tv & video & music', 'celebrity & pop culture']
    useEffect(() => {
        async function fetchTopics() {
            console.log(`http://172.26.130.99:3000/word_cloud/T_${currentTopic}`)
            try {
                const twitterResp = await fetch(`http://172.26.130.99:8080/word_cloud/T_${currentTopic}`);
                const twitterData = await twitterResp.json();
                setTwitterWordCloudValueList(twitterData)

                const mastadonResp = await fetch(`http://172.26.130.99:8080/word_cloud/M_${currentTopic}`);
                const mastadonData = await mastadonResp.json();
                setMastadonWordCloudValueList(mastadonData)

                // let allData = twitterData.concat(mastadonData) 
                currentDataSource === 'Twitter' ? setWordCloudValueList(twitterData) : setWordCloudValueList(mastadonData);
            } catch (err) {
                console.log(err)
                setErrorModalVisible(true)
            }
        }
        fetchTopics()
    }, [currentTopic, currentDataSource]);

    return (
        <>
            {
                wordCloudValueList !== null
                    ? wordCloudValueList.length > 0
                        ? <>
                            <Container>
                                <br />
                                <Row>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Change Data Source
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => { setWordCloudValueList(twitterWordCloudValueList); setCurrentDataSource('Twitter') }}>Twitter</Dropdown.Item>
                                            <Dropdown.Item onClick={() => { setWordCloudValueList(mastadonWordCloudValueList); setCurrentDataSource('Mastadon') }}>Mastadon</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Row>
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
                            <WordCloud words={wordCloudValueList} title={currentDataSource + ": " + processPropertyKey(currentTopic)} fontSizes={[25, 120]} /></>
                        : <h1 className='text-center'>No Words Available</h1>

                    :
                    <LoadingSpinner />
            }
            <br />
            <ErrorModal visible={errorModalVisible} setVisible={setErrorModalVisible} />
        </>
    )
};

export default TopicsOfInterest;