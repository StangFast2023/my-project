"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function T2P7_TableAllType({setIsOpen, setDetails, data }) {
    const part8 = data?.tab2?.part8 || data?.tab1?.part8;
    const { allZones, roundColumns } = useMemo(() => {
        const zones = [];
        let maxR = 0;

        Object.values(part8).forEach(region => {
            Object.values(region).forEach(posTypeGroup => {
                Object.values(posTypeGroup).forEach(zone => {
                    zones.push(zone);
                    if (zone.round_data) {
                        const roundKeys = Object.keys(zone.round_data).map(Number);
                        const currentMax = roundKeys.length > 0 ? Math.max(...roundKeys) : 0;
                        if (currentMax > maxR) maxR = currentMax;
                    }
                });
            });
        });

        const columns = Array.from({ length: maxR }, (_, i) => i + 1);
        return { allZones: zones, roundColumns: columns };
    }, [part8]);

    if (allZones.length === 0) return null;
    const grandTotalListed = allZones.reduce((sum, zone) => sum + (zone.total_list || 0), 0);
    const grandTotalCalled = allZones.reduce((sum, zone) => sum + (zone.total_call || 0), 0);
    const grandTotalRemain = allZones.reduce((sum, zone) => sum + (zone.total_remain || 0), 0);
    
    const grandTotalPerRound = roundColumns.map(num => {
        return allZones.reduce((sum, zone) => {
            const roundInfo = zone.round_data?.[num];
            return sum + (roundInfo ? (roundInfo.total || 0) : 0);
        }, 0);
    });
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปยอดเรียกรายงานตัวสะสมแยกตามเขตพื้นที่และประเภทตำแหน่ง</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="w-[10%] px-6 py-4 font-semibold border-b">ภาค / เขตพื้นที่</th>
                                <th className="w-[7%] px-4 py-4 font-semibold text-center border-b bg-gray-100/50">ประเภท</th>
                                <th className="w-[7%] px-4 py-4 font-semibold text-center border-b bg-gray-100/30">ขึ้นบัญชี</th>
                                <th className="w-[7%] px-4 py-4 font-semibold text-center border-b bg-emerald-50 text-emerald-700">เรียกแล้วรวม</th>
                                {roundColumns.map(num => (
                                    <th key={num} className="px-4 py-4 font-semibold text-center border-b border-l bg-amber-50/30">
                                        รอบที่ {num}
                                    </th>
                                ))}
                                <th className="w-[7%] px-6 py-4 font-semibold text-center border-b border-l text-rose-500">คงเหลือ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {Object.entries(part8).map(([regionKey, regionData]) => {
                                const firstTypeGroup = Object.values(regionData)[0];
                                const firstZone = firstTypeGroup ? Object.values(firstTypeGroup)[0] : null;
                                const regionName = firstZone ? firstZone.prov_main_name : `ภาคที่ ${regionKey}`;
                                const zonesBySubId = {};
                                Object.values(regionData).forEach(posTypeGroup => {
                                    Object.values(posTypeGroup).forEach(zone => {
                                        const subId = zone.prov_sub_id;
                                        if (!zonesBySubId[subId]) zonesBySubId[subId] = [];
                                        zonesBySubId[subId].push(zone);
                                    });
                                });
                                let regionTotalList = 0;
                                let regionTotalCall = 0;
                                let regionTotalRemain = 0;
                                let regionTotalPerRound = Array(roundColumns.length).fill(0);

                                return (
                                    <React.Fragment key={regionKey}>
                                        <tr className="bg-emerald-50/30">
                                            <td colSpan={roundColumns.length + 5} className="px-6 py-2.5 text-emerald-800 font-bold text-base border-b border-gray-100">
                                                {regionName}
                                            </td>
                                        </tr>
                                        {Object.entries(zonesBySubId).map(([subId, zoneList]) => {
                                            const rowCount = zoneList.length + 1; 
                                            const zoneTotalList = zoneList.reduce((s, z) => s + (z.total_list || 0), 0);
                                            const zoneTotalCall = zoneList.reduce((s, z) => s + (z.total_call || 0), 0);
                                            const zoneTotalRemain = zoneList.reduce((s, z) => s + (z.total_remain || 0), 0);
                                            const zoneTotalPerRound = roundColumns.map(num => {
                                                return zoneList.reduce((s, z) => s + (z.round_data?.[num]?.total || 0), 0);
                                            });
                                            regionTotalList += zoneTotalList;
                                            regionTotalCall += zoneTotalCall;
                                            regionTotalRemain += zoneTotalRemain;
                                            zoneTotalPerRound.forEach((val, i) => regionTotalPerRound[i] += val);

                                            return (
                                                <React.Fragment key={subId}>
                                                    {zoneList.map((zone, index) => (
                                                        <tr key={`${subId}-${zone.pos_type_id}`} className="hover:bg-gray-50/40 transition-colors">
                                                            {index === 0 && (
                                                                <td 
                                                                    rowSpan={rowCount} 
                                                                    className="px-6 py-4 font-semibold text-gray-800 bg-gray-50/10 text-center border-r border-gray-100"
                                                                    style={{ verticalAlign: 'middle' }}
                                                                >
                                                                    {zone.prov_full_name}
                                                                </td>
                                                            )}
                                                            <td className="px-4 py-4 text-center">
                                                                <span className={`px-2.5 py-1 rounded text-xs font-medium inline-block min-w-[70px] ${
                                                                    zone.pos_type_id === "1" ? "bg-blue-50 text-blue-600" :
                                                                    zone.pos_type_id === "2" ? "bg-emerald-50 text-emerald-600" : 
                                                                    "bg-amber-50 text-amber-600"
                                                                }`}>
                                                                    {zone.pos_type}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-4 text-center text-gray-500 font-mono">
                                                                {zone.total_list.toLocaleString()}
                                                            </td>
                                                            <td className="px-4 py-4 text-center bg-emerald-50/10 font-mono">
                                                                <span className="text-emerald-600 font-medium">{zone.total_call.toLocaleString()}</span>
                                                            </td>
                                                            {roundColumns.map(num => {
                                                                const roundInfo = zone.round_data?.[num];
                                                                return (
                                                                    <td key={num} className="px-4 py-4 text-center border-l border-gray-100 font-mono">
                                                                        {roundInfo ? roundInfo.total.toLocaleString() : <span className="text-gray-300">-</span>}
                                                                    </td>
                                                                );
                                                            })}
                                                            <td className="px-6 py-4 text-center text-rose-500 font-medium border-l border-gray-100 font-mono">
                                                                {zone.total_remain.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-slate-50/60 font-semibold text-gray-900 border-b border-gray-200">
                                                        <td className="px-4 py-3 text-center text-xs text-slate-500 bg-slate-50/40 font-bold">รวมประจำเขต</td>
                                                        <td className="px-4 py-3 text-center font-mono">{zoneTotalList.toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-center bg-emerald-50/20 text-emerald-700 font-mono">{zoneTotalCall.toLocaleString()}</td>
                                                        {zoneTotalPerRound.map((total, idx) => (
                                                            <td key={idx} className="px-4 py-3 text-center border-l border-gray-200 font-mono text-slate-700">
                                                                {total > 0 ? total.toLocaleString() : <span className="text-gray-300">-</span>}
                                                            </td>
                                                        ))}
                                                        <td className="px-6 py-3 text-center text-rose-600 font-bold border-l border-gray-200 font-mono">{zoneTotalRemain.toLocaleString()}</td>
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
                                        <tr className="bg-emerald-600/5 font-bold text-emerald-900 border-b-2 border-gray-200">
                                            <td colSpan={2} className="px-6 py-3.5 text-center text-sm">
                                                รวม{regionName}
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-mono">{regionTotalList.toLocaleString()}</td>
                                            <td className="px-4 py-3.5 text-center bg-emerald-600/10 text-emerald-700 font-mono">{regionTotalCall.toLocaleString()}</td>
                                            {regionTotalPerRound.map((total, idx) => (
                                                <td key={idx} className="px-4 py-3.5 text-center border-l border-emerald-100 font-mono">
                                                    {total > 0 ? total.toLocaleString() : <span className="text-gray-300">-</span>}
                                                </td>
                                            ))}
                                            <td className="px-6 py-3.5 text-center text-rose-600 font-extrabold border-l border-emerald-100 font-mono">{regionTotalRemain.toLocaleString()}</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            <tr className="bg-gray-700 text-white font-bold text-sm">
                                <td colSpan={2} className="px-6 py-4 text-center uppercase tracking-wider">
                                    รวมทั้งหมดทุกภาค
                                </td>
                                <td className="px-4 py-4 text-center font-mono">
                                    {grandTotalListed.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-center bg-gray-700 font-mono">
                                    {grandTotalCalled.toLocaleString()}
                                </td>
                                {grandTotalPerRound.map((total, index) => (
                                    <td key={index} className="px-4 py-4 text-center border-l border-gray-700 font-mono">
                                        {total.toLocaleString()}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-center border-l border-gray-700 text-rose-300 font-mono">
                                    {grandTotalRemain.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}