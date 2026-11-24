"use client";

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ContactRound, Search } from 'lucide-react';
import RoundDetailModal from '@/app/components/RoundDetailModal';
import useMediaQuery from '@/app/avaliable/useMediaQuery';

export default function Row6RegionTable({ position, data }) {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const TableData = useMemo(() => {
        return data?.chart_3_region || {};
    }, [data?.chart_3_region]);
    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );
    const [selectedRegionKey, setSelectedRegionKey] = useState(null);
    const [selectedZoneKey, setSelectedZoneKey] = useState(null);
    const [selectedRoundKey, setSelectedRoundKey] = useState(null);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRound, setSelectedRound] = useState(null);

    const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
    const [selectedTypeCall, setSelectedTypeCall] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);

    const handleCellClick = (each_round_data) => {
        setSelectedRound(each_round_data);
        setIsModalOpen(true);
    };

    const roundColumns = Array.from({ length: 10 }, (_, i) => i + 1);

    const getChangeUI = (round, called, listed, change) => {
        if (round === 1) return { text: 'รอบเริ่มต้น', color: 'text-green-600', icon: null };
        if (called === false && listed === false) return { text: 'สิ้นสุดการเรียกบรรจุ', color: 'text-gray-500', icon: null };
        if (change == null) return { text: '-', color: 'text-gray-500', icon: null };
        const val = Number(change);
        const formatted = Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (val > 0) return { text: `${formatted} %`, color: 'text-green-600', icon: 'up' };
        if (val < 0) return { text: `${formatted} %`, color: 'text-rose-600', icon: 'down' };
        return { text: `${formatted} %`, color: 'text-gray-500', icon: 'minus' };
    };

    const textColor = (value, list) => {
        if (Number(value) > 0) return 'text-emerald-600';
        if (list === false) return 'text-amber-600';
        return 'text-rose-600';
    };

    const getBgHover = (value, list) => {
        if (list === false) return 'hover:bg-amber-50/90';
        if (Number(value) > 0) return 'hover:bg-emerald-50/90';
        return 'hover:bg-rose-50/90';
    };

    const formatNumber = (value) => Number(value || 0).toLocaleString();
    const formatPercent = (value) => value == null || value === ''
        ? '-'
        : `${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

    const regions = useMemo(() => Object.entries(TableData).map(([regionKey, region]) => {
        const zones = Object.entries(region?.sub_province || {}).map(([zoneKey, zone]) => {
            const allRoundEntries = Object.entries(zone?.data_rounds || {})
                .map(([key, roundInfo]) => ({
                    roundKey: Number(key),
                    roundInfo,
                    total: roundInfo?.total != null && roundInfo.total !== '-'
                        ? Number(roundInfo.total) || 0
                        : 0,
                }))
                .filter((item) => Number.isInteger(item.roundKey) && item.roundKey > 0)
                .sort((a, b) => a.roundKey - b.roundKey);

            const rounds = roundColumns.map((roundKey) => {
                const found = allRoundEntries.find((item) => item.roundKey === roundKey);
                return found || { roundKey, roundInfo: null, total: 0 };
            });

            return {
                ...zone,
                key: String(zoneKey),
                statusOpen: zone?.status_open === true,
                listed: Number(zone?.total_listed) || 0,
                listedNew: Number(zone?.total_listed_n) || 0,
                diff: Number(zone?.total_diff) || 0,
                calledTotal: Number(zone?.total_called) || 0,
                remain: Number(zone?.total_remaining) || 0,
                processing: Number(zone?.processing) || 0,
                rounds,
                mobileRounds: allRoundEntries,
            };
        });

        const summary = {
            list: 0,
            list_n: 0,
            diff: 0,
            call: 0,
            remain: 0,
            rounds: roundColumns.map(() => ({ total: 0 })),
        };

        zones.forEach((zone) => {
            summary.list += zone.listed;
            summary.list_n += zone.listedNew;
            summary.diff += zone.diff;
            summary.call += zone.calledTotal;
            summary.remain += zone.remain;
            zone.rounds.forEach((round, index) => {
                summary.rounds[index].total += round.total;
            });
        });

        return { ...region, key: String(regionKey), zones, summary };
    }), [TableData, roundColumns]);

    const grandTotal = useMemo(() => {
        const result = {
            list: 0,
            list_n: 0,
            diff: 0,
            call: 0,
            remain: 0,
            rounds: roundColumns.map(() => ({ total: 0 })),
        };

        regions.forEach(({ summary }) => {
            result.list += summary.list;
            result.list_n += summary.list_n;
            result.diff += summary.diff;
            result.call += summary.call;
            result.remain += summary.remain;
            summary.rounds.forEach((round, index) => {
                result.rounds[index].total += round.total;
            });
        });
        return result;
    }, [regions, roundColumns]);

    const getRemainingStatus = (remain) => remain === 0 ? 'หมดบัญชีแล้ว' : remain > 0 ? 'คงเหลือ' : 'ขาดแคลน';
    const getRemainingClass = (remain) => remain > 0 ? 'text-orange-600' : 'text-rose-600';
    const getProcessing = (called, listed) => listed > 0 ? `${((called / listed) * 100).toFixed(2)} %` : '0.00 %';

    const mobileRegions = regions;
    const activeRegion = mobileRegions.find((region) => region.key === String(selectedRegionKey)) || mobileRegions[0] || null;
    const activeRegionKey = activeRegion?.key ?? null;
    const mobileZones = activeRegion?.zones || [];
    const activeZone = mobileZones.find((zone) => zone.key === String(selectedZoneKey)) || mobileZones[0] || null;
    const activeRoundList = activeZone?.mobileRounds || [];
    const activeRound = activeRoundList.find((round) => round.roundKey === Number(selectedRoundKey)) || activeRoundList[0] || null;
    const activeTypeCalls = activeRound?.roundInfo?.type_call &&
        typeof activeRound.roundInfo.type_call === 'object'
        ? Object.values(activeRound.roundInfo.type_call)
        : [];
    const changeRegion = (regionKey) => {
        setSelectedRegionKey(regionKey);
        setSelectedZoneKey(null);
        setSelectedRoundKey(null);
    };
    const changeZone = (zoneKey) => {
        setSelectedZoneKey(zoneKey);
        setSelectedRoundKey(null);
    };

    const renderMobileSummary = (summary, title, dark = false) => (
        <section className={`overflow-hidden rounded-2xl border shadow-sm ${dark ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-800'}`}>
            <div className={`border-b px-3 py-3 ${dark ? 'border-white/15' : 'border-gray-100'}`}>
                <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-500'}`}>สรุปผล</p>
                <h3 className="font-bold">{title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
                <div className={`rounded-lg p-3 ${dark ? 'bg-white/10' : 'bg-amber-50'}`}>
                    <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-500'}`}>ขึ้นบัญชี (เก่า)</p>
                    <p className="mt-1 break-words text-right font-bold">{formatNumber(summary.list)}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? 'bg-white/10' : 'bg-amber-100'}`}>
                    <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-500'}`}>ขึ้นบัญชี (ใหม่)</p>
                    <p className="mt-1 break-words text-right font-bold">{formatNumber(summary.list_n)}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? 'bg-white/10' : 'bg-rose-50'}`}>
                    <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-500'}`}>ส่วนต่าง</p>
                    <p className={`mt-1 break-words text-right font-bold ${dark ? 'text-white' : 'text-rose-700'}`}>{formatNumber(summary.diff)}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? 'bg-white/10' : 'bg-emerald-50'}`}>
                    <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-500'}`}>เรียกแล้ว</p>
                    <p className={`mt-1 break-words text-right font-bold ${dark ? 'text-white' : 'text-emerald-700'}`}>{formatNumber(summary.call)}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? 'bg-white/10' : 'bg-blue-50'}`}>
                    <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-500'}`}>ความคืบหน้า</p>
                    <p className={`mt-1 break-words text-right font-bold ${dark ? 'text-white' : 'text-blue-700'}`}>{getProcessing(summary.call, summary.list_n)}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? 'bg-white/10' : 'bg-orange-50'}`}>
                    <p className={`text-xs ${dark ? 'text-gray-300' : 'text-gray-500'}`}>สถานะตำแหน่ง</p>
                    <p className={`mt-1 break-words text-right text-sm font-bold ${dark ? 'text-white' : getRemainingClass(summary.remain)}`}>{getRemainingStatus(summary.remain)}</p>
                </div>
                <div className={`col-span-2 flex items-center justify-between gap-3 rounded-lg p-3 ${dark ? 'bg-white/10' : 'bg-amber-50'}`}>
                    <span className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-600'}`}>คงเหลือ</span>
                    <span className={`font-bold ${dark ? 'text-white' : getRemainingClass(summary.remain)}`}>{formatNumber(summary.remain)} คน</span>
                </div>
            </div>
            <div className={`border-t p-3 ${dark ? 'border-white/15' : 'border-gray-100'}`}>
                <p className={`mb-2 text-sm font-bold ${dark ? 'text-white' : 'text-gray-700'}`}>รวมยอดแต่ละรอบ</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {summary.rounds.map((round, index) => {
                        const rounds = round.total;
                        return (
                            rounds ? (
                                <div key={index} className={`flex min-w-[112px] shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${dark ? 'bg-white/10' : 'bg-gray-50'}`}>
                                    <span className={`whitespace-nowrap ${dark ? 'text-gray-300' : 'text-gray-500'}`}>รอบ {index + 1}</span>
                                    <span className="font-semibold">{round.total ? formatNumber(round.total) : '—'}</span>
                                </div>
                            ) : null
                        );
                    })}
                </div>
            </div>
        </section>
    );

    const renderZoneSummary = (zone) => (
        <div className="grid grid-cols-2 gap-2 p-3">
            <div className="rounded-lg bg-amber-50 p-3">
                <p className="text-xs text-gray-600">ขึ้นบัญชี (เก่า)</p>
                <p className="mt-1 break-words text-base text-right font-bold text-gray-700">{zone.statusOpen ? formatNumber(zone.listed) : '-'}</p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
                <p className="text-xs text-gray-600">ขึ้นบัญชี (ใหม่)</p>
                <p className="mt-1 break-words text-base text-right font-bold text-gray-700">{zone.statusOpen ? formatNumber(zone.listedNew) : '-'}</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-3">
                <p className="text-xs text-gray-600">ส่วนต่าง</p>
                <p className="mt-1 break-words text-base text-right font-bold text-rose-700">{zone.statusOpen ? formatNumber(zone.diff) : '-'}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
                <p className="text-xs text-gray-600">เรียกแล้ว</p>
                <p className="mt-1 break-words text-base text-right font-bold text-emerald-700">{zone.statusOpen ? formatNumber(zone.calledTotal) : '-'}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-gray-600">ความคืบหน้า</p>
                <p className="mt-1 break-words text-base text-right font-bold text-blue-700">{zone.statusOpen ? getProcessing(zone.calledTotal, zone.listedNew) : '-'}</p>
            </div>
            <div className={`rounded-lg p-3 ${zone.statusOpen ? zone.remain > 0 ? 'bg-orange-50' : 'bg-rose-50' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-600">สถานะตำแหน่ง</p>
                <p className={`mt-1 text-base text-right text-sm font-bold ${zone.statusOpen ? getRemainingClass(zone.remain) : 'text-gray-500'}`}>{zone.statusOpen ? getRemainingStatus(zone.remain) : '-'}</p>
            </div>
            <div className={`col-span-2 flex items-center justify-between gap-3 rounded-lg p-3 ${zone.statusOpen ? zone.remain > 0 ? 'bg-amber-50' : 'bg-rose-50' : 'bg-gray-50'}`}>
                <span className="text-sm text-gray-600">คงเหลือ</span>
                <span className={`font-bold ${zone.statusOpen ? getRemainingClass(zone.remain) : 'text-gray-500'}`}>{zone.statusOpen ? formatNumber(zone.remain) : '-'} คน</span>
            </div>
        </div>
    );

    const renderMobile = () => (
        <div className="space-y-3">
            {renderMobileSummary({
                list: grandTotal.list,
                list_n: grandTotal.list_n,
                diff: grandTotal.diff,
                call: grandTotal.call,
                remain: grandTotal.remain,
                rounds: grandTotal.rounds,
            }, 'รวมทุกภาค', true)}

            <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">1</span>
                    <div>
                        <h3 className="font-bold text-gray-800">เลือกภาค</h3>
                        <p className="text-xs text-gray-600">เลื่อนซ้าย–ขวาเพื่อเลือกภาค</p>
                    </div>
                </div>
                <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2">
                    {mobileRegions.map((region) => {
                        const active = region.key === activeRegionKey;
                        return (
                            <button key={region.key} type="button" onClick={() => changeRegion(region.key)}
                                className={`min-w-[130px] max-w-[80%] shrink-0 snap-start rounded-xl border px-4 py-3 text-center text-sm font-bold transition ${active ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                                <span className="mt-1 block break-words">{region.name}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">2</span>
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-800">เลือกเขต</h3>
                        <p className="truncate text-xs text-gray-600">
                            {activeRegion?.name || 'เลือกเขตในภาคที่เลือก'}
                        </p>
                    </div>
                </div>

                {mobileZones.length === 0 ? (
                    <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
                        ไม่มีข้อมูลเขตในภาคนี้
                    </p>
                ) : (
                    <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2">
                        {mobileZones.map((zone) => {
                            const active = zone.key === activeZone?.key;

                            return (
                                <button
                                    key={zone.key}
                                    type="button"
                                    onClick={() => changeZone(zone.key)}
                                    className={`flex min-w-0 flex-1 shrink-0 snap-start items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-bold transition ${active
                                        ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                                        : 'border-gray-200 bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <span className="whitespace-nowrap">
                                        {zone.name || `เขต ${zone.key}`}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {activeZone && (
                <>
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50 px-3 py-3">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-600">ข้อมูลเขตที่เลือก</p>
                                <h3 className="font-bold text-base text-gray-800">{activeRegion?.name} / {activeZone.name || `เขต ${activeZone.key}`}</h3>
                            </div>
                            <div className={`mt-2 w-full inline-block rounded-full px-2.5 py-1 text-center text-base font-semibold ${activeZone.statusOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {activeZone.statusOpen ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}
                            </div>
                        </div>
                        {renderZoneSummary(activeZone)}
                    </section>

                    <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">3</span>
                            <div>
                                <h3 className="font-bold text-gray-800">เลือกดูรายรอบ</h3>
                                <p className="text-xs text-gray-600">มี {activeRoundList.length} รอบในข้อมูล • เลื่อนซ้าย–ขวา</p>
                            </div>
                        </div>

                        {activeRoundList.length === 0 ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">ยังไม่มีข้อมูลรายรอบสำหรับเขตนี้</div>
                        ) : (
                            <>
                                <div className="mb-3 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2">
                                    {activeRoundList.map((round) => {
                                        const active = round.roundKey === activeRound?.roundKey;
                                        return (
                                            <button key={round.roundKey} type="button" onClick={() => setSelectedRoundKey(round.roundKey)}
                                                className={`min-w-[76px] shrink-0 snap-start rounded-xl border px-3 py-2 text-center transition ${active ? 'border-amber-500 bg-amber-500 text-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                                                <span className="block text-xs opacity-80">รอบ</span>
                                                <span className="block text-lg font-bold">{round.roundKey}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {activeRound && (
                                    <>
                                        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                            <div className="flex items-start justify-between gap-3 border-b border-gray-100 bg-gray-50 p-4">
                                                <div>
                                                    <p className="text-xs text-gray-600">{activeRegion?.name} / {activeZone.name || `เขต ${activeZone.key}`}</p>
                                                    <h4 className="mt-1 text-lg font-bold text-gray-800">รอบที่ {activeRound.roundKey}</h4>
                                                </div>
                                                <span className="shrink-0 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600">
                                                    {activeRound.roundInfo ? (activeRound.roundInfo.status === 'waiting' ? 'รอการบรรจุ' : 'มีข้อมูล') : 'ไม่มีข้อมูล'}
                                                </span>
                                            </div>

                                            {activeRound.roundInfo ? (
                                                <>

                                                    <div className="divide-y divide-gray-100 border-t border-gray-100">

                                                        <div className="space-y-3 p-3">
                                                            <p className="text-sm font-bold text-gray-700">
                                                                ข้อมูลเพิ่มเติมของรอบ
                                                            </p>
                                                            <div className="flex items-start justify-between gap-3">
                                                                <span className="text-sm text-gray-500">
                                                                    เรียกทั้งหมด
                                                                </span>
                                                                <span className="text-right text-sm font-semibold text-gray-800">
                                                                    {activeRound.roundInfo.total}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start justify-between gap-3">
                                                                <span className="text-sm text-gray-500">
                                                                    อัตราการเปลี่ยนแปลง
                                                                </span>
                                                                <span className={`max-w-[60%] text-right text-sm font-bold ${getChangeUI(
                                                                    activeRound.roundKey,
                                                                    activeRound.roundInfo.called,
                                                                    activeRound.roundInfo.listed,
                                                                    activeRound.roundInfo.percent_change
                                                                ).color
                                                                    }`}>
                                                                    {getChangeUI(
                                                                        activeRound.roundKey,
                                                                        activeRound.roundInfo.called,
                                                                        activeRound.roundInfo.listed,
                                                                        activeRound.roundInfo.percent_change
                                                                    ).text}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start justify-between gap-3">
                                                                <span className="text-sm text-gray-500">
                                                                    สัดส่วนของการใช้บัญชี
                                                                </span>
                                                                <span className="text-right text-sm font-semibold text-gray-800">
                                                                    {formatPercent(activeRound.roundInfo.proportion_used)}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start justify-between gap-3">
                                                                <span className="text-sm text-gray-500">
                                                                    วันที่รายงานตัว
                                                                </span>
                                                                <span className="text-right text-sm font-semibold text-gray-800">
                                                                    {activeRound.roundInfo.st_report_thai_short + ' - ' + activeRound.roundInfo.ed_report_thai_short ?? '-'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start justify-between gap-3">
                                                                <span className="text-sm text-gray-500">
                                                                    วันที่บรรจุ
                                                                </span>
                                                                <span className="text-right text-sm font-semibold text-gray-800">
                                                                    {activeRound.roundInfo.thai_short ?? '-'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start justify-between gap-3">
                                                                <span className="text-sm text-gray-500">
                                                                    สถานะ
                                                                </span>
                                                                <span className={`text-right text-sm font-bold ${activeRound.roundInfo.status_work === 'waiting'
                                                                    ? 'text-sky-600'
                                                                    : activeRound.roundInfo.total === '-'
                                                                        ? 'text-amber-600'
                                                                        : 'text-emerald-600'
                                                                    }`}>
                                                                    {activeRound.roundInfo.total === '-'
                                                                        ? 'บัญชีสิ้นสุดแล้ว'
                                                                        : activeRound.roundInfo.status_work === 'waiting'
                                                                            ? 'รอการบรรจุ'
                                                                            : Number(activeRound.roundInfo.total) === 0
                                                                                ? 'ไม่มีการเรียกใช้บัญชี'
                                                                                : 'บรรจุแล้ว'}
                                                                    {console.log(activeRound.roundInfo)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 p-3">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="text-sm font-bold text-gray-700">
                                                                    ประเภทการเรียก
                                                                </p>
                                                                <span className="text-xs text-gray-400">
                                                                    {activeTypeCalls.length} ประเภท
                                                                </span>
                                                            </div>

                                                            {activeTypeCalls.length > 0 ? (
                                                                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2">
                                                                    {activeTypeCalls.map((typeData, index) => {
                                                                        const regions = Object.entries(typeData.provinces || {});

                                                                        return (
                                                                            <div
                                                                                key={typeData.type_call_id ?? index}
                                                                                className="w-[100%] min-w-[100%] shrink-0 snap-start space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                                                                            >
                                                                                {/* ประเภทการเรียก */}
                                                                                <div className="flex items-start justify-center gap-2">
                                                                                    <span className="text-right text-sm font-bold text-gray-800">
                                                                                        {typeData.type_call_name || '-'}
                                                                                    </span>
                                                                                </div>

                                                                                {/* จำนวนที่เรียก */}
                                                                                <div className="flex items-center justify-between gap-3">
                                                                                    <span className="text-sm text-gray-500">
                                                                                        จำนวนที่เรียก
                                                                                    </span>
                                                                                    <span className="font-bold text-emerald-700">
                                                                                        {formatNumber(typeData.total)} คน
                                                                                    </span>
                                                                                </div>

                                                                                {/* ลำดับที่ */}
                                                                                <div className="space-y-2">
                                                                                    <span className="text-sm text-gray-500">
                                                                                        ลำดับที่
                                                                                    </span>

                                                                                    <div className="flex gap-1 overflow-x-auto whitespace-nowrap pb-1">
                                                                                        {Array.isArray(typeData.rank) &&
                                                                                            typeData.rank.length > 0 ? (
                                                                                            typeData.rank.map((item, rankIndex) => {
                                                                                                const rankText =
                                                                                                    item && typeof item === 'object'
                                                                                                        ? item.start === item.end
                                                                                                            ? String(item.start)
                                                                                                            : `${item.start}-${item.end}`
                                                                                                        : String(item);

                                                                                                return (
                                                                                                    <span
                                                                                                        key={rankIndex}
                                                                                                        className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white px-2 text-sm font-semibold text-gray-700"
                                                                                                    >
                                                                                                        {rankText}
                                                                                                    </span>
                                                                                                );
                                                                                            })
                                                                                        ) : (
                                                                                            <span className="text-sm text-gray-400">-</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                {/* บัญชีที่ใช้เรียก */}
                                                                                <div className="flex items-center justify-between gap-3">
                                                                                    <span className="text-sm text-gray-500">
                                                                                        บัญชีที่ใช้เรียก
                                                                                    </span>
                                                                                    <span
                                                                                        className={`rounded-md border px-2 py-1 text-xs font-semibold ${typeData.list_new_status === true
                                                                                            ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                                                                                            : 'border-rose-300 bg-rose-100 text-rose-700'
                                                                                            }`}
                                                                                    >
                                                                                        {typeData.list_new_status === true
                                                                                            ? 'บัญชีใหม่'
                                                                                            : 'บัญชีเก่า'}
                                                                                    </span>
                                                                                </div>

                                                                                {/* การเรียกข้ามเขต */}
                                                                                <div className="flex items-center justify-between gap-3">
                                                                                    <span className="text-sm text-gray-500">
                                                                                        เรียกบรรจุข้ามเขต
                                                                                    </span>
                                                                                    <span className="text-sm font-semibold text-gray-700">
                                                                                        {typeData.is_cross_region === true ? 'ใช่' : 'ไม่ใช่'}
                                                                                    </span>
                                                                                </div>

                                                                                {/* ภาคและเขต */}
                                                                                <div className="space-y-2">
                                                                                    <div className="flex items-center justify-between gap-2">
                                                                                        <span className="text-sm font-semibold text-gray-700">
                                                                                            ภาค & เขต
                                                                                        </span>
                                                                                        <span className="text-xs text-gray-400">
                                                                                            {regions.length} ภาค
                                                                                        </span>
                                                                                    </div>

                                                                                    {regions.length > 0 ? (
                                                                                        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2">
                                                                                            {regions.map(([regionKey, region]) => {
                                                                                                const zones = Object.entries(region || {}).filter(
                                                                                                    ([key, value]) =>
                                                                                                        key !== 'name' &&
                                                                                                        value &&
                                                                                                        typeof value === 'object' &&
                                                                                                        !Array.isArray(value)
                                                                                                );

                                                                                                return (
                                                                                                    <div
                                                                                                        key={regionKey}
                                                                                                        className="w-[100%] min-w-[100%] shrink-0 snap-start space-y-3 rounded-xl border border-sky-200 bg-white p-3"
                                                                                                    >
                                                                                                        {/* ชื่อภาค */}
                                                                                                        <div className="flex items-center justify-between gap-2">
                                                                                                            <span className="text-sm font-bold text-gray-800">
                                                                                                                {region.name || `ภาค ${regionKey}`}
                                                                                                            </span>
                                                                                                        </div>

                                                                                                        {/* สไลเดอร์เขต */}
                                                                                                        {zones.length > 0 ? (
                                                                                                            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2">
                                                                                                                {zones.map(([zoneKey, zone]) => (
                                                                                                                    <div
                                                                                                                        key={zoneKey}
                                                                                                                        className="w-[100%] min-w-[100%] shrink-0 snap-start space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                                                                                                                    >
                                                                                                                        <div className="flex justify-start items-center gap-2">
                                                                                                                            <span className="text-sm font-bold text-gray-800">
                                                                                                                                {zone.name}
                                                                                                                            </span>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center justify-between gap-2">
                                                                                                                            <span className="text-xs text-gray-500">
                                                                                                                                จำนวนจังหวัด
                                                                                                                            </span>
                                                                                                                            <span className="text-sm font-semibold text-gray-700">
                                                                                                                                {Array.isArray(zone.list)
                                                                                                                                    ? zone.list.length
                                                                                                                                    : 0} จังหวัด
                                                                                                                            </span>
                                                                                                                        </div>

                                                                                                                        {/* ดูจังหวัดเฉพาะเขต */}
                                                                                                                        <button
                                                                                                                            type="button"
                                                                                                                            onClick={() => {
                                                                                                                                setSelectedTypeCall(typeData);
                                                                                                                                setSelectedRegion(region);
                                                                                                                                setSelectedZone(zone);
                                                                                                                                setIsProvinceModalOpen(true);
                                                                                                                            }}
                                                                                                                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                                                                                                                        >
                                                                                                                            <Search size={16} />
                                                                                                                            ดูจังหวัด
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <p className="text-center text-sm text-gray-400">
                                                                                                                ไม่มีข้อมูลเขต
                                                                                                            </p>
                                                                                                        )}

                                                                                                        {zones.length > 1 && (
                                                                                                            <p className="text-center text-xs text-gray-400">
                                                                                                                เลื่อนซ้าย–ขวาเพื่อดูเขตอื่น
                                                                                                            </p>
                                                                                                        )}
                                                                                                    </div>
                                                                                                );
                                                                                            })}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="rounded-lg bg-white p-3 text-center text-sm text-gray-400">
                                                                                            ไม่มีข้อมูลภาคและเขต
                                                                                        </div>
                                                                                    )}

                                                                                    {regions.length > 1 && (
                                                                                        <p className="text-center text-xs text-gray-400">
                                                                                            เลื่อนซ้าย–ขวาเพื่อดูภาคอื่น
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-400">
                                                                    ไม่มีข้อมูลประเภทการเรียก
                                                                </div>
                                                            )}

                                                            {activeTypeCalls.length > 1 && (
                                                                <p className="text-center text-xs text-gray-400">
                                                                    เลื่อนซ้าย–ขวาเพื่อดูประเภทการเรียกอื่น
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>

                                                </>
                                            ) : (
                                                <div className="p-5 text-center text-sm text-gray-500">
                                                    ไม่มีข้อมูลสำหรับรอบที่ {activeRound.roundKey}
                                                </div>
                                            )}
                                        </article>
                                        {mounted && isProvinceModalOpen && selectedTypeCall &&
                                            createPortal(
                                                <div
                                                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
                                                    onClick={() => setIsProvinceModalOpen(false)}
                                                >
                                                    <div className="max-h-[65vh] space-y-3 overflow-y-auto p-4">
                                                        {selectedZone && Array.isArray(selectedZone.list) &&
                                                            selectedZone.list.length > 0 ? (
                                                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                                                <div className="space-y-1 bg-sky-50 p-3">
                                                                    <p className="text-xs text-sky-600">
                                                                        {selectedTypeCall?.type_call_name}
                                                                    </p>
                                                                    <p className="font-bold text-gray-800">
                                                                        {selectedRegion?.name}
                                                                    </p>
                                                                    <p className="text-sm font-semibold text-gray-700">
                                                                        {selectedZone.name}
                                                                    </p>
                                                                </div>

                                                                <div className="flex bg-white flex-wrap gap-2 p-3">
                                                                    {selectedZone.list.map((province, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1.5 text-sm font-medium text-gray-700"
                                                                        >
                                                                            {province}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="py-8 text-center text-sm text-gray-400">
                                                                ไม่มีรายชื่อจังหวัด
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>,
                                                document.body
                                            )
                                        }
                                    </>
                                )}
                            </>
                        )}
                    </section>

                    {activeRegion && renderMobileSummary({
                        list: activeRegion.summary.list,
                        list_n: activeRegion.summary.list_n,
                        diff: activeRegion.summary.diff,
                        call: activeRegion.summary.call,
                        remain: activeRegion.summary.remain,
                        rounds: activeRegion.summary.rounds,
                    }, `รวม ${activeRegion.name}`)}
                </>
            )}
        </div>
    );

    if (!TableData || Object.keys(TableData).length === 0) return null;
    return (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="col-span-1 w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4 lg:col-span-12">
                <div className="mb-4 flex min-w-0 items-center text-gray-700">
                    <ContactRound className="h-5 w-5 shrink-0" />
                    <h3 className="ml-2 min-w-0 text-sm font-bold md:text-base lg:text-lg">
                        ตารางการบรรจุรายรอบของแต่ละเขต {position ? ` ${position}` : null}
                    </h3>
                </div>
                {isMobile ? (
                    renderMobile()
                ) : (
                    <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-gray-300">
                        {regions.length === 0 ? (
                            <div className="h-[500px] w-full" />
                        ) : (
                            <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-gray-300">
                                <table className="w-full min-w-max border-collapse whitespace-nowrap text-left lg:min-w-0">
                                    <thead className="bg-gray-50 text-sm text-gray-600">
                                        <tr>
                                            <th className="sticky left-0 top-0 z-40 w-[10%] bg-gray-50 px-4 py-4 font-semibold">ภาค / เขต</th>
                                            <th className="sticky top-0 z-30 w-[7%] bg-sky-50 px-4 py-4 text-center font-semibold">สถานะเปิดสอบ</th>
                                            <th className="sticky top-0 z-30 w-[5%] bg-amber-50 px-4 py-4 text-center font-semibold">ขึ้นบัญชี (เก่า)</th>
                                            <th className="sticky top-0 z-30 w-[5%] bg-amber-100 px-4 py-4 text-center font-semibold">ขึ้นบัญชี (ใหม่)</th>
                                            <th className="sticky top-0 z-30 w-[5%] bg-rose-50 px-4 py-4 text-center font-semibold text-rose-700">ส่วนต่าง</th>
                                            <th className="sticky top-0 z-30 w-[5%] bg-emerald-50 px-4 py-4 text-center font-semibold text-emerald-700">เรียกแล้ว</th>
                                            <th className="sticky top-0 z-30 w-[5%] bg-blue-50 px-4 py-4 text-center font-semibold text-blue-700">ความคืบหน้า</th>
                                            <th className="sticky top-0 z-30 w-[5%] bg-gray-50 px-4 py-4 text-center font-semibold text-gray-700">สถานะตำแหน่ง</th>
                                            <th className="sticky top-0 z-30 w-[5%] bg-amber-50 px-4 py-4 text-center font-semibold text-amber-600">คงเหลือ</th>
                                            {roundColumns.map((num) => <th key={num} className="sticky top-0 z-30 w-[5%] bg-amber-50/30 px-4 py-4 text-center font-semibold">รอบ {num}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {regions.map((region) => (
                                            <React.Fragment key={region.key}>
                                                <tr className="border-b border-t-2 border-t-gray-700 border-b-gray-200 bg-emerald-50/20">
                                                    <td colSpan={roundColumns.length + 9} className="px-6 py-2 text-sm font-bold uppercase tracking-wider text-emerald-700 md:text-base lg:text-lg">
                                                        <span className="sticky left-4">{region.name}</span>
                                                    </td>
                                                </tr>
                                                {region.zones.map((zone) => (
                                                    <tr key={`${region.key}-${zone.key}`}>
                                                        <td className="sticky left-0 z-10 bg-gray-50 px-4 py-4 text-left text-sm font-semibold text-gray-700">{zone.name}</td>
                                                        <td className={`px-4 py-4 text-center text-sm font-semibold ${zone.status_open ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{zone.statusOpen ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}</td>
                                                        <td className="bg-amber-50 px-4 py-4 text-center text-sm font-semibold text-gray-600">{zone.statusOpen ? formatNumber(zone.listed) : '-'}</td>
                                                        <td className="bg-amber-100 px-4 py-4 text-center text-sm font-semibold text-gray-700">{zone.statusOpen ? formatNumber(zone.listedNew) : '-'}</td>
                                                        <td className="bg-rose-50 px-4 py-4 text-center text-sm font-semibold text-rose-600">{zone.statusOpen ? formatNumber(zone.diff) : '-'}</td>
                                                        <td className="bg-emerald-50 px-4 py-4 text-center text-sm font-semibold text-emerald-600">{zone.statusOpen ? formatNumber(zone.calledTotal) : '-'}</td>
                                                        <td className={`px-4 py-4 text-center text-sm font-semibold ${zone.statusOpen ? zone.processing < 100 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{zone.statusOpen ? formatPercent(zone.processing) : '-'}</td>
                                                        <td className={`px-4 py-4 text-center text-sm font-semibold ${zone.statusOpen ? zone.remain > 0 ? 'bg-orange-50 text-orange-600' : 'bg-rose-600 text-white' : 'bg-gray-50 text-gray-500'}`}>{zone.statusOpen ? getRemainingStatus(zone.remain) : '-'}</td>
                                                        <td className={`px-4 py-4 text-center text-sm font-semibold ${zone.statusOpen ? zone.remain > 0 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'}`}>{zone.statusOpen ? formatNumber(zone.remain) : '-'}</td>
                                                        {zone.rounds.map(({ roundKey, roundInfo }) => (
                                                            <td
                                                                key={roundKey}
                                                                onClick={() => roundInfo?.call_status === true ? handleCellClick(roundInfo) : null}
                                                                className={`relative group overflow-hidden text-center p-0 ${roundInfo?.call_status === true ? `${getBgHover(roundInfo.total, roundInfo.list_status)} cursor-pointer` : 'bg-gray-100'}`}
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        handleCellClick(roundInfo);
                                                                    }
                                                                }}
                                                                aria-label={`ดูรายละเอียดรอบที่ ${roundInfo?.call_status === true ? roundInfo?.round : ''}`}
                                                            >
                                                                {roundInfo?.call_status === true ? (
                                                                    <>
                                                                        <div className="py-2 transition-transform duration-300 group-hover:-translate-y-2 text-sm font-semibold">
                                                                            <span className={textColor(roundInfo.total, roundInfo.list_status)}>
                                                                                {roundInfo.list_status === true
                                                                                    ? Number(roundInfo.total).toLocaleString()
                                                                                    : ''}
                                                                            </span>
                                                                        </div>

                                                                        {roundInfo.call_status === true && (
                                                                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50/50 text-emerald-800 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none">
                                                                                <div className="flex items-center gap-1 text-xs font-medium">
                                                                                    <Search size={10} />
                                                                                    <span>รายละเอียด</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : null}
                                                            </td>

                                                        ))}
                                                    </tr>
                                                ))}
                                                <tr className="border-t border-gray-200">
                                                    <td className="sticky left-0 z-10 bg-white px-4 py-4 text-left text-sm font-semibold text-gray-600">รวม {region.name}</td>
                                                    <td className="bg-white px-4 py-4 text-center"></td>
                                                    <td className="bg-amber-100/50 px-4 py-4 text-center text-sm font-semibold text-gray-600">{formatNumber(region.summary.list)}</td>
                                                    <td className="bg-amber-300/50 px-4 py-4 text-center text-sm font-semibold text-gray-700">{formatNumber(region.summary.list_n)}</td>
                                                    <td className="bg-rose-200/50 px-4 py-4 text-center text-sm font-semibold text-rose-700">{formatNumber(region.summary.diff)}</td>
                                                    <td className="bg-emerald-200/50 px-4 py-4 text-center text-sm font-semibold text-emerald-700">{formatNumber(region.summary.call)}</td>
                                                    <td className="bg-blue-50/50 px-4 py-4 text-center text-sm font-semibold text-blue-700">{getProcessing(region.summary.call, region.summary.list_n)}</td>
                                                    <td className={`px-4 py-4 text-center text-sm font-semibold ${region.summary.remain > 0 ? 'bg-orange-200/50 text-orange-600' : 'bg-rose-700 text-white'}`}>{getRemainingStatus(region.summary.remain)}</td>
                                                    <td className={`px-4 py-4 text-center text-sm font-semibold ${region.summary.remain > 0 ? 'bg-amber-200/50 text-amber-600' : 'bg-rose-300/50 text-rose-700'}`}>{formatNumber(region.summary.remain)}</td>
                                                    {region.summary.rounds.map((round, index) => <td key={index} className={`px-4 py-4 text-center text-sm font-semibold text-gray-700 ${round.total ? 'bg-white' : 'bg-gray-100'}`}>{round.total ? formatNumber(round.total) : ''}</td>)}
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                        <tr className="bg-gray-700 text-sm font-bold text-white">
                                            <td className="sticky bottom-0 left-0 z-40 bg-gray-700 px-4 py-4 text-center">รวมทั้งหมด</td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center"></td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{formatNumber(grandTotal.list)}</td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{formatNumber(grandTotal.list_n)}</td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{formatNumber(grandTotal.diff)}</td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{formatNumber(grandTotal.call)}</td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{getProcessing(grandTotal.call, grandTotal.list_n)}</td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{getRemainingStatus(grandTotal.remain)}</td>
                                            <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{formatNumber(grandTotal.remain)}</td>
                                            {grandTotal.rounds.map((round, index) => <td key={index} className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{round.total ? formatNumber(round.total) : ''}</td>)}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <RoundDetailModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            data={selectedRound}
                        />

                    </div>

                )}
            </div>
        </div >
    );
}
