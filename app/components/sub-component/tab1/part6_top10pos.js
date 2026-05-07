"use client";
import { motion } from "framer-motion";
import axios from 'axios';

export default function StatChart({ setIsOpen,setDetails,data }) {
    const topTenData = data.tab1.part5 || [];
    const handleViewDetail = async (id) => {
        try { const response = await axios.get( `http://127.0.0.1:8000/api/listed-position-detail/${id}` );
            setDetails(response.data);
            setIsOpen(true);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <div className="w-full bg-white rounded-2xl overflow-hidden">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">📈 ตำแหน่งยอดฮิตที่ขึ้นบัญชี</h3>
                    <p className="text-sm text-gray-500">ข้อมูลสรุปภาพรวมทุกภาค/เขต</p>
                </div>
                <div className="max-h-[700px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-4 text-lg font-semibold text-gray-600">อันดับ</th>
                                <th className="p-4 text-lg font-semibold text-gray-600">ชื่อตำแหน่ง</th>
                                <th className="p-4 text-lg font-semibold text-gray-600 text-right">ขึ้นบัญชี (คน)</th>
                                <th className="p-4 text-lg font-semibold text-gray-600 text-center">📃</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topTenData.map((pos, index) => (
                                <tr key={pos.id_pos} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-lg font-bold 
                                            ${index < 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-lg text-gray-800">{pos.pos_name}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="font-mono text-lg font-bold text-blue-700">
                                            {Number(pos.total).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="font-mono text-xs font-bold text-blue-700">
                                            <button 
                                                onClick={() => handleViewDetail(pos.id_pos)}
                                                className="bg-gray-400 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                                            >
                                                🔎 รายละเอียด
                                            </button>
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
