import { useState } from 'react';
import { motion } from 'framer-motion';
import RoundDetailModal from '@/app/components/RoundDetailModal';
import { useColumnStore } from '../../../useTableColumns';
export default function Part4_PositionRow({ posData, roundsArray, regoin, zone }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRound, setSelectedRound] = useState(null);
    const handleCellClick = (each_round_data) => {
        setSelectedRound(each_round_data);
        setIsModalOpen(true);
    };
    const percent = (posData.total_listed_n > 0) ? (posData.total_call / posData.total_listed_n) * 100 : 0;
    const columns = useColumnStore((state) => state.columns);
    const regionColors = {
        1: "bg-rose-50 text-rose-800 font-bold",
        2: "bg-indigo-50 text-indigo-800 font-bold",
        3: "bg-teal-50 text-teal-800 font-bold",
        4: "bg-amber-50 text-amber-800 font-bold"
    };
    const zoneColors = {
        1: "bg-sky-100 text-sky-800 font-bold",
        2: "bg-slate-100 text-slate-800 font-bold",
        3: "bg-orange-100 text-orange-800 font-bold"
    };
    return (
        <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white hover:bg-gray-50"
        >
            <td className=" w-[400px] min-w-[400px] sticky left-0 z-10 p-4 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">[ <span className="font-semibold">{posData.pos_id}</span> ] {posData.pos_name}</td>
            {!columns.all_header && (<td className={`w-[200px] min-w-[200px] sticky top-0 z-10 p-4 font-semibold text-center bg-gray-50 ${regionColors[regoin.pro_main_id]} `}>{regoin.pro_main_name}</td>)}
            {!columns.all_header && (<td className={`w-[100px] min-w-[100px] sticky top-0 z-10 p-4 font-semibold text-center bg-gray-50 ${zoneColors[zone.pro_sub_id]} `}>เขต {zone.pro_sub_id}</td>)}
            <td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${posData.pos_type_id === 1 ? "bg-blue-50 text-blue-700" : posData.pos_type_id === 2 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{posData.pos_type_name}</td>
            {columns.column_part1 && (<td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${posData.status_open ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}>{posData.status_open ? "เปิด" : "ไม่เปิดสอบ"}</td>)}
            {columns.column_part2 && (<td className={`w-[120px] min-w-[120px] p-4 text-center font-bold ${posData.status_out_of_lits ? (posData.status_open === false ? "bg-rose-50 text-rose-700" : "bg-green-50 text-green-700") : (posData.total_remain > 0 ? "bg-yellow-50 text-yellow-700" : "bg-rose-700 text-white")}`}>{posData.status_out_of_lits ? (posData.status_open === false ? "ไม่มีบัญชี" : "หมดบัญชี") : (posData.total_remain > 0 ? "คงเหลือ" : "ขาดแคลน")}</td>)}
            {columns.column_part3 && (<td className={`w-[120px] min-w-[120px] p-4 text-center font-bold ${posData.status_open ? (percent < 30 ? "text-rose-600 bg-rose-50" : percent < 70 ? "text-amber-600 bg-amber-50" : percent <= 100 ? "text-emerald-600 bg-emerald-50" : "text-violet-600 bg-violet-50") : "text-gray-600 bg-gray-50"}`}> {(posData.status_open ? percent : 0).toFixed(2)} %</td>)}
            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold">{posData.total_listed.toLocaleString()}</td>
            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-gray-50">{posData.total_listed_n.toLocaleString()}</td>
            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-rose-50 text-rose-700">{posData.total_diff.toLocaleString()}</td>
            <td className=" w-[120px] min-w-[120px] p-4 text-center bg-clip-padding bg-emerald-50 font-bold text-emerald-700">{posData.total_call.toLocaleString()}</td>
            <td className={`w-[120px] min-w-[120px] p-4 text-center bg-clip-padding font-bold ${posData.total_remain > 0 ? 'bg-amber-50 text-amber-500 ' : posData.total_remain === 0 ? (!posData.status_open ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-600') : 'bg-rose-50 text-rose-500'}`}>{posData.total_remain.toLocaleString()}</td>
            {
                roundsArray.map((_, i) => {
                    const status = posData.data_call_round?.[i + 1]?.status_work;
                    const call_values = ['completed', 'waiting'].includes(status) ? posData.data_call_round?.[i + 1]?.total : (status === 'exhaustion' ? '-' : (status === 'not-used' ? 0 : null));
                    const status_list = posData.data_call_round?.[i + 1]?.list_status ?? 'no-data';
                    const status_call = posData.data_call_round?.[i + 1]?.call_status ?? 'no-data';
                    const has_no_data = !(status_call === 'no-data' && status_list === 'no-data');
                    const getBagColor = (has_no_data, status_call, status_list) => {
                        if (!has_no_data) return 'cursor-default';
                        if (status_call === true) {
                            return 'cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 hover:border-b-emerald-300';
                        }
                        if (status_call === false && status_list === false) {
                            return 'cursor-pointer hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200 hover:border-b-amber-300';
                        }
                        return 'cursor-pointer hover:bg-rose-50 hover:text-rose-700 transition-colors duration-200 hover:border-b-rose-300';
                    };
                    const bag_color = getBagColor(has_no_data, status_call, status_list);
                    const getButtonColor = (has_no_data, status_call, status_list) => {
                        if (!has_no_data) return 'cursor-default bg-gray-100';
                        if (status_call === true) {
                            return 'bg-emerald-50/90 py-1 text-emerald-800';
                        }
                        if (status_call === false && status_list === false) {
                            return 'bg-amber-50/90 py-1 text-amber-800 ';
                        }
                        return 'bg-rose-50/90 py-1 text-rose-800';
                    };
                    const button_color = getButtonColor(has_no_data, status_call, status_list);
                    return (
                        <td
                            key={i}
                            onClick={status_call === true ? () => handleCellClick(posData.data_call_round?.[i + 1]) : undefined}
                            className={`w-[100px] min-w-[100px] bg-clip-padding relative group p-4 text-center font-bold ${bag_color} ${status_call === true ? 'text-emerald-600' : 'bg-gray-100'}`}>
                            {status_call === true ? (
                                <div className={`transition-transform duration-300 group-hover:-translate-y-2 `}>
                                    {call_values !== undefined && call_values !== null ? (
                                        status_call === true ? call_values.toLocaleString() : (!status_list ? '-' : 0)
                                    ) : null}
                                </div>
                            ) : null}
                            {status_call === true ? (
                                <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out ${button_color}`}>
                                    <div className="flex items-center gap-1 text-xs font-medium">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>รายละเอียด</span>
                                    </div>
                                </div>
                            ) : null}
                        </td>
                    );
                })
            }

            <RoundDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedRound}
            />
        </motion.tr >
    );
}