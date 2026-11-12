
"use client";

import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Bolt } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend,
    Filler
);

ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;

export default function T2P3_TypePerRound({ data }) {
    const part3 = data?.tab2?.part3;
    if (!part3) return null;

    const keys = Object.keys(part3);
    const labels = keys.map(key => `รอบที่ ${key}`);

    const types = [
        { id: 1, name: "ทั่วไป", color: "#3b82f6ab" },
        { id: 2, name: "วิชาการ", color: "#10b981ab" },
        { id: 3, name: "ครูผู้ช่วย", color: "#f59e0bab" }
    ];

    const barDatasets = types.map(type => ({
        type: 'bar',
        label: type.name,
        data: keys.map(key => {
            const item = part3[key]?.data?.[type.id];
            return item ? item.total : 0;
        }),
        backgroundColor: type.color,
        borderRadius: 4,
        order: 2,
    }));

    const lineDataset = {
        type: 'line',
        label: ' ยอดรวมการเรียกรายงานตัว ',
        yAxisID: 'y1',
        data: keys.map(key => part3[key].total_per_round || null),
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

    const mobileChartWidth = Math.max(labels.length * 75, 450);

    const sharedOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
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
        }
    };

    const desktopOptions = {
        ...sharedOptions,
        plugins: {
            ...sharedOptions.plugins,
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: "'Kanit', sans-serif", size: 14 }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                display: true,
                ticks: {
                    callback: (value) => value.toLocaleString() + ' อัตรา'
                }
            },
            y1: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                display: true,
                grid: { drawOnChartArea: false },
                ticks: {
                    callback: (value) => value.toLocaleString() + ' อัตรา'
                }
            }
        }
    };

    const mobileOptions = {
        ...sharedOptions,
        plugins: {
            ...sharedOptions.plugins,
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: "'Kanit', sans-serif", size: 10 },
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 8
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45,
                    font: { size: 10 }
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                display: false
            },
            y1: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                display: false
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
                <h3 className="flex text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                    <Bolt />
                    <span className="ml-2">เปรียบเทียบผลการเรียกบรรจุรายรอบ จำแนกตามประเภทตำแหน่ง</span>
                </h3>

                {/* Desktop */}
                <div className="hidden md:block w-full h-[370px]">
                    <Bar data={chartData} options={desktopOptions} />
                </div>

                {/* Mobile */}
                <div className="block md:hidden w-full">
                    <div className="w-full overflow-x-auto overflow-y-hidden">
                        <div
                            className="relative h-[390px]"
                            style={{ width: `${mobileChartWidth}px` }}
                        >
                            <Bar data={chartData} options={mobileOptions} />
                        </div>
                    </div>

                    <p className="text-center text-gray-400 text-xs mt-2">
                        เลื่อนกราฟไปทางซ้ายหรือขวาเพื่อดูข้อมูลเพิ่มเติม
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
