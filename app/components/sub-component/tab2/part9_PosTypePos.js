"use client";
import { motion }           from "framer-motion";
import { Doughnut }         from "react-chartjs-2";
import { LoadingScreen }    from '../../../components/LoadingScreen';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
export default function T2P9_PosTypePose({ data }) {
    if ( !data ) return <LoadingScreen />;
    const part9 = data.tab2.part1;
    if (!part9) return null;
    const dataArray = Object.keys(part9).filter(key => key !== 't').map(key => part9[key]);
    const ROUND_COLORS = ["#3b82f6ab", "#10b981ab", "#f59e0bab"];
    const pieChartData = {
        labels: Object.values(dataArray).map(item => `ประเภท : ${item.type_name}`),
        datasets: [
            {
                label: 'จำนวนตำแหน่ง',
                data: Object.values(dataArray).map(item => item.total_count), 
                backgroundColor: ROUND_COLORS.slice(0, dataArray.length), 
                borderColor: ROUND_COLORS.slice(0, dataArray.length).map(color => color.replace('ab', 'ff')), 
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60',
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
                        return ` ทั้งหมด : ${value.toLocaleString()} ตำแหน่ง (${percentage}%)`;
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
                    <h3 className="flex justify-center text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-chevron-right-icon lucide-square-chevron-right"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m10 8 4 4-4 4"/></svg>
                        <span className="ml-2">สัดส่วนตำแหน่งที่เปิดรับ แบ่งตามประเภท</span>
                    </h3>
                    <p className=" text-sm md:text-base lg:text-sm text-gray-500">มีทั้งหมด {part9.t.total_count} ตำแหน่ง</p>
                </div>
            
                <div className="h-[370px] w-full relative">
                    <Doughnut data={pieChartData} options={options} />
                </div>
            </div>
        </motion.div>
    );
}
