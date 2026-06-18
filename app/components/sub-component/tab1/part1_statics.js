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
            <div className={`${data ? 'block' : 'opacity-0'} grid grid-cols-1 gap-2 md:grid-cols-6 lg:grid-cols-6 lg:gap-4`}>

                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                    <p className="text-gray-500 text-sm">อายุบัญชี (วัน) </p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                            <CountUp
                                end={(data?.tab1?.part1?.days_passed)}
                                duration={3}
                                separator=","
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-sm md:text-base lg:text-xl"> / {data?.tab1?.part1?.total_days.toLocaleString()} วัน</b>
                        </span>
                    </div>
                    <div className="w-full rounded-full h-3 overflow-hidden">
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                    <p className="text-gray-500 text-sm">ความคืบหน้าอายุบัญชี</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                            <CountUp
                                end={data?.tab1?.part1?.percentage}
                                duration={3}
                                separator=","
                                decimals={2}
                                useEasing={true}
                            />   <b className="text-sm md:text-base lg:text-xl">  / 100.00 %</b>
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${data?.tab1?.part4?.CurRound?.value >= 100 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${Math.min(data?.tab1?.part4?.CurRound?.value, 100)}%` }} />
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                    <p className="text-gray-500 text-sm">ขึ้นบัญชีทั้งหมด</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                            <CountUp
                                end={data?.tab1?.part1?.TotalList}
                                duration={3}
                                separator=","
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-sm md:text-base lg:text-xl">  อัตรา</b>
                        </span>
                    </div>
                    <div className="w-full rounded-full h-3 overflow-hidden">
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                    <p className="text-gray-500 text-sm">เรียกไปแล้ว</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                            <CountUp
                                end={data?.tab1?.part1?.TotalCall}
                                duration={3}
                                separator=","
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-sm md:text-base lg:text-xl">  อัตรา</b>
                        </span>
                    </div>
                    <div className="w-full rounded-full h-3 overflow-hidden">
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                    <p className="text-gray-500 text-sm">คงเหลือ</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                            <CountUp
                                end={data?.tab1?.part1?.TotalList - data?.tab1?.part1?.TotalCall}
                                duration={3}
                                separator=","
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-sm md:text-base lg:text-xl">  อัตรา</b>
                        </span>
                    </div>
                    <div className="w-full rounded-full h-3 overflow-hidden">
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                    <p className="text-gray-500 text-sm">เรียกเฉลี่ยเดือนละ</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                            <CountUp
                                end={data?.tab1?.part1?.AvgCall}
                                duration={3}
                                separator=","
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-sm md:text-base lg:text-xl">  อัตรา</b>
                        </span>
                    </div>
                    <div className="w-full rounded-full h-3 overflow-hidden">
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
