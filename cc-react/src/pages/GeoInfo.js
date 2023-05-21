import { useEffect, useState } from "react";
import MapBoxVisualisation from "../Components/MapBoxVisualisation";
import PageTransition from '../Components/PageTransition';
import LoadingSpinner from '../Components/LoadingSpinner';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, Row, Form } from "react-bootstrap";
import ScatterPlot from "../Components/ScatterPlot";
import { processPropertyKey } from '../StringUtil'

const GeoInfo = () => {
    //Map Related State
    const [mapData, setMapData] = useState(null);
    const [currentMapFeature, setCurrentMapFeature] = useState('positive_tweet_percentage');
    const [mapPropertyKeys, setMapPropertyKeys] = useState([]);
    const [currentMapFeatureLabel, setCurrentMapFeatureLabel] = useState(processPropertyKey(currentMapFeature));
    //Scatter Related State
    const scatterFeatures = ["median income", "median age", "mortgage stress %", "unemployment rate", "education level",
        "total medical practitioners % per 100,000", "crime offences count", "population density"]
    const [currentScatterFeature, setCurrentScatterFeature] = useState("median income")
    useEffect(() => {
        fetch('http://172.26.130.99:8080/getGeoData').then(respData => {
            respData.json().then(respJson => {
                processData(respJson)
                if (mapData === null) {
                    setMapData({
                        "type": "FeatureCollection",
                        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4283" } },
                        "features": respJson
                    })
                    let tempKeys = [];
                    for (let key in respJson[0].properties) {
                        if (key !== 'lga_code' && key !== 'lga_name') {
                            tempKeys.push(key)
                        }
                    }
                    setMapPropertyKeys(tempKeys)
                }
            })
        })
    }, [mapData, setMapPropertyKeys]);

    return (
        <PageTransition>
            <Container>
                <br />
                <h1>SUDO Geographical Data</h1>
                <br />
                {/* Map */}
                {
                    mapData !== null
                        ? <>
                            <Row>
                                <Form.Label><strong>{"Map Attribute: "}</strong>{processPropertyKey(currentMapFeature)}</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Change Map Attribute
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {mapPropertyKeys.length > 0
                                            ? mapPropertyKeys.map(key => {
                                                return <Dropdown.Item onClick={() => handleDropdownClick(key, setCurrentMapFeature, setCurrentMapFeatureLabel)}>{processPropertyKey(key)}</Dropdown.Item>
                                            })
                                            : null
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row style={{ margin: "2rem" }}>
                                <MapBoxVisualisation currentFeature={currentMapFeature} data={mapData} currentDataLabel={currentMapFeatureLabel} />
                            </Row>
                        </>
                        : <LoadingSpinner />
                }
                {/* Scatter */}
                <hr/>
                {
                    <Row>
                        <Form.Label>{<strong>Scatter Attribute: </strong>}{processPropertyKey(currentScatterFeature)}</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Change Scatter Attribute
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {scatterFeatures.map(feature => {
                                    return <Dropdown.Item onClick={() => setCurrentScatterFeature(feature)}>{processPropertyKey(feature)}</Dropdown.Item>
                                })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <ScatterPlot attributeName={currentScatterFeature} />
                    </Row>
                }
            </Container>


        </PageTransition>
    );
}

const handleDropdownClick = (value, setCurrentFeature, setCurrentFeatureLabel) => {
    setCurrentFeature(value);
    setCurrentFeatureLabel(processPropertyKey(value))
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

export default GeoInfo;