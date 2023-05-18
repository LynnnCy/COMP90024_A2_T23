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

const ScatterPlot = ({ attributeName }) => {
    console.log("attributeName", attributeName)
    const [dataForScatter, setDataForScatter] = useState(null);
    useEffect(() => {
        fetch(`http://172.26.130.99:8080/scatter_plot/${attributeName}`).then(resp => resp.json()).then(respJson => {
            // console.log(respJson)
            let processedData = []
            // if (dataForScatter === null) {
                respJson[attributeName].forEach(point => {
                    processedData.push({ x: point[0], y: point[1] })
                })
                setDataForScatter({
                    datasets: [
                        {
                            label: attributeName,
                            data: processedData,
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                        },
                    ],
                });
            // }
        })
    }, [attributeName, dataForScatter])
    let scatter = dataForScatter === null ? null : <>
        <Scatter options={options} data={dataForScatter} />
    </>
    return scatter;
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export default ScatterPlot;