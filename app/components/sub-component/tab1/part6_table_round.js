"use client";
import React                from 'react';
import { motion }           from 'framer-motion';
import { LoadingScreen }    from '../../../components/LoadingScreen';
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
    if ( !data ) return <LoadingScreen />;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <h3 className="text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">📅 สรุปข้อมูลการเรียกบรรจุสะสม จำแนกตามเขตพื้นที่</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full min-w-[1200px] overflow-y-auto text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="bg-gray-50    w-[5%] px-6 py-4 text-sm md:text-base lg:text-lg font-semibold sticky left-[0] z-30">ภาค / เขต</th>
                                <th className="bg-amber-50   w-[5%] px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center">ขึ้นบัญชี</th>
                                <th className="bg-emerald-50 w-[5%] px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-emerald-700">เรียกแล้ว</th>
                                <th className="bg-blue-50    w-[5%] px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-blue-700">ความคืบหน้า</th>
                                <th className="bg-rose-50    w-[5%] px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-rose-500">คงเหลือ</th>
                                {roundColumns.map(num => (<th key={num} className="w-[5%] px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center bg-amber-50/30">รอบ {num}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(part6).map((region) => {
                                let reg = { list: 0, call: 0, remain: 0, rounds: Array(roundColumns.length).fill(0) };
                                return (
                                    <React.Fragment key={region.name}>
                                        <tr className="bg-emerald-50/20">
                                            <td colSpan={roundColumns.length + 5} className="border-t-2 border-gray-700 px-6 py-2 text-emerald-700 font-bold text-sm md:text-base lg:text-lg uppercase tracking-wider">
                                                <span className="sticky left-[30px]">{region.name}</span>
                                            </td>
                                        </tr>
                                        {Object.values(region.data).map((zone) => {
                                            reg.list += (Number(zone.total_listed) || 0);
                                            reg.call += (Number(zone.total_called) || 0);
                                            reg.remain += (Number(zone.total_remain) || 0);
                                            roundColumns.forEach((n, i) => reg.rounds[i] += (zone['data-round']?.[n]?.total || 0));
                                            return (
                                                <tr key={zone.full}>
                                                    <td className="bg-gray-50    w-[5%] px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-left   text-gray-700 sticky left-0 z-10">{zone.name}</td>
                                                    <td className="bg-amber-50   w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-500">{zone.total_listed.toLocaleString()}</td>
                                                    <td className="bg-emerald-50 w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-emerald-600">{zone.total_called.toLocaleString()}</td>
                                                    <td className="bg-blue-50    w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-blue-600">{( ( zone.total_called / zone.total_listed ) * 100 ).toFixed(2)} %</td>
                                                    <td className="bg-rose-50    w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-rose-500">{zone.total_remain.toLocaleString()}</td>
                                                    {roundColumns.map(num => {
                                                        const roundInfo = zone['data-round'][num];
                                                        const bgClass = roundInfo ? "bg-white" : "bg-gray-200";
                                                        return (
                                                            <td 
                                                                key={num} 
                                                                className={`w-[5%] px-4 py-4 text-center ${bgClass}`}
                                                            >
                                                                {roundInfo ? (
                                                                    <span className="text-gray-700 font-bold text-sm md:text-base lg:text-sm">
                                                                        {roundInfo.total.toLocaleString()}
                                                                    </span>
                                                                ) : (
                                                                    null
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                        <tr key={region.name}>
                                            <td className="bg-white         w-[5%] px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-600 sticky left-0 z-10"> รวม {region.name}</td>
                                            <td className="bg-amber-50/50   w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-600">{reg.list.toLocaleString()}</td>
                                            <td className="bg-emerald-50/50 w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-emerald-600">{reg.call.toLocaleString()}</td>
                                            <td className="bg-blue-50/50    w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-blue-600">{( ( reg.call / reg.list ) * 100 ).toFixed(2)} %</td>
                                            <td className="bg-rose-50/50    w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-rose-500">{reg.remain.toLocaleString()}</td>
                                            {reg.rounds.map((v, i) => <td key={i} className={`w-[5%] px-4 py-4 text-sm md:text-base lg:text-sm text-center font-semibold text-gray-700 ${ v > 0 ? 'bg-white' : 'bg-gray-200' }`} >{v > 0 ? v.toLocaleString() : null}</td>)}
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            <tr className="bg-gray-700 text-white text-sm md:text-base lg:text-sm font-bold">
                                <td className="bg-gray-700 px-6 py-4 text-center uppercase tracking-wider sticky left-[0] z-30">รวมทั้งหมด</td>
                                <td className="bg-gray-700 px-4 py-4 text-center">{grandTotalListed.toLocaleString()}</td>
                                <td className="bg-gray-700 px-4 py-4 text-center">{grandTotalCalled.toLocaleString()}</td>
                                <td className="bg-gray-700 px-4 py-4 text-center text-blue-300">{( ( grandTotalCalled / grandTotalListed ) * 100 ).toFixed(2)} %</td>
                                <td className="bg-gray-700 px-6 py-4 text-center text-rose-300">{grandTotalRemain.toLocaleString()}</td>
                                {grandTotalPerRound.map((total, index) => (<td key={index} className="w-[120px] px-4 py-4 text-center">{total > 0 ? total.toLocaleString() : null}</td>))}
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </motion.div>
    );
}