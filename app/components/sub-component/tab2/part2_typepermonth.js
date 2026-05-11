"use client";
import { motion } from "framer-motion";
import { Chart as ChartJS, registerables, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;
if (typeof window !== 'undefined') {
  ChartJS.register(...registerables, zoomPlugin);
}
export default function T2P2_TypePerMonth({ data }) {
    const part2 = data?.tab2?.part2; 
    if (!part2) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >

        </motion.div>
    );
}
