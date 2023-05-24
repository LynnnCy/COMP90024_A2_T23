/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import { useEffect, useState } from 'react';
import { Container, Row, Form, FormGroup, Button } from "react-bootstrap";
import { Input } from 'reactstrap';
import LoadingSpinner from '../Components/LoadingSpinner';
import PageTransition from '../Components/PageTransition';
import ErrorModal from "../Components/ErrorModal";

const StreamData = () => {
    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentData, setCurrentData] = useState(null)
    const [errorModalVisible, setErrorModalVisible] = useState(false)
    useEffect(() => {
        fetch(`http://172.26.130.99:3000/streamData?username=${currentUserName}`).then(respData => {
            respData.json().then(respJson => {
                setCurrentData(respJson)
            }).catch(err => {
                setErrorModalVisible(true)
            })
        }).catch(err => {
            setErrorModalVisible(true)
        })
    }, [currentUserName])
    const renderStream = () => {
        return currentData.map(data => {
            return (
                <li>
                    <div>
                        <p><strong>{data.value.username}: </strong>{data.value.text}</p>
                    </div>
                </li>

            )
        })
    }
    const updateData = (() => {
        fetch(`http://172.26.130.99:3000/streamData?username=${currentUserName}`).then(respData => {
            respData.json().then(respJson => {
                setCurrentData(respJson)
            }).catch(err => {
                setErrorModalVisible(true)
            })
        }).catch(err => {
            setErrorModalVisible(true)
        })
    })
    return (
        <PageTransition>
            <Container>
                <h1>Stream Latest Data from Twitter User</h1>
                <ErrorModal visible={errorModalVisible} setVisible={setErrorModalVisible} />
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    setCurrentUserName(e.target[0].value.replaceAll('@', ''))
                }}>
                    <FormGroup>
                        <br />
                        <label for="username">Enter Twitter username here:</label>
                        <Input id='username' placeholder="e.g. enter @elonmusk and hit submit" /> <br />
                        <Button type='submit'>Submit</Button>{" "}
                        <Button type='submit' onClick={updateData}>Refresh Data</Button>
                    </FormGroup>
                    <br />
                    <Row>
                        {
                            currentData === null
                                ? <LoadingSpinner />
                                : <ul>{renderStream()}</ul>
                        }
                    </Row>
                </Form>
            </Container>
        </PageTransition>
    )
};


export default StreamData;