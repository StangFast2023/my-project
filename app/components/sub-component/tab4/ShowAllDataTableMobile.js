
import { useMemo, useState, useEffect, useRef, Fragment } from 'react';
import { EmptyData } from '../../EmptyData';
import { Check } from 'lucide-react';
import { createPortal } from 'react-dom';

const getMobileCallTypes = (typeCall) => {
    if (!typeCall || typeof typeCall !== "object") return [];

    return Object.values(typeCall).map((item) => {
        const ranks = Array.isArray(item.rank)
            ? item.rank.map(({ start, end }) => {
                if (start === end) return String(start);
                return `${start}-${end}`;
            })
            : [];

        const provinceGroups = Object.entries(item.provinces || {}).map(
            ([regionId, regionData]) => {
                const zones = Object.entries(regionData || {})
                    .filter(([key, value]) => {
                        return key !== "name" && value && typeof value === "object";
                    })
                    .map(([zoneId, zoneData]) => ({
                        zoneId,
                        name: zoneData.name || `เขต ${zoneId}`,
                        provinces: Array.isArray(zoneData.list)
                            ? zoneData.list
                            : [],
                    }));

                return {
                    regionId,
                    name: regionData.name || `ภาค ${regionId}`,
                    zones,
                };
            }
        );

        return {
            id: item.type_call_id,
            name: item.type_call_name || "ไม่ระบุประเภทการเรียก",
            total: Number(item.total) || 0,
            callStatus: item.call_status === true,
            listNewStatus: item.list_new_status === true,
            ranks,
            provinceGroups,
        };
    });
};

