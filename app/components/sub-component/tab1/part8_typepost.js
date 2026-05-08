"use client";

import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;

export default function PieListed({ data }) {
    const part7 = data.tab1.part7;
    if (!part7) return null;
    const dataArray = Object.values(part7 || {});
    const labels = dataArray.map(item => item.type_name);
    const dataValues = dataArray.map(item => item.total_person);
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'จำนวน ',
                data: dataValues,
                backgroundColor: [
                    "#65a8ff", 
                    "#6ec291", 
                    "#cea877", 
                ],
                hoverBackgroundColor: ["#1449e6b0", "#008236b0", "#a65f00b0"],
                borderWidth: 2,
                borderColor: "#ffffff",
            },
        ],
    };
    const totalSum = dataArray.reduce((sum, item) => sum + (item.total_person || 0), 0);
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60',
        plugins: {
        legend: {
            position: 'bottom',
            labels: {
                font: { family: "'Kanit', sans-serif", size: 16 },
                usePointStyle: true, 
                padding: 20
            }
        },
        tooltip: {
            titleFont: {
                size: 20,        
                weight: 'bold',  
                family: 'Kanit', 
            },
            bodyFont: {
                size: 20,
                weight: 'normal',
                family: 'Kanit',
            },
            footerFont: {
                size: 16,
            },
            padding: 10,
            callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const percentage = totalSum > 0 ? ((value / totalSum) * 100).toFixed(2) : 0;
                        return ` ${label}: ${value.toLocaleString()} คน ( ${percentage} % )`;
                    }
                },
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
                    <h3 className="text-lg font-bold text-gray-700">🏛️สัดส่วนประเภทข้าราชการหรือพนักงานส่วนท้องถิ่นของบัญชีผู้สอบแข่งขันได้ (คน) </h3>
                </div>
            
                <div className="h-[370px] w-full relative">
                    <Doughnut data={chartData} options={options} />
                </div>
            </div>
        </motion.div>
    );
}
