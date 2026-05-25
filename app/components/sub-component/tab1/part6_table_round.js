"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function T1P3_PieListed({ data }) {
    const part6 = data.tab1.part6;
    if (!part6) return null;
    const allZones      = Object.values(part6).flatMap(region => Object.values(region.data));
    const maxRounds     = 10;
    const roundColumns  = Array.from({ length: maxRounds }, (_, i) => i + 1);
    const grandTotalListed = allZones.reduce((sum, zone) => sum + zone.total_listed, 0);
    const grandTotalCalled = allZones.reduce((sum, zone) => sum + zone.total_called, 0);
    const grandTotalRemain = allZones.reduce((sum, zone) => sum + zone.total_remain, 0);
    const grandTotalPerRound = roundColumns.map(num => {
        return allZones.reduce((sum, zone) => {
            const roundInfo = zone['data-round'][num];
            return sum + (roundInfo ? roundInfo.total : 0);
        }, 0);
    });
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปยอดเรียกรายงานตัวสะสมแยกตามเขตพื้นที่</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="w-[15%] px-6 py-4 font-semibold border-b">ภาค / เขต</th>
                                <th className="w-[7%] px-4 py-4 font-semibold text-center border-b bg-gray-100/50">ขึ้นบัญชี</th>
                                {roundColumns.map(num => (
                                    <th key={num} className="px-4 py-4 font-semibold text-center border-b border-l bg-amber-50/30">
                                        รอบที่ {num}
                                    </th>
                                ))}
                                <th className="w-[7%] px-4 py-4 font-semibold text-center border-b bg-emerald-50 text-emerald-700">เรียกแล้วรวม</th>
                                <th className="w-[7%] px-6 py-4 font-semibold text-center border-b border-l text-rose-500">คงเหลือ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {Object.values(part6).map((region) => (
                                <React.Fragment key={region.name}>
                                    <tr className="bg-emerald-50/20">
                                        <td colSpan={roundColumns.length + 4} className="px-6 py-2 text-emerald-700 font-bold text-lg uppercase tracking-wider">
                                            {region.name}
                                        </td>
                                    </tr>
                                    {Object.values(region.data).map((zone) => (
                                        <tr key={zone.full} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-700">{zone.name}</td>
                                            <td className="px-4 py-4 text-center text-gray-500">
                                                {zone.total_listed.toLocaleString()}
                                            </td>
                                            {roundColumns.map(num => {
                                                const roundInfo = zone['data-round'][num];
                                                const bgClass = roundInfo ? "bg-white" : "bg-gray-200";
                                                
                                                return (
                                                    <td 
                                                        key={num} 
                                                        className={`px-4 py-4 text-center border-l ${bgClass}`}
                                                    >
                                                        {roundInfo ? (
                                                            <span className="text-gray-700 font-medium">
                                                                {roundInfo.total.toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            null
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-4 py-4 text-center bg-emerald-50/10">
                                                <span className="text-emerald-600 font-bold">{zone.total_called.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-rose-500 font-semibold border-l">
                                                {zone.total_remain.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            <tr className="bg-gray-700 text-white font-bold">
                                <td className="px-6 py-4 text-center uppercase tracking-wider">
                                    รวมทั้งหมด
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {grandTotalListed.toLocaleString()}
                                </td>
                                {grandTotalPerRound.map((total, index) => (
                                    <td key={index} className="px-4 py-4 text-center border-l border-gray-700">
                                        {total > 0 ? total.toLocaleString() : null}
                                    </td>
                                ))}
                                <td className="px-4 py-4 text-center bg-gray-700">
                                    {grandTotalCalled.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center border-l border-gray-700 text-rose-300">
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