import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapboxgl-legend/dist/style.css';



const MapBoxVisualisation = ({data}) => {
    const mapContainerRef = useRef(null);
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWhheWF0IiwiYSI6ImNsaGJ1OWdlZjB1bnQza28xMXFyanRsYmoifQ.xCFO6dYDz52Flm3XKx3tUw';
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [144.9631, -37.8136],
            zoom: 6
        });
        map.scrollZoom.disable();
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'top-right');

        map.on('load', () => {
            data.then((data) => {
                // Calculate class breaks based on the range of density values
                const featureName = 'tweet_counts'
                let densityValues = new Set();
                data.features.forEach((feature) => {
                    densityValues.add(feature.properties[featureName])
                });
                const minDensity = Math.min(...densityValues);
                let maxDensity = Math.max(...densityValues);
                //Move very large values to the end of the spectrum
                while (maxDensity / minDensity >= 500) {
                    densityValues.delete(maxDensity)
                    maxDensity = Math.max(...densityValues);
                }

                const range = maxDensity - minDensity;
                const classBreaks = [
                    minDensity,
                    minDensity + range * 0.1,
                    minDensity + range * 0.2,
                    minDensity + range * 0.3,
                    minDensity + range * 0.4,
                    minDensity + range * 0.5,
                    minDensity + range * 0.6,
                    minDensity + range * 0.7,
                    minDensity + range * 0.8,
                    minDensity + range * 0.9,
                    maxDensity
                ];


                map.addSource('density-data', {
                    type: 'geojson',
                    data: data
                });

                const colors = getAllColors(classBreaks)

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
                            classBreaks[7],
                            colors[7],
                            classBreaks[8],
                            colors[8],
                            classBreaks[9],
                            colors[9],
                        ],
                        'fill-opacity': 0.7
                    },
                    filter: ['==', '$type', 'Polygon']
                });

                map.on('click', 'density-layer', (e) => {
                    if (e.features.length > 0) {
                        const feature = e.features[0];
                        const coordinates = e.lngLat;
                        const description =
                            `<strong>Place name: ${feature.properties.lga_name} <br>
                            Affected family members rate per 100k 2017-18: ${feature.properties["affected_family_members_rate_per_100k_2017_18"]} <br>
                            Total Crime Offences Count: ${feature.properties.total_crime_offences_count} <br>
                            Median Income 2017-18 (AUD): ${feature.properties.median_aud_2017_18} <br>
                            Mean Income 2017-18 (AUD): ${feature.properties.mean_aud_2017_18} <br>
                            Median age of earners 2017-18: ${feature.properties.median_age_of_earners_years_2017_18} <br>
                            Tweet Count: ${feature.properties.tweet_counts} <br>
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
                    <div style="background-color: white; padding: 1rem">
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
                        <span>Class 8</span>
                        <div style="background-color: ${colors[8]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 9</span>
                        <div style="background-color: ${colors[9]}; width: 20px; height: 20px; display: inline-block;"></div>
                        <span>Class 10</span>
                    </div>
                    `;
                if (document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].childNodes.length === 0) {
                    document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].appendChild(legend)
                }
            });

            return () => map.remove();
        })
    });

    return (
        <>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
        </>
    );
};

const getColor = (value, max, min) => {
    //value from 0 to 1
    let colorValue = (value - min) / (max - min)
    let hue = ((1 - colorValue) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

const getAllColors = (classBreaks) => {
    let colors = []
    for (let index = 0; index < classBreaks.length; index++) {
        colors[index] = getColor(classBreaks[index], classBreaks[classBreaks.length - 1], classBreaks[0])
    }
    return colors;
}

export default MapBoxVisualisation;