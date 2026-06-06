
"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);
export default function Row3Part2Pie({ data }) {
    const total_called = data?.total_called;
    const total_remain = data?.total_remain;
    const total_listed = data?.total_listed;
    if (!total_listed && !total_called && !total_remain) return null;

    const pieData = {
        labels: [" เรียกรายงานตัวแล้ว", " คงเหลือในบัญชี"],
        datasets: [
            {
                data: [total_called, total_remain],
                backgroundColor: [
                    "#10B981",
                    "#E5E7EB",
                ],
                hoverBackgroundColor: ["#059669", "#D1D5DB"],
                borderWidth: 0,
            },
        ],
    };

    const optionsPie = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '20',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: "'Kanit', sans-serif", size: 14 },
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = total_listed;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value.toLocaleString()} คน ( ${percentage}% )`;
                    }
                }
            }
        }
    };
    return (
        <Doughnut data={pieData} options={optionsPie} />
    );
}