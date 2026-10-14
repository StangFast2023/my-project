"use client";
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked } from 'lucide-react';
import LoadingScreen from '../../LoadingScreen';
import useMediaQuery from '@/app/avaliable/useMediaQuery';
export default function T2P7_TableAllType({ data }) {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const part8 = data?.tab3?.part8 || null;

    const [mobileRegionIndex, setMobileRegionIndex] = useState(0);
    const [mobileZoneIndex, setMobileZoneIndex] = useState(0);
    const [mobileTypeIndex, setMobileTypeIndex] = useState(0);

    const { allZones, roundColumns } = useMemo(() => {
        const zones = [];
        let maxRoundsFound = 0;
        Object.values(part8 || {}).forEach(region => {
            Object.values(region).forEach(posTypeGroup => {
                Object.values(posTypeGroup).forEach(zone => {
                    zones.push(zone);
                    const zoneRounds = Object.keys(zone.round_data || {}).length;
                    if (zoneRounds > maxRoundsFound) {
                        maxRoundsFound = zoneRounds;
                    }
                });
            });
        });
        const finalMaxRounds = Math.max(10, maxRoundsFound);
        const columns = Array.from({ length: finalMaxRounds }, (_, i) => i + 1);

        return { allZones: zones, roundColumns: columns };
    }, [part8]);

    if (allZones.length === 0) return null;
    const grandTotalListed = allZones.reduce((sum, zone) => sum + (zone.total_list || 0), 0);
    const grandTotalListedNew = allZones.reduce((sum, zone) => sum + (zone.total_list_new || 0), 0);
    const grandTotalDiff = allZones.reduce((sum, zone) => sum + (zone.total_diff || 0), 0);
    const grandTotalCalled = allZones.reduce((sum, zone) => sum + (zone.total_call || 0), 0);
    const grandTotalRemain = allZones.reduce((sum, zone) => sum + (zone.total_remain || 0), 0);

    const grandTotalPerRound = roundColumns.map(num => {
        return allZones.reduce((sum, zone) => {
            const roundInfo = zone.round_data?.[num];
            return sum + (roundInfo ? (roundInfo.total || 0) : 0);
        }, 0);
    });

    const mobileRegions = Object.entries(part8).map(([regionKey, regionData]) => {
        const firstTypeGroup = Object.values(regionData)[0];
        const firstZone = firstTypeGroup ? Object.values(firstTypeGroup)[0] : null;
        const regionName = firstZone ? firstZone.prov_main_name : `ภาคที่ ${regionKey}`;
        const zonesBySubId = {};
        Object.values(regionData).forEach((typeGroup) => {
            Object.values(typeGroup).forEach((zone) => {
                const subId = zone.prov_sub_id;
                if (!zonesBySubId[subId]) zonesBySubId[subId] = [];
                zonesBySubId[subId].push(zone);
            });
        });
        const zones = Object.entries(zonesBySubId).map(([subId, zoneList]) => {
            const total = (key) => zoneList.reduce((sum, item) => sum + (item[key] || 0), 0);
            return {
                subId,
                name: zoneList[0]?.prov_full_name || `เขต ${subId}`,
                items: zoneList,
                totalList: total("total_list"),
                totalListNew: total("total_list_new"),
                totalDiff: total("total_diff"),
                totalCall: total("total_call"),
                totalRemain: total("total_remain"),
                perRound: roundColumns.map((num) =>
                    zoneList.reduce(
                        (sum, item) => sum + (item.round_data?.[num]?.total || 0),
                        0
                    )
                ),
            };
        });
        return { regionKey, regionName, zones };
    });
    const selectedRegion = mobileRegions[mobileRegionIndex];
    const selectedZone = selectedRegion?.zones[mobileZoneIndex];
    const selectedTypes = selectedZone?.items || [];
    const selectedType = selectedTypes[mobileTypeIndex];
    const mobileProgress = selectedType && selectedType.total_list_new > 0 ? (selectedType.total_call / selectedType.total_list_new) * 100 : 0;
    if (!data) return <LoadingScreen />;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-2">
                <h3 className="flex text-base md:text-base lg:text-lg font-bold text-gray-700">
                    <BookMarked />
                    <span className="ml-2">สรุปยอดเรียกรายงานตัวสะสมแยกตามเขตพื้นที่และประเภทตำแหน่ง</span>
                </h3>
            </div>
            {isMobile ? (
                <div>
                    <div className="space-y-4">
                        <section>
                            <h3 className="mb-2 text-sm font-bold text-gray-700">
                                ชั้นที่ 1 · ระดับภาค
                            </h3>
                            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
                                {mobileRegions.map((region, index) => (
                                    <button
                                        key={region.regionKey}
                                        onClick={() => {
                                            setMobileRegionIndex(index);
                                            setMobileZoneIndex(0);
                                            setMobileTypeIndex(0);
                                        }}
                                        className={`shrink-0 snap-start rounded-lg border px-4 py-3 text-sm font-semibold ${mobileRegionIndex === index ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-gray-200 bg-white text-gray-600"}`}
                                    >
                                        {region.regionName}
                                    </button>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="mb-2 text-sm font-bold text-gray-700">
                                ชั้นที่ 2 · ระดับเขต
                            </h3>
                            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
                                {(selectedRegion?.zones || []).map((zone, index) => (
                                    <button
                                        key={zone.subId} onClick={() => { setMobileZoneIndex(index); setMobileTypeIndex(0); }}
                                        className={`min-w-36 shrink-0 snap-start rounded-lg border p-3 text-center ${mobileZoneIndex === index ? "border-violet-600 bg-violet-50 text-violet-800" : "border-gray-200 bg-white text-gray-700"}`}
                                    >
                                        <div className="text-sm font-semibold">{zone.name}</div>
                                    </button>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="mb-2 text-sm font-bold text-gray-700">
                                ชั้นที่ 3 · ประเภทตำแหน่ง
                            </h3>
                            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
                                {selectedTypes.map((item, index) => (
                                    <button
                                        key={`${item.prov_sub_id}-${item.pos_type_id}`}
                                        onClick={() => setMobileTypeIndex(index)}
                                        className={`min-w-36 shrink-0 snap-start rounded-lg border p-3 text-center ${mobileTypeIndex === index ? (Number(item.pos_type_id) === 1 ? 'border-blue-200 bg-blue-200 text-blue-700 shadow-sm' : Number(item.pos_type_id) === 2 ? 'border-emerald-200 bg-emerald-200 text-emerald-700 shadow-sm' : 'border-amber-200 bg-amber-200 text-amber-700 shadow-sm') : "border-gray-200 bg-white text-gray-700"}`}
                                    >
                                        <div className="text-sm font-semibold">{item.pos_type}</div>
                                    </button>
                                ))}
                            </div>
                            {selectedType && (
                                <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-lg bg-amber-50 p-3">
                                            <div className="text-xs text-amber-700">ขึ้นบัญชี (เก่า)</div>
                                            <div className="mt-1 font-bold text-gray-700 text-right">
                                                {selectedType.total_list.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-amber-100 p-3">
                                            <div className="text-xs text-amber-800">ขึ้นบัญชี (ใหม่)</div>
                                            <div className="mt-1 font-bold text-gray-700 text-right">
                                                {selectedType.total_list_new.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-rose-50 p-3">
                                            <div className="text-xs text-rose-700">ส่วนต่าง</div>
                                            <div className="mt-1 font-bold text-gray-700 text-right">
                                                {selectedType.total_diff.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="rounded-lg bg-emerald-50 p-3">
                                            <div className="text-xs text-emerald-700">เรียกแล้วรวม</div>
                                            <div className="mt-1 font-bold text-gray-700 text-right">
                                                {selectedType.total_call.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`mt-3 rounded-lg p-3 ${mobileProgress === 100 ? "bg-emerald-50" : (mobileProgress < 100 ? "bg-blue-50" : "bg-violet-50")}`}>
                                        <div className="flex items-center justify-between gap-2 text-sm">
                                            <span className={`${mobileProgress === 100 ? "text-emerald-800" : (mobileProgress < 100 ? "text-blue-800" : "text-violet-800")}`}>ความคืบหน้า</span>
                                            <strong className={`${mobileProgress === 100 ? "text-emerald-800" : (mobileProgress < 100 ? "text-blue-800" : "text-violet-800")}`}>
                                                {(selectedType.total_remain !== 0 ? mobileProgress : 0).toFixed(2)}%
                                            </strong>
                                        </div>
                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                                            <div
                                                className={`h-full rounded-full ${mobileProgress === 100 ? "bg-emerald-500" : (mobileProgress < 100 ? "bg-blue-500" : "bg-violet-500")}`}
                                                style={{ width: `${Math.max(0, Math.min(mobileProgress, 100))}%`, }}
                                            />
                                        </div>
                                    </div>
                                    <div className={`mt-2 flex items-center justify-between rounded-lg p-3 ${selectedType.total_remain === 0 ? "bg-emerald-50" : (selectedType.total_remain > 0 ? "bg-orange-50" : "bg-rose-50")}`}>
                                        <span className={`text-sm ${selectedType.total_remain === 0 ? "text-emerald-800" : (selectedType.total_remain > 0 ? "text-orange-800" : "text-rose-800")}`}>คงเหลือ</span>
                                        <strong className={`${selectedType.total_remain === 0 ? "text-emerald-800" : (selectedType.total_remain > 0 ? "text-orange-800" : "text-rose-800")}`}>
                                            {selectedType.total_remain.toLocaleString()}
                                        </strong>
                                    </div>
                                    <div className={`mt-2 flex items-center justify-between rounded-lg p-3 ${selectedType.total_remain === 0 ? "bg-emerald-600" : (selectedType.total_remain > 0 ? "bg-orange-600" : "bg-rose-600")}`}>
                                        <span className="text-sm text-white">สถานะบัญชี</span>
                                        <strong className="text-sm text-white">
                                            {selectedType.total_remain === 0 ? "หมดบัญชี" : (selectedType.total_remain > 0 ? "คงเหลือ" : "ขาดแคลน")}
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </section>
                        <section>
                            <h3 className="mb-2 text-sm font-bold text-gray-700">
                                ชั้นที่ 4 · รายรอบ
                            </h3>
                            {selectedType ? (
                                <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
                                    {roundColumns.map((num) => {
                                        const round = selectedType.round_data?.[num];
                                        return (
                                            round?.total != null ? (
                                                <div
                                                    key={num}
                                                    className="min-w-32 shrink-0 snap-start rounded-lg border border-gray-200 bg-white p-3"
                                                >
                                                    <div>
                                                        <div className="text-xs text-gray-500">
                                                            รอบที่ {num}
                                                        </div>
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            จำนวนเรียกบรรจุ
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-lg font-bold text-right text-gray-800">
                                                        {round?.total != null ? round.total.toLocaleString() : "—"}
                                                    </div>
                                                </div>
                                            ) : null
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    ไม่มีข้อมูลประเภทตำแหน่งที่เลือก
                                </p>
                            )}
                        </section>

                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
                    <div className="flex-1 min-h-[400px] max-h-[800px] overflow-x-auto">
                        <table className="w-full h-full overflow-y-auto text-left border-collapse whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="sticky left-0 top-0 z-40 w-[15%] px-6 py-4 font-semibold bg-gray-50">ภาค / เขตพื้นที่</th>
                                    <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-gray-50">ประเภท</th>
                                    <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-amber-50   text-amber-600">ขึ้นบัญชี (เก่า)</th>
                                    <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-amber-100  text-amber-700">ขึ้นบัญชี (ใหม่)</th>
                                    <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-rose-100   text-rose-700">ส่วนต่าง</th>
                                    <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-emerald-50 text-emerald-700">เรียกแล้วรวม</th>
                                    <th className="sticky top-0 z-30 w-[7%] px-4 py-4 font-semibold text-center bg-blue-50    text-blue-700">ความคืบหน้า</th>
                                    <th className="sticky top-0 z-30 w-[7%] px-6 py-4 font-semibold text-center bg-orange-50  text-orange-500">คงเหลือ</th>
                                    {roundColumns.map(num => (<th key={num} className="sticky top-0 z-30 px-4 py-4 font-semibold text-center bg-amber-50">รอบที่ {num}</th>))}
                                </tr >
                            </thead >
                            <tbody className="divide-y divide-gray-100 text-base text-gray-700">
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
                                    let regionTotalListNew = 0;
                                    let regionTotalDiff = 0;
                                    let regionTotalCall = 0;
                                    let regionTotalRemain = 0;
                                    let regionTotalPerRound = Array(roundColumns.length).fill(0);

                                    return (
                                        <React.Fragment key={regionKey}>
                                            <tr className="bg-emerald-50/30">
                                                <td colSpan={roundColumns.length + 8} className="border-t-2 border-gray-500 px-6 py-2.5 text-emerald-800 font-bold text-base">
                                                    <span className="sticky left-[30px] z-30">
                                                        {regionName}
                                                    </span>
                                                </td>
                                            </tr>
                                            {Object.entries(zonesBySubId).map(([subId, zoneList]) => {
                                                const rowCount = zoneList.length + 1;
                                                const zoneTotalList = zoneList.reduce((s, z) => s + (z.total_list || 0), 0);
                                                const zoneTotalListNew = zoneList.reduce((s, z) => s + (z.total_list_new || 0), 0);
                                                const zoneTotalDiff = zoneList.reduce((s, z) => s + (z.total_diff || 0), 0);
                                                const zoneTotalCall = zoneList.reduce((s, z) => s + (z.total_call || 0), 0);
                                                const zoneTotalRemain = zoneList.reduce((s, z) => s + (z.total_remain || 0), 0);
                                                const zoneTotalPerRound = roundColumns.map(num => {
                                                    return zoneList.reduce((s, z) => s + (z.round_data?.[num]?.total || 0), 0);
                                                });
                                                regionTotalList += zoneTotalList;
                                                regionTotalListNew += zoneTotalListNew;
                                                regionTotalDiff += zoneTotalDiff;
                                                regionTotalCall += zoneTotalCall;
                                                regionTotalRemain += zoneTotalRemain;
                                                zoneTotalPerRound.forEach((val, i) => regionTotalPerRound[i] += val);
                                                return (
                                                    <React.Fragment key={subId}>
                                                        {zoneList.map((zone, index) => (
                                                            <tr key={`${subId}-${zone.pos_type_id}`}>
                                                                {index === 0 && (<td rowSpan={rowCount} className="sticky left-0 z-20 bg-white px-6 py-4 text-gray-800 bg-gray-50 text-base font-semibold  text-center" style={{ verticalAlign: 'middle' }}>{zone.prov_full_name}</td>)}
                                                                <td className={`px-4 py-4 text-base font-semibold text-center ${zone.pos_type_id === 1 ? "bg-blue-50 text-blue-700" : zone.pos_type_id === 2 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{zone.pos_type}</td>
                                                                <td className="px-4 py-4  text-base font-semibold text-center bg-amber-50  text-amber-500">{zone.total_list.toLocaleString()}</td>
                                                                <td className="px-4 py-4  text-base font-semibold text-center bg-amber-100 text-amber-600">{zone.total_list_new.toLocaleString()}</td>
                                                                <td className="px-4 py-4  text-base font-semibold text-center bg-rose-100  text-rose-600">{zone.total_diff.toLocaleString()}</td>
                                                                <td className="px-4 py-4  text-base font-semibold text-center bg-emerald-50 text-emerald-600">{zone.total_call.toLocaleString()}</td>
                                                                <td className={`px-4 py-4 text-base font-semibold text-center ${zone.total_remain === 0 ? 'bg-rose-50 text-rose-600' : (((zone.total_call / zone.total_list_new) * 100) === 100 ? 'bg-emerald-50 text-emerald-600' : (((zone.total_call / zone.total_list_new) * 100) <= 100 ? 'bg-blue-50 text-blue-600' : 'bg-violet-50 text-violet-600'))}`}>
                                                                    {(zone.total_remain !== 0 ? ((zone.total_call / zone.total_list_new) * 100) : 0).toFixed(2)} %
                                                                </td>
                                                                <td className={`px-6 py-4  text-base font-semibold text-center ${zone.total_remain === 0 ? 'bg-blue-50 text-blue-500' : zone.total_remain > 0 ? 'bg-orange-50 text-orange-500' : 'bg-rose-50 text-rose-500'}`}>
                                                                    {zone.total_remain.toLocaleString()}
                                                                </td>
                                                                {roundColumns.map(num => { const roundInfo = zone.round_data?.[num]; const bgClass = roundInfo ? "bg-white" : "bg-gray-100"; return (<td key={num} className={`px-4 py-4 text-center text-base font-semibold ${bgClass}`}>{roundInfo ? roundInfo.total.toLocaleString() : null}</td>); })}

                                                            </tr>
                                                        ))}
                                                        <tr className="bg-slate-50/60 font-semibold text-gray-900 ">
                                                            <td className="px-4 py-3  text-center text-xs text-slate-500 bg-slate-50/40 font-bold">รวมประจำเขต</td>
                                                            <td className="px-4 py-3  text-center text-base font-semibold ">{zoneTotalList.toLocaleString()}</td>
                                                            <td className="px-4 py-3  text-center text-base font-semibold ">{zoneTotalListNew.toLocaleString()}</td>
                                                            <td className="px-4 py-3  text-center text-base font-semibold ">{zoneTotalDiff.toLocaleString()}</td>
                                                            <td className="px-4 py-3  text-center text-base font-semibold bg-emerald-50/20 text-emerald-700 ">{zoneTotalCall.toLocaleString()}</td>
                                                            <td className={`px-4 py-3 text-center text-base font-semibold ${zoneTotalRemain === 0 ? 'bg-rose-50/20 text-rose-700' : (zoneTotalRemain === 100 ? 'bg-emerald-50/20 text-emerald-700' : (zoneTotalRemain <= 100 ? 'bg-blue-100/20 text-blue-700' : 'bg-violet-100/20 text-violet-700'))}`}>
                                                                {(zoneTotalRemain !== 0 ? (zoneTotalCall / zoneTotalListNew) * 100 : 0).toFixed(2)} %
                                                            </td>
                                                            <td className={`px-6 py-3 text-center text-base font-semibold ${zoneTotalRemain === 0 ? 'text-blue-600' : zoneTotalRemain < 0 ? 'text-rose-600' : 'text-orange-600'}`}>
                                                                {zoneTotalRemain.toLocaleString()}
                                                            </td>
                                                            {zoneTotalPerRound.map((total, idx) => (<td key={idx} className={`px-4 py-3 text-center text-base font-semibold font-mono text-slate-700 ${total > 0 ? 'bg-white' : 'bg-gray-100'} `}>{total > 0 ? total.toLocaleString() : null}</td>))}
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            })}
                                            <tr className="bg-emerald-100 text-emerald-900 text-sm">
                                                <td className="sticky left-0 z-20 bg-emerald-100 px-6 py-3.5 text-center text-base font-semibold ">รวม{regionName}</td>
                                                <td className="px-6 py-3.5 text-center  text-base font-semibold  "></td>
                                                <td className="px-4 py-3.5 text-center  text-base font-semibold bg-amber-50  text-amber-600">{regionTotalList.toLocaleString()}</td>
                                                <td className="px-4 py-3.5 text-center  text-base font-semibold bg-amber-100 text-amber-700">{regionTotalListNew.toLocaleString()}</td>
                                                <td className="px-4 py-3.5 text-center  text-base font-semibold bg-rose-50   text-rose-700">{regionTotalDiff.toLocaleString()}</td>
                                                <td className="px-4 py-3.5 text-center  text-base font-semibold bg-emerald-100 text-emerald-700 ">{regionTotalCall.toLocaleString()}</td>
                                                <td className={`px-4 py-3.5 text-center text-base font-semibold ${regionTotalRemain === 0 ? 'bg-rose-100 text-rose-700' : (regionTotalRemain === 100 ? 'bg-emerald-100 text-emerald-700' : (regionTotalRemain <= 100 ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'))}`}>
                                                    {((regionTotalCall / regionTotalListNew) * 100).toFixed(2)} %
                                                </td>
                                                <td className={`px-6 py-3.5 text-center text-base font-semibold ${regionTotalRemain === 0 ? 'bg-emerald-50 text-emerald-600' : (regionTotalRemain > 0 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600')}`}>
                                                    {regionTotalRemain.toLocaleString()}
                                                </td>
                                                {regionTotalPerRound.map((total, idx) => (<td key={idx} className={`px-4 py-3.5 text-center text-base font-semibold text-gray-700 ${total > 0 ? 'bg-white' : 'bg-gray-100'} `}>{total > 0 ? total.toLocaleString() : null}</td>))}

                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                                <tr className="bg-gray-700 text-white font-bold text-sm">
                                    <td className="sticky left-0 bottom-0 z-40 px-6 py-4 bg-gray-700 text-center uppercase tracking-wider">รวมทั้งหมดทุกภาค</td>
                                    <td className="sticky bottom-0 z-30 px-6 py-4 bg-gray-700 text-center uppercase tracking-wider"></td>
                                    <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center font-mono">{grandTotalListed.toLocaleString()}</td>
                                    <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center font-mono">{grandTotalListedNew.toLocaleString()}</td>
                                    <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center font-mono">{grandTotalDiff.toLocaleString()}</td>
                                    <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center font-mono">{grandTotalCalled.toLocaleString()}</td>
                                    <td className="sticky bottom-0 z-30 px-4 bg-gray-700 py-4 text-center text-blue-300 font-mono">{((grandTotalCalled / grandTotalListedNew) * 100).toFixed(2)} %</td>
                                    <td className="sticky bottom-0 z-30 px-6 bg-gray-700 py-4 text-center text-rose-300 font-mono">{grandTotalRemain.toLocaleString()}</td>
                                    {grandTotalPerRound.map((total, index) => (<td key={index} className="sticky bottom-0 z-30 px-4 py-4 bg-gray-700 text-center font-mono">{total > 0 ? total.toLocaleString() : null}</td>))}
                                </tr>
                            </tbody>
                        </table >
                    </div >
                </div >
            )
            }
        </motion.div >
    );
}