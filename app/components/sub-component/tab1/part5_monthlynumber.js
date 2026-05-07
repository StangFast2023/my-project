"use client";
import CountUp from 'react-countup';
import { motion } from "framer-motion";

export default function StatChart({ data }) {
    return (
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <div className="lg:col-span-7 flex flex-col h-full">
                <div className="flex flex-col justify-between h-full gap-3 pl-2">
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                        <p className="text-gray-500 text-sm">{data.tab1.part4.CurRound.name}</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                <CountUp 
                                    end={data.tab1.part4.CurRound.value} 
                                    duration={3} 
                                    separator="," 
                                    decimals={2}
                                    useEasing={true}
                                />  <b className="text-xl"> / 100.00 %</b>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">เหลือจำนวนรอบ</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                <CountUp 
                                    end={(25-data.tab1.part1.CurRound)} 
                                    duration={3} 
                                    separator="," 
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-xl"> รอบ</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                        <p className="text-gray-500 text-sm">{data.tab1.part4.MostTotalCall_1.name}</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                {data.tab1.part4.MostTotalCall_1.value}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">{data.tab1.part4.MostTotalCall_2.name}</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                <CountUp 
                                    end={data.tab1.part4.MostTotalCall_2.value} 
                                    duration={3} 
                                    separator="," 
                                    decimals={0}
                                    useEasing={true}
                                /> <b className="text-xl"> อัตรา</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                        <p className="text-gray-500 text-sm">{data.tab1.part4.MostRoundCall_1.name}</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                {data.tab1.part4.MostRoundCall_1.value}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">{data.tab1.part4.MostRoundCall_2.name}</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                <CountUp 
                                    end={data.tab1.part4.MostRoundCall_2.value} 
                                    duration={3} 
                                    separator="," 
                                    decimals={0}
                                    useEasing={true}
                                /> <b className="text-xl"> อัตรา</b>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
        // <div className="lg:w-1/3 flex flex-col gap-5">
        //     <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-sky-500 w-100">
        //         <p className="text-sm font-medium text-slate-500">ความคืบหน้าในการเรียก [ <b>{currentRound} / {totalRound}</b> ]</p>
        //         <p className="text-3xl font-bold text-slate-800 text-right">
        //             {totalRound > 0 ? ((currentRound / totalRound) * 100).toFixed(2) : 0} / <span className="text-lg font-bold text-gray-600">100.00%</span>
        //         </p>
        //     </div>
        //     <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500 w-100">
        //         <p className="text-sm font-medium text-slate-500">รอบที่มีการรายงานตัวมากที่สุด</p>
        //         <p className="text-3xl font-bold text-slate-800 text-right">
        //             <span className="text-lg font-bold text-gray-600">รอบที่</span> {topRoundWinner.roundNumber}
        //         </p>
        //     </div>
        //     <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 w-100">
        //         <p className="text-sm font-medium text-slate-500">เดือนที่มีการรายงานตัวมากที่สุด</p>
        //         <p className="text-3xl font-bold text-slate-800 text-right">{kpiStats.maxMonth} {kpiStats.maxYear}</p>
        //     </div>
        //     <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 w-100">
        //         <p className="text-sm font-medium text-slate-500">อัตราที่มีการรายงานตัวมากที่สุด</p>
        //         <p className="text-3xl font-bold text-slate-800 text-right">{kpiStats.maxTotal.toLocaleString()} <span className="text-lg font-bold text-gray-600">อัตรา</span></p>
        //     </div>
        // </div>
    );
}
