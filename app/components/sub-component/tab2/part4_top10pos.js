"use client";
import { motion }           from "framer-motion";
import axios                from 'axios';
import { LoadingScreen }    from '../../../components/LoadingScreen';

export default function T2P4_Top10ListPos({ setIsOpen,setDetails,data }) {
    if(!data) return <LoadingScreen />;
    const topTenData = data.tab2.part4 || [];
    const handleViewDetail = async (id) => {
        try { const response = await axios.get( `http://127.0.0.1:8000/api/listed-position-detail/${id}` );
            setDetails(response.data);
            setIsOpen(true);
        } catch (error) {
            console.error(error);
        }
    };
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
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">🎉 ตำแหน่งที่มีการแข่งขันและขึ้นบัญชีสูงสุด</h3>
                    <p className="text-sm text-gray-500">ข้อมูลสรุปภาพรวมทุกภาค/เขต</p>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="sticky top-0 z-20 bg-gray-100 shadow-sm">
                                <th className="p-4 text-lg font-semibold text-gray-600">อันดับ</th>
                                <th className="p-4 text-lg font-semibold text-gray-600">ชื่อตำแหน่ง</th>
                                <th className="p-4 text-lg font-semibold text-gray-600">ประเภท</th>
                                <th className="p-4 text-lg font-semibold text-gray-600 text-center">ขึ้นบัญชี (คน)</th>
                                <th className="p-4 text-lg font-semibold text-gray-600 text-center">📃</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topTenData.map((pos, index) => (
                                <tr key={pos.id_pos} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xm font-bold 
                                            ${index < 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-xm text-gray-800">{pos.pos_name}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-xm text-gray-800">
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${typeStyles[pos.pos_type_id]}`}>
                                                { pos.pos_type }
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="font-mono text-xm font-bold text-gray-700">
                                            {Number(pos.total).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="font-mono text-xm font-bold text-blue-700">
                                            <button onClick={() => handleViewDetail(pos.id_pos)}className="bg-gray-400 hover:bg-sky-700 text-white px-3 py-1 rounded-md text-sm transition-colors hover:shadow-xl transition-all duration-300">
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
