import React                        from 'react';
import Part3_PositionRow            from './part3_PositionRow';
import { AnimatePresence, motion }  from 'framer-motion';

export default function Part2_RegionRow({ regionKey, regionData, collapsedIDs, toggleRegionCollapse, toggleCollapse, roundsArray }) {
  const isRegionCollapsed = !!collapsedIDs[regionKey];
  return (
    <>
      <motion.tr 
        className="bg-emerald-100 font-bold text-emerald-900 cursor-pointer hover:bg-emerald-200" 
        onClick={() => toggleRegionCollapse(regionKey)}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <td className="sticky left-0 z-10 bg-emerald-100 p-4">{isRegionCollapsed ? "▶" : "▼"} {regionData.pro_main_name}</td>
        {Array.from({ length: roundsArray.length + 7 }).map((_, i) => <td key={i} className="bg-emerald-100"></td>)}
      </motion.tr>
        <AnimatePresence initial={false}>
            {!isRegionCollapsed && Object.entries(regionData.pro_sub).map(([provSubID, provSubData]) => {
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
                            <td className="sticky left-0 z-10 p-4 pl-8 bg-emerald-50">{isCollapsed ? "▶" : "▼"} {provSubData.pro_sub_name}</td>
                            {Array.from({ length: roundsArray.length + 8 }).map((_, i) => <td key={i} className="bg-emerald-50"></td>)}
                        </motion.tr>

                        <AnimatePresence initial={false}>
                            {!isCollapsed && Object.entries(provSubData.data_position).map(([posID, posData]) => (
                                <Part3_PositionRow key={posID} posData={posData} roundsArray={roundsArray} />
                            ))}
                        </AnimatePresence>
                    </React.Fragment>
                );
            })}
        </AnimatePresence>
    </>
  );
}