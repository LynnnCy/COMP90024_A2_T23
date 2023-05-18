import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';


const ChartComponent = () => {
    const [fetchedData, setFetchedData] = useState(null);
    const [barChartData, setBarChartData] = useState(null)
    useEffect(() => {
        fetch('http://172.26.130.99:8080/bar_chart_data').then(respData => {
            respData.json().then(respJson => {
                setFetchedData(respJson);
                if (fetchedData === null) {
                    setFetchedData(respJson);
                    let data = []
                    respJson.series.forEach(curr => {
                        data.push({ "name": curr.name, "amusement": curr.data[0], "awe": curr.data[1], "joy": curr.data[2] })
                    })
                    setBarChartData(data)
                }
            })
        })
    })

    return (
        barChartData !== null
            ? <BarChart width={1080} height={650} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amusement" fill="#8884d8" />
                <Bar dataKey="awe" fill="#82ca9d" />
                <Bar dataKey="joy" fill="#82ca9d7" />
            </BarChart>
            : null
    );
};

export default ChartComponent;
