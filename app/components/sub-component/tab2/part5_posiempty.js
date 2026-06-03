"use client";
import { motion }           from "framer-motion";
import { BookDown }         from 'lucide-react';
import { LoadingScreen }    from '../../../components/LoadingScreen';
export default function T2P5_PopularPosEmp({ data }) {
    if(!data) return <LoadingScreen />;
    const fastEmpty = data.tab2.part5 || [];
    const typeStyles = {
        1: "bg-blue-100 text-blue-700",
        2: "bg-green-100 text-green-700",
        3: "bg-yellow-100 text-yellow-700"
    };
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <div className="w-full bg-white rounded-2xl overflow-hidden">
                
                <div className="text-center mb-2">
                    <h3 className="flex justify-center text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        <BookDown />
                        <span className="ml-2">สรุปอันดับตำแหน่งที่มีการบรรจุเต็มอัตราในรอบที่ 1</span>
                    </h3>
                    <p className="text-sm md:text-base lg:text-sm text-gray-500">ข้อมูลสรุปภาพรวมทุกภาค/เขต</p>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="sticky top-0 z-20 bg-gray-100 shadow-sm">
                                <th className="p-4 text-sm md:text-base lg:text-lg font-semibold text-gray-600">อันดับ</th>
                                <th className="p-4 text-sm md:text-base lg:text-lg font-semibold text-gray-600">ชื่อตำแหน่ง</th>
                                <th className="p-4 text-sm md:text-base lg:text-lg font-semibold text-gray-600">ประเภท</th>
                                <th className="p-4 text-sm md:text-base lg:text-lg font-semibold text-gray-600">เขต</th>
                                <th className="p-4 text-sm md:text-base lg:text-lg font-semibold text-gray-600">อัตรา</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {fastEmpty.map((pos, index) => (
                                <tr key={`${pos.prov_main_id}-${pos.prov_sub_id}-${pos.id_pos}`}className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm md:text-base lg:text-xm font-bold 
                                            ${index < 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <div className="font-bold text-sm md:text-base lg:text-xm text-gray-800">{pos.pos_name}</div>
                                    </td>
                                    <td className="p-2">
                                        <div className="font-bold text-sm md:text-base lg:text-xm text-gray-800">
                                            <span className={`px-4 py-1.5 rounded-full font-bold shadow-sm ${typeStyles[pos.pos_type_id]}`}>
                                                { pos.pos_type }
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="font-bold text-sm md:text-base lg:text-xm text-gray-800">{pos.prov_full_name}</div>
                                    </td>
                                    <td className="p-2 text-right">
                                        <span className="font-mono text-sm md:text-base lg:text-xm font-bold text-gray-700">
                                            {Number(pos.total_call).toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
        
    );
}
