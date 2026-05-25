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
    const part5 = data.tab1.part5;
    if (!part5) return null;

    const part1 = data?.tab1?.part1;
    if (!part1) return null;

    const totalRegistered = part1.TotalList;
    const totalCalled = part1.TotalCall;

    const ROUND_COLORS = [
        "#1e40afab", "#fbbe24ab", "#ef4444ab", "#10b981ab", "#8b5cf6ab", 
        "#f59e0bab", "#3b82f6ab", "#ec4899ab", "#06b6d4ab", "#84cc16ab", 
        "#6366f1ab", "#f43f5eab", "#14b8a6ab", "#f97316ab", "#a855f7ab", 
        "#0ea5e9ab", "#d946efab", "#22c55eab", "#eab308ab", "#64748bab", 
        "#475569ab", "#be123cab", "#15803dab", "#1d4ed8ab", "#7c3aedab"  
    ];
    
    const pieChartData = {
        labels: Object.values(part5).map(item => `รอบที่ ${item.round}`),
        datasets: [
            {
                label: 'จำนวนที่เรียกบรรจุ (คน)',
                data: Object.values(part5).map(item => item.total), 
                backgroundColor: ROUND_COLORS.slice(0, part5.length), 
                borderColor: ROUND_COLORS.slice(0, part5.length).map(color => color.replace('ab', 'ff')), // เพิ่มความเข้มที่เส้นขอบ
                borderWidth: 1,
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
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${context.label}: ${value.toLocaleString()} คน (${percentage}%)`;
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
                    <h3 className="text-lg font-bold text-gray-700">🏛️สัดส่วนบัญชีผู้สอบแข่งขันได้ที่ถูกเรียกให้ไปรายงานตัว</h3>
                    <p className="text-sm text-gray-500">จากทั้งหมด {totalRegistered.toLocaleString()} คน</p>
                </div>
            
                <div className="h-[370px] w-full relative">
                    <Doughnut data={pieChartData} options={options} />
                </div>
                <div className="flex flex-col items-center pointer-events-none">
                    <div className="flex items-baseline">
                        <span className="text-lg text-gray-600">เรียกไปแล้ว</span>
                        <span className="text-3xl font-bold text-emerald-500 ml-2">
                            <CountUp 
                                end={totalCalled}
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                                suffix=" อัตรา"
                            /> 
                        </span>
                        <span className="text-lg font-bold text-emerald-600">
                            <CountUp
                                className="mx-2" 
                                end={((totalCalled / totalRegistered) * 100).toFixed(2)}
                                duration={3} 
                                separator="," 
                                decimals={2}
                                useEasing={true}
                                prefix="( "
                                suffix=" % )"
                            />
                        </span> 
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
