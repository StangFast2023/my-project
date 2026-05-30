"use client";
import CountUp              from 'react-countup';
import { motion }           from "framer-motion";
import { Doughnut }         from "react-chartjs-2";
import { LoadingScreen }    from '../../../components/LoadingScreen';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
export default function T1P3_PieListed({ data }) {
    if ( !data ) return <LoadingScreen />;
    const part1 = data?.tab1?.part1;
    if (!part1) return null;

    const totalRegistered = part1.TotalList;
    const totalCalled = part1.TotalCall;
    const remaining = totalRegistered - totalCalled;

    const chartData = {
        labels: [" เรียกรายงานตัวแล้ว", " คงเหลือในบัญชี"],
        datasets: [
            {
                data: [totalCalled, remaining],
                backgroundColor: [
                    "#10B981",
                    "#E5E7EB",
                ],
                hoverBackgroundColor: ["#059669", "#D1D5DB"],
                borderWidth: 0,
            },
        ],
    };
    const options = {
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
                label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = totalRegistered;
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${label}: ${value.toLocaleString()} คน ( ${percentage}% )`;
                }
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
                <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700">🏛️สัดส่วนบัญชีผู้สอบแข่งขันได้</h3>
                    <p className="text-sm text-gray-500">จากทั้งหมด {totalRegistered.toLocaleString()} คน</p>
                </div>
            
                <div className="h-[370px] w-full relative">
                    <Doughnut data={chartData} options={options} />
                </div>
                
                <div className="flex flex-col items-center pointer-events-none">
                    <div className="flex items-baseline">
                        <span className="text-lg text-gray-600">คงเหลือ</span>
                        <span className="text-3xl font-bold text-gray-500 ml-2">
                            <CountUp 
                                end={remaining}
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                            /> 
                        </span>
                        <span className="text-lg text-gray-600 pl-2">อัตรา</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
