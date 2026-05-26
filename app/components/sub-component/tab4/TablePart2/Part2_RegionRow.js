import React                        from 'react';
import Part3_TypeRow                from './part3_TypeRow';
import { AnimatePresence, motion }  from 'framer-motion';
import { ChevronDown }              from 'lucide-react';

export default function Part2_RegionRow({ regionKey, regionData, collapsedIDs, toggleRegionCollapse, toggleCollapse, roundsArray }) {
  const isRegionCollapsed = !!collapsedIDs[regionKey];
  return (
    <>
      <motion.tr 
        className="bg-emerald-100 font-bold text-emerald-900 cursor-pointer hover:bg-emerald-200" 
        onClick={() => toggleRegionCollapse(regionKey)}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <td className="sticky left-0 z-10 bg-emerald-100 p-4">
            <div className="flex items-center gap-2">
                <motion.div
                    animate={{ rotate: isRegionCollapsed ? -90 : 0 }}
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
                    {regionData.pro_main_name}
                </span>
            </div>
        </td>
        {Array.from({ length: roundsArray.length + 7 }).map((_, i) => <td key={i} className="bg-emerald-100"></td>)}
      </motion.tr>
        <AnimatePresence initial={false}>
            {!isRegionCollapsed && (
                <>
                    {Object.entries(regionData.pro_sub).map(([provSubID, provSubData]) => {
                        const currentID = `${regionKey}_${provSubID}`;
                        const isCollapsed = !!collapsedIDs[currentID];
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
                                    <td className="sticky left-0 z-10 bg-emerald-50 p-4 pl-8">
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ rotate: isCollapsed ? -90 : 0 }}
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
                                                {provSubData.pro_sub_name}
                                            </span>
                                        </div>
                                    </td>
                                    {Array.from({ length: roundsArray.length + 7 }).map((_, i) => <td key={i} className="bg-emerald-50"></td>)}
                                </motion.tr>

                                <AnimatePresence initial={false}>
                                    {!isCollapsed && 
                                        <>
                                            {Object.entries(provSubData.data_type_position).map(([typeID, typeData]) => (
                                                <Part3_TypeRow key={typeID} typeData={typeData} roundsArray={roundsArray} isParentCollapsed={isCollapsed} />
                                            ))}
                                            <tr className={`bg-emerald-50 font-bold border-t-2 border-gray-300`}>
                                                <td className={`border-r-2 border-gray-600 bg-emerald-100 w-[400px] min-w-[400px] sticky z-999 left-0 p-3 pl-12`}>
                                                    <div className="grid grid-cols-12 gap-6">
                                                        <div className="col-span-12 lg:col-span-4 px-3 py-1 text-right">
                                                            รวม
                                                        </div>
                                                        <div className="col-span-12 lg:col-span-8 bg-emerald-300 px-3 py-1 rounded-lg text-emerald-900 text-center">
                                                            {provSubData.pro_sub_name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`bg-emerald-50 w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                                                <td className={`bg-emerald-50 w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                                                <td className={`${provSubData.total_called / provSubData.total_listed * 100 == 100 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"} w-[120px] min-w-[120px] p-4 text-center font-bold border-l-1`}>
                                                    {   ( ( provSubData.total_called / provSubData.total_listed ) * 100 ) > 0 
                                                        ?   ( ( ( provSubData.total_called / provSubData.total_listed ) * 100 ) == 100 ? 'หมดบัญชี' : 'คงเหลือ' )
                                                        :   null
                                                    }
                                                </td>
                                                <td className={`${( provSubData.total_called / provSubData.total_listed ) * 100 < 30 ? "text-rose-600 bg-rose-50" : ( provSubData.total_called / provSubData.total_listed ) * 100 < 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"} w-[120px] min-w-[120px] p-4 text-center font-bold border-l-1`}>
                                                    {( ( provSubData.total_called / provSubData.total_listed ) * 100 ).toFixed(2)} %
                                                </td>
                                                <td className={`border-l-1 bg-emerald-50 w-[100px] min-w-[100px] p-4 text-center font-bold `}>{provSubData.total_listed.toLocaleString()}</td>
                                                <td className={`w-[100px] min-w-[100px] p-4 text-center font-bold bg-emerald-50 text-emerald-700  border-l-1`}>{provSubData.total_called.toLocaleString()}</td>
                                                <td className={`w-[100px] min-w-[100px] p-4 text-center font-bold bg-amber-50 text-amber-500 border-l-1 border-r-1`}>{provSubData.total_remain.toLocaleString()}</td>
                                                {roundsArray.map((_, i) => (
                                                    <td key={i} className="bg-emerald-50 w-[100px] min-w-[100px] p-4 text-center border-l border-black">
                                                        {provSubData.total_each_round?.[i + 1]?.total.toLocaleString() || null }
                                                    </td>
                                                ))}
                                            </tr>
                                        </>
                                    }
                                </AnimatePresence>
                            </React.Fragment>
                        );
                    })}

                    <tr className={`bg-emerald-100 font-bold border-t-2 border-gray-300`}>
                        <td className={` border-r-2 border-gray-600 bg-emerald-100 w-[400px] min-w-[400px] sticky z-999 left-0 p-3 pl-12`}>
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 lg:col-span-4 px-3 py-1 text-right">
                                    รวม
                                </div>
                                <div className="col-span-12 lg:col-span-8 bg-emerald-300 px-3 py-1 rounded-lg text-emerald-900 text-center">
                                    {regionData.pro_main_name}
                                </div>
                            </div>
                        </td>
                        <td className={`bg-emerald-100 w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                        <td className={`bg-emerald-100 w-[100px] min-w-[100px] p-4 text-center font-bold `}></td>
                        <td className={`${regionData.total_called / regionData.total_listed * 100 == 100 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"} w-[120px] min-w-[120px] p-4 text-center font-bold border-l-1`}>
                            {   ( ( regionData.total_called / regionData.total_listed ) * 100 ) > 0 
                                ?   ( ( ( regionData.total_called / regionData.total_listed ) * 100 ) == 100 ? 'หมดบัญชี' : 'คงเหลือ' )
                                :   null
                            }
                        </td>
                        <td className={`${( regionData.total_called / regionData.total_listed ) * 100 < 30 ? "text-rose-600 bg-rose-50" : ( typeData.total_called / typeData.total_listed ) * 100 < 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"} w-[120px] min-w-[120px] p-4 text-center font-bold border-l-1`}>
                            {( ( regionData.total_called / regionData.total_listed ) * 100 ).toFixed(2)} %
                        </td>
                        <td className={`border-l-1 bg-emerald-100 w-[100px] min-w-[100px] p-4 text-center font-bold `}>{regionData.total_listed.toLocaleString()}</td>
                        <td className={`border-l-1 w-[100px] min-w-[100px] p-4 text-center font-bold bg-emerald-50 text-emerald-700`}>{regionData.total_called.toLocaleString()}</td>
                        <td className={`border-r-1 border-l-1 w-[100px] min-w-[100px] p-4 text-center font-bold bg-amber-50 text-amber-500`}>{regionData.total_remain.toLocaleString()}</td>
                        {roundsArray.map((_, i) => (
                            <td key={i} className="bg-emerald-100 w-[100px] min-w-[100px] p-4 text-center border-l border-black">
                                {regionData.total_each_round?.[i + 1]?.total.toLocaleString() || null }
                            </td>
                        ))}
                    </tr>
                </>
            ) }
        </AnimatePresence>
    </>
  );
}