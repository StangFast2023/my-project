
import { useMemo, useState, useEffect, useRef, Fragment } from 'react';
import { EmptyData } from '../../EmptyData';
import { Check } from 'lucide-react';

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
                                    .filter(({ data }) => {
                                        return (
                                            data &&
                                            (
                                                data.call_status !== undefined ||
                                                data.list_status !== undefined ||
                                                data.type_call
                                            )
                                        );
                                    });

                                if (roundsWithData.length === 0) {
                                    return (
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-gray-700">
                                            ยังไม่มีข้อมูลการเรียกบรรจุ
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        ref={roundsScrollRef}
                                        className="flex gap-3 overflow-x-auto pb-4"
                                    >
                                        {roundsWithData.map(({ num, data }) => {
                                            const called = data.call_status === true;
                                            const listed = data.list_status === true;
                                            const change = Number(data.percent_change) || 0;
                                            const proportion_used = activePosition.total_listed_n > 0 ? Number((data.total / activePosition.total_listed_n) * 100).toFixed(2) : 0;
                                            const callTypes = getMobileCallTypes(data.type_call);

                                            const workStatus = (() => {
                                                if (data.status_work === "completed") {
                                                    return {
                                                        label: "ได้รับการบรรจุแล้ว",
                                                        color: "border-1 border-green-400 bg-green-100 text-green-700",
                                                    };
                                                }

                                                if (data.status_work === "waiting") {
                                                    return {
                                                        label: "รอการเรียกบรรจุ",
                                                        color: "border-1 border-blue-400 bg-blue-100 text-blue-700",
                                                    };
                                                }

                                                if (!called) {
                                                    return {
                                                        label: "ไม่มีการเรียกใช้บัญชี",
                                                        color: "border-1 border-gray-400 bg-gray-100 text-gray-600",
                                                    };
                                                }

                                                if (!listed) {
                                                    return {
                                                        label: "บัญชีสิ้นสุด",
                                                        color: "border-1 border-red-400 bg-red-100 text-red-700",
                                                    };
                                                }

                                                return {
                                                    label: "ไม่ระบุสถานะ",
                                                    color: "border-1 border-gray-400 bg-gray-100 text-gray-600",
                                                };
                                            })();

                                            return (
                                                <Fragment key={num}>
                                                    {called ? (
                                                        <div
                                                            key={num}
                                                            className="min-w-[300px] max-w-[340px] flex-shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                                                        >
                                                            {/* หัวการ์ด */}
                                                            <div className="bg-gray-100 border-b border-gray-100 p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-bold text-gray-800">
                                                                        รอบที่ {num}
                                                                    </h4>

                                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${workStatus.color}`}>
                                                                        {workStatus.label}
                                                                    </span>
                                                                </div>

                                                                <div className="mt-3">
                                                                    <p className="text-sm text-gray-700">
                                                                        จำนวนเรียกบรรจุ
                                                                    </p>

                                                                    <p className="text-right text-2xl font-bold text-gray-700">
                                                                        {Number(data.total || 0).toLocaleString("th-TH")}
                                                                        <span className="ml-2 text-sm font-normal text-gray-700">
                                                                            อัตรา
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* ข้อมูลประจำรอบ */}
                                                            <div className="p-4 space-y-3">
                                                                <div className={`p-2 border-1 rounded-lg ${data.list_new_status ? 'border-emerald-400 bg-emerald-200/50' : 'border-rose-400 bg-rose-200/50'}`}>
                                                                    <p className="text-xs text-gray-700">
                                                                        ประเภทบัญชี
                                                                    </p>
                                                                    <p className={`text-right text-sm font-bold ${data.list_new_status ? 'text-emerald-700' : 'text-rose-700'} `}>
                                                                        {data.list_new_status
                                                                            ? "บัญชีใหม่"
                                                                            : "บัญชีเดิม"}
                                                                    </p>
                                                                </div>

                                                                <div className="p-2 border-1 border-gray-400 rounded-lg bg-gray-50">
                                                                    <p className="text-xs text-gray-700">
                                                                        วันที่รายงานข้อมูล
                                                                    </p>

                                                                    <p className="text-right text-sm font-bold text-gray-800">
                                                                        {data.st_report_thai_short || "-"}
                                                                        {" - "}
                                                                        {data.ed_report_thai_short || "-"}
                                                                    </p>
                                                                </div>

                                                                <div className="p-2 border-1 border-gray-400 rounded-lg bg-gray-50">
                                                                    <p className="text-xs text-gray-700">
                                                                        วันที่เรียกบรรจุ
                                                                    </p>

                                                                    <p className="text-right text-sm font-bold text-gray-800">
                                                                        {data.call_date || "-"}
                                                                    </p>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="p-2 border-1 border-gray-400 rounded-lg bg-gray-50">
                                                                        <p className="text-xs text-gray-700">
                                                                            เปลี่ยนแปลง
                                                                        </p>

                                                                        <p className={`text-right text-sm font-semibold ${change > 0
                                                                            ? "text-green-600"
                                                                            : change < 0
                                                                                ? "text-red-600"
                                                                                : "text-gray-600"
                                                                            }`}>
                                                                            {change > 0 ? "+" : ""}
                                                                            {change.toLocaleString("th-TH", {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            })}%
                                                                        </p>
                                                                    </div>

                                                                    <div className="p-2 border-1 border-gray-400 rounded-lg bg-gray-50">
                                                                        <p className="text-xs text-gray-700">
                                                                            สัดส่วนการใช้บัญชี
                                                                        </p>

                                                                        <p className="text-right text-sm font-semibold text-gray-800">
                                                                            {proportion_used}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* รายละเอียดประเภทการเรียก */}
                                                            <div className="border-t border-gray-200 p-4">
                                                                <h5 className="mb-3 text-sm font-bold text-gray-800">
                                                                    รายละเอียดประเภทการเรียก
                                                                </h5>

                                                                {callTypes.length === 0 ? (
                                                                    <p className="text-sm text-gray-400 text-center py-3">
                                                                        ไม่มีรายละเอียดประเภทการเรียก
                                                                    </p>
                                                                ) : (
                                                                    <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory">
                                                                        {callTypes.map((type, typeIndex) => (
                                                                            <div
                                                                                key={`${type.id}-${typeIndex}`}
                                                                                className="w-[95%] min-w-[95%] flex-shrink-0 snap-start rounded-lg border border-gray-200 overflow-hidden"
                                                                            >
                                                                                <div className="bg-gray-50 p-2">
                                                                                    <div className="flex items-center justify-between gap-2">
                                                                                        <p className="text-sm font-semibold text-gray-800">
                                                                                            {type.name}
                                                                                        </p>
                                                                                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs border-1 border-emerald-400 font-semibold text-emerald-700 whitespace-nowrap">
                                                                                            {type.total.toLocaleString("th-TH")} อัตรา
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="mt-2">
                                                                                        <p className="text-xs text-gray-700 mb-2">
                                                                                            ลำดับที่เรียก
                                                                                        </p>

                                                                                        {type.ranks.length > 0 ? (
                                                                                            <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-2 snap-x snap-mandatory">
                                                                                                {type.ranks.map((rank, index) => (
                                                                                                    <span
                                                                                                        key={`${rank}-${index}`}
                                                                                                        className="flex-shrink-0 snap-start rounded-md bg-white border border-gray-400 px-2 py-1 text-sm font-semibold text-gray-700"
                                                                                                    >
                                                                                                        {rank}
                                                                                                    </span>
                                                                                                ))}
                                                                                            </div>
                                                                                        ) : (
                                                                                            <p className="text-sm text-gray-400">-</p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                {/* รายละเอียดภาคและเขต */}
                                                                                <div className="p-3">
                                                                                    {type.provinceGroups.length === 0 ? (
                                                                                        <p className="text-xs text-gray-400">
                                                                                            ไม่มีข้อมูลพื้นที่
                                                                                        </p>
                                                                                    ) : (
                                                                                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                                                                                            {type.provinceGroups.map((region) => (
                                                                                                <div
                                                                                                    key={region.regionId}
                                                                                                    className="w-[95%] min-w-[95%] flex-shrink-0 snap-start rounded-lg border border-gray-200 p-3"
                                                                                                >
                                                                                                    {/* ชื่อภาค */}
                                                                                                    <p className="mb-3 text-sm font-semibold text-gray-800">
                                                                                                        {region.name}
                                                                                                    </p>

                                                                                                    {region.zones.length === 0 ? (
                                                                                                        <p className="text-xs text-gray-400">
                                                                                                            ไม่มีข้อมูลเขต
                                                                                                        </p>
                                                                                                    ) : (
                                                                                                        /* การ์ดเขตเลื่อนซ้าย-ขวา */
                                                                                                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                                                                                                            {region.zones.map((zone) => (
                                                                                                                <div
                                                                                                                    key={zone.zoneId}
                                                                                                                    className="w-[95%] min-w-[95%] flex-shrink-0 snap-start rounded-lg border border-gray-100 bg-gray-50 p-2"
                                                                                                                >
                                                                                                                    <div className="flex items-center justify-between gap-2">
                                                                                                                        <p className="text-sm font-medium text-gray-700">
                                                                                                                            {zone.name}
                                                                                                                        </p>

                                                                                                                        <span className="text-xs text-gray-700 whitespace-nowrap">
                                                                                                                            {zone.provinces.length} จังหวัด
                                                                                                                        </span>
                                                                                                                    </div>

                                                                                                                    <button
                                                                                                                        type="button"
                                                                                                                        onClick={() => {
                                                                                                                            setSelectedZone({
                                                                                                                                regionName: region.name,
                                                                                                                                zoneName: zone.name,
                                                                                                                                provinces: zone.provinces,
                                                                                                                            });
                                                                                                                        }}
                                                                                                                        className="mt-2 w-full border-1 border-emerald-400 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                                                                                                                    >
                                                                                                                        ดูรายชื่อจังหวัด
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </Fragment>
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
            {selectedZone && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedZone(null)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 p-4">
                            <div>
                                <h3 className="font-bold text-gray-800">
                                    {selectedZone.zoneName}
                                </h3>

                                <p className="text-xs text-gray-700">
                                    {selectedZone.regionName}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedZone(null)}
                                className="rounded-lg px-3 py-1 text-gray-700 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-4">
                            {selectedZone.provinces.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedZone.provinces.map((province, index) => (
                                        <div
                                            key={`${province}-${index}`}
                                            className="rounded-lg bg-gray-50 p-2 text-sm text-gray-700"
                                        >
                                            {province}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-5 text-center text-sm text-gray-400">
                                    ไม่มีรายชื่อจังหวัด
                                </p>
                            )}
                        </div>

                        <div className="border-t border-gray-200 p-3">
                            <button
                                type="button"
                                onClick={() => setSelectedZone(null)}
                                className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
