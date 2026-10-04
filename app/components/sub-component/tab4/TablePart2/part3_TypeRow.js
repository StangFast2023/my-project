import React, { useState } from 'react';
import Part4_PositionRow from './part4_PositionRow';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useColumnStore } from '../../../useTableColumns';
export default function Part3_PositionRow({ typeData, roundsArray, isParentCollapsed, regoin, zone }) {
    const columns = useColumnStore((state) => state.columns);
    const [isTypeExpanded, setIsTypeExpanded] = useState(false);
    const isVisible = !isParentCollapsed && !isTypeExpanded;
    const listed = Number(typeData.total_listed) || 0;
    const listed_n = Number(typeData.total_listed_n) || 0;
    const diff = Number(typeData.total_diff) || 0;
    const called = Number(typeData.total_called) || 0;
    const remain = Number(typeData.total_remain) || 0;
    const percent = listed_n > 0 ? (called / listed_n) * 100 : 0;
    const colorClass = percent < 30 ? "text-rose-600 bg-rose-50" : percent < 70 ? "text-amber-600 bg-amber-50" : percent <= 100 ? "text-emerald-600 bg-emerald-50" : "text-violet-600 bg-violet-50";
    const isFull = percent === 100;
    const hasData = listed_n > 0;
    return (

        <>
            <motion.tr
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-gray-100 font-semibold cursor-pointer hover:bg-gray-200"
                onClick={() => setIsTypeExpanded(!isTypeExpanded)}
            >
                <td className={`w-[400px] min-w-[400px] sticky left-0 z-10 p-3 pl-12 ${typeData.pos_type_id === 1 ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`} style={{ display: columns.all_header ? '' : 'none' }}>
                    <div className="flex items-center gap-2">
                        <motion.div animate={{ rotate: isVisible ? 0 : -90 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
                            <ChevronDown size={20} />
                        </motion.div>
                        <span className="font-bold">
                            {typeData.pos_type_name}
                        </span>
                    </div>
                    {!isVisible ? (<div className="absolute right-3 top-0 bottom-0 flex items-center"> รวม </div>) : null}
                </td>
                {
                    !isVisible
                        ? (
                            <>
                                {!columns.all_header && (<td className={` w-[200px] min-w-[200px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold `}></td>)}
                                {!columns.all_header && (<td className={` w-[100px] min-w-[100px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold `}></td>)}
                                <td className={` w-[100px] min-w-[100px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold `}>{!columns.all_header && 'เขต' + zone.pro_sub_id}</td>
                                {columns.column_part1 && (<td className={` w-[100px] min-w-[100px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold`}></td>)}
                                {columns.column_part2 && (<td className={` w-[120px] min-w-[120px] ${!hasData ? "bg-gray-50 text-gray-400" : (isFull ? "bg-green-50 text-green-700" : ( remain > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-rose-700 text-white' ))} p-4 text-center font-bold`}>{hasData ? (isFull ? 'หมดบัญชี' : ( remain > 0 ? 'คงเหลือ' : 'ขาดแคลน') ) : '-' }</td>)}
                                {columns.column_part3 && (<td className={` w-[120px] min-w-[120px] ${colorClass} p-4 text-center font-bold`}>{hasData ? percent.toFixed(2) + ' %' : 0} </td>)}
                                <td className={` w-[120px] min-w-[120px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold`}>{listed.toLocaleString()}</td>
                                <td className={` w-[120px] min-w-[120px] ${typeData.pos_type_id === 1 ? "bg-blue-200" : typeData.pos_type_id === 2 ? "bg-emerald-200" : "bg-amber-200"} p-4 text-center font-bold`}>{listed_n.toLocaleString()}</td>
                                <td className={` w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-rose-50    text-rose-700 `}>{diff.toLocaleString()}</td>
                                <td className={` w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-emerald-50 text-emerald-700 `}>{called.toLocaleString()}</td>
                                <td className={` w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold ${remain === 0 ? 'text-blue-500 bg-blue-50' : remain > 0 ? 'text-amber-500 bg-amber-50' : 'text-rose-500 bg-rose-100'}`}>{remain.toLocaleString()}</td>
                                {roundsArray.map((_, i) => (<td key={i} className={` w-[100px] min-w-[100px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center`} >{typeData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>))}

                            </>
                        ) : Array.from({ length: roundsArray.length + 10 }).map((_, i) => (<td key={i} className={`${typeData.pos_type_id === 1 ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}></td>))
                }
            </motion.tr>

            <AnimatePresence>
                {isVisible && (
                    <>
                        {Object.values(typeData.data_position).map((pos) => (
                            <Part4_PositionRow key={pos.pos_id} posData={pos} roundsArray={roundsArray} regoin={regoin} zone={zone} />
                        ))}
                        <tr className={`${typeData.pos_type_id === 1 ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} font-bold`} style={{ display: columns.all_header ? '' : 'none' }}>
                            <td className={`w-[400px] min-w-[400px] ${typeData.pos_type_id === 1 ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} sticky z-10 left-0 p-3 pl-12`}>
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 lg:col-span-4 px-3 py-1 text-right">
                                        รวม
                                    </div>
                                    <div className={`col-span-12 lg:col-span-8 px-3 py-1 rounded-lg text-center ${typeData.pos_type_id === 1 ? "bg-blue-300 text-blue-900" : typeData.pos_type_id === 2 ? "bg-emerald-300 text-emerald-900" : "bg-amber-300 text-amber-900"}`}>
                                        {typeData.pos_type_name}
                                    </div>
                                </div>
                            </td>
                            {!columns.all_header && (<td className=" w-[200px] min-w-[200px] bg-emerald-100 p-4 text-center font-bold" />)}
                            {!columns.all_header && (<td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold" />)}
                            <td className={`w-[100px] min-w-[100px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold `}></td>
                            {columns.column_part1 && (<td className={`w-[100px] min-w-[100px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold `}></td>)}
                            {columns.column_part2 && (<td className={`w-[120px] min-w-[120px] ${!hasData ? "bg-gray-50 text-gray-400" : (isFull ? "bg-green-50 text-green-700" : (remain > 0 ? "bg-yellow-50 text-yellow-700 " : "bg-rose-700 text-white "))} bg-clip-padding p-4 text-center font-bold`}>{hasData ? (isFull ? 'หมดบัญชี' : (remain > 0 ? 'คงเหลือ' : 'ขาดแคลน')) : '-'}</td>)}
                            {columns.column_part3 && (<td className={`w-[120px] min-w-[120px] ${colorClass} p-4 text-center font-bold`}>{hasData ? percent.toFixed(2) + ' %' : 0} </td>)}
                            <td className={`w-[120px] min-w-[120px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center font-bold `}>{listed.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] ${typeData.pos_type_id === 1 ? "bg-blue-200" : typeData.pos_type_id === 2 ? "bg-emerald-200" : "bg-amber-200"} p-4 text-center font-bold `}>{listed_n.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-rose-50    bg-clip-padding text-rose-700`}>{diff.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-emerald-50 bg-clip-padding text-emerald-700`}>{called.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-clip-padding ${remain === 0 ? 'text-blue-500 bg-blue-50' : remain > 0 ? 'text-amber-500 bg-amber-50' : 'text-rose-500 bg-rose-100'}`}>{remain.toLocaleString()}</td>
                            {roundsArray.map((_, i) => (<td key={i} className={`w-[100px] min-w-[100px] ${typeData.pos_type_id === 1 ? "bg-blue-100" : typeData.pos_type_id === 2 ? "bg-emerald-100" : "bg-amber-100"} p-4 text-center`} >{typeData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>))}
                        </tr>
                    </>
                )}
            </AnimatePresence>
        </>

    );
}