"use client";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Chart } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { TrendingUp } from 'lucide-react';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, zoomPlugin);
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
export default function T1P4_Cumulative({ data }) {
    if (!data) return <LoadingScreen />;
    const chartRawData = data?.tab1?.part3;
    if (!chartRawData) return null;

    const keys = Object.keys(chartRawData);
    const labels = keys.map(key => chartRawData[key].label_th_s);

    let runningTotal = 0;
    const monthlyTotals = [];
    const cumulativeData = [];

    keys.forEach(key => {
        const monthData = chartRawData[key];
        const monthTotal = monthData.total_per_month || 0;
        const isCalled = monthData.call_status;
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
                yAxisID: 'y1',
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
        spanGaps: true,
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { font: { family: "'Kanit', sans-serif", size: 14 } }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
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
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                ticks: { callback: (value) => value.toLocaleString() + ' อัตรา' }
            },
            y1: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                ticks: { callback: (value) => value.toLocaleString() + ' อัตรา' }
            }
        },
    };
    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div>
                <h3 className="flex text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                    <TrendingUp />
                    <span className="ml-2">สถิติการเรียกบรรจุรายเดือนและยอดสะสม</span>
                </h3>
                <div className="h-[370px] w-full">
                    <Chart type="bar" data={chartData} options={options} />
                </div>
            </div>
        </motion.div>
    );
}
