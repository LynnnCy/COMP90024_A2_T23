/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { processPropertyKey } from '../StringUtil'
import { Row } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import ErrorModal from "../Components/ErrorModal";

const ChartComponent = () => {
    const [barChartSource, setBarChartSource] = useState('twitter')
    const [fetchedData, setFetchedData] = useState(null);
    const [barChartData, setBarChartData] = useState(null)
    const [errorModalVisible, setErrorModalVisible] = useState(false)
    useEffect(() => {
        // console.log(fetchedData)
        let fetchUrl = barChartSource === 'twitter' ? 'http://172.26.130.99:8080/bar_chart_data' : 'http://172.26.130.99:8080/chart_data_mastodon';
        if (fetchedData === null) {
            fetch(fetchUrl).then(respData => {
                respData.json().then(respJson => {
                    setFetchedData(respJson);
                    if (fetchedData === null) {
                        setFetchedData(respJson);
                        let data = []
                        respJson.series.forEach((curr) => {
                            let dataObject = {
                                "name": processPropertyKey(processPropertyKey(curr.name).replace("Wna:", ""))
                            }
                            respJson.xAxis[0].data.forEach((prop, index) => {
                                dataObject[processPropertyKey(prop)] = curr.data[index]
                            })
                            // data.push({ "name": processPropertyKey(curr.name), "amusement": curr.data[0], "awe": curr.data[1], "joy": curr.data[2] })
                            data.push(dataObject)
                        })
                        setBarChartData(data)
                    }
                }).catch(err => {
                    setErrorModalVisible(true)
                })
            }).catch(err => {
                setErrorModalVisible(true)
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
                        <div className='text-center'>
                            <span>Y-Axis: <em><strong>Topic % in Each Emotion</strong></em></span><span>{" | "}X-Axis: <em><strong>Emotion Type</strong></em></span>
                        </div>
                        <ResponsiveContainer width="95%" height={650}>
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={processPropertyKey("sports")} fill="#FF6F61" />
                                <Bar dataKey={processPropertyKey("diaries_&_daily_life")} fill="#70C1B3" />
                                <Bar dataKey={processPropertyKey("news_&_social_concern")} fill="#Feb236" />
                                <Bar dataKey={processPropertyKey("music")} fill="green" />
                                {/* {"celebrity_&_pop_culture", "film_tv_&_video", "music"} */}

                                {
                                    barChartSource === 'twitter'
                                        ? <>
                                            <Bar dataKey={processPropertyKey("film_tv_&_video")} fill="indigo" />
                                            <Bar dataKey={processPropertyKey("celebrity_&_pop_culture")} fill="brown" />
                                        </>
                                        : null
                                }
                                {
                                    barChartSource === 'mastadon' ?
                                        <>
                                            <Bar dataKey={processPropertyKey("arts_&_culture")} fill="gray" />
                                            <Bar dataKey={processPropertyKey("other_hobbies")} fill="navy" />
                                        </>
                                        : null
                                }

                            </BarChart>
                        </ResponsiveContainer>

                    </>
                    : null
            }
            <ErrorModal visible={errorModalVisible} setVisible={setErrorModalVisible} />
        </div>

    );
};

export default ChartComponent;
