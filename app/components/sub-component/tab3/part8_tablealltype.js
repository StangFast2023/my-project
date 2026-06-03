"use client";
import React, { useMemo }   from 'react';
import { motion }           from 'framer-motion';
import { BookMarked }       from 'lucide-react';
import { LoadingScreen }    from '../../../components/LoadingScreen';
const maxR = 10;
export default function T2P7_TableAllType({data}) {
    const part8 = data?.tab3?.part8 || null;
    const { allZones, roundColumns } = useMemo(() => {
        const zones = [];
        Object.values(part8).forEach(region => {
            Object.values(region).forEach(posTypeGroup => {
                Object.values(posTypeGroup).forEach(zone => {
                    zones.push(zone);
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
    if(!data) return <LoadingScreen />;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <div className="text-center mb-2">
                <h3 className="flex text-sm md:text-base lg:text-lg font-bold text-gray-700">
                    <BookMarked />
                    <span className="ml-2">สรุปยอดเรียกรายงานตัวสะสมแยกตามเขตพื้นที่และประเภทตำแหน่ง</span>
                </h3>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex-1 overflow-x-auto min-h-[600px] max-h-[800px] shadow-sm">
                    <table className="w-full min-w-[1200px] overflow-y-auto text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="sticky left-0 top-0 z-40 w-[15%] px-6 py-4 font-semibold bg-gray-50">ภาค / เขตพื้นที่</th>
                                <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-gray-50">ประเภท</th>
                                <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-amber-50 text-amber-700">ขึ้นบัญชี</th>
                                <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-emerald-50 text-emerald-700">เรียกแล้วรวม</th>
                                <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-blue-50 text-blue-700">ความคืบหน้า</th>
                                <th className="sticky top-0 z-30 w-[7%] px-6 py-4 font-semibold text-center bg-rose-50 text-rose-500">คงเหลือ</th>
                                {roundColumns.map(num => (<th key={num} className="sticky top-0 z-30 px-4 py-4 font-semibold text-center bg-amber-50">รอบที่ {num}</th>))}
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
                                            <td colSpan={roundColumns.length + 6} className="border-t-2 border-gray-500 px-6 py-2.5 text-emerald-800 font-bold text-base">
                                                <span className="sticky left-[30px] z-40">
                                                    {regionName}
                                                </span>
                                            </td>
                                        </tr>
                                        {Object.entries(zonesBySubId).map(([subId, zoneList]) => {
                                            const rowCount = zoneList.length + 1; 
                                            const zoneTotalList = zoneList.reduce((s, z) => s + (z.total_list || 0), 0);
                                            const zoneTotalCall = zoneList.reduce((s, z) => s + (z.total_call || 0), 0);
                                            const zoneTotalRemain = zoneList.reduce((s, z) => s + (z.total_remain || 0), 0);
                                            const zoneTotalPerRound = roundColumns.map(num => {
                                            return zoneList.reduce((s, z) => s + (z.round_data?.[num]?.total || 0), 0);});
                                            regionTotalList += zoneTotalList;
                                            regionTotalCall += zoneTotalCall;
                                            regionTotalRemain += zoneTotalRemain;
                                            zoneTotalPerRound.forEach((val, i) => regionTotalPerRound[i] += val);
                                            return (
                                                <React.Fragment key={subId}>
                                                    {zoneList.map((zone, index) => (
                                                        <tr key={`${subId}-${zone.pos_type_id}`}>
                                                            {index === 0 && (<td rowSpan={rowCount} className="sticky left-0 z-20 bg-white px-6 py-4 text-gray-800 bg-gray-50 text-sm font-semibold  text-center"style={{ verticalAlign: 'middle' }}>{zone.prov_full_name}</td>)}
                                                            <td className={`px-4 py-4 text-sm font-semibold text-center ${zone.pos_type_id === 1 ? "bg-blue-50 text-blue-700" :zone.pos_type_id === 2 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{zone.pos_type}</td>
                                                            <td className="px-4 py-4  text-sm font-semibold text-center bg-amber-50 text-amber-500">{zone.total_list.toLocaleString()}</td>
                                                            <td className="px-4 py-4  text-sm font-semibold text-center bg-emerald-50 text-emerald-600">{zone.total_call.toLocaleString()}</td>
                                                            <td className="px-4 py-4  text-sm font-semibold text-center bg-blue-50 text-blue-600">{( ( zone.total_call / zone.total_list ) * 100).toFixed(2)} %</td>
                                                            <td className="px-6 py-4  text-sm font-semibold text-center bg-rose-50 text-rose-500">{zone.total_remain.toLocaleString()}</td>
                                                            {roundColumns.map(num => {const roundInfo = zone.round_data?.[num];const bgClass = roundInfo ? "bg-white" : "bg-gray-100";return (<td key={num} className={`px-4 py-4 text-center text-sm font-semibold ${bgClass}`}>{roundInfo ? roundInfo.total.toLocaleString() : null}</td>);})}

                                                        </tr>
                                                    ))}
                                                    <tr className="bg-slate-50/60 font-semibold text-gray-900 ">
                                                        <td className="px-4 py-3 text-center text-xs text-slate-500 bg-slate-50/40 font-bold">รวมประจำเขต</td>
                                                        <td className="px-4 py-3 text-center text-sm font-semibold ">{zoneTotalList.toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-center text-sm font-semibold bg-emerald-50/20 text-emerald-700 ">{zoneTotalCall.toLocaleString()}</td>
                                                        <td className="px-4 py-3 text-center text-sm font-semibold bg-blue-50/20 text-blue-700 ">{( ( zoneTotalCall / zoneTotalList ) * 100 ).toFixed(2)} %</td>
                                                        <td className="px-6 py-3 text-center text-sm font-semibold text-rose-600 font-bold ">{zoneTotalRemain.toLocaleString()}</td>
                                                        {zoneTotalPerRound.map((total, idx) => (<td key={idx} className={`px-4 py-3 text-center text-sm font-semibold font-mono text-slate-700 ${total > 0 ? 'bg-white' : 'bg-gray-100' } `}>{total > 0 ? total.toLocaleString() : null}</td>))}
                                                    </tr>
                                                </React.Fragment>
                                            );
                                        })}
                                        <tr className="bg-emerald-100 text-emerald-900 text-sm">
                                            <td className="sticky left-0 z-20 bg-emerald-100 px-6 py-3.5 text-center text-sm font-semibold ">รวม{regionName}</td>
                                            <td className="px-6 py-3.5 text-center text-sm font-semibold  "></td>
                                            <td className="px-4 py-3.5 text-center text-sm font-semibold bg-amber-50 text-amber-700">{regionTotalList.toLocaleString()}</td>
                                            <td className="px-4 py-3.5 text-center text-sm font-semibold bg-emerald-100 text-emerald-700 ">{regionTotalCall.toLocaleString()}</td>
                                            <td className="px-4 py-3.5 text-center text-sm font-semibold bg-blue-100 text-blue-700 ">{( ( regionTotalCall / regionTotalList ) * 100 ).toFixed(2)} %</td>
                                            <td className="px-6 py-3.5 text-center text-sm font-semibold bg-rose-50 text-rose-600">{regionTotalRemain.toLocaleString()}</td>
                                            {regionTotalPerRound.map((total, idx) => (<td key={idx} className={`px-4 py-3.5 text-center text-sm font-semibold ${total > 0 ? 'bg-white' : 'bg-gray-100' } `}>{total > 0 ? total.toLocaleString() : null}</td>))}

                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            <tr className="bg-gray-700 text-white font-bold text-sm">
                                <td className="sticky left-0 bottom-0 z-40 px-6 py-4 bg-gray-700 text-center uppercase tracking-wider">รวมทั้งหมดทุกภาค</td>
                                <td className="sticky bottom-0 z-30 px-6 py-4 bg-gray-700 text-center uppercase tracking-wider"></td>
                                <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center font-mono">{grandTotalListed.toLocaleString()}</td>
                                <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center font-mono">{grandTotalCalled.toLocaleString()}</td>
                                <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center text-blue-300 font-mono">{( ( grandTotalCalled / grandTotalListed ) * 100).toFixed(2)} %</td>
                                <td className="sticky bottom-0 z-30 px-6 bg-gray-700 py-4 text-center text-rose-300 font-mono">{grandTotalRemain.toLocaleString()}</td>
                                {grandTotalPerRound.map((total, index) => (<td key={index} className="sticky bottom-0 z-30 px-4 py-4 bg-gray-700 text-center font-mono">{total > 0 ? total.toLocaleString() : null }</td>))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}