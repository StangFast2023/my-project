import React from 'react';
import Part3_TypeRow from './part3_TypeRow';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useColumnStore } from '../../../useTableColumns';

export default function Part2_RegionRow({ regionKey, regionData, collapsedIDs, toggleRegionCollapse, toggleCollapse, roundsArray }) {
    const columns = useColumnStore((state) => state.columns);
    const isRegionCollapsed = !!collapsedIDs[regionKey];
    const listed = Number(regionData.total_listed) || 0;
    const listed_n = Number(regionData.total_listed_n) || 0;
    const diff = Number(regionData.total_diff) || 0;
    const called = Number(regionData.total_called) || 0;
    const remain = Number(regionData.total_remain) || 0;
    const percent = listed_n > 0 ? (called / listed_n) * 100 : 0;
    const statusClass = percent === 100 ? "bg-green-50 text-green-700" : (remain > 0 ? "bg-yellow-50 text-yellow-700" : "bg-rose-700 text-white");
    const percentClass = percent < 30 ? "text-rose-600 bg-rose-50" : percent < 70 ? "text-amber-600 bg-amber-50" : (percent <= 100 ? "text-emerald-600 bg-emerald-50" : "text-violet-600 bg-violet-50");
    return (
        <>

            <motion.tr
                className="bg-emerald-100 font-bold text-emerald-900 cursor-pointer"
                onClick={() => toggleRegionCollapse(regionKey)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: columns.all_header ? '' : 'none' }}
            >
                <td className="w-[400px] min-w-[400px] sticky left-0 z-10 bg-emerald-100 p-4">
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: isRegionCollapsed ? -90 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                        >
                            <ChevronDown size={20} />
                        </motion.div>
                        <span className="font-bold">{regionData.pro_main_name}</span>
                    </div>
                    {isRegionCollapsed && <div className="absolute right-3 top-0 bottom-0 flex items-center"> รวม </div>}
                </td>
                {
                    isRegionCollapsed ? (
                        <>
                            {!columns.all_header && (<td className=" w-[200px] min-w-[200px] bg-emerald-100 p-4 text-center font-bold" />)}
                            {!columns.all_header && (<td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold" />)}
                            <td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold"></td>
                            {columns.column_part1 && <td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold"></td>}
                            {columns.column_part2 && <td className={`w-[120px] min-w-[120px] ${statusClass} p-4 text-center font-bold`}>{listed_n > 0 ? (percent === 100 ? 'หมดบัญชี' : (remain > 0 ? 'คงเหลือ' : 'ขาดแคลน')) : '-'}</td>}
                            {columns.column_part3 && <td className={`w-[120px] min-w-[120px] ${percentClass} p-4 text-center font-bold`}>{listed_n > 0 ? `${percent.toFixed(2)} %` : 0}</td>}
                            <td className=" w-[120px] min-w-[120px] bg-gray-100 p-4 text-center font-bold text-gray-700">{listed.toLocaleString()}</td>
                            <td className=" w-[120px] min-w-[120px] bg-gray-200 p-4 text-center font-bold text-gray-700">{listed_n.toLocaleString()}</td>
                            <td className=" w-[120px] min-w-[120px] bg-rose-100 p-4 text-center font-bold text-rose-700">{diff.toLocaleString()}</td>
                            <td className=" w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-emerald-50 text-emerald-700">{called.toLocaleString()}</td>
                            <td className=" w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-amber-50 text-amber-500">{remain.toLocaleString()}</td>
                            {roundsArray.map((_, i) => <td key={i} className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center">{regionData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>)}
                        </>
                    ) : Array.from({ length: roundsArray.length + 10 }).map((_, i) => <td key={i} className="bg-emerald-100"></td>)
                }
            </motion.tr>



            <AnimatePresence initial={false}>
                {!isRegionCollapsed && (
                    <>
                        {Object.entries(regionData.pro_sub).map(([provSubID, provSubData]) => {
                            console.log(provSubData);
                            const currentID = `${regionKey}_${provSubID}`;
                            const isCollapsed = !!collapsedIDs[currentID];
                            const s_listed = Number(provSubData.total_listed) || 0;
                            const s_listed_n = Number(provSubData.total_listed_n) || 0;
                            const s_diff = Number(provSubData.total_diff) || 0;
                            const s_called = Number(provSubData.total_called) || 0;
                            const s_remain = Number(provSubData.total_remain) || 0;
                            const s_percent = s_listed_n > 0 ? (s_called / s_listed_n) * 100 : 0;
                            const s_statusClass = s_percent === 100 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700";
                            const s_percentClass = s_percent < 30 ? "text-rose-600 bg-rose-50" : s_percent < 70 ? "text-amber-600 bg-amber-50" : s_percent <= 100 ? "text-emerald-600 bg-emerald-50" : "text-violet-600 bg-violet-50";

                            return (
                                <React.Fragment key={currentID}>
                                    <motion.tr
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="bg-gray-100 font-semibold cursor-pointer hover:bg-gray-200"
                                        onClick={() => toggleCollapse(currentID)}
                                    >
                                        {columns.all_header && (
                                            <td className="sticky left-0 z-10 bg-emerald-50 p-4 pl-8">
                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        animate={{ rotate: isCollapsed ? -90 : 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}
                                                    >
                                                        <ChevronDown size={20} />
                                                    </motion.div>
                                                    <span className="font-bold">{provSubData.pro_sub_name}</span>
                                                </div>
                                                {isCollapsed && <div className="absolute right-3 top-0 bottom-0 flex items-center"> รวม </div>}
                                            </td>
                                        )}
                                        {isCollapsed ? (
                                            <>
                                                {!columns.all_header && (<td className=" w-[200px] min-w-[200px] bg-emerald-50 p-4 text-center font-bold" />)}
                                                {!columns.all_header && (<td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold" />)}
                                                <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>
                                                {columns.column_part1 && <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>}
                                                {columns.column_part2 && <td className={`w-[120px] min-w-[120px] ${s_statusClass}  p-4 text-center font-bold`}>{s_listed_n > 0 ? (s_percent === 100 ? 'หมดบัญชี' : (s_remain > 0 ? 'คงเหลือ' : 'ขาดแคลน')) : '-'}</td>}
                                                {columns.column_part3 && <td className={`w-[120px] min-w-[120px] ${s_percentClass} p-4 text-center font-bold`}>{s_listed_n > 0 ? `${s_percent.toFixed(2)} %` : 0}</td>}
                                                <td className=" w-[120px] min-w-[120px] bg-gray-50  p-4 text-center font-bold text-gray-700">{s_listed.toLocaleString()}</td>
                                                <td className=" w-[120px] min-w-[120px] bg-gray-100 p-4 text-center font-bold text-gray-700">{s_listed_n.toLocaleString()}</td>
                                                <td className=" w-[120px] min-w-[120px] bg-rose-50  p-4 text-center font-bold text-rose-700">{s_diff.toLocaleString()}</td>
                                                <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-emerald-50 text-emerald-700">{s_called.toLocaleString()}</td>
                                                <td className={`w-[120px] min-w-[120px] p-4 text-center font-bold ${s_remain === 0 ? 'bg-blue-50 text-blue-500' : s_remain > 0 ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>{s_remain.toLocaleString()}</td>
                                                {roundsArray.map((_, i) => <td key={i} className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center">{provSubData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>)}
                                            </>
                                        ) : Array.from({ length: roundsArray.length + 10 }).map((_, i) => <td key={i} className="bg-emerald-50"></td>)
                                        }
                                    </motion.tr>

                                    <AnimatePresence initial={false}>
                                        {!isCollapsed && (
                                            <>
                                                {
                                                    Object.entries(provSubData.data_type_position).map(([typeID, typeData]) => (
                                                        <Part3_TypeRow key={typeID} typeData={typeData} roundsArray={roundsArray} isParentCollapsed={isRegionCollapsed || isCollapsed} regoin={regionData} zone={provSubData} />
                                                    ))
                                                }
                                                {
                                                    !isCollapsed && (
                                                        <tr className="bg-emerald-50 font-bold" style={{ display: columns.all_header ? '' : 'none' }}>
                                                            <td className=" w-[400px] min-w-[400px] bg-emerald-50 sticky z-10 left-0 p-3 pl-12"><div className="grid grid-cols-12 gap-6"><div className="col-span-12 lg:col-span-4 px-3 py-1 text-right">รวม</div><div className="col-span-12 lg:col-span-8 bg-emerald-300 px-3 py-1 rounded-lg text-emerald-900 text-center">{provSubData.pro_sub_name}</div></div></td>
                                                            {!columns.all_header && (<td className=" w-[200px] min-w-[200px] bg-emerald-50 p-4 text-center font-bold"></td>)}
                                                            {!columns.all_header && (<td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>)}
                                                            <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>
                                                            {columns.column_part1 && (<td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>)}
                                                            {columns.column_part2 && (<td className={`w-[120px] min-w-[120px] ${s_statusClass} p-4 text-center font-bold`}>{s_listed_n > 0 ? (s_percent === 100 ? 'หมดบัญชี' : (s_remain > 0 ? 'คงเหลือ' : 'ขาดแคลน')) : '-'}</td>)}
                                                            {columns.column_part3 && (<td className={`w-[120px] min-w-[120px] ${s_percentClass} p-4 text-center font-bold`}>{s_listed_n > 0 ? `${s_percent.toFixed(2)} %` : 0}</td>)}
                                                            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-gray-50  text-gray-700">{s_listed.toLocaleString()}</td>
                                                            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-gray-100 text-gray-700">{s_listed_n.toLocaleString()}</td>
                                                            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-rose-50  text-rose-700">{s_diff.toLocaleString()}</td>
                                                            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-emerald-50 text-emerald-700">{s_called.toLocaleString()}</td>
                                                            <td className={`w-[120px] min-w-[120px] p-4 text-center font-bold ${s_remain === 0 ? 'bg-blue-50 text-blue-500' : s_remain > 0 ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>{s_remain.toLocaleString()}</td>
                                                            {roundsArray.map((_, i) => (<td key={i} className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center">{provSubData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>))}
                                                        </tr>
                                                    )
                                                }
                                            </>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            );
                        })}

                        <tr className={`bg-emerald-100 font-bold`} style={{ display: columns.all_header ? '' : 'none' }}>
                            <td className={`w-[400px] min-w-[400px] bg-emerald-100 sticky z-10 left-0 p-3 pl-12`}>
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 lg:col-span-4 px-3 py-1 text-right">
                                        รวม
                                    </div>
                                    <div className="col-span-12 lg:col-span-8 bg-emerald-300 px-3 py-1 rounded-lg text-emerald-900 text-center">
                                        {regionData.pro_main_name}
                                    </div>
                                </div>
                            </td>
                            {!columns.all_header && (<td className=" w-[200px] min-w-[200px] bg-emerald-100 p-4 text-center font-bold" />)}
                            {!columns.all_header && (<td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold" />)}
                            <td className={`w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold `}></td>
                            {columns.column_part1 && (<td className={`w-[100px] min-w-[100px] bg-emerald-100  p-4 text-center font-bold `}></td>)}
                            {columns.column_part2 && (<td className={`w-[120px] min-w-[120px] ${statusClass}  p-4 text-center font-bold`}>{listed_n > 0 ? (percent === 100 ? 'หมดบัญชี' : (remain > 0 ? 'คงเหลือ' : 'ขาดแคลน')) : '-'}</td>)}
                            {columns.column_part3 && (<td className={`w-[120px] min-w-[120px] ${percentClass} p-4 text-center font-bold`}>{listed_n > 0 ? `${percent.toFixed(2)} %` : 0}</td>)}
                            <td className={`w-[120px] min-w-[120px] bg-gray-100 p-4 text-center font-bold  text-gray-700`}>{listed.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] bg-gray-200 p-4 text-center font-bold  text-gray-700`}>{listed_n.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] bg-rose-200 p-4 text-center font-bold  text-rose-700`}>{diff.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] bg-clip-padding p-4 text-center font-bold bg-emerald-50 text-emerald-700`}>{called.toLocaleString()}</td>
                            <td className={`w-[120px] min-w-[120px] bg-clip-padding p-4 text-center font-bold ${remain === 0 ? 'bg-blue-50 text-blue-500' : (remain > 0 ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500')}`}>{remain.toLocaleString()}</td>
                            {roundsArray.map((_, i) => (<td key={i} className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center">{regionData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>))}
                        </tr>

                    </>
                )}
            </AnimatePresence>
        </>
    );
}