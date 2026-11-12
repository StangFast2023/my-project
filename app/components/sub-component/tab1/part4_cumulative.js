"use client";
import { motion } from 'framer-motion';
import { Chart } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
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
export default function T1P4_Cumulative({ data }) {
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
    const mobileChartWidth = Math.max(labels.length * 75, 450);

    const sharedOptions = {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        plugins: {
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
                    callback: (value) => value.toLocaleString() + ' คน'
                }
            },
            y1: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                display: true,
                ticks: {
                    callback: (value) => value.toLocaleString() + ' คน'
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
                    <TrendingUp />
                    <span className="ml-2">สถิติการเรียกบรรจุรายเดือนและยอดสะสม</span>
                </h3>
                {/* Desktop */}
                <div className="hidden md:block h-[400px] w-full">
                    <Chart type="bar" data={chartData} options={desktopOptions} />
                </div>

                {/* Mobile */}
                <div className="block md:hidden w-full">
                    <div className="w-full overflow-x-auto overflow-y-hidden">
                        <div
                            className="relative h-[390px]"
                            style={{ width: `${mobileChartWidth}px` }}
                        >
                            <Chart type="bar" data={chartData} options={mobileOptions} />
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
