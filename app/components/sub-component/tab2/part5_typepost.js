"use client";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement,
    LineElement,
    Title, 
    Tooltip, 
    Legend 
} from "chart.js";

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement,
    LineElement, 
    Title, 
    Tooltip, 
    Legend
);

ChartJS.defaults.font.family = "'Kanit', sans-serif";
ChartJS.defaults.font.size = 16;

export default function T2P5_TypePostBarPart1({ data }) {

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
        </motion.div>
    );
}
