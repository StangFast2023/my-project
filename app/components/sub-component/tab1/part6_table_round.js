"use client";
import React                from 'react';
import { motion }           from 'framer-motion';
import { LoadingScreen }    from '../../../components/LoadingScreen';
export default function T1P3_PieListed({ data }) {
    if ( !data ) return <LoadingScreen />;
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
            
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปข้อมูลการเรียกบรรจุสะสม จำแนกตามเขตพื้นที่</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full min-w-[1200px] overflow-y-auto text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="bg-gray-50    w-[250px] px-6 py-4 text-lg font-semibold sticky left-[0] z-30">ภาค / เขต</th>
                                <th className="bg-amber-50   w-[120px] px-4 py-4 text-lg font-semibold text-center">ขึ้นบัญชี</th>
                                <th className="bg-emerald-50 w-[120px] px-4 py-4 text-lg font-semibold text-center text-emerald-700">เรียกแล้ว</th>
                                <th className="bg-rose-50    w-[120px] px-4 py-4 text-lg font-semibold text-center text-rose-500">คงเหลือ</th>
                                {roundColumns.map(num => (<th key={num} className="w-[100px] px-4 py-4 text-lg font-semibold text-center bg-amber-50/30">รอบ {num}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(part6).map((region) => (
                                <React.Fragment key={region.name}>
                                    <tr className="bg-emerald-50/20">
                                        <td colSpan={roundColumns.length + 3} className="px-6 py-2 text-emerald-700 font-bold text-lg uppercase tracking-wider">
                                            <span className="sticky left-[30px]">{region.name}</span>
                                        </td>
                                    </tr>
                                    {Object.values(region.data).map((zone) => (
                                        <tr key={zone.full}>
                                            <td className="bg-gray-50    w-[250px] px-6 py-4 text-sm font-semibold text-gray-700 sticky left-0 z-10">{zone.name}</td>
                                            <td className="bg-amber-50   w-[120px] px-4 py-4 text-sm font-semibold text-center font-bold text-gray-500">{zone.total_listed.toLocaleString()}</td>
                                            <td className="bg-emerald-50 w-[120px] px-4 py-4 text-sm font-semibold text-center font-bold "><span className="text-emerald-600 font-bold">{zone.total_called.toLocaleString()}</span></td>
                                            <td className="bg-rose-50    w-[120px] px-6 py-4 text-sm font-semibold text-center font-bold text-rose-500 font-semibold">{zone.total_remain.toLocaleString()}</td>
                                            {roundColumns.map(num => {
                                                const roundInfo = zone['data-round'][num];
                                                const bgClass = roundInfo ? "bg-white" : "bg-gray-200";
                                                
                                                return (
                                                    <td 
                                                        key={num} 
                                                        className={`w-[120px] px-4 py-4 text-center ${bgClass}`}
                                                    >
                                                        {roundInfo ? (
                                                            <span className="text-gray-700 font-bold">
                                                                {roundInfo.total.toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            null
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            <tr className="bg-gray-700 text-white font-bold">
                                <td className="bg-gray-700 w-[250px] px-6 py-4 text-center uppercase tracking-wider sticky left-[0] z-30">รวมทั้งหมด</td>
                                <td className="bg-gray-700 w-[120px] px-4 py-4 text-center">{grandTotalListed.toLocaleString()}</td>
                                <td className="bg-gray-700 w-[120px] px-4 py-4 text-center bg-gray-700">{grandTotalCalled.toLocaleString()}</td>
                                <td className="bg-gray-700 w-[120px] px-6 py-4 text-center text-rose-300">{grandTotalRemain.toLocaleString()}</td>
                                {grandTotalPerRound.map((total, index) => (<td key={index} className="w-[120px] px-4 py-4 text-center">{total > 0 ? total.toLocaleString() : null}</td>))}
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </motion.div>
    );
}