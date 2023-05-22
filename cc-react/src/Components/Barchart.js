import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { processPropertyKey } from '../StringUtil'
import { Row } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';

const ChartComponent = () => {
    const [barChartSource, setBarChartSource] = useState('twitter')
    const [fetchedData, setFetchedData] = useState(null);
    const [barChartData, setBarChartData] = useState(null)
    useEffect(() => {
        console.log('rendering')
        let fetchUrl = barChartSource === 'twitter' ? 'http://localhost:8080/bar_chart_data' : 'http://localhost:8080/chart_data_mastodon';
        if (fetchedData === null) {
            fetch(fetchUrl).then(respData => {
                respData.json().then(respJson => {
                    setFetchedData(respJson);
                    if (fetchedData === null) {
                        setFetchedData(respJson);
                        let data = []
                        respJson.series.forEach(curr => {
                            data.push({ "name": processPropertyKey(curr.name), "amusement": curr.data[0], "awe": curr.data[1], "joy": curr.data[2] })
                        })
                        setBarChartData(data)
                    }
                })
            })
        }
    }, [barChartSource, barChartData, fetchedData])

    return (
        <div>
            {
                barChartData !== null
                    ? <>
                        <Row>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Change Data Source
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => {
                                        setBarChartSource('twitter')
                                        setFetchedData(null)
                                    }}>Twitter</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        setBarChartSource('mastadon')
                                        setFetchedData(null)
                                    }}>Mastadon</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Row>
                        <h1 className="text-center">{barChartSource === 'twitter' ? "Twitter: " : "Mastadon: "}{"Emotion Data Statistics"}</h1>
                        <BarChart width={1080} height={650} data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amusement" fill="#FF6F61" />
                            <Bar dataKey="awe" fill="#70C1B3" />
                            <Bar dataKey="joy" fill="#Feb236" />
                        </BarChart>
                    </>
                    : null
            }
        </div>

    );
};

export default ChartComponent;
