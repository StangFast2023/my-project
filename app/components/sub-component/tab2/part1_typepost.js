"use client";

import CountUp              from 'react-countup';
import { motion }           from "framer-motion";
import { LoadingScreen }    from '../../../components/LoadingScreen';

export default function T2P3_TypePostPart1({ data }) {
    if(!data) return <LoadingScreen />;
    const part7 = data.tab2.part1;
    if (!part7) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
                <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                    <p className="text-gray-500 text-sm">จำนวนตำแหน่งทั้งหมด</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-3xl font-bold text-gray-600">
                            <CountUp 
                                end={part7.t.total_count} 
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-xl"> ตำแหน่ง </b> 
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">ขึ้นบัญชีทั้งหมด</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className="text-3xl font-bold text-gray-600">
                            <CountUp 
                                end={part7.t.total_person} 
                                duration={3} 
                                separator="," 
                                decimals={0}
                                useEasing={true}
                            />   <b className="text-xl"> คน </b> 
                        </span>
                    </div>
                </div>
                {Object.entries(part7 || {}).filter(([key]) => key !== 't').map(([key, value]) => (
                    <div key={key} className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                        <p className="text-gray-600 text-xl font-bold">{value.type_name}</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                <CountUp 
                                    end={value.total_count} 
                                    duration={3} 
                                    separator="," 
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-xl"> ตำแหน่ง </b> 
                            </span>
                            <span className="text-2xl font-bold text-emerald-600">
                                <CountUp 
                                    end={value.total_count_in_percent} 
                                    duration={3} 
                                    separator="," 
                                    decimals={2}
                                    useEasing={true}
                                    prefix={'('}
                                    suffix={'%)'}
                                />
                            </span>
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <p className="text-gray-500 text-sm">ผู้ขึ้นบัญชี</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-3xl font-bold text-gray-600">
                                <CountUp 
                                    end={value.total_person} 
                                    duration={3} 
                                    separator="," 
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-xl"> คน </b> 
                            </span>
                            <span className="text-2xl font-bold text-emerald-600">
                                <CountUp 
                                    end={value.total_person_in_percent} 
                                    duration={3} 
                                    separator="," 
                                    decimals={2}
                                    useEasing={true}
                                    prefix={'('}
                                    suffix={'%)'}
                                />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </motion.div>
    );
}
