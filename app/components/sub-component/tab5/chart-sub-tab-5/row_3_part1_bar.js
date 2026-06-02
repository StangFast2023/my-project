
"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar }              from "react-chartjs-2";
import zoomPlugin           from 'chartjs-plugin-zoom';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, zoomPlugin);
export default function Row3Part1Bar({ data }) {
    const chartRawData = data?.chart_1_round;
    if (!chartRawData) return null;
    const keys   = Object.keys(chartRawData);
    const labels = keys.map(key => chartRawData[key].date_thai_s);
    let runningTotal = 0;
    const monthlyTotals = [];
    const cumulativeData = [];
    keys.forEach(key => {
        const monthData = chartRawData[key];
        const monthTotal = monthData.total_per_month || 0;
        const isCalled = monthData.call;
            runningTotal += monthTotal;
            monthlyTotals.push(monthTotal);
            if (isCalled === true) {
                cumulativeData.push(runningTotal);
            } else {
                cumulativeData.push(null);
            }
    });
    
    const chartData = {
        labels: labels,
        datasets: [
            {
                type: 'line',
                label: "ยอดสะสมทั้งหมด",
                data: cumulativeData,
                borderColor: "#10B981",
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: "#FFF",
                fill: false,
                order: 1 
            },
            {
                type: 'bar',
                label: "ยอดบรรจุรายเดือน",
                data: monthlyTotals,
                backgroundColor: "rgba(59, 130, 246, 0.6)",
                borderRadius: 6,
                order: 2 
            }
        ]
    };

    const optionsBar = {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true, 
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: { font: { family: "'Kanit', sans-serif", size: 14 } }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toLocaleString() + ' คน';
                        }
                        return label;
                    }
                }
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, 
                        modifierKey: 'ctrl',
                    },
                        pinch: {
                        enabled: true, 
                    },
                    mode: 'x', 
                },
                pan: {
                    enabled: true,
                    mode: 'x', 
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { font: { family: "'Kanit', sans-serif" } }
            },
            x: {
                grid: { display: false },
                ticks: { font: { family: "'Kanit', sans-serif" } }
            }
        }
    };
    return (
        <Bar data={chartData} options={optionsBar} />
    );
}