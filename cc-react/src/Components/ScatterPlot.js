import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { processPropertyKey } from '../StringUtil'

const ScatterPlot = ({ attributeName }) => {
    const [dataForScatter, setDataForScatter] = useState(null);
    const [loading, setLoading] = useState(true)
    const FONT_LABEL_SIZE = 20
    useEffect(() => {
        setLoading(true)
        fetch(`http://172.26.130.99:8080/scatter_plot/${attributeName}`).then(resp => resp.json()).then(respJson => {
            setLoading(false)
            let processedData = []
            respJson[attributeName].forEach(point => {
                processedData.push({ x: point[0], y: point[1] })
            })
            setDataForScatter({
                datasets: [
                    {
                        label: processPropertyKey(attributeName),
                        data: processedData,
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                    },

                ],
            });
        }).catch(err => {
            alert(err)
            setLoading(false)
        })
    }, [attributeName])
    let options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Positive Tweet Percentage',
                    font: {
                        size: FONT_LABEL_SIZE,
                    },
                }
            },
            x: {
                title: {
                    display: true,
                    text: processPropertyKey(attributeName),
                    font: {
                        size: FONT_LABEL_SIZE,
                    },
                }
            }
        },
    };
    return loading
        ? <LoadingSpinner />
        :
        <Scatter display options={options} data={dataForScatter} />
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default ScatterPlot;