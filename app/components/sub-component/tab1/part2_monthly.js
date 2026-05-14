"use client";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, zoomPlugin);
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
export default function T1P2_CallMonthly({ data }) {
    const ROUND_COLORS = [
        "#1e40afab", "#fbbe24ab", "#ef4444ab", "#10b981ab", "#8b5cf6ab", 
        "#f59e0bab", "#3b82f6ab", "#ec4899ab", "#06b6d4ab", "#84cc16ab", 
        "#6366f1ab", "#f43f5eab", "#14b8a6ab", "#f97316ab", "#a855f7ab", 
        "#0ea5e9ab", "#d946efab", "#22c55eab", "#eab308ab", "#64748bab", 
        "#475569ab", "#be123cab", "#15803dab", "#1d4ed8ab", "#7c3aedab"  
    ];

    const chartRawData = data?.tab1?.part2;
    if (!chartRawData) return null;

    const keys = Object.keys(chartRawData);
    const labels = keys.map(key => chartRawData[key].label_th_s);
    const fullNames = keys.map(key => chartRawData[key].label_th_f);
    const allRounds = Array.from(
        new Set(
            keys.flatMap(key => {
                const monthData = chartRawData[key]?.data; 
                return monthData ? Object.values(monthData).map(d => d.round) : [];
            })
        )
    ).sort((a, b) => a - b);

    const barDatasets = allRounds.map((roundNum, index) => ({
        type: 'bar',
        label: ` รอบที่ ${roundNum}`,
        data: keys.map(key => {
            const monthEntry = chartRawData[key];
            if (monthEntry && monthEntry.data) {
                const dataArray = Object.values(monthEntry.data);
                const item = dataArray.find(d => d.round === roundNum);
                return item ? item.total : 0;
            }
            return 0;
        }),
        backgroundColor: ROUND_COLORS[index] || "#CCCCCC",
        borderRadius: 6,
        order: 2,
    }));

    const lineDataset = {
        type: 'line', 
        label: ' ยอดรวมการเรียกรายงานตัว ',
        data: keys.map(key => {
            const value = chartRawData[key]?.total_per_month;
            return value > 0 ? value : null; 
        }),
        borderColor: '#F87171', 
        backgroundColor: '#F87171',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.3, 
        order: 1, 
    };
    const chartData = {
        labels: labels,
        datasets: [...barDatasets, lineDataset], 
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                labels: {
                    font: {
                        size: 14
                    }
                },
                callbacks: {
                    title: function(context) {
                        const index = context[0].dataIndex;
                        return fullNames[index]; 
                    },
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ' : ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('th-TH').format(context.parsed.y) + ' คน';
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
                ticks: {
                    callback: (value) => value.toLocaleString() + ' อัตรา'
                }
            }
        }
    };


    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <div>
                <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปจำนวนการเรียกรายงานตัวรายรอบและยอดรวมรายเดือน</h3>
                    <div className="w-full h-[370px]">
                        <Bar data={chartData} options={options} />
                    </div>
            </div>
        </motion.div>
    );
}
