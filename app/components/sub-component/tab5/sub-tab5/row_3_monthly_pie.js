
"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import zoomPlugin           from 'chartjs-plugin-zoom';
import Row3Part1Bar         from '../../tab5/chart-sub-tab-5/row_3_part1_bar';
import Row3Part2Pie         from '../../tab5/chart-sub-tab-5/row_3_part2_pie';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, zoomPlugin);
export default function Row3StatusRank({ data }) {
    const ChartData = data || {};
    if (!ChartData) return null;
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex text-gray-700 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook-pen-icon lucide-notebook-pen"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สถิติการเรียกบรรจุรายเดือนและยอดสะสม
                    </h3>
                </div>
                <div className="w-full h-[450px]">
                    <Row3Part1Bar data={ChartData} />
                </div>
            </div>
            <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex text-gray-700 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alarm-smoke-icon lucide-alarm-smoke"><path d="M11 21c0-2.5 2-2.5 2-5"/><path d="M16 21c0-2.5 2-2.5 2-5"/><path d="m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8"/><path d="M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z"/><path d="M6 21c0-2.5 2-2.5 2-5"/></svg>
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สัดส่วนบัญชีผู้สอบแข่งขันได้
                    </h3>
                </div>
                <div className="w-full h-[450px]">
                    <Row3Part2Pie data={ChartData} />
                </div>
            </div>
        </div>
    );
}