export default function ShowAllDataTableMobile({ checkData, part2, isLoading }) {
    const safePart2 = useMemo(() => part2?.tab4?.part2?.data || {}, [part2?.tab4?.part2?.data]);
    const maxRound = Math.max(10, part2?.tab4?.part2?.round || 0);
    const roundsArray = useMemo(
        () => Array.from({ length: maxRound }, (_, i) => i + 1),
        [maxRound]
    );
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedRegionKey, setSelectedRegionKey] = useState(null);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [selectedPositionKey, setSelectedPositionKey] = useState(null);
    const hasData = Object.keys(safePart2).length > 0;
    const roundsScrollRef = useRef(null);

    useEffect(() => {
        if (roundsScrollRef.current) {
            roundsScrollRef.current.scrollLeft = 0;
        }
    }, [selectedPositionKey]);
    const formatNumber = (value) =>
        (Number(value) || 0).toLocaleString('en-US');
    const formatPercent = (value) =>
        `${(Number(value) || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}%`;
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
                <p className="text-center text-sm font-semibold text-gray-700">
                    กำลังดึงข้อมูล... กรุณารอสักครู่
                </p>
            </div>
        );
    }
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
                        <p className="text-xs text-gray-700">ขึ้นบัญชี (เก่า)</p>
                        <p className="mt-1 break-words text-xl font-bold text-gray-800 text-right">
                            {formatNumber(summary.total_listed)}
                        </p>
                    </div>
                    <div className="rounded-xl bg-gray-100 p-2">
                        <p className="text-xs text-gray-700">ขึ้นบัญชี (ใหม่)</p>
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
                        <p className="text-xs text-gray-700">ความคืบหน้า</p>
                        <p className={`mt-1 text-xl font-bold text-right ${summaryStatusColor}`}>
                            {formatPercent(summaryPercent)}
                        </p>
                    </div>
                    <div className={`rounded-xl border border-gray-200 p-2 col-span-2 text-white ${summaryPercent === 100 ? "bg-emerald-600" : (summaryPercent < 100 ? "bg-amber-600" : "bg-rose-600")}`}>
                        <p className="text-base text-center">สถานะบัญชี : {summaryStatus}</p>
                    </div>
                </div>
                <div className="px-3 pb-3">
                    <p className="mb-2 text-xs font-bold text-gray-700">
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
                                        <span className="text-xs text-gray-700 whitespace-nowrap">
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
                            const status_open = item.status_open;
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-3">
                                        <div className="p-2 rounded inset-shadow-sm">
                                            <p className="text-xs text-gray-700">สถานะเปิดสอบ</p>
                                            <p className={`mt-1 p-2 rounded-xl font-bold text-center border shadow-sm ${status_open ? 'border-emerald-700 text-emerald-700 bg-emerald-50' : 'border-rose-700 text-rose-700  bg-rose-50'}`}>
                                                {status_open ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}
                                            </p>
                                        </div>
                                        <div className="p-2 rounded inset-shadow-sm">
                                            <p className="text-xs text-gray-700">สถานะบัญชี</p>
                                            <p className={`mt-1 p-2 rounded-xl font-bold text-center shadow-sm ${status.color}`}>
                                                {status.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`mt-3 rounded-lg py-1.5 text-center text-xs font-bold ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
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

                        <div className="grid grid-cols-2 gap-3 p-2">
                            <div className="rounded-xl bg-gray-50 p-2 inset-shadow-sm">
                                <p className="text-xs text-gray-700">ขึ้นบัญชี (เก่า)</p>
                                <p className="mt-1 text-lg font-bold text-gray-800 text-right">
                                    {formatNumber(activePosition.total_listed)}
                                </p>
                            </div>
                            <div className="rounded-xl bg-gray-100 p-2 inset-shadow-sm">
                                <p className="text-xs text-gray-700">ขึ้นบัญชี (ใหม่)</p>
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
                                <p className="text-xs text-gray-700">ความคืบหน้า</p>
                                <p className={`mt-1 text-lg font-bold text-right ${!activePosition.status_open ? 'text-gray-700' : activePosition.pos_percent < 30 ? 'text-rose-600' : activePosition.pos_percent < 70 ? 'text-amber-600' : activePosition.pos_percent <= 100 ? 'text-emerald-600' : 'text-violet-600'}`}>
                                    {activePosition.status_open ? formatPercent(activePosition.pos_percent) : '0%'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">

                        <div className="mt-5">

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


                            {(() => {
                                const roundsWithData = roundsArray
                                    .map((num) => ({
                                        num,
                                        data: activePosition?.roundsData?.[num],
                                    }))
                                    .filter(({ data }) =>
                                        data && (
                                            data.call_status !== undefined ||
                                            data.list_status !== undefined ||
                                            data.type_call
                                        )
                                    );

                                if (roundsWithData.length === 0) {
                                    return (
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-700">
                                            ยังไม่มีข้อมูลการเรียกบรรจุ
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        ref={roundsScrollRef}
                                        className="flex w-full min-w-full items-start snap-x snap-mandatory gap-2 overflow-x-auto pb-3"
                                    >
                                        {roundsWithData.map(({ num, data }) => {
                                            const called = data.call_status === true;
                                            const listed = data.list_status === true;
                                            const callTypes = getMobileCallTypes(data.type_call);

                                            const hasChange =
                                                data.percent_change !== null &&
                                                data.percent_change !== undefined &&
                                                Number.isFinite(Number(data.percent_change));

                                            const change = hasChange
                                                ? Number(data.percent_change)
                                                : null;

                                            const proportionUsed =
                                                activePosition.total_listed_n > 0
                                                    ? (Number(data.total || 0) /
                                                        activePosition.total_listed_n) * 100
                                                    : 0;

                                            const workStatus = (() => {
                                                if (data.status_work === "completed") {
                                                    return {
                                                        label: "ได้รับการบรรจุแล้ว",
                                                        color: "bg-emerald-50 text-emerald-700 border border-emerald-300",
                                                    };
                                                }

                                                if (data.status_work === "waiting") {
                                                    return {
                                                        label: "รอการเรียกบรรจุ",
                                                        color: "bg-blue-50 text-blue-700 border border-blue-300",
                                                    };
                                                }

                                                if (!called) {
                                                    return {
                                                        label: "ไม่มีการเรียกใช้บัญชี",
                                                        color: "bg-gray-100 text-gray-600 border border-gray-300",
                                                    };
                                                }

                                                if (!listed) {
                                                    return {
                                                        label: "บัญชีสิ้นสุด",
                                                        color: "bg-rose-50 text-rose-700 border border-rose-300",
                                                    };
                                                }

                                                return {
                                                    label: "ไม่ระบุสถานะ",
                                                    color: "bg-gray-100 text-gray-600 border border-gray-300",
                                                };
                                            })();

                                            return (
                                                <div
                                                    key={num}
                                                    className="h-auto w-[100%] min-w-[100%] shrink-0 snap-start rounded-xl border border-gray-200 bg-white p-1"
                                                >
                                                    <div className="space-y-2">

                                                        {/* หัวการ์ด */}
                                                        <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-2">
                                                            <span className="text-base font-bold text-gray-800">
                                                                รอบที่ {data.round || num}
                                                            </span>

                                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${workStatus.color}`}>
                                                                {workStatus.label}
                                                            </span>
                                                        </div>

                                                        {/* ข้อมูลประจำรอบ */}
                                                        <div className="grid grid-cols-2 gap-2 p-1">

                                                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                                                                <p className="text-xs text-gray-700">
                                                                    จำนวนที่เรียกบรรจุ
                                                                </p>
                                                                <p className="mt-1 text-right text-lg font-bold text-gray-800">
                                                                    {(Number(data.total) || 0).toLocaleString("th-TH")}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                                                                <p className="text-xs text-gray-700">
                                                                    บัญชีที่ใช้เรียก
                                                                </p>
                                                                <p className="mt-1 text-right text-sm font-bold">
                                                                    {data.list_new_status === true ? (
                                                                        <span className="text-emerald-700">
                                                                            บัญชีใหม่
                                                                        </span>
                                                                    ) : data.list_new_status === false ? (
                                                                        <span className="text-rose-700">
                                                                            บัญชีเก่า
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-500">-</span>
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="col-span-2 rounded-lg border border-gray-100 bg-gray-50 p-2">
                                                                <p className="text-xs text-gray-700">
                                                                    วันที่รายงานตัว
                                                                </p>
                                                                <p className="mt-1 text-right text-sm font-semibold text-gray-800">
                                                                    {called ? data.st_report_thai_short || "-" : "-"}
                                                                    {" - "}
                                                                    {called ? data.ed_report_thai_short || "-" : "-"}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                                                                <p className="text-xs text-gray-700">
                                                                    วันที่เรียกบรรจุ
                                                                </p>
                                                                <p className="mt-1 text-right text-sm font-semibold text-gray-800">
                                                                    {called ? data.call_date || "-" : "-"}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                                                                <p className="text-xs text-gray-700">
                                                                    อัตราการเปลี่ยนแปลง
                                                                </p>
                                                                <p className={`mt-1 text-right text-sm font-semibold ${change === null
                                                                    ? "text-gray-600"
                                                                    : change > 0
                                                                        ? "text-emerald-600"
                                                                        : change < 0
                                                                            ? "text-rose-600"
                                                                            : "text-gray-600"
                                                                    }`}>
                                                                    {Number(data.round || num) === 1
                                                                        ? "รอบเริ่มต้น"
                                                                        : !called && !listed
                                                                            ? "สิ้นสุดการเรียกบรรจุ"
                                                                            : change !== null
                                                                                ? `${change > 0 ? "+" : ""}${change.toLocaleString("th-TH", {
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 2,
                                                                                })}%`
                                                                                : "-"}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
                                                                <p className="text-xs text-gray-700">
                                                                    สัดส่วนการใช้บัญชี
                                                                </p>
                                                                <p className="mt-1 text-right text-sm font-semibold text-gray-800">
                                                                    {called ? `${proportionUsed.toFixed(2)}%` : "-"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* รายละเอียดประเภทการเรียก */}
                                                        <div className="space-y-3 border-t border-gray-200 pt-2">

                                                            <div className="flex items-center justify-between px-1">
                                                                <h6 className="text-xs font-bold text-gray-700">
                                                                    รายละเอียดประเภทการเรียก
                                                                </h6>
                                                                <span className="text-xs text-gray-800">
                                                                    {callTypes.length} ประเภท
                                                                </span>
                                                            </div>

                                                            {callTypes.length > 0 ? (
                                                                <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">

                                                                    {callTypes.map((type, typeIndex) => (
                                                                        <div
                                                                            key={`${type.id}-${typeIndex}`}
                                                                            className="w-[95%] min-w-[95%] shrink-0 snap-start rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3"
                                                                        >

                                                                            {/* ชื่อประเภทและจำนวน */}
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <span className="text-sm font-bold text-gray-800">
                                                                                    {type.name}
                                                                                </span>

                                                                                <span className="shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-bold text-gray-700">
                                                                                    {type.total.toLocaleString("th-TH")} อัตรา
                                                                                </span>
                                                                            </div>

                                                                            {/* สถานะพื้นที่ */}
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <p className="text-xs font-semibold text-gray-700">
                                                                                    ลักษณะการเรียก
                                                                                </p>

                                                                                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${type.is_cross_region
                                                                                    ? "bg-violet-50 text-violet-700"
                                                                                    : "bg-emerald-50 text-emerald-700"
                                                                                    }`}>
                                                                                    {type.is_cross_region
                                                                                        ? "ข้ามภาค"
                                                                                        : "ภายในภาค"}
                                                                                </span>
                                                                            </div>

                                                                            {/* ลำดับบัญชี */}
                                                                            <div>
                                                                                <p className="mb-1 text-xs font-semibold text-gray-700">
                                                                                    ลำดับบัญชีที่เรียก
                                                                                </p>

                                                                                {type.ranks.length > 0 ? (
                                                                                    <div className="flex flex-nowrap gap-1.5 overflow-x-auto snap-x snap-mandatory pb-2">
                                                                                        {type.ranks.map((rank, index) => (
                                                                                            <span
                                                                                                key={`${rank}-${index}`}
                                                                                                className="shrink-0 snap-start rounded-md border border-gray-400 bg-white px-2 py-1 text-xs font-semibold text-gray-700"
                                                                                            >
                                                                                                {rank}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="text-xs text-gray-500">
                                                                                        ไม่ระบุลำดับ
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* พื้นที่เรียกบรรจุ */}
                                                                            {type.provinceGroups.length > 0 ? (
                                                                                <div className="space-y-2">
                                                                                    <p className="text-xs font-semibold text-gray-700">
                                                                                        พื้นที่เรียกบรรจุ
                                                                                    </p>

                                                                                    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">

                                                                                        {type.provinceGroups.map((region) => (
                                                                                            <div
                                                                                                key={region.regionId}
                                                                                                className="w-[95%] min-w-[95%] shrink-0 snap-start rounded-lg border border-gray-300 bg-white p-2 space-y-2"
                                                                                            >
                                                                                                {/* ภาค */}
                                                                                                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                                                                                                    <p className="text-sm font-bold text-gray-700">
                                                                                                        {region.name}
                                                                                                    </p>
                                                                                                </div>

                                                                                                {region.zones.length > 0 ? (
                                                                                                    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">

                                                                                                        {region.zones.map((zone) => (
                                                                                                            <div
                                                                                                                key={zone.zoneId}
                                                                                                                className="w-[90%] min-w-[90%] shrink-0 snap-start rounded-lg border border-gray-200 bg-gray-50 p-2"
                                                                                                            >
                                                                                                                <div className="flex items-center justify-between gap-2">
                                                                                                                    <p className="text-xs font-bold text-gray-700">
                                                                                                                        {zone.name}
                                                                                                                    </p>

                                                                                                                    <span className="shrink-0 text-xs text-gray-700">
                                                                                                                        {zone.provinces.length} จังหวัด
                                                                                                                    </span>
                                                                                                                </div>

                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    onClick={() => setSelectedZone({
                                                                                                                        regionName: region.name,
                                                                                                                        zoneName: zone.name,
                                                                                                                        provinces: zone.provinces,
                                                                                                                    })}
                                                                                                                    className="mt-2 w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700"
                                                                                                                >
                                                                                                                    ดูรายชื่อจังหวัด
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        ))}

                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <p className="text-xs text-gray-500">
                                                                                                        ไม่มีข้อมูลเขต
                                                                                                    </p>
                                                                                                )}
                                                                                            </div>
                                                                                        ))}

                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-xs text-gray-500">
                                                                                    ไม่มีข้อมูลพื้นที่ที่เรียกบรรจุ
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ))}

                                                                </div>
                                                            ) : (
                                                                <p className="rounded-lg bg-white p-3 text-center text-xs text-gray-600">
                                                                    ไม่มีรายละเอียดประเภทการเรียก
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                        </div>
                    </div>
                </section>
            )}


            {/* Modal รายชื่อจังหวัด */}
            {selectedZone &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        className="md:hidden fixed inset-0 z-[9999] flex items-center justify-center bg-gray-800/50 p-4"
                        onClick={() => setSelectedZone(null)}
                    >
                        <div
                            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">
                                        รายชื่อจังหวัด
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-700">
                                        {selectedZone.regionName} {selectedZone.zoneName}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedZone(null)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                                    aria-label="ปิดหน้าต่าง"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* จำนวนจังหวัด */}
                            <div className="px-4 pt-3">
                                <span className="text-xs font-semibold text-gray-700">
                                    ทั้งหมด {selectedZone.provinces.length} จังหวัด
                                </span>
                            </div>

                            {/* รายชื่อจังหวัด */}
                            <div className="max-h-[60vh] overflow-y-auto p-4">
                                {selectedZone.provinces.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedZone.provinces.map((province, index) => (
                                            <div
                                                key={`${selectedZone.zoneName}-${index}`}
                                                className="rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-xs font-semibold text-gray-700"
                                            >
                                                {province}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-xs text-gray-600">
                                        ไม่มีรายชื่อจังหวัด
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 p-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedZone(null)}
                                    className="w-full rounded-lg bg-gray-800 py-2.5 text-sm font-semibold text-white"
                                >
                                    ปิดหน้าต่าง
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

        </div>
    );
}
