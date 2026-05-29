"use client";
import { LoadingScreen }    from '../../../components/LoadingScreen';
import { motion }           from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Bar }              from "react-chartjs-2";
import zoomPlugin           from 'chartjs-plugin-zoom';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, zoomPlugin);
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
export default function T2P2_TypePerMonth({ data }) {
    if(!data) return <LoadingScreen />;
    const part2 = data?.tab2?.part2; 
    if (!part2) return null;
    const keys = Object.keys(part2);
    const labels = keys.map(key => part2[key].name_s);
    const fullNames = keys.map(key => part2[key].name_l);
    const types = [
        { id: 1, name: "ทั่วไป", color: "#3b82f6ab" },
        { id: 2, name: "วิชาการ", color: "#10b981ab" },
        { id: 3, name: "ครูผู้ช่วย", color: "#f59e0bab" }
    ];
    const barDatasets = types.map(type => ({
        type: 'bar',
        label: type.name,
        data: keys.map(key => {
            const monthData = part2[key].data;
            return monthData && monthData[type.id] ? monthData[type.id].total : 0;
        }),
        backgroundColor: type.color,
        borderRadius: 4,
        order: 2, 
    }));
    const lineDataset = {
        type: 'line', 
        label: ' ยอดรวมการเรียกรายงานตัว ',
        data: keys.map(key => part2[key].total_per_month || null),
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
        fullNames: fullNames,
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
                <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สถิติการเรียกบรรจุรายเดือน จำแนกตามประเภทตำแหน่ง</h3>
                    <div className="w-full h-[370px]">
                        <Bar data={chartData} options={options} />
                    </div>
            </div>
        </motion.div>
    );
}
