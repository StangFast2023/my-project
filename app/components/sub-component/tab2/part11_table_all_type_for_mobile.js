"use client";
import { useMemo } from "react";
import { Newspaper, ChevronRight } from "lucide-react";
export default function T2P11_TableSummaryforMobile({ data }) {
    const part8 = useMemo(() => data?.tab2?.part8 || {}, [data?.tab2?.part8]);

    const { roundColumns } = useMemo(() => {
        let gTotal = { list: 0, list_new: 0, diff: 0, call: 0, remain: 0, rounds: {} };
        let maxRoundsFound = 0;
        Object.values(part8).forEach(posTypeGroup => {
            Object.values(posTypeGroup).forEach(zone => {
                gTotal.list += (Number(zone.total_list) || 0);
                gTotal.list_new += (Number(zone.total_list_n) || 0);
                gTotal.diff += (Number(zone.total_diff) || 0);
                gTotal.call += (Number(zone.total_call) || 0);
                gTotal.remain += (Number(zone.total_remain) || 0);
                const zoneRounds = Object.keys(zone.round_data || {}).length;
                if (zoneRounds > maxRoundsFound) {
                    maxRoundsFound = zoneRounds;
                }
                Object.entries(zone.round_data || {}).forEach(([r, v]) => {
                    gTotal.rounds[r] = (gTotal.rounds[r] || 0) + (v.total || 0);
                });
            });
        });
        const finalMaxRounds = Math.max(10, maxRoundsFound);
        return {
            roundColumns: Array.from({ length: finalMaxRounds }, (_, i) => i + 1)
        };
    }, [part8]);
    return (
        <div className="block md:hidden space-y-4">
            <div className="text-center mb-4 text-gray-700">
                <div className="flex flex-col items-center">
                    <Newspaper />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สรุปสถิติการเรียกบรรจุสะสม จำแนกตามภูมิภาคและประเภทตำแหน่ง
                    </h3>
                </div>
                <span className="text-xs text-gray-400">
                    เลื่อนซ้าย–ขวาเพื่อดูภาคอื่น
                </span>
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                {Object.entries(part8).map(([regId, posTypes]) => {
                    const zones = Object.values(posTypes);
                    const regionName = zones[0]?.prov_main_name || `ภาคที่ ${regId}`;
                    const reg = zones.reduce(
                        (acc, zone) => {
                            acc.list += Number(zone.total_list) || 0;
                            acc.list_new += Number(zone.total_list_n) || 0;
                            acc.diff += Number(zone.total_diff) || 0;
                            acc.call += Number(zone.total_call) || 0;
                            acc.remain += Number(zone.total_remain) || 0;

                            roundColumns.forEach((num) => {
                                acc.rounds[num] =
                                    (acc.rounds[num] || 0) +
                                    (Number(zone.round_data?.[num]?.total) || 0);
                            });

                            return acc;
                        },
                        {
                            list: 0,
                            list_new: 0,
                            diff: 0,
                            call: 0,
                            remain: 0,
                            rounds: {},
                        }
                    );
                    const progress = reg.list_new > 0 ? (reg.call / reg.list_new) * 100 : 0;
                    return (
                        <section
                            key={regId}
                            className="w-[100%] min-w-[100%] snap-start self-start overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="border-b border-emerald-100 bg-emerald-50 p-4">
                                <h5 className="text-xl font-bold text-emerald-800">
                                    {regionName}
                                </h5>
                                <p className="mt-1 text-right text-xs text-gray-500">
                                    รวม {zones.length} ประเภทตำแหน่ง
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-3">
                                <div className="rounded-xl bg-amber-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        ขึ้นบัญชี (เก่า)
                                    </p>
                                    <p className="mt-1 text-right text-xl font-bold text-gray-700">
                                        {reg.list.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-amber-100 p-3">
                                    <p className="text-xs text-gray-500">
                                        ขึ้นบัญชี (ใหม่)
                                    </p>
                                    <p className="mt-1 text-right text-xl font-bold text-gray-700">
                                        {reg.list_new.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-rose-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        ส่วนต่าง
                                    </p>
                                    <p className="mt-1 text-right text-xl font-bold text-rose-600">
                                        {reg.diff.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-emerald-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        เรียกแล้วรวม
                                    </p>
                                    <p className="mt-1 text-right text-xl font-bold text-emerald-700">
                                        {reg.call.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        ความคืบหน้า
                                    </p>
                                    <p className="mt-1 text-right text-xl font-bold text-blue-700">
                                        {progress.toFixed(2)}%
                                    </p>
                                </div>
                                <div className="rounded-xl bg-orange-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        คงเหลือ
                                    </p>
                                    <p className="mt-1 text-right text-xl font-bold text-orange-600">
                                        {reg.remain.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 bg-gray-50 p-3">
                                <details>
                                    <summary className="cursor-pointer text-sm font-bold text-gray-700">
                                        สรุปยอดเรียกแยกรอบของภาค
                                    </summary>
                                    <div className="mt-3 space-y-2">
                                        {roundColumns.filter((num) => reg.rounds[num] > 0).map((num) => (
                                            <div
                                                key={num}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                                            >
                                                <span className="text-sm text-gray-600">
                                                    รอบที่ {num}
                                                </span>
                                                <span className="text-sm font-bold text-emerald-700">
                                                    {reg.rounds[num].toLocaleString()} คน
                                                </span>
                                            </div>
                                        ))}
                                        {!roundColumns.some((num) => reg.rounds[num] > 0) && (
                                            <p className="py-2 text-center text-xs text-gray-400">
                                                ยังไม่มีข้อมูลรอบเรียกบรรจุ
                                            </p>
                                        )}
                                    </div>
                                </details>
                            </div>
                            <div className="px-3">
                                <hr className="border-gray-200" />
                            </div>
                            <div className="space-y-3 p-3">
                                <h6 className="text-sm font-bold text-gray-700">
                                    รายละเอียดแต่ละประเภทตำแหน่ง
                                </h6>
                                {zones.map((zone) => {
                                    const zoneProgress = Number(zone.total_list_n) > 0 ? (Number(zone.total_call || 0) / Number(zone.total_list_n)) * 100 : 0;
                                    const typeColor = zone.pos_type_id === 1 ? "border-blue-200 bg-blue-50 text-blue-700" : zone.pos_type_id === 2 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700";
                                    const roundsWithData = roundColumns.filter((num) => Number(zone.round_data?.[num]?.total) > 0);
                                    return (
                                        <details
                                            key={zone.pos_type_id}
                                            className="overflow-hidden rounded-xl border border-gray-200"
                                        >
                                            <summary className="cursor-pointer list-none p-3">
                                                <div className="flex items-center justify-start gap-2">
                                                    <span className="text-base text-gray-600 font-semibold">ประเภท : </span>
                                                    <span className={`rounded-lg border px-2 py-1 text-lg font-bold ${typeColor}`}>
                                                        {zone.pos_type}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm mt-2 mb-4">
                                                    <div className="bg-emerald-100 rounded-xl border-gray-200 shadow-sm p-2">
                                                        <p className="text-xs text-gray-500">
                                                            เรียกแล้ว
                                                        </p>
                                                        <p className="font-bold text-right text-xl text-emerald-700">
                                                            {(Number(zone.total_call) || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-blue-100 rounded-xl border-gray-200 shadow-sm p-2">
                                                        <p className="text-xs text-gray-500">
                                                            ความคืบหน้า
                                                        </p>
                                                        <p className="font-bold text-right text-xl text-blue-700">
                                                            {zoneProgress.toFixed(2)}%
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="shrink-0 flex justify-end text-gray-400 font-bold shadow-sm p-2 mt-2">
                                                        ดูรายละเอียด <ChevronRight />
                                                    </span>
                                                </div>
                                            </summary>
                                            <div className="space-y-3 border-t border-gray-100 bg-gray-50 p-3">
                                                <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">

                                                    <div className="bg-amber-100 rounded-xl border-gray-200 shadow-sm p-2">
                                                        <p className="text-xs text-gray-500">
                                                            ขึ้นบัญชี (เก่า)
                                                        </p>
                                                        <p className="font-bold text-right text-xl text-gray-700">
                                                            {(Number(zone.total_list) || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-amber-200 rounded-xl border-gray-200 shadow-sm p-2">
                                                        <p className="text-xs text-gray-500">
                                                            ขึ้นบัญชี (ใหม่)
                                                        </p>
                                                        <p className="font-bold text-right text-xl text-gray-700">
                                                            {(Number(zone.total_list_n) || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-rose-100 rounded-xl border-gray-200 shadow-sm p-2">
                                                        <p className="text-xs text-gray-500">
                                                            ส่วนต่าง
                                                        </p>
                                                        <p className="font-bold text-right text-xl text-rose-700">
                                                            {(Number(zone.total_diff) || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="bg-orange-100 rounded-xl border-gray-200 shadow-sm p-2">
                                                        <p className="text-xs text-gray-500">
                                                            คงเหลือ
                                                        </p>
                                                        <p className="font-bold text-right text-xl text-orange-700">
                                                            {(Number(zone.total_remain) || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <hr className="border-gray-200" />
                                                <p className="text-xs font-bold text-gray-600">
                                                    จำนวนเรียกบรรจุแยกรอบ
                                                </p>
                                                {roundsWithData.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {roundsWithData.map((num) => (
                                                            <div
                                                                key={num}
                                                                className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3"
                                                            >
                                                                <span className="text-sm text-gray-600">
                                                                    รอบที่ {num}
                                                                </span>
                                                                <span className="text-sm font-bold text-emerald-700">
                                                                    {Number(zone.round_data?.[num]?.total).toLocaleString()} คน
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="py-2 text-center text-xs text-gray-400">
                                                        ยังไม่มีข้อมูลรอบเรียกบรรจุ
                                                    </p>
                                                )}
                                            </div>
                                        </details>
                                    );
                                })}
                            </div>

                        </section>
                    );
                })}
            </div>
        </div>
    );
}