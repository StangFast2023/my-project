import React                        from 'react';
import Part3_TypeRow                from './part3_TypeRow';
import { AnimatePresence, motion }  from 'framer-motion';
import { ChevronDown }              from 'lucide-react';
import { useColumnStore }           from '../../../useTableColumns';

export default function Part2_RegionRow({ regionKey, regionData, collapsedIDs, toggleRegionCollapse, toggleCollapse, roundsArray , isExpanded }) {
    const columns = useColumnStore((state) => state.columns);
    const isRegionCollapsed = !!collapsedIDs[regionKey];
    const listed = Number(regionData.total_listed) || 0;
    const called = Number(regionData.total_called) || 0;
    const percent = listed > 0 ? (called / listed) * 100 : 0;
    const statusClass = percent === 100 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700";
    const percentClass = percent < 30 ? "text-rose-600 bg-rose-50" : percent < 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";
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
                            {!columns.all_header && (           <td className=" w-[200px] min-w-[200px] bg-emerald-100 p-4 text-center font-bold" />)}
                            {!columns.all_header && (           <td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold" />)}
                                                                <td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold"></td>
                            {columns.column_part1 &&            <td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold"></td>}
                            {columns.column_part2 &&            <td className={`w-[120px] min-w-[120px] ${statusClass} p-4 text-center font-bold`}>{listed > 0 ? (percent === 100 ? 'หมดบัญชี' : 'คงเหลือ') : '-'}</td>}
                            {columns.column_part3 &&            <td className={`w-[120px] min-w-[120px] ${percentClass} p-4 text-center font-bold`}>{listed > 0 ? `${percent.toFixed(2)} %` : 0}</td>}
                                                                <td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold">{regionData.total_listed.toLocaleString()}</td>
                            {roundsArray.map((_, i) =>  <td key={i} className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center">{regionData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>)}
                                                                <td className=" w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-emerald-50 text-emerald-700">{regionData.total_called.toLocaleString()}</td>
                                                                <td className=" w-[120px] min-w-[120px] top-0 z-10 p-4 text-center font-bold bg-amber-50 text-amber-500">{regionData.total_remain.toLocaleString()}</td>
                        </>
                    ) : Array.from({ length: roundsArray.length + 8 }).map((_, i) => <td key={i} className="bg-emerald-100"></td>)
                }
            </motion.tr>



            <AnimatePresence initial={false}>
                {!isRegionCollapsed && (
                    <>
                        {Object.entries(regionData.pro_sub).map(([provSubID, provSubData]) => {
                            const currentID = `${regionKey}_${provSubID}`;
                            const isCollapsed = !!collapsedIDs[currentID];
                            const s_listed = Number(provSubData.total_listed) || 0;
                            const s_called = Number(provSubData.total_called) || 0;
                            const s_percent = s_listed > 0 ? (s_called / s_listed) * 100 : 0;
                            const s_statusClass = s_percent === 100 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700";
                            const s_percentClass = s_percent < 30 ? "text-rose-600 bg-rose-50" : s_percent < 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";
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
                                                    {!columns.all_header && (           <td className=" w-[200px] min-w-[200px] bg-emerald-50 p-4 text-center font-bold" />)}
                                                    {!columns.all_header && (           <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold" />)}
                                                                                        <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>
                                                    {columns.column_part1 &&            <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>}
                                                    {columns.column_part2 &&            <td className={`w-[120px] min-w-[120px] ${s_statusClass}  p-4 text-center font-bold`}>{s_listed > 0 ? (s_percent === 100 ? 'หมดบัญชี' : 'คงเหลือ') : '-'}</td>}
                                                    {columns.column_part3 &&            <td className={`w-[120px] min-w-[120px] ${s_percentClass} p-4 text-center font-bold`}>{s_listed > 0 ? `${s_percent.toFixed(2)} %` : 0}</td>}
                                                                                        <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold">{provSubData.total_listed.toLocaleString()}</td>
                                                    {roundsArray.map((_, i) =>  <td key={i} className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center">{provSubData.total_each_round?.[i + 1]?.total.toLocaleString() || null }</td>)}
                                                                                        <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-emerald-50 text-emerald-700">{provSubData.total_called.toLocaleString()}</td>
                                                                                        <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-amber-50 text-amber-500">{provSubData.total_remain.toLocaleString()}</td>
                                                </>
                                            ) : Array.from({ length: roundsArray.length + 8 }).map((_, i) => <td key={i} className="bg-emerald-50"></td>)
                                        }
                                    </motion.tr>

                                    <AnimatePresence initial={false}>
                                        {!isCollapsed && (
                                            <>
                                                {
                                                    Object.entries(provSubData.data_type_position).map(([typeID, typeData]) => (
                                                        <Part3_TypeRow key={typeID} typeData={typeData} roundsArray={roundsArray} isRegionCollapsed={isRegionCollapsed} isCollapsed={isCollapsed} isParentCollapsed={isRegionCollapsed || isCollapsed} regoin={regionData} zone={provSubData} isExpanded={isExpanded} />
                                                    ))
                                                }
                                                {
                                                    !isCollapsed && (
                                                        <tr className="bg-emerald-50 font-bold" style={{ display: columns.all_header ? '' : 'none' }}>
                                                            <td className=" w-[400px] min-w-[400px] bg-emerald-50 sticky z-10 left-0 p-3 pl-12"><div className="grid grid-cols-12 gap-6"><div className="col-span-12 lg:col-span-4 px-3 py-1 text-right">รวม</div><div className="col-span-12 lg:col-span-8 bg-emerald-300 px-3 py-1 rounded-lg text-emerald-900 text-center">{provSubData.pro_sub_name}</div></div></td>
                        {!columns.all_header && (           <td className=" w-[200px] min-w-[200px] bg-emerald-50 p-4 text-center font-bold"></td>)}
                        {!columns.all_header && (           <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>)}
                                                            <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>
                        {columns.column_part1 && (          <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold"></td>)}
                        {columns.column_part2 && (          <td className={`w-[120px] min-w-[120px] ${s_statusClass} p-4 text-center font-bold`}>{s_listed > 0 ? (s_percent === 100 ? 'หมดบัญชี' : 'คงเหลือ') : '-'}</td>)}
                        {columns.column_part3 && (          <td className={`w-[120px] min-w-[120px] ${s_percentClass} p-4 text-center font-bold`}>{s_listed > 0 ? `${s_percent.toFixed(2)} %` : 0}</td>)}
                                                            <td className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center font-bold">{provSubData.total_listed.toLocaleString()}</td>
                        {roundsArray.map((_, i) => (<td key={i} className=" w-[100px] min-w-[100px] bg-emerald-50 p-4 text-center">{provSubData.total_each_round?.[i + 1]?.total.toLocaleString() || null}</td>))}
                                                            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-emerald-50 text-emerald-700">{provSubData.total_called.toLocaleString()}</td>
                                                            <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold bg-amber-50 text-amber-500">{provSubData.total_remain.toLocaleString()}</td>
                                                        </tr>
                                                    )
                                                }
                                            </>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            );
                        })}

                        <tr className={`bg-emerald-100 font-bold`}  style={{ display: columns.all_header ? '' : 'none' }}>
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
                            {!columns.all_header && (           <td className=" w-[200px] min-w-[200px] bg-emerald-100 p-4 text-center font-bold" />)}
                            {!columns.all_header && (           <td className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold" />)}
                                                                <td className={`w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold `}></td>
                            {columns.column_part1 && (          <td className={`w-[100px] min-w-[100px] bg-emerald-100  p-4 text-center font-bold `}></td>)}
                            {columns.column_part2 && (          <td className={`w-[120px] min-w-[120px] ${statusClass}  p-4 text-center font-bold`}>{listed > 0 ? (percent === 100 ? 'หมดบัญชี' : 'คงเหลือ') : '-'}</td>)}
                            {columns.column_part3 && (          <td className={`w-[120px] min-w-[120px] ${percentClass} p-4 text-center font-bold`}>{listed > 0 ? `${percent.toFixed(2)} %` : 0 }</td>)}
                                                                <td className={`w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center font-bold `}>{regionData.total_listed.toLocaleString()}</td>
                            {roundsArray.map((_, i) => (<td key={i} className=" w-[100px] min-w-[100px] bg-emerald-100 p-4 text-center">{regionData.total_each_round?.[i + 1]?.total.toLocaleString() || null }</td>))}
                                                                <td className={`w-[120px] min-w-[120px] bg-clip-padding p-4 text-center font-bold bg-emerald-50 text-emerald-700`}>{regionData.total_called.toLocaleString()}</td>
                                                                <td className={`w-[120px] min-w-[120px] bg-clip-padding p-4 text-center font-bold bg-amber-50 text-amber-500`}>{regionData.total_remain.toLocaleString()}</td>
                        </tr>
                    
                    </>
                ) }
            </AnimatePresence>
        </>
    );
}