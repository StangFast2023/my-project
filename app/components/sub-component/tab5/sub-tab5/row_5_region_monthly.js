
"use client";
import { FolderKanban } from 'lucide-react';
import { Bar } from "react-chartjs-2";

export default function Row5RegionMonthly({ position, data }) {
    const chartRawData = data?.chart_3_region || {};
    if (!chartRawData) return null;

    const keys = Object.keys(chartRawData);
    const flatData = keys.flatMap(key => {
        const mainRegion = chartRawData[key];
        return Object.values(mainRegion.sub_province).flatMap(sub => {
            return Object.values(sub.data_monthly).map(monthData => ({
                name: `${mainRegion.name} ${sub.name}`,
                labels: monthData.name_s,
                total: monthData.total || 0
            }));
        });
    });

    const firstKey = Object.keys(chartRawData || {})[0];
    const subProvinces = chartRawData?.[firstKey]?.sub_province;
    const labels = subProvinces ? Object.values(Object.values(subProvinces)[0]?.data_monthly || {}).map(m => m.name_s) : [];
    const groupedData = flatData.reduce((acc, curr) => {
        if (!acc[curr.name]) acc[curr.name] = {};
        acc[curr.name][curr.labels] = curr.total;
        return acc;
    }, {});

    const getHueFromString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const lastChar = str.match(/\d+$/) ? parseInt(str.match(/\d+$/)[0]) : 1;
        const hue = Math.abs(hash) % 360;
        const saturation = 70 + (lastChar * 15);
        const lightness = 10 + (lastChar * 15);
        return {
            bg: `hsla(${hue}, ${saturation}%, ${lightness + 35}%, 0.5)`,
            bd: `hsl(${hue}, ${saturation}%, ${lightness}%, 1)`
        };
    };

    const barDatasets = Object.keys(groupedData).map(regionName => {
        const hue = getHueFromString(regionName);
        return {
            type: 'bar',
            label: regionName,
            data: labels.map(month => groupedData[regionName][month] || 0),
            backgroundColor: hue.bg,
            borderColor: hue.bd,
            borderWidth: 2,
            borderRadius: 4,
            order: 2,
        };
    });

    const monthlyTotals = labels.map(month => {
        return Object.keys(groupedData).reduce((sum, regionName) => {
            const val = groupedData[regionName][month];
            return sum + (parseInt(val, 10) || 0);
        }, 0);
    });

    let runningTotal = 0;
    const cumulativeData = monthlyTotals.map(val => {
        const numericVal = Number(val) || 0;
        if (numericVal === 0) {
            return null;
        }
        runningTotal += numericVal;
        return runningTotal;
    });

    const lineDataset = {
        type: 'line',
        label: ' ยอดรวมการเรียกรายงานตัว ',
        yAxisID: 'y1',
        data: cumulativeData,
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
        spanGaps: true,
        responsive: true,
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                ticks: { callback: (value) => value + ' อัตรา' }
            },
            y1: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                ticks: { callback: (value) => value + ' อัตรา' }
            }
        },
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
                    title: function (context) {
                        const index = context[0].dataIndex;
                        return labels[index];
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
    };
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex text-gray-700 items-center">
                    <FolderKanban />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สถิติการเรียกบรรจุรายเดือนแบบแบ่งเขตและยอดสะสม {position ? " " + position + "ทุกเขต" : null}
                    </h3>
                </div>
                <div className="w-full h-[500px]">
                    <Bar data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
}