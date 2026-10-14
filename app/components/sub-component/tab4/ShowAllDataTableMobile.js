
import { useMemo, useState } from 'react';
import { EmptyData } from '../../EmptyData';
import { Check } from 'lucide-react';

export default function ShowAllDataTableMobile({ checkData, part2, isLoading }) {
    const safePart2 = useMemo(() => part2?.tab4?.part2?.data || {}, [part2?.tab4?.part2?.data]);
    const maxRound = Math.max(10, part2?.tab4?.part2?.round || 0);
    const roundsArray = useMemo(
        () => Array.from({ length: maxRound }, (_, i) => i + 1),
        [maxRound]
    );
    const [selectedRegionKey, setSelectedRegionKey] = useState(null);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [selectedPositionKey, setSelectedPositionKey] = useState(null);
    const hasData = Object.keys(safePart2).length > 0;
    const formatNumber = (value) =>
        (Number(value) || 0).toLocaleString('en-US');
    const formatPercent = (value) =>
        `${(Number(value) || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}%`;
    const formatDateThai = (dateStr) => {
        if (!dateStr) return '-';

        const [d, m, y] = dateStr.split('-');
        const months = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
            'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
            'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
        ];
        const monthIndex = Number(m) - 1;
        if (!d || !y || !months[monthIndex]) return dateStr;
        return `${parseInt(d, 10)} ${months[monthIndex]} ${parseInt(y, 10) + 543}`;
    };
    const getRoundStatus = (status) => {
        switch (status) {
            case 'completed':
                return {
                    label: 'บรรจุแล้ว',
                    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                };
            case 'waiting':
                return {
                    label: 'รอการบรรจุ',
                    color: 'bg-sky-50 text-sky-700 border-sky-200',
                };
            case 'not-used':
                return {
                    label: 'ไม่มีการเรียกใช้บัญชี',
                    color: 'bg-rose-50 text-rose-700 border-rose-200',
                };
            case 'exhaustion':
                return {
                    label: 'บัญชีหมด',
                    color: 'bg-amber-50 text-amber-700 border-amber-200',
                };
            default:
                return {
                    label: 'ไม่มีข้อมูลสถานะ',
                    color: 'bg-gray-50 text-gray-600 border-gray-200',
                };
        }
    };
    const getPositionStatus = (item) => {
        if (item.status_out_of_lits) {
            return item.status_open === false
                ? {
                    label: 'ไม่มีบัญชี',
                    color: 'bg-rose-50 text-rose-700 border-1 border-rose-700',
                }
                : {
                    label: 'หมดบัญชี',
                    color: 'bg-emerald-50 text-emerald-700 border-1 border-emerald-700',
                };
        }
        if (Number(item.total_remain) < 0) {
            return {
                label: 'ขาดแคลน',
                color: 'bg-rose-50 text-rose-700 border-1 border-rose-700',
            };
        }
        return {
            label: 'คงเหลือ',
            color: 'bg-amber-50 text-amber-700 border-1 border-amber-700',
        };
    };
    const flatTableRows = useMemo(() => {
        const rows = [];
        Object.entries(safePart2).forEach(([regionKey, regionData]) => {
            Object.entries(regionData.pro_sub || {}).forEach(
                ([provSubID, provSubData]) => {
                    Object.entries(provSubData.data_type_position || {}).forEach(
                        ([typeID, typeData]) => {
                            Object.values(typeData.data_position || {}).forEach(
                                (posData) => {
                                    const totalListedNew =
                                        Number(posData.total_listed_n) || 0;
                                    const totalCall =
                                        Number(posData.total_call) || 0;

                                    rows.push({
                                        uniqueKey: `${regionKey}-${provSubID}-${typeID}-${posData.pos_id}`,
                                        regionKey,
                                        pro_main_id: regionData.pro_main_id,
                                        pro_main_name: regionData.pro_main_name,
                                        pro_sub_id: provSubData.pro_sub_id ?? provSubID,
                                        pos_id: posData.pos_id,
                                        pos_name: posData.pos_name,
                                        pos_type_id: posData.pos_type_id,
                                        pos_type_name: posData.pos_type_name,
                                        status_open: posData.status_open,
                                        status_out_of_lits: posData.status_out_of_lits,
                                        total_listed: Number(posData.total_listed) || 0,
                                        total_listed_n: totalListedNew,
                                        total_diff: Number(posData.total_diff) || 0,
                                        total_call: totalCall,
                                        total_remain: Number(posData.total_remain) || 0,
                                        pos_percent: totalListedNew > 0
                                            ? (totalCall / totalListedNew) * 100
                                            : 0,
                                        roundsData: posData.data_call_round || {},
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
        return rows;
    }, [safePart2]);
    const summary = useMemo(() => {
        const result = {
            total_listed: 0,
            total_listed_n: 0,
            total_diff: 0,
            total_called: 0,
            total_remain: 0,
            rounds: {},
        };
        Object.values(safePart2).forEach((regionData) => {
            result.total_listed += Number(regionData.total_listed) || 0;
            result.total_listed_n += Number(regionData.total_listed_n) || 0;
            result.total_diff += Number(regionData.total_diff) || 0;
            result.total_called += Number(regionData.total_called) || 0;
            result.total_remain += Number(regionData.total_remain) || 0;
            Object.values(regionData.total_each_round || {}).forEach((roundData) => {
                const round = Number(roundData.round);
                if (!round) return;
                result.rounds[round] =
                    (result.rounds[round] || 0) + (Number(roundData.total) || 0);
            });
        });
        return result;
    }, [safePart2]);
    const summaryPercent = summary.total_listed_n > 0 ? (summary.total_called / summary.total_listed_n) * 100 : 0;
    const summaryStatus = summaryPercent > 100 ? 'ขาดแคลน' : summaryPercent === 100 ? 'หมดบัญชี' : summaryPercent > 0 ? 'คงเหลือ' : 'ยังไม่ใช้บัญชี';
    const summaryStatusColor = summaryPercent < 30 ? 'text-rose-600' : summaryPercent < 70 ? 'text-amber-600' : summaryPercent < 100 ? 'text-emerald-600' : 'text-violet-600';
    const mobileRegions = useMemo(() => {
        const regions = new Map();
        flatTableRows.forEach((item) => {
            if (!regions.has(String(item.regionKey))) {
                regions.set(String(item.regionKey), {
                    id: String(item.regionKey),
                    name: item.pro_main_name || `ภาค ${item.pro_main_id}`,
                    colorId: item.pro_main_id,
                });
            }
        });
        return Array.from(regions.values());
    }, [flatTableRows]);
    const activeRegionKey = mobileRegions.some((region) => region.id === String(selectedRegionKey)) ? String(selectedRegionKey) : mobileRegions[0]?.id ?? null;
    const mobileZones = useMemo(() => {
        const zones = new Map();
        flatTableRows
            .filter((item) => String(item.regionKey) === String(activeRegionKey))
            .forEach((item) => {
                const id = String(item.pro_sub_id);
                if (!zones.has(id)) {
                    zones.set(id, {
                        id,
                        name: `เขต ${item.pro_sub_id}`,
                        colorId: item.pro_sub_id,
                    });
                }
            });
        return Array.from(zones.values());
    }, [flatTableRows, activeRegionKey]);
    const activeZoneId = mobileZones.some((zone) => zone.id === String(selectedZoneId)) ? String(selectedZoneId) : mobileZones[0]?.id ?? null;
    const mobilePositions = useMemo(
        () => flatTableRows.filter(
            (item) => String(item.regionKey) === String(activeRegionKey) && String(item.pro_sub_id) === String(activeZoneId)
        ),
        [flatTableRows, activeRegionKey, activeZoneId]
    );
    const activePosition = mobilePositions.find((item) => item.uniqueKey === selectedPositionKey) || mobilePositions[0] || null;
    if (!checkData) {
        return <div className="min-h-[300px]" />;
    }
    if (isLoading) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-b-gray-600" />
                <p className="text-center text-sm font-semibold text-gray-500">
                    กำลังดึงข้อมูล... กรุณารอสักครู่
                </p>
            </div>
        );
    }
    const roundsWithData = roundsArray.filter((round) => {
        const data = activePosition?.roundsData?.[round];
        if (!data) return false;
        const statusList = data.status_list_n ?? 'no-data';
        const statusCall = data.status_call ?? 'no-data';
        return !(
            statusList === 'no-data' && statusCall === 'no-data'
        );
    });
    if (!hasData || flatTableRows.length === 0) {
        return <EmptyData />;
    }
    return (
        <div className="fade-in space-y-3 pb-6">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="bg-[#2d3446] px-4 py-4 text-white">
                    <h2 className="text-base font-bold">สรุปข้อมูลทุกภาค</h2>
                    <p className="mt-1 text-xs text-gray-300">
                        ภาพรวมบัญชีสอบแข่งขันและการเรียกบรรจุ
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 p-2">
                    <div className="rounded-xl bg-gray-50 p-2">
                        <p className="text-xs text-gray-500">ขึ้นบัญชี (เก่า)</p>
                        <p className="mt-1 break-words text-xl font-bold text-gray-800 text-right">
                            {formatNumber(summary.total_listed)}
                        </p>
                    </div>
                    <div className="rounded-xl bg-gray-100 p-2">
                        <p className="text-xs text-gray-500">ขึ้นบัญชี (ใหม่)</p>
                        <p className="mt-1 break-words text-xl font-bold text-gray-800 text-right">
                            {formatNumber(summary.total_listed_n)}
                        </p>
                    </div>
                    <div className="rounded-xl bg-rose-50 p-2">
                        <p className="text-xs text-rose-600">ส่วนต่าง</p>
                        <p className="mt-1 break-words text-xl font-bold text-rose-700 text-right">
                            {formatNumber(summary.total_diff)}
                        </p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-2">
                        <p className="text-xs text-emerald-600">เรียกทั้งหมด</p>
                        <p className="mt-1 break-words text-xl font-bold text-emerald-700 text-right">
                            {formatNumber(summary.total_called)}
                        </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-2">
                        <p className="text-xs text-amber-600">คงเหลือ</p>
                        <p className={`mt-1 break-words text-xl font-bold text-right ${summary.total_remain < 0 ? 'text-rose-600' : 'text-amber-700'}`}>
                            {formatNumber(summary.total_remain)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-2">
                        <p className="text-xs text-gray-500">ความคืบหน้า</p>
                        <p className={`mt-1 text-xl font-bold text-right ${summaryStatusColor}`}>
                            {formatPercent(summaryPercent)}
                        </p>
                    </div>
                    <div className={`rounded-xl border border-gray-200 p-2 col-span-2 text-white ${summaryPercent === 100 ? "bg-emerald-600" : (summaryPercent < 100 ? "bg-amber-600" : "bg-rose-600")}`}>
                        <p className="text-base text-center">สถานะบัญชี : {summaryStatus}</p>
                    </div>
                </div>
                <div className="px-3 pb-3">
                    <p className="mb-2 text-xs font-bold text-gray-500">
                        ยอดเรียกแยกตามรอบ
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                        {roundsArray.map((round) => {
                            return (
                                summary.rounds[round] != null && (
                                    <div
                                        key={round}
                                        className="flex min-w-[120px] shrink-0 snap-start items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 shadow-sm"
                                    >
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            รอบ {round}
                                        </span>
                                        <span className="text-lg font-bold text-gray-800">
                                            {formatNumber(summary.rounds[round])}
                                        </span>
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                        1
                    </span>
                    <h2 className="font-bold text-gray-800">เลือกภาค</h2>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {mobileRegions.map((region) => {
                        const active = region.id === activeRegionKey;
                        return (
                            <button
                                key={region.id}
                                type="button"
                                onClick={() => { setSelectedRegionKey(region.id); setSelectedZoneId(null); setSelectedPositionKey(null); }}
                                className={`shrink-0  rounded-xl border px-4 py-3 text-sm font-bold transition ${active ? 'border-gray-700 bg-gray-700 text-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-700'}`}
                            >
                                {region.name}
                            </button>
                        );
                    })}
                </div>
                <div className="text-xs text-gray-400 text-center">
                    กรุณาเลือกภาค
                </div>
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                        2
                    </span>
                    <h2 className="font-bold text-gray-800">เลือกเขต</h2>
                </div>
                <div className="flex w-full gap-2">
                    {mobileZones.map((zone) => {
                        const active = zone.id === activeZoneId;
                        return (
                            <button
                                key={zone.id}
                                type="button"
                                onClick={() => { setSelectedZoneId(zone.id); setSelectedPositionKey(null); }}
                                className={`min-w-0 flex-1 rounded-xl border px-2 py-3 text-sm font-bold transition ${active ? 'border-sky-700 bg-sky-700 text-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-700'}`}
                            >
                                {zone.name}
                            </button>
                        );
                    })}
                </div>
                <div className="text-xs text-gray-400 text-center">
                    กรุณาเลือกเขต
                </div>
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                        3
                    </span>
                    <h2 className="font-bold text-gray-800">เลือกตำแหน่ง</h2>
                </div>
                <div className="overflow-x-auto w-full pb-4">
                    <div className="flex w-full gap-3">
                        {mobilePositions.map((item) => {
                            const active = activePosition?.uniqueKey === item.uniqueKey;
                            const status = getPositionStatus(item);
                            return (
                                <button
                                    key={item.uniqueKey}
                                    type="button"
                                    onClick={() => setSelectedPositionKey(item.uniqueKey)}
                                    className={`w-full shrink-0 rounded-xl border p-3 text-left transition ${active ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    <div className="flex items-start gap-2 my-2">
                                        <div className={`flex h-12 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                            {item.pos_id}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="break-words text-sm font-bold text-gray-800">
                                                {item.pos_name}
                                            </p>
                                            <div className="flex flex-between gap-1.5">
                                                <span className={`rounded-md px-2 w-full text-center py-1 text-xs font-semibold ${item.pos_type_id === 1 ? 'bg-blue-50 text-blue-700 border-1 border-blue-700' : item.pos_type_id === 2 ? 'bg-emerald-50 text-emerald-700 border-1 border-emerald-700' : 'bg-amber-50 text-amber-700 border-1 border-amber-700'}`}>
                                                    {item.pos_type_name || 'ไม่ระบุประเภท'}
                                                </span>
                                                <span className={`rounded-md px-2 w-full text-center py-1 text-xs font-semibold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-3">
                                        <div className="p-2 rounded inset-shadow-sm border border-gray-400">
                                            <p className="text-[11px] text-gray-500">
                                                ขึ้นบัญชีใหม่
                                            </p>
                                            <p className="text-sm font-bold text-gray-800 text-right">
                                                {formatNumber(item.total_listed_n)}
                                            </p>
                                        </div>
                                        <div className="p-2 rounded inset-shadow-sm border border-gray-400">
                                            <p className="text-[11px] text-gray-500">
                                                เรียกแล้ว
                                            </p>
                                            <p className="text-sm font-bold text-emerald-700 text-right">
                                                {formatNumber(item.total_call)}
                                            </p>
                                        </div>
                                        <div className="p-2 rounded inset-shadow-sm border border-gray-400">
                                            <p className="text-[11px] text-gray-500">
                                                คงเหลือ
                                            </p>
                                            <p className={`text-sm font-bold text-right ${item.total_remain < 0 ? 'text-rose-600' : 'text-amber-700'}`} >
                                                {formatNumber(item.total_remain)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`mt-3 rounded-lg py-1.5 text-center text-xs font-bold ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {active ? (
                                            <>
                                                <Check className="mr-1 inline-block h-4 w-4" strokeWidth={6} />
                                                เลือกแล้ว
                                            </>
                                        ) : (
                                            'แตะเพื่อดูรายละเอียด'
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="text-xs text-gray-400 text-center">
                    กรุณาเลื่อนซ้าย-ขวาเพื่อเลือกตำแหน่ง
                </div>
            </section>
            {activePosition && (
                <section className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="bg-[#2d3446] p-4 text-white space-y-1">
                            <p className="text-xs text-gray-300">
                                รายละเอียดของ
                            </p>
                            <h2 className="mbreak-words text-lg font-bold">
                                {activePosition.pos_name}
                            </h2>
                            <p className="text-xs text-gray-300">
                                {activePosition.pro_main_name} / เขต {activePosition.pro_sub_id}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-gray-200">
                            <div className="bg-white p-2">
                                <p className="text-xs text-gray-500">สถานะเปิดสอบ</p>
                                <p className={`mt-1 p-2 rounded-xl font-bold text-center shadow-sm ${activePosition.status_open ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700  bg-rose-100'}`}>
                                    {activePosition.status_open ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}
                                </p>
                            </div>

                            <div className="bg-white p-2">
                                <p className="text-xs text-gray-500">สถานะบัญชี</p>
                                <p className={`mt-1 p-2 rounded-xl font-bold text-center shadow-sm ${activePosition.total_remain === 0 ? "text-emerald-700 bg-emerald-100" : (activePosition.total_remain > 0 ? "text-amber-700 bg-amber-100" : "text-rose-700 bg-rose-100")} `}>
                                    {getPositionStatus(activePosition).label}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 p-2">
                            <div className="rounded-xl bg-gray-50 p-2 inset-shadow-sm">
                                <p className="text-xs text-gray-500">ขึ้นบัญชี (เก่า)</p>
                                <p className="mt-1 text-lg font-bold text-gray-800 text-right">
                                    {formatNumber(activePosition.total_listed)}
                                </p>
                            </div>
                            <div className="rounded-xl bg-gray-100 p-2 inset-shadow-sm">
                                <p className="text-xs text-gray-500">ขึ้นบัญชี (ใหม่)</p>
                                <p className="mt-1 text-lg font-bold text-gray-800 text-right">
                                    {formatNumber(activePosition.total_listed_n)}
                                </p>
                            </div>
                            <div className="rounded-xl bg-rose-50 p-2 inset-shadow-sm">
                                <p className="text-xs text-rose-600">ส่วนต่าง</p>
                                <p className="mt-1 text-lg font-bold text-rose-700 text-right">
                                    {formatNumber(activePosition.total_diff)}
                                </p>
                            </div>
                            <div className="rounded-xl bg-emerald-50 p-2 inset-shadow-sm">
                                <p className="text-xs text-emerald-600">เรียกทั้งหมด</p>
                                <p className="mt-1 text-lg font-bold text-emerald-700 text-right">
                                    {formatNumber(activePosition.total_call)}
                                </p>
                            </div>
                            <div className="rounded-xl bg-amber-50 p-2 inset-shadow-sm">
                                <p className="text-xs text-amber-600">คงเหลือ</p>
                                <p className={`mt-1 text-lg font-bold text-right ${activePosition.total_remain < 0 ? 'text-rose-600' : 'text-amber-700'}`}>
                                    {formatNumber(activePosition.total_remain)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-2 inset-shadow-sm">
                                <p className="text-xs text-gray-500">ความคืบหน้า</p>
                                <p className={`mt-1 text-lg font-bold text-right ${!activePosition.status_open ? 'text-gray-500' : activePosition.pos_percent < 30 ? 'text-rose-600' : activePosition.pos_percent < 70 ? 'text-amber-600' : activePosition.pos_percent <= 100 ? 'text-emerald-600' : 'text-violet-600'}`}>
                                    {activePosition.status_open ? formatPercent(activePosition.pos_percent) : '0%'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
                                4
                            </span>
                            <h2 className="text-lg font-bold text-gray-800">
                                รายละเอียดการเรียกแต่ละรอบ
                            </h2>
                        </div>
                        <div className="text-xs text-gray-400 text-center mb-2">
                            กรุณาเลื่อนซ้าย-ขวาเพื่อเลือกดูรอบ
                        </div>

                        {roundsWithData.length === 0 ? (
                            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center text-sm text-gray-400">
                                ยังไม่มีข้อมูลรอบเรียกบัญชี
                            </div>
                        ) : (
                            <div className="-mx-2 overflow-x-auto px-2 pb-3">
                                <div className="flex w-full items-stretch gap-3">
                                    {roundsWithData.map((round) => {
                                        const data = activePosition.roundsData?.[round];
                                        const status = getRoundStatus(data?.status);
                                        const statusList = data?.status_list_n ?? 'no-data';
                                        const statusCall = data?.status_call ?? 'no-data';
                                        const noCall = statusCall === false && statusList === false;
                                        const listExhausted = statusCall === false && statusList === true;
                                        let changeText = '-';
                                        let changeColor = 'text-gray-500';
                                        if (round === 1) {
                                            changeText = 'รอบเริ่มต้น';
                                            changeColor = 'text-emerald-600';
                                        } else if (noCall) {
                                            changeText = 'สิ้นสุดการเรียกบรรจุ';
                                        } else if (
                                            data?.percent_change !== null && data?.percent_change !== undefined
                                        ) {
                                            const value = Number(data.percent_change);
                                            const formatted = Math.abs(value).toLocaleString(
                                                'en-US',
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            );
                                            changeText = value > 0 ? `▲ ${formatted}%` : value < 0 ? `▼ ${formatted}%` : `${formatted}%`;
                                            changeColor = value > 0 ? 'text-emerald-600' : value < 0 ? 'text-rose-600' : 'text-gray-500';
                                        }
                                        const crossedRegionNames = {
                                            1: 'ภาคเหนือ',
                                            2: 'ภาคกลาง',
                                            3: 'ภาคตะวันออกเฉียงเหนือ',
                                            4: 'ภาคใต้',
                                        };
                                        const roundTotal = noCall || listExhausted ? '-' : data?.total != null ? formatNumber(data.total) : '-';
                                        return (
                                            <article
                                                key={round}
                                                className="flex w-auto min-w-[100%] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
                                                    <div>
                                                        <h3 className="text-base font-bold text-gray-800">
                                                            รอบที่ {round}
                                                        </h3>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${status.color}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-1 flex-col gap-3 p-4">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="rounded-xl bg-emerald-50 p-2">
                                                            <p className="text-xs text-emerald-700">
                                                                จำนวนที่เรียกบรรจุ
                                                            </p>
                                                            <p className="mt-1 text-xl font-bold text-emerald-800 text-right">
                                                                {roundTotal}
                                                            </p>
                                                        </div>
                                                        <div className="rounded-xl bg-gray-50 p-2">
                                                            <p className="text-xs text-gray-500">
                                                                ลำดับที่
                                                            </p>
                                                            <p className="mt-1 break-words text-lg font-bold text-gray-800 text-right">
                                                                {noCall || listExhausted ? '-' : data?.start_end || '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden rounded-xl border border-gray-100">
                                                        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-3 py-3">
                                                            <span className="text-sm text-gray-500">
                                                                อัตราการเปลี่ยนแปลง
                                                            </span>
                                                            <span className={`text-right text-sm font-bold ${listExhausted ? 'text-gray-500' : changeColor}`} >
                                                                {listExhausted ? '-' : changeText}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-start justify-between gap-3 px-3 py-3">
                                                            <span className="text-sm text-gray-500">
                                                                วันที่บรรจุ
                                                            </span>
                                                            <span className="text-right text-sm font-semibold text-gray-800">
                                                                {formatDateThai(data?.date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                                        <div className="bg-gray-50 px-3 py-3">
                                                            <h4 className="text-sm font-bold text-gray-800">
                                                                รายละเอียดการเรียกข้ามเขต
                                                            </h4>
                                                        </div>
                                                        <div className="divide-y divide-gray-100">
                                                            <div className="flex items-start justify-between gap-3 px-3 py-3">
                                                                <span className="text-sm text-gray-500">
                                                                    เรียกใช้บัญชีข้ามเขต
                                                                </span>
                                                                <span className="text-right text-sm font-bold text-gray-800">
                                                                    {data?.status_cross === true ? 'ใช่' : data?.status_cross === false ? 'ไม่ใช่' : '-'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-start justify-between gap-3 px-3 py-3">
                                                                <span className="text-sm text-gray-500">
                                                                    ภาคที่เรียกข้ามมา
                                                                </span>
                                                                <span className="max-w-[60%] text-right text-sm font-bold text-gray-800">
                                                                    {crossedRegionNames[data?.crossed_region] || '-'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-start justify-between gap-3 px-3 py-3">
                                                                <span className="text-sm text-gray-500">
                                                                    เขตที่เรียกข้ามมา
                                                                </span>
                                                                <span className="text-right text-sm font-bold text-gray-800">
                                                                    {data?.crossed_zone != null && data?.crossed_zone !== 'no-data' ? `เขต ${data.crossed_zone}` : '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </div>
                        )}


                    </div>
                </section>
            )}
        </div>
    );
}
