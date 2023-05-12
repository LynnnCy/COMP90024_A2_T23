import { useEffect, useState } from "react";
import MapBoxVisualisation from "../Components/MapBoxVisualisation";
import PageTransition from '../Components/PageTransition';
import LoadingSpinner from '../Components/LoadingSpinner';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, Row } from "react-bootstrap";

const GeoInfoMap = () => {
    const [data, setData] = useState(null);
    const [currentFeature, setCurrentFeature] = useState('tweet_counts');
    useEffect(() => {
        setData(import('../sudo_vic_lga_attributes.json'))
    }, []);

return (
    <PageTransition>
        <Container>
            <Row>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Feature
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleDropdownClick("tweet_counts", setCurrentFeature)}>Tweet Counts</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDropdownClick("total_crime_offences_count", setCurrentFeature)}>{"Total crime offences count"}</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDropdownClick("affected_family_members_rate_per_100k_2017_18", setCurrentFeature)}>{"Affected family members rate per 100k (2017-18)"}</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDropdownClick("estimated resident population - total(no.)", setCurrentFeature)}>{"Estimated resident population - total(no.)"}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            <Row style={{margin: "2rem"}}>
                {data !== null ? <MapBoxVisualisation currentFeature={currentFeature} data={data} /> : <LoadingSpinner />}
            </Row>
        </Container>
    </PageTransition>
);
}

const handleDropdownClick = (value, callback) => {
    callback(value);
}

export default GeoInfoMap;