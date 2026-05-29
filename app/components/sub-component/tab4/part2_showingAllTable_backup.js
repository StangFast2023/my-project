"use client";
import React                    from 'react';
import { motion }               from 'framer-motion';
import { EmptyData }            from '../../EmptyData';
import { LoadingScreen }        from '../../LoadingScreen';
import { useColumnStore }       from '../../useTableColumns';
import Part1_TableContainer     from './TablePart2/Part1_TableContainer';
export default function T2P7_TableAllType({data,isLoading}) {
    const part2 = data?.tab4?.part2.data || null;
    const columns = useColumnStore((state) => state.columns);
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
            <div className="flex flex-col h-full min-h-[100px] max-h-[800px]  border border-gray-300">
                <div className="flex-1 overflow-x-auto shadow-sm">
                    <table className="w-full min-w-[1200px] overflow-y-auto table-fixed border-collapse">
                        <colgroup>
                            <col className="w-[400px] min-w-[400px] border-1 border-gray-200 border-r-[2px] border-r-gray-600" />
                            {!columns.all_header && (<col className="w-[200px] min-w-[200px] border-1 border-gray-200" />)}
                            {!columns.all_header && (<col className="w-[100px] min-w-[100px] border-1 border-gray-200" />)}
                            <col className="w-[100px] min-w-[100px] border-1 border-gray-200" />
                            {columns.column_part1 && (<col className="w-[100px] min-w-[100px] border-1 border-gray-200" />)}
                            {columns.column_part2 && (<col className="w-[120px] min-w-[120px] border-1 border-gray-200" />)}
                            {columns.column_part3 && (<col className="w-[120px] min-w-[120px] border-1 border-gray-200" />)}
                            <col className="w-[100px] min-w-[100px] border-1 border-gray-200" />
                            <col className="w-[120px] min-w-[120px] border-1 border-emerald-400" />
                            <col className="w-[120px] min-w-[120px] border-1 border-amber-400" />
                            {roundsArray.map((_, i) => <col key={i} className="w-[100px] min-w-[100px] border-y-[1px] border-l-[1px] border-gray-200" />)}

                        </colgroup>
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                                                            <th className="w-[400px] min-w-[400px] sticky left-0 top-0 z-40 p-4 font-semibold bg-gray-50 ">ภาค / เขต / ตำแหน่ง</th>
                                {!columns.all_header && (                   <th className="w-[200px] min-w-[200px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ภาค</th>)}
                                {!columns.all_header && (                   <th className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">เขต</th>)}
                                                                            <th className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ประเภท</th>
                                {columns.column_part1 && (                  <th className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">สถานะสอบ</th>)}
                                {columns.column_part2 && (                  <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">สถานะบัญชี</th>)}
                                {columns.column_part3 && (                  <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ความคืบหน้า</th>)}
                                                                            <th className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ขึ้นบัญชี</th>
                                                                            <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-emerald-50 text-emerald-700">เรียกทั้งหมด</th>
                                                                            <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-amber-50 text-amber-500">คงเหลือ</th>
                                {roundsArray.map((_, index) => (<th key={index} className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">รอบ {index + 1}</th>))}
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
                    <table className="sticky bottom-0 z-20 w-full min-w-[1200px] table-fixed border-collapse">
                        <tfoot className="sticky bottom-0 z-20 bg-[#2d3446] text-white">
                            <tr>
                                <td className="sticky left-0 bottom-0 z-30 bg-[#2d3446] px-6 py-3 w-[400px] min-w-[400px] text-center uppercase tracking-widest text-center">รวมทั้งหมดทุกภาค</td>
                                {!columns.all_header && (<td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[200px] min-w-[200px] p-4 text-center font-bold"></td>)}
                                {!columns.all_header && (<td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>)}
                                <td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>
                                {columns.column_part1 && (<td className=" sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>)}
                                {columns.column_part2 && (<td className=" sticky left-0 bottom-0 z-30 px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold">{statusText}</td>)}
                                {columns.column_part3 && (<td className={`sticky left-0 bottom-0 z-30 ${statusColor} px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold`}>{summary?.total_listed > 0 ? `${percent.toFixed(2)} %` : 0}</td>)}
                                <td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold">{summary ? summary.total_listed.toLocaleString() : null}</td>
                                <td className="sticky left-0 bottom-0 z-30 top-0 z-30 px-4 py-3 bg-[#2d3446] w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_called.toLocaleString() : null}</td>
                                <td className="sticky left-0 bottom-0 z-30 top-0 z-30 px-4 py-3 bg-[#2d3446] w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_remain.toLocaleString() : null}</td>
                                {roundsArray.map((_, i) => (<td key={i} className={`sticky left-0 bottom-0 z-30 w-[100px] min-w-[100px] p-4 text-center text-center font-bold`} >{ summary && summary !== 0 ? summary.rounds?.[i + 1]?.toLocaleString() : null }</td>))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}