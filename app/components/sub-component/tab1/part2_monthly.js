
'use client';

import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { ChartColumn } from 'lucide-react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend
);

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
                return monthData
                    ? Object.values(monthData).map(d => d.round)
                    : [];
            })
        )
    ).sort((a, b) => a - b);

    // ข้อมูลกราฟแท่ง
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

    // ข้อมูลกราฟเส้น
    const lineDataset = {
        type: 'line',
        label: ' ยอดรวมการเรียกรายงานตัว ',
        yAxisID: 'y1',
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

    // Tooltip ใช้ร่วมกันทั้ง Desktop และ Mobile
    const tooltipCallbacks = {
        title: function (context) {
            const index = context[0].dataIndex;
            return fullNames[index];
        },
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
    };

    // Zoom และ Pan ใช้ร่วมกัน
    const zoomOptions = {
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
    };

    // Desktop Options
    const desktopOptions = {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,

        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                display: true,
                ticks: {
                    callback: (value) => value.toLocaleString() + ' คน'
                }
            },
            y1: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false
                },
                display: true,
                ticks: {
                    callback: (value) => value.toLocaleString() + ' คน'
                }
            }
        },

        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                labels: {
                    font: {
                        size: 14
                    }
                },
                callbacks: tooltipCallbacks
            },
            zoom: zoomOptions
        }
    };

    // Mobile Options
    const mobileOptions = {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,

        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                        size: 10
                    }
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
                display: false,
                grid: {
                    drawOnChartArea: false
                }
            }
        },

        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 8,
                    font: {
                        size: 10
                    }
                }
            },
            tooltip: {
                labels: {
                    font: {
                        size: 12
                    }
                },
                callbacks: tooltipCallbacks
            },
            zoom: zoomOptions
        }
    };

    // กำหนดความกว้างกราฟ Mobile ตามจำนวนเดือน
    const mobileChartWidth = Math.max(labels.length * 75, 450);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="flex items-center text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                <ChartColumn />
                <span className="ml-2">
                    สรุปจำนวนการเรียกบรรจุรายรอบ (แยกตามเดือน)
                </span>
            </h3>

            {/* Desktop */}
            <div className="hidden md:block w-full h-[400px]">
                <Bar
                    data={chartData}
                    options={desktopOptions}
                />
            </div>

            {/* Mobile */}
            <div className="block md:hidden w-full">
                <div className="w-full overflow-x-auto overflow-y-hidden">
                    <div
                        className="relative h-[390px]"
                        style={{
                            width: `${mobileChartWidth}px`
                        }}
                    >
                        <Bar
                            data={chartData}
                            options={mobileOptions}
                        />
                    </div>
                </div>

                <p className="text-center text-gray-400 text-xs mt-2">
                    เลื่อนกราฟไปทางซ้ายหรือขวาเพื่อดูข้อมูลเพิ่มเติม
                </p>
            </div>
        </motion.div>
    );
}
