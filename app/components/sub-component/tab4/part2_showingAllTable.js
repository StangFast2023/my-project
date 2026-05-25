"use client";
import React                            from 'react';
import Swal                             from 'sweetalert2';
import { motion, AnimatePresence }      from 'framer-motion';
import { LoadingScreen }                from '../../../components/LoadingScreen';
import Part1_TableContainer             from '../tab4/TablePart2/Part1_TableContainer';
export default function T2P7_TableAllType({data}) {
    const [collapsedIDs, setCollapsedIDs] = React.useState({});
    const toggleCollapse = (id) => {
        setCollapsedIDs(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    const toggleRegionCollapse = (regionKey) => {
        setCollapsedIDs(prev => {
            const isRegionCollapsed = !prev[regionKey];
            const newCollapsed = { ...prev, [regionKey]: isRegionCollapsed };
            Object.keys(part2[regionKey].pro_sub).forEach(provSubID => {
                newCollapsed[`${regionKey}_${provSubID}`] = isRegionCollapsed;
            });
            return newCollapsed;
        });
    };

    // const grandTotalListed      = 0;
    // const grandTotalCalled      = 0;
    // const grandTotalRemain      = 0;
    // const grandTotalPerRound    = 0;

    const part2 = data?.tab4?.part2.data || null;
    const maxRound = Math.max(10, data?.tab4?.part2?.round || 0);
    const roundsArray = Array.from({ length: maxRound }, (_, i) => i + 1);
    if(!data) return <LoadingScreen />;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 ข้อมูลสรุปการเรียกบรรจุรายเขต</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">

                <div className="overflow-x-auto border max-h-[800px] rounded-xl shadow-sm">
                    <table className="w-full min-w-[1200px] text-left border-collapse">
                        <colgroup>
                            <col className="w-[400px] min-w-[400px]" />
                            <col className="w-[120px] min-w-[120px]" />
                            <col className="w-[120px] min-w-[120px]" />
                            <col className="w-[120px] min-w-[120px]" />
                            <col className="w-[120px] min-w-[120px]" />
                            <col className="w-[120px] min-w-[120px]" />
                            {roundsArray.map((_, i) => <col key={i} className="w-[120px] min-w-[120px]" />)}
                            <col className="w-[120px] min-w-[120px]" />
                            <col className="w-[120px] min-w-[120px]" />
                        </colgroup>

                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="sticky left-0 top-0 z-40 p-4 font-semibold bg-gray-50 border-r-2 border-gray-600 border-b">ภาค / เขต / ตำแหน่ง</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border-b bg-gray-50">ประเภท</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border-b bg-gray-50">สถานะสอบ</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border-b bg-gray-50">สถานะบัญชี</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border-b bg-gray-50">ความคืบหน้า</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border-b bg-gray-50">ขึ้นบัญชี</th>
                                {roundsArray.map((_, index) => (<th key={index} className="sticky top-0 z-30 p-4 font-semibold text-center border-b bg-gray-50">รอบ {index + 1}</th>))}
                                <th className="sticky right-[120px] top-0 z-40 p-4 font-semibold text-center border-b bg-emerald-50 text-emerald-700 border-l-2 border-gray-600">รวม</th>
                                <th className="sticky right-0 top-0 z-40 p-4 font-semibold text-center border-b bg-rose-50 text-rose-500">คงเหลือ</th>
                            </tr>
                        </thead>

                        <Part1_TableContainer
                            part2={part2}
                            collapsedIDs={collapsedIDs}
                            toggleRegionCollapse={toggleRegionCollapse}
                            toggleCollapse={toggleCollapse}
                            roundsArray={roundsArray}
                        />
                        
                    </table>
                </div>

            </div>
        </motion.div>
    );
}