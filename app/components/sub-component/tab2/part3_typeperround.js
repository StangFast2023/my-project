"use client";
import { motion } from "framer-motion";
import { Chart as ChartJS, registerables, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Chart } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
export default function T2P3_TypePerRound({ data }) {
    const part3 = data?.tab2?.part3; 
    if (!part3) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >

        </motion.div>
    );
}
