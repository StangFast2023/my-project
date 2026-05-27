import React, { useState }              from 'react'; 
import Part4_PositionRow                from './part4_PositionRow';
import { AnimatePresence, motion }      from 'framer-motion';
import { ChevronDown }                  from 'lucide-react';
export default function Part3_PositionRow({ typeData, roundsArray, isParentCollapsed }) {
    const [isTypeExpanded, setIsTypeExpanded] = useState(false);
    const isVisible = !isParentCollapsed && !isTypeExpanded;
    const listed = Number(typeData.total_listed) || 0;
    const called = Number(typeData.total_called) || 0;
    const percent = listed > 0 ? (called / listed) * 100 : 0;
    const colorClass = percent < 30 ? "text-rose-600 bg-rose-50" 
                    : percent < 70 ? "text-amber-600 bg-amber-50" 
                    : "text-emerald-600 bg-emerald-50";
    const colorLine = percent < 30 ? "outline outline-1 outline-rose-400" 
                    : percent < 70 ? "outline outline-1 outline-amber-400 " 
                    : "outline outline-1 outline-emerald-400";
    const isFull = percent === 100;
    const hasData = listed > 0;
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
                <td className={`sticky left-0 z-10 p-3 pl-12 ${typeData.pos_type_id === "1" ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === "2" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} `}>
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: isVisible ? 0 : -90 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px'
                            }}
                        >
                            <ChevronDown size={20} /> 
                        </motion.div>
                        <span className="font-bold">
                            {typeData.pos_type_name}
                        </span>
                    </div>
                    { !isVisible ? ( <div className="absolute right-3 top-0 bottom-0 flex items-center"> รวม </div> ) : null }
                </td>
                {
                    !isVisible
                    ?
                        (
                            <>
                                <td className={`${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                                <td className={`${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                                <td className={`${!hasData ? "bg-gray-50 text-gray-400" : (isFull ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700")} w-[120px] min-w-[120px] p-4 text-center font-bold`}>
                                    {hasData ? (isFull ? 'หมดบัญชี' : 'คงเหลือ') : '-'}
                                </td>
                                <td className={`${colorClass} w-[120px] min-w-[120px] p-4 text-center font-bold`}>
                                    {hasData ? percent.toFixed(2) + ' %' : 0} 
                                </td>
                                <td className={`${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center font-bold `}>{typeData.total_listed.toLocaleString()}</td>
                                {roundsArray.map((_, i) => (
                                    <td key={i} className={`${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center`} >
                                        {typeData.total_each_round?.[i + 1]?.total.toLocaleString() || null }
                                    </td>
                                ))}
                                <td className={`top-0 z-10 w-[100px] min-w-[100px] p-4 text-center font-bold bg-emerald-50 text-emerald-700 `}>{typeData.total_called.toLocaleString()}</td>
                                <td className={`top-0 z-10 w-[100px] min-w-[100px] p-4 text-center font-bold bg-amber-50   text-amber-500 `}>{typeData.total_remain.toLocaleString()}</td>
                            </>
                        )
                    : 
                        ( Array.from({ length: roundsArray.length + 7 }).map((_, i) => <td key={i} className={`${typeData.pos_type_id === "1" ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === "2" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}></td>) )
                }
            </motion.tr>
            <AnimatePresence>
                    {isVisible &&
                        <>
                            {Object.values(typeData.data_position).map((pos) => (
                                <Part4_PositionRow key={pos.pos_id} posData={pos} roundsArray={roundsArray} />
                            ))}
                            <tr className={`${typeData.pos_type_id === "1" ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === "2" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} font-bold`}>
                                <td className={`${typeData.pos_type_id === "1" ? "bg-blue-100 text-blue-700" : typeData.pos_type_id === "2" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} w-[400px] min-w-[400px] sticky z-10 left-0 p-3 pl-12`}>
                                    <div className="grid grid-cols-12 gap-6">
                                        <div className="col-span-12 lg:col-span-4 px-3 py-1 text-right">
                                            รวม
                                        </div>
                                        <div className={`col-span-12 lg:col-span-8 px-3 py-1 rounded-lg text-center ${typeData.pos_type_id === "1" ? "bg-blue-300 text-blue-900" : typeData.pos_type_id === "2" ? "bg-emerald-300 text-emerald-900" : "bg-amber-300 text-amber-900"}`}>
                                            {typeData.pos_type_name}
                                        </div>
                                    </div>
                                </td>
                                <td className={`${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                                <td className={`${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                                <td className={`${!hasData ? "bg-gray-50 text-gray-400" : (isFull ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700 ")} bg-clip-padding w-[120px] min-w-[120px] p-4 text-center font-bold`}>{hasData ? (isFull ? 'หมดบัญชี' : 'คงเหลือ') : '-'}</td>
                                <td className={`${colorClass} w-[120px] min-w-[120px] p-4 text-center font-bold`}>{hasData ? percent.toFixed(2) + ' %' : 0} </td>
                                <td className={` ${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center font-bold `}>{typeData.total_listed.toLocaleString()}</td>
                                {roundsArray.map((_, i) => (
                                    <td key={i} className={`${typeData.pos_type_id === "1" ? "bg-blue-100" : typeData.pos_type_id === "2" ? "bg-emerald-100" : "bg-amber-100"} w-[100px] min-w-[100px] p-4 text-center`} >
                                        {typeData.total_each_round?.[i + 1]?.total.toLocaleString() || null }
                                    </td>
                                ))}
                                <td className={`top-0 z-10 w-[100px] min-w-[100px] p-4 text-center font-bold bg-emerald-50 bg-clip-padding text-emerald-700`}>{typeData.total_called.toLocaleString()}</td>
                                <td className={`top-0 z-10 w-[100px] min-w-[100px] p-4 text-center font-bold bg-amber-50   bg-clip-padding text-amber-500`}>{typeData.total_remain.toLocaleString()}</td>
                            </tr>
                        </>
                    }
            </AnimatePresence>
        </>
    );
}