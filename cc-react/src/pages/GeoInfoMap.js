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
        fetch('http://172.26.130.99:8080/getGeoData').then(respData => {
            respData.json().then(respJson => {
                processData(respJson)
                if (data === null) {
                    setData({
                        "type": "FeatureCollection",
                        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4283" } },
                        "features": respJson
                    })
                    let tempKeys = [];
                    for (let key in respJson[0].properties) {
                        tempKeys.push(key)
                    }
                    setPropertyKeys(tempKeys)
                }
            })
        })
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

const processData = (data) => {
    data.forEach((feature, index) => {
        for (let key in feature.properties) {
            if (key !== 'lga_code' && key !== 'lga_name') {
                feature.properties[key] = parseInt(feature.properties[key])
            }
        }
        data[index] = feature
    })
}

export default GeoInfoMap;