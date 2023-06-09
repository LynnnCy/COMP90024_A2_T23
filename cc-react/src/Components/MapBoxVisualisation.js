/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapboxgl-legend/dist/style.css';
import Table from 'react-bootstrap/Table';
import { Row } from 'react-bootstrap';

const MapBoxVisualisation = ({ data, currentFeature, currentDataLabel: currentFeatureLabel }) => {
    const mapContainerRef = useRef(null);
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWhheWF0IiwiYSI6ImNsaGJ1OWdlZjB1bnQza28xMXFyanRsYmoifQ.xCFO6dYDz52Flm3XKx3tUw';
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [144.9631, -36.8136],
            zoom: 5.5
        });
        map.scrollZoom.disable();
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-right');

        map.on('load', () => {
            // Calculate class breaks based on the range of density values
            const featureName = currentFeature
            const classBreaks = getClassBreaks(data, featureName);

            map.addSource('density-data', {
                type: 'geojson',
                data: data
            });

            let reversedColours = currentFeature.toLowerCase().includes('positive') ? true : false;
            const colors = getAllColors(classBreaks, reversedColours)
            
            map.addLayer({
                id: 'density-layer',
                type: 'fill',
                source: 'density-data',
                paint: {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', featureName],
                        classBreaks[0],
                        colors[0],
                        classBreaks[1],
                        colors[1],
                        classBreaks[2],
                        colors[2],
                        classBreaks[3],
                        colors[3],
                        classBreaks[4],
                        colors[4],
                        classBreaks[5],
                        colors[5],
                        classBreaks[6],
                        colors[6],
                    ],
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'black'
                },
                filter: ['==', '$type', 'Polygon']
            });

            map.on('click', 'density-layer', (e) => {
                if (e.features.length > 0) {
                    const feature = e.features[0];
                    const coordinates = e.lngLat;
                    const description =
                        `<strong>Place name: ${feature.properties.lga_name} <br>
                            Population Density (person/km2): ${feature.properties["population density (persons/km2)"]} <br>
                            Median Age: ${feature.properties["median age"]} <br>
                            Annual Median Income (AUD): ${feature.properties['median_aud_2017_18']} <br>
                            Unemployment Rate (sep 21): ${feature.properties['unemployment rate (sep 21)']} <br>
                            Mortgage Stress %: ${feature.properties['Mortgage stress %']} <br>
                            Full time participation in Secondary School Education at age 16: ${feature.properties['full time participation in Secondary School Education at age 16']} <br>
                            Total Crime Offences Count: ${feature.properties['total_crime_offences_count']} <br>
                            Total Medical Practitioners % Per 100,000: ${feature.properties['total medical practitioners % per 100,000']} <br>
                            Total Tweet Count: ${feature.properties['total_tweet_count']} <br>
                            Total Positive Tweet Count: ${feature.properties['positive_tweet_count']} <br>
                            ${currentFeatureLabel}: ${feature.properties[currentFeature]} <br>
                            </strong>`;

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(map);
                }
            });
            const legend = document.createElement('div');
            legend.className = 'mapboxgl-ctrl';
            legend.style.maxWidth = '46rem';
            legend.innerHTML = `
                    <div style="background-color:rgba(255, 255, 255, 0.8);; padding: 1rem">
                        <div style="background-color: ${colors[0]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 1</span>
                        <div style="background-color: ${colors[1]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 2</span>
                        <div style="background-color: ${colors[2]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 3</span>
                        <div style="background-color: ${colors[3]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 4</span>
                        <div style="background-color: ${colors[4]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 5</span>
                        <div style="background-color: ${colors[5]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 6</span>
                        <div style="background-color: ${colors[6]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 7</span>
                        <div style="background-color: ${colors[7]}; width: 20px; height: 20px; display: inline-block;"></div>
                    </div>
                    `;
            if (document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].childNodes.length === 0) {
                document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].appendChild(legend)
            }
        });

        return () => map.remove();
    })
    let classBreaks = data !== null ? getClassBreaks(data, currentFeature) : []
    return (
        <>
            <div ref={mapContainerRef} style={{ width: '100%', height: '50vh' }}></div>
            <Row style={{ marginTop: "2rem" }}>
                <h3><u>Map Class Values</u></h3>
                {data !== null
                    ? <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Value(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classBreaks.map((classBreak, index) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td> {index === classBreaks.length - 1 ? `Greater than ${Math.trunc(classBreak)}` : `Values between ${Math.trunc(classBreak)} to ${Math.trunc(classBreaks[index + 1])}`}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    : null}

            </Row>
        </>
    );
};

const getColor = (value, max, min, reversed) => {
    //value from 0 to 1
    let colorValue = (value - min) / (max - min)
    let hue = reversed ? ((colorValue) * 120).toString(10) : ((1 - colorValue) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

const getAllColors = (classBreaks, reversed) => {
    let colors = []
    for (let index = 0; index < classBreaks.length; index++) {
        colors[index] = getColor(classBreaks[index], classBreaks[classBreaks.length - 1], classBreaks[0], reversed)
    }
    return colors;
}

const getClassBreaks = (data, featureName) => {
    let densityValues = new Set();
    data.features.forEach((feature, index) => {
        if (feature.properties[featureName] === undefined) {
            console.log(data.features[index].properties[featureName])
            data.features[index].properties[featureName] = 0
            console.log(data.features[index].properties[featureName])
        }
        densityValues.add(feature.properties[featureName])
    });
    densityValues.delete(NaN)
    const minDensity = Math.min(...densityValues);
    let maxDensity = Math.max(...densityValues);
    // console.log("densityValues", densityValues)
    // console.log("minDensity", minDensity)
    // console.log("maxDensity", maxDensity)
    if (maxDensity > 1000 && minDensity > 0) {
        //Move very large values to the end of the spectrum
        while (maxDensity / minDensity >= 500) {
            densityValues.delete(maxDensity)
            maxDensity = Math.max(...densityValues);
        }
    }

    const range = maxDensity - minDensity;
    const classBreaks = [
        minDensity,
        minDensity + range * 0.166,
        minDensity + range * 0.332,
        minDensity + range * 0.498,
        minDensity + range * 0.664,
        minDensity + range * 0.83,
        maxDensity
    ];
    return classBreaks;
}

export default MapBoxVisualisation;
