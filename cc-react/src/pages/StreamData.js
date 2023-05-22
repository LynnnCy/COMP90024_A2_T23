import { useEffect, useState } from 'react';
import { Container, Row, Form, FormGroup, Button } from "react-bootstrap";
import { Input } from 'reactstrap';
import LoadingSpinner from '../Components/LoadingSpinner';
import PageTransition from '../Components/PageTransition';

const StreamData = () => {
    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentData, setCurrentData] = useState(null)
    useEffect(() => {
        fetch(`http://localhost:3000/streamData?username=${currentUserName}`).then(respData => {
            respData.json().then(respJson => {
                setCurrentData(respJson)
            })
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
        fetch(`http://localhost:3000/streamData?username=${currentUserName}`).then(respData => {
            respData.json().then(respJson => {
                setCurrentData(respJson)
            })
        })
    })
    return (
        <PageTransition>
            <Container>
                <h1>Stream Latest Data from Twitter User</h1>
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