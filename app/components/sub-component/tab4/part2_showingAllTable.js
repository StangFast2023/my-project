"use client";
import React                                from 'react';
import { motion }                           from 'framer-motion';
import { EmptyData }                        from '../../../components/EmptyData';
import { LoadingScreen }                    from '../../../components/LoadingScreen';
import Part1_TableContainer                 from '../tab4/TablePart2/Part1_TableContainer';
export default function T2P7_TableAllType({data,isLoading}) {
    const part2 = data?.tab4?.part2.data || null;
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
    const maxRound = Math.max(10, data?.tab4?.part2?.round || 0);
    const roundsArray = Array.from({ length: maxRound }, (_, i) => i + 1);
    let summary = { total_listed: 0, total_called: 0, total_remain: 0, rounds: {} };

    if (part2 && Object.keys(part2).length > 0) {
        summary = Object.values(part2).reduce((acc, curr) => {
            acc.total_listed += (Number(curr.total_listed) || 0);
            acc.total_called += (Number(curr.total_called) || 0);
            acc.total_remain += (Number(curr.total_remain) || 0);
            
            if (curr.total_each_round) {
                Object.values(curr.total_each_round).forEach(roundData => {
                    const r = roundData.round;
                    acc.rounds[r] = (acc.rounds[r] || 0) + (Number(roundData.total) || 0);
                });
            }
            return acc;
        }, { total_listed: 0, total_called: 0, total_remain: 0, rounds: {} });
    }
    const percent = (summary?.total_listed > 0) 
        ? (summary.total_called / summary.total_listed) * 100 
        : 0;

    const statusText = percent === 100 ? 'หมดบัญชี' : (percent > 0 ? 'คงเหลือ' : null);
    const statusColor = percent < 30 ? "text-rose-400" : (percent < 70 ? "text-amber-400" : "text-emerald-400");
    const has_data = Object.keys(data.tab4.part2.data || {}).length > 0;
    console.log("has_data" + has_data);
    
    if (isLoading) {
        return (
            <div className="h-[600px] flex flex-col items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-30 w-30 border-b-8 border-gray-600 mb-12"></div>
                <p className="text-gray-500 font-bold text-xl">กำลังดึงข้อมูล... กรุณารอสักครู่</p>
            </div>
        );
    }
    if(!has_data) return <EmptyData />;
    if(!part2) return <LoadingScreen />;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 ข้อมูลสรุปการเรียกบรรจุรายเขต</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
                <div className="overflow-x-auto max-h-[800px] rounded-xl shadow-sm">
                    <table className="w-full min-w-[1200px] text-left border-collapse border border-gray-400">
                        <colgroup>
                            <col className="w-[400px] min-w-[400px]" />
                            <col className="w-[100px] min-w-[100px]" />
                            <col className="w-[100px] min-w-[100px]" />
                            <col className="w-[120px] min-w-[120px]" />
                            <col className="w-[120px] min-w-[120px]" />
                            <col className="w-[100px] min-w-[100px]" />
                            <col className="w-[100px] min-w-[100px]" />
                            <col className="w-[100px] min-w-[100px]" />
                            {roundsArray.map((_, i) => <col key={i} className="w-[100px] min-w-[100px]" />)}
                        </colgroup>

                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="sticky left-0 top-0 z-40 p-4 font-semibold bg-gray-50 border-r-2 border-gray-600 border-b">ภาค / เขต / ตำแหน่ง</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-gray-50">ประเภท</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-gray-50">สถานะสอบ</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-gray-50">สถานะบัญชี</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-gray-50">ความคืบหน้า</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-gray-50">ขึ้นบัญชี</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-emerald-50 text-emerald-700">เรียก</th>
                                <th className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-amber-50 text-amber-500">คงเหลือ</th>
                                {roundsArray.map((_, index) => (<th key={index} className="sticky top-0 z-30 p-4 font-semibold text-center border border-gray-400 bg-gray-50">รอบ {index + 1}</th>))}
                            </tr>
                        </thead>

                        <Part1_TableContainer
                            part2={part2}
                            collapsedIDs={collapsedIDs}
                            toggleRegionCollapse={toggleRegionCollapse}
                            toggleCollapse={toggleCollapse}
                            roundsArray={roundsArray}
                        />

                        <tfoot className="sticky bottom-0 z-20 bg-[#2d3446] text-white">
                            <tr>
                                <td className="sticky left-0 top-0 z-40 bg-[#2d3446] px-6 py-3 w-[400px] min-w-[400px] text-center uppercase tracking-widest text-center !border-r-2 !border-white">รวมทั้งหมดทุกภาค</td>
                                <td className="px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>
                                <td className="px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>
                                <td className="px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold border border-white">
                                    {statusText}
                                </td>
                                <td className={`${statusColor} px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold border border-white`}>
                                    {summary?.total_listed > 0 ? `${percent.toFixed(2)} %` : 0}
                                </td>
                                <td className="px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold border border-white">{summary ? summary.total_listed.toLocaleString() : null}</td>
                                <td className="px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold border border-white">{summary ? summary.total_called.toLocaleString() : null}</td>
                                <td className="px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold border border-white">{summary ? summary.total_remain.toLocaleString() : null}</td>
                                {roundsArray.map((_, i) => (
                                    <td key={i} className={`w-[100px] min-w-[100px] p-4 text-center text-center font-bold ${ summary ? ( summary.rounds?.[i + 1] ? 'border border-white' : null ) : null }`} >
                                        { summary && summary !== 0 ? summary.rounds?.[i + 1]?.toLocaleString() : null }
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}