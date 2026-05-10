"use client";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Chart } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler,zoomPlugin);

ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
export default function T1P4_Cumulative({ data }) {
    const chartRawData = data?.tab1?.part3; 
    if (!chartRawData) return null;
    const keys = Object.keys(chartRawData);
    const labels = keys.map(key => chartRawData[key].name_s);

    let runningTotal = 0;
    const monthlyTotals = [];
    const cumulativeData = [];

    keys.forEach(key => {
        const monthTotal = chartRawData[key].total_per_month || 0;
        runningTotal += monthTotal;
        
        monthlyTotals.push(monthTotal); 
        cumulativeData.push(runningTotal); 
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

    const options = {
        responsive: true,
        maintainAspectRatio: false,
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
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สถิติเรียกรายงานตัวรายเดือนรวมและยอดสะสม</h3>
                <div className="h-[370px] w-full">
                    <Chart type="bar" data={chartData} options={options} />
                </div>
        </motion.div>
    );
}
