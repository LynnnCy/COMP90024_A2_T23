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