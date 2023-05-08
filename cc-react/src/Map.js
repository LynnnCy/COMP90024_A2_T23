import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapboxgl-legend/dist/style.css';

const data = import('./sudo_vic_lga_attributes.json')

const Map = () => {
    const mapContainerRef = useRef(null);
    const [hoverInfo, setHoverInfo] = useState(null);
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWhheWF0IiwiYSI6ImNsaGJ1OWdlZjB1bnQza28xMXFyanRsYmoifQ.xCFO6dYDz52Flm3XKx3tUw';
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [144.9631, -37.8136],
            zoom: 6
        });
        map.scrollZoom.disable();

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
                            'lime',
                            classBreaks[1],
                            'green',
                            classBreaks[2],
                            'yellow',
                            classBreaks[3],
                            'orange',
                            classBreaks[4],
                            'red',
                            classBreaks[5],
                            'pink',
                            classBreaks[6],
                            'purple',
                            classBreaks[7],
                            'skyblue',
                            classBreaks[8],
                            'blue',
                            classBreaks[9],
                            'navy',
                        ],
                        'fill-opacity': 0.7
                    },
                    filter: ['==', '$type', 'Polygon']
                });

                map.on('click', 'density-layer', (e) => {
                    if (e.features.length > 0) {
                        if (hoverInfo) {
                            setHoverInfo(null);
                        }
                        const feature = e.features[0];
                        console.log(feature.properties[featureName])
                        setHoverInfo(feature.properties[featureName]);
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
            });

            return () => map.remove();
        })
    }, []);

    return (
        <>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
        </>
    );
};

export default Map;
