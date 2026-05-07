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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mb-4 font-kanit">
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">รอบที่</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-600">
                        <CountUp 
                            end={data.tab1.part1.CurRound} 
                            duration={3} 
                            separator="," 
                            decimals={0}
                            useEasing={true}
                        />
                    </span>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">ขึ้นบัญชีทั้งหมด</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-600">
                        <CountUp 
                            end={data.tab1.part1.TotalList} 
                            duration={3} 
                            separator="," 
                            decimals={0}
                            useEasing={true}
                            suffix=" อัตรา"
                        />
                    </span>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">เรียกไปแล้ว</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-600">
                        <CountUp 
                            end={data.tab1.part1.TotalCall} 
                            duration={3} 
                            separator="," 
                            decimals={0}
                            useEasing={true}
                            suffix=" อัตรา"
                        />
                    </span>
                    <span className="text-xl font-bold text-blue-600 ml-2">
                        (
                            <CountUp 
                                className='mx-1'
                                end={((data.tab1.part1.TotalCall / data.tab1.part1.TotalList) * 100)} 
                                duration={3} 
                                separator="," 
                                decimals={2}
                                useEasing={true}
                                suffix=" %"
                            />
                        )
                    </span>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">คงเหลือ</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-600">
                        <CountUp 
                            end={( data.tab1.part1.TotalList - data.tab1.part1.TotalCall )} 
                            duration={3} 
                            separator="," 
                            decimals={0}
                            useEasing={true}
                            suffix=" อัตรา"
                        />
                    </span>
                    <span className="text-xl font-bold text-blue-600 ml-2">
                        ( 
                            <CountUp 
                                className='mx-1'
                                end={(( (data.tab1.part1.TotalList - data.tab1.part1.TotalCall) / data.tab1.part1.TotalList) * 100)} 
                                duration={3} 
                                separator="," 
                                decimals={2}
                                useEasing={true}
                                suffix=" %"
                            />
                        )
                    </span>
                </div>
            </div>
        </div>
</motion.div>
    );
}
