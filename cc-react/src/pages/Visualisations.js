/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import { Container } from 'react-bootstrap';
import Barchart from '../Components/Barchart';
import TopicsOfInterest from '../Components/TopicsOfInterest';
import PageTransition from '../Components/PageTransition';

const Visualisations = () => {
    return (
        <PageTransition>
            <Container>
                <TopicsOfInterest/>
                <hr/>
                <Barchart />
            </Container>
        </PageTransition>
    )
};

export default Visualisations;