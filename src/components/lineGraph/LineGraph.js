import React, { useEffect, useState } from 'react'
import { Line } from "react-chartjs-2"
import numeral from "numeral"

 const options = {
    legend: {
        display: false,
    }, 
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

const buildChartData = (data, casesType = 'cases') => {
    const chartData = [];
    let lastDataPoint;
    for(let date in data.cases) {
        if(lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            }
           chartData.push(newDataPoint); 
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}

function LineGraph({ casesType = 'cases'}) {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
            
                console.log(data);
                const chartData = buildChartData(data, 'cases');
                setData(chartData);
            })
        }
        fetchData();   
    }, [casesType]);

   
    return (
        <div>
            <h2>Worldwide new Cases</h2>
            {/* Optional chaining - it basically checks that the data even exists 
            and if it doesn't then it returns the whole thing as undefined 
            Before you have to write {data && data.length} */}
            {data?.length > 0 && (
                <Line 
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgroundColor: "rgba(204, 16, 53, 0.3)",
                                borderColor: "#CC1034",
                                data: data,
                            }
                        ]
                    }}
                />
            )}
            
        </div>
    )
}

export default LineGraph
