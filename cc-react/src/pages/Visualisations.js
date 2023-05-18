import { Container } from 'react-bootstrap';
import Barchart from '../Components/Barchart';
import PageTransition from '../Components/PageTransition';

const Visualisations = () => {
    return (
        <PageTransition>
            <Container>
                <Barchart />
            </Container>
        </PageTransition>
    )
};

export default Visualisations;