function draw(name, dateArr, dataArr, kdaArr) {
    var ctx = document.getElementById(name);
    var myLineChart = new Chart(ctx, {
        data: {
            xLabels: dateArr,
            yLabels: ['Remake', 'Victory', 'Defeat'],
            datasets: [{
                type: 'line',
                label: "Game",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: dataArr,
                spanGaps: false,
            }, {
                yAxisID: "y-axis-2",
                type: 'line',
                label: 'KDA',
                fill: false,
                lineTension: 0.1,
                data: kdaArr,
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        //labelString: 'Time'
                    }
                }],
                yAxes: [{
                    type: 'category',
                    position: 'left',
                    display: true,
                }, {
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                }]
            }
        }
    });
}