"use client";
import React, { useMemo }   from 'react';
import { motion }           from 'framer-motion';
import { LoadingScreen }    from '../../../components/LoadingScreen';
const maxR = 10;
export default function T2P7_TableSummary({ data }) {
    const part8 = useMemo(() => data.tab2.part8 || {}, [data.tab2.part8]);
    const { roundColumns, grandTotal } = useMemo(() => {
        let gTotal = { list: 0, call: 0, remain: 0, rounds: {} };
        Object.values(part8).forEach(posTypeGroup => {
            Object.values(posTypeGroup).forEach(zone => {
                gTotal.list += (Number(zone.total_list) || 0);
                gTotal.call += (Number(zone.total_call) || 0);
                gTotal.remain += (Number(zone.total_remain) || 0);
                Object.entries(zone.round_data || {}).forEach(([r, v]) => {
                    gTotal.rounds[r] = (gTotal.rounds[r] || 0) + (v.total || 0);
                });
            });
        });
        return { roundColumns: Array.from({ length: maxR }, (_, i) => i + 1), grandTotal: gTotal };
    }, [part8]);
    if(!data) return <LoadingScreen />;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปสถิติการเรียกบรรจุสะสม จำแนกตามภูมิภาคและประเภทตำแหน่ง</h3>
            <div className="flex-1 rounded-2xl overflow-x-auto min-h-[600px] shadow-sm shadow-sm">
                <table className="w-full min-w-[1200px] overflow-y-auto text-left border-collapse  whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="bg-gray-50    px-6 py-4 text-left   text-sm font-semibold sticky left-0 top-0 z-40 ">ภาค / ประเภทตำแหน่ง</th>
                            <th className="bg-amber-50   px-4 py-4 text-center text-sm font-semibold sticky top-0 z-30 ">ขึ้นบัญชี</th>
                            <th className="bg-emerald-50 px-4 py-4 text-center text-sm font-semibold sticky top-0 z-30 text-emerald-700">เรียกแล้วรวม</th>
                            <th className="bg-blue-50    px-4 py-4 text-center text-sm font-semibold sticky top-0 z-30 text-blue-700">ความคืบหน้า</th>
                            <th className="bg-rose-50    px-6 py-4 text-center text-sm font-semibold sticky top-0 z-30 text-rose-600">คงเหลือ</th>
                            {roundColumns.map(num => <th key={num} className="bg-white sticky top-0 z-30 px-4 py-4 text-center text-sm font-semibold bg-amber-50/50">รอบที่ {num}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Object.entries(part8).map(([regId, posTypes]) => {
                            let reg = { list: 0, call: 0, remain: 0, rounds: Array(roundColumns.length).fill(0) };
                            return (
                                <React.Fragment key={regId}>
                                    <tr className="bg-emerald-50/50">
                                        <td colSpan={roundColumns.length + 4} className="px-4 py-2.5 font-bold text-emerald-900">
                                           <span className="sticky left-[20px] z-20 pr-2">
                                                {Object.values(posTypes)[0]?.prov_main_name || `ภาคที่ ${regId}`}
                                           </span>
                                        </td>
                                    </tr>
                                    {Object.values(posTypes).map((zone) => {
                                        reg.list += (Number(zone.total_list) || 0);
                                        reg.call += (Number(zone.total_call) || 0);
                                        reg.remain += (Number(zone.total_remain) || 0);
                                        roundColumns.forEach((n, i) => reg.rounds[i] += (zone.round_data?.[n]?.total || 0));
                                        return (
                                            <tr key={zone.pos_type_id} className="group hover:bg-gray-200 duration-300">
                                                <td className={`sticky left-0 z-20 px-6 py-3 pl-10 text-sm                  group-hover:bg-transparent font-semibold ${zone.pos_type_id === 1 ? "bg-blue-100 text-blue-700" : zone.pos_type_id === 2 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{zone.pos_type}</td>
                                                <td className="px-4 py-3 text-center  text-sm font-semibold bg-amber-50     group-hover:bg-transparent text-gray-600 ">{(Number(zone.total_list) || 0).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-center  text-sm font-semibold bg-emerald-50   group-hover:bg-transparent text-emerald-600 ">{(Number(zone.total_call) || 0).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-center  text-sm font-semibold bg-blue-50      group-hover:bg-transparent text-blue-600 ">{(Number(( zone.total_call / zone.total_list ) * 100) || 0).toFixed(2)} %</td>
                                                <td className="px-4 py-3 text-center  text-sm font-semibold bg-rose-50      group-hover:bg-transparent text-rose-600 ">{(Number(zone.total_remain) || 0).toLocaleString()}</td>
                                                {roundColumns.map(num => <td key={num} className={`px-4 py-3 text-center text-sm font-semibold text-gray-600 group-hover:bg-transparent ${ zone.round_data?.[num]?.total > 0  ? 'bg-white' : 'bg-gray-100' } `}>{ ( zone.round_data?.[num]?.total > 0 ? zone.round_data?.[num]?.total.toLocaleString() : null ) || null}</td>)}
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-gray-50 font-bold text-gray-800 group hover:bg-gray-200 duration-200">
                                        <td className="sticky left-0 z-20 px-6 py-3 text-sm  bg-inherit    group-hover:bg-transparent font-semibold text-left">รวม {Object.values(posTypes)[0]?.prov_main_name}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-center bg-amber-50   group-hover:bg-transparent ">{reg.list.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-center bg-emerald-50 group-hover:bg-transparent text-emerald-700 ">{reg.call.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-center bg-blue-50    group-hover:bg-transparent text-blue-700 ">{( ( reg.call / reg.list ) * 100 ).toFixed(2)} %</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-center bg-rose-50    group-hover:bg-transparent text-rose-700 ">{reg.remain.toLocaleString()}</td>
                                        {reg.rounds.map((v, i) => <td key={i} className={`px-4 py-3 text-center text-sm font-semibold group-hover:bg-transparent ${ v > 0 ? 'bg-white' : 'bg-gray-100' } `}>{v > 0 ? v.toLocaleString() : null}</td>)}
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                        {/* แถวรวมทั้งหมด */}
                        <tr className="bg-gray-800 text-white font-bold">
                            <td className="sticky left-0 bottom-0 z-40 bg-gray-800 px-6 py-4 text-sm font-semibold text-center uppercase tracking-widest">รวมทั้งหมดทุกภาค</td>
                            <td className="sticky bottom-0 z-30        bg-gray-800 px-4 py-4 text-sm font-semibold text-center ">{grandTotal.list.toLocaleString()}</td>
                            <td className="sticky bottom-0 z-30        bg-gray-800 px-4 py-4 text-sm font-semibold text-center ">{grandTotal.call.toLocaleString()}</td>
                            <td className="sticky bottom-0 z-30        bg-gray-800 px-4 py-4 text-sm font-semibold text-center ">{( ( grandTotal.call / grandTotal.list ) * 100 ).toFixed(2)} %</td>
                            <td className="sticky bottom-0 z-30        bg-gray-800 px-4 py-4 text-sm font-semibold text-center ">{grandTotal.remain.toLocaleString()}</td>
                            {roundColumns.map(n => <td key={n} className="sticky bottom-0 z-30        bg-gray-800 px-4 py-4 text-sm font-semibold text-center">{ ( grandTotal.rounds[n] > 0 ? grandTotal.rounds[n].toLocaleString() : null ) || null}</td>)}
                        </tr>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}