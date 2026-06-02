"use client";
import Swal                         from 'sweetalert2';
import withReactContent             from 'sweetalert2-react-content';
import { motion }                   from 'framer-motion';
import { LoadingScreen }            from '../../../components/LoadingScreen';
const MySwal = withReactContent(Swal);
export default function T5P1_filterDlaSearch({ setIsOpen, details, data }) { 
    const part5ForShow = data?.tab5?.part1 || {};
    const handleViewDetail = async () => {
        setIsOpen(true);
    };
    if(!part5ForShow) return <LoadingScreen />;
    return ( 
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <div className="grid grid-cols-12 gap-6 my-2">
                <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <span className="font-medium text-gray-700 whitespace-nowrap">คำนวณโดย :</span>
                    <div 
                        onClick={() => handleViewDetail()}
                        className="group relative w-full h-auto bg-white rounded-3xl cursor-pointer overflow-hidden transition-all duration-300"
                    >
                        <div className="grid lg:grid-cols-10  gap-4 items-center px-4 transition-all duration-500 group-hover:blur-lg group-hover:bg-gray-50/50">
                            <div className="col-span-2 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                                <p className="text-gray-500 text-sm">ภาค :</p>
                                <span className="text-lg md:text-base lg:text-xl font-bold text-gray-600 text-right">{part5ForShow[details?.regionId]?.pro_main_name || "-"}</span>
                            </div>
                            <div className="col-span-2 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                                <p className="text-gray-500 text-sm">เขต :</p>
                                <span className="text-lg md:text-base lg:text-xl font-bold text-gray-600 text-right">
                                    {part5ForShow[details?.regionId]?.pro_sub[details?.areaId]?.pro_sub_id ? "เขต" + part5ForShow[details?.regionId]?.pro_sub[details?.areaId]?.pro_sub_id : "-"}
                                </span>
                            </div>
                            <div className="col-span-4 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                                <p className="text-gray-500 text-sm">ตำแหน่ง :</p>
                                <span className="text-lg md:text-base lg:text-xl font-bold text-gray-600 text-right truncate">
                                    {part5ForShow[details?.regionId]?.pro_sub[details?.areaId]?.data_position[details?.positionId]?.pos_name || "-"}
                                </span>
                            </div>
                            <div className="col-span-2 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                                <p className="text-gray-500 text-sm">ลำดับที่ :</p>
                                <span className="text-lg md:text-base lg:text-xl font-bold text-gray-600 text-right">{details?.sequence || "-"} </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <div className="flex items-center gap-1 text-lg md:text-base lg:text-xl font-bold text-gray-600">
                                <svg className="w-6 h-6 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>แก้ไขข้อมูล</span>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </motion.div>
    );
}