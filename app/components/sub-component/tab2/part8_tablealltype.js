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
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปยอดเรียกรายงานตัวสะสมรายภาค</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 border-b">ภาค / ประเภทตำแหน่ง</th>
                            <th className="px-4 py-4 text-center border-b">ขึ้นบัญชี</th>
                            {roundColumns.map(num => <th key={num} className="px-4 py-4 text-center border-b border-l bg-amber-50/50">รอบที่ {num}</th>)}
                            <th className="px-4 py-4 text-center border-b text-emerald-700">เรียกแล้วรวม</th>
                            <th className="px-6 py-4 text-center border-b text-rose-600">คงเหลือ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Object.entries(part8).map(([regId, posTypes]) => {
                            let reg = { list: 0, call: 0, remain: 0, rounds: Array(roundColumns.length).fill(0) };
                            return (
                                <React.Fragment key={regId}>
                                    <tr className="bg-emerald-50/50">
                                        <td colSpan={roundColumns.length + 4} className="px-4 py-2.5 font-bold text-emerald-900 border-b border-emerald-100">
                                            {Object.values(posTypes)[0]?.prov_main_name || `ภาคที่ ${regId}`}
                                        </td>
                                    </tr>
                                    {Object.values(posTypes).map((zone) => {
                                        reg.list += (Number(zone.total_list) || 0);
                                        reg.call += (Number(zone.total_call) || 0);
                                        reg.remain += (Number(zone.total_remain) || 0);
                                        roundColumns.forEach((n, i) => reg.rounds[i] += (zone.round_data?.[n]?.total || 0));
                                        return (
                                            <tr key={zone.pos_type_id} className="hover:bg-gray-50">
                                                <td className={`w-[13%] px-6 py-3 pl-10 border-l-4 border-emerald-300 font-semibold ${zone.pos_type_id === "1" ? "bg-blue-50 text-blue-700" : zone.pos_type_id === "2" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                                    {zone.pos_type}
                                                </td>
                                                <td className="w-[7%] px-4 py-3 text-center font-bold text-gray-600 font-mono">{(Number(zone.total_list) || 0).toLocaleString()}</td>
                                                {roundColumns.map(num => <td key={num} className={`px-4 py-3 text-center border-l font-bold text-gray-600 font-mono ${ zone.round_data?.[num]?.total > 0  ? 'bg-white' : 'bg-gray-100' } `}>{ ( zone.round_data?.[num]?.total > 0 ? zone.round_data?.[num]?.total.toLocaleString() : null ) || null}</td>)}
                                                <td className="w-[7%] px-4 py-3 text-center font-bold text-emerald-600 font-mono">{(Number(zone.total_call) || 0).toLocaleString()}</td>
                                                <td className="w-[7%] px-4 py-3 text-center font-bold text-rose-600 font-mono">{(Number(zone.total_remain) || 0).toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-gray-100 font-bold text-gray-800">
                                        <td className="px-6 py-3 text-right">รวม {Object.values(posTypes)[0]?.prov_main_name}</td>
                                        <td className="px-4 py-3 text-center font-mono">{reg.list.toLocaleString()}</td>
                                        {reg.rounds.map((v, i) => <td key={i} className={`px-4 py-3 text-center border-l font-mono ${ v > 0 ? 'bg-white' : 'bg-gray-100' } `}>{v > 0 ? v.toLocaleString() : null}</td>)}
                                        <td className="px-4 py-3 text-center text-emerald-700 font-mono">{reg.call.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-center text-rose-700 font-mono">{reg.remain.toLocaleString()}</td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                        {/* แถวรวมทั้งหมด */}
                        <tr className="bg-gray-800 text-white font-bold">
                            <td className="px-6 py-4 text-center uppercase tracking-widest">รวมทั้งหมดทุกภาค</td>
                            <td className="px-4 py-4 text-center font-mono">{grandTotal.list.toLocaleString()}</td>
                            {roundColumns.map(n => <td key={n} className="px-4 py-4 text-center border-l border-gray-700 font-mono">{ ( grandTotal.rounds[n] > 0 ? grandTotal.rounds[n].toLocaleString() : null ) || null}</td>)}
                            <td className="px-4 py-4 text-center font-mono">{grandTotal.call.toLocaleString()}</td>
                            <td className="px-4 py-4 text-center font-mono">{grandTotal.remain.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}