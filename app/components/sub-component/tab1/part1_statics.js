"use client";
import CountUp from 'react-countup';
import { motion } from "framer-motion";

export default function StaticNumber({ data }) {

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            
            <div className="lg:col-span-7 flex flex-col h-full">
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2">
                    <p className="text-gray-500 text-sm">อายุบัญชี</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-3xl font-bold text-gray-600">
                            <CountUp 
                                end={(data.tab1.part1.days_passed)} 
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-xl"> / {data.tab1.part1.total_days.toLocaleString()} วัน</b> 
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">ความคืบหน้าอายุบัญชี</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-3xl font-bold text-gray-600">
                            <CountUp 
                                end={data.tab1.part1.percentage} 
                                duration={3} 
                                separator="," 
                                decimals={2}
                                useEasing={true}
                            />   <b className="text-xl">  / 100.00 %</b> 
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${data.tab1.part4.CurRound.value >= 100 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${Math.min(data.tab1.part4.CurRound.value, 100)}%` }} />
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2">
                    <p className="text-gray-500 text-sm">ขึ้นบัญชีทั้งหมด</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-3xl font-bold text-gray-600">
                            <CountUp 
                                end={data.tab1.part1.TotalList} 
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-xl">  อัตรา</b> 
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">เรียกไปแล้ว</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-3xl font-bold text-gray-600">
                            <CountUp 
                                end={data.tab1.part1.TotalCall} 
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-xl">  อัตรา</b> 
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">คงเหลือ</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-3xl font-bold text-gray-600">
                            <CountUp 
                                end={data.tab1.part1.TotalList - data.tab1.part1.TotalCall} 
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-xl">  อัตรา</b> 
                        </span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2">
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
                            />   <b className="text-xl">  อัตรา</b> 
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
