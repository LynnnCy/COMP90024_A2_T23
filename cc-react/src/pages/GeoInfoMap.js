import { useEffect, useState } from "react";
import MapBoxVisualisation from "../Components/MapBoxVisualisation";
import PageTransition from '../Components/PageTransition';
import LoadingSpinner from '../Components/LoadingSpinner';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, Row } from "react-bootstrap";

const GeoInfoMap = () => {
    const [data, setData] = useState(null);
    const [currentFeature, setCurrentFeature] = useState('tweet_counts');
    const [propertyKeys, setPropertyKeys] = useState([]);
    useEffect(() => {
        if (data === null) {
            import('../sudo_vic_lga_attributes.json').then(data => {
                setData(data)
                let tempKeys = [];
                for (let key in data.features[0].properties) {
                    tempKeys.push(key)
                }
                setPropertyKeys(tempKeys);
            })
        }
    }, [data, setPropertyKeys]);

    return (
        <PageTransition>
            {data !== null
                ? <Container>
                    <Row>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Feature
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {propertyKeys.length > 0
                                    ? propertyKeys.map(key => {
                                        return <Dropdown.Item onClick={() => handleDropdownClick(key, setCurrentFeature)}>{key}</Dropdown.Item>
                                    })
                                    : null
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Row>
                    <Row style={{ margin: "2rem" }}>
                        <MapBoxVisualisation currentFeature={currentFeature} data={data} />
                    </Row>
                </Container>
                : <LoadingSpinner />}

        </PageTransition>
    );
}

const handleDropdownClick = (value, callback) => {
    callback(value);
}

export default GeoInfoMap;