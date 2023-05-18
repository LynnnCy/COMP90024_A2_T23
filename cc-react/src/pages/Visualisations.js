import { Container, Dropdown } from 'react-bootstrap';
import Barchart from '../Components/Barchart';
import ScatterPlot from '../Components/ScatterPlot';
import { useState } from 'react';

const Visualisations = () => {
    const features = ["median age", "median income", "Mortgage stress %",
        "medical resource", "unemployment rate", "education_level",
        "total medical practitioners %", "crime offences count"]
    const [currentScatterFeature, setCurrentScatterFeature] = useState("median income")

    return (<Container>
        <Barchart />
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Feature
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {features.map(feature => {
                    return <Dropdown.Item onClick={() => setCurrentScatterFeature(feature)}>{feature}</Dropdown.Item>
                })
                }
            </Dropdown.Menu>
        </Dropdown>
        <ScatterPlot attributeName={currentScatterFeature} />
    </Container>)
};

export default Visualisations;