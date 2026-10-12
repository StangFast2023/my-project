
"use client";
import { AppWindow } from "lucide-react";

export default function T1P3_PieListedMobile({ data }) {

    const part6 = data?.tab1?.part6 || {};
    if (!part6) return null;
    const allZones = Object.values(part6).flatMap(region => Object.values(region.data));
    const max_rounds_all_zones = Math.max(...allZones.map(zone => zone.total_round));
    const maxRounds = Math.max(10, max_rounds_all_zones);
    const roundColumns = Array.from({ length: maxRounds }, (_, i) => i + 1);
    const regions = Object.values(part6);
    return (
        <div className="block md:hidden space-y-4">

            <div className="text-center mb-4 text-gray-700">
                <div className="flex items-center">
                    <AppWindow />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สรุปข้อมูลการเรียกบรรจุสะสม จำแนกตามเขตพื้นที่
                    </h3>
                </div>
            </div>

            {/* ชั้นที่ 1: ภาค */}
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3">
                {regions.map((region) => {
                    const zones = Object.values(region.data || {});
                    const reg = zones.reduce((acc, zone) => {
                        const oldList = Number(zone.total_listed) || 0;
                        const newList = Number(zone.total_listed_new) || 0;
                        const called = Number(zone.total_called) || 0;
                        const remain = Number(zone.total_remain) || 0;

                        acc.list += oldList;
                        acc.new_list += newList;
                        acc.call += called;
                        acc.remain += remain;

                        roundColumns.forEach((num, index) => {
                            const roundInfo = zone["data-round"]?.[num];
                            acc.rounds[index] += Number(roundInfo?.total_called) || 0;
                        });
                        return acc;
                    }, { list: 0, new_list: 0, diff: 0, call: 0, remain: 0, progress: 0, rounds: Array(roundColumns.length).fill(0), });
                    reg.diff = reg.list - reg.new_list;
                    reg.progress = reg.new_list > 0 ? (reg.call / reg.new_list) * 100 : 0;
                    return (
                        <section
                            key={region.name}
                            className="min-w-full w-full shrink-0 snap-start border border-gray-200 rounded-xl shadow-lg p-2"
                        >
                            <div className="p-2 rounded-2xl bg-white shadow-sm mt-3 mb-2">
                                <h3 className="font-bold text-xl text-center text-emerald-700 mb-2">
                                    {region.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-amber-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            ขึ้นบัญชี (เก่า)
                                        </p>
                                        <p className="mt-1 font-bold text-xl text-right text-gray-700">
                                            {Number(reg.list || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-amber-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            ขึ้นบัญชี (เก่า)
                                        </p>
                                        <p className="mt-1 font-bold text-xl text-right text-gray-700">
                                            {Number(reg.new_list || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-rose-100 p-3">
                                        <p className="text-xs text-gray-500">
                                            ส่วนต่าง
                                        </p>
                                        <p className="mt-1 font-bold text-xl text-right text-rose-700">
                                            {Number(reg.diff || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-emerald-100 p-3">
                                        <p className="text-xs text-gray-500">
                                            เรียกบรรจุแล้ว
                                        </p>
                                        <p className="mt-1 font-bold text-xl text-right text-emerald-700">
                                            {Number(reg.call || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-blue-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            ความคืบหน้า
                                        </p>
                                        <p className="mt-1 font-bold text-xl text-right text-blue-700">
                                            {Number((reg.call / reg.new_list) * 100 || 0).toFixed(2)} %
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-amber-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            คงเหลือ
                                        </p>
                                        <p className="mt-1 font-bold text-xl text-right text-amber-600">
                                            {Number(reg.remain || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="mb-2 text-gray-600 font-semibold">สรุปรวมรายรอบ</span>
                                    {reg.rounds.length > 0 ? (
                                        reg.rounds.map((info, index) => {
                                            const round = roundColumns[index];
                                            return info > 0 ? (
                                                <div
                                                    key={round}
                                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 gap-3 p-2 my-2"
                                                >
                                                    <span className="text-base text-gray-600">
                                                        รวมรอบที่ {round}
                                                    </span>

                                                    <div className="ml-auto flex items-center gap-2 my-1">
                                                        <span className="text-base font-bold text-emerald-700">
                                                            {Number(info).toLocaleString()}
                                                        </span>

                                                        <span className="text-base text-gray-600">
                                                            คน
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })
                                    ) : (
                                        <p className="py-4 text-center text-sm text-gray-400">
                                            ยังไม่มีข้อมูลรอบเรียกบรรจุ
                                        </p>
                                    )}
                                </div>
                            </div>

                            <hr className="my-4 border-gray-200" />

                            {/* ชั้นที่ 2: เขต */}
                            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3">
                                {zones.map((zone) => {
                                    const rounds = Object.entries(zone["data-round"] || {}).sort(([a], [b]) => Number(a) - Number(b));
                                    const progress = Number(zone.total_listed_new) > 0 ? ((Number(zone.total_called) / Number(zone.total_listed_new)) * 100).toFixed(2) : "0.00";

                                    return (
                                        <article
                                            key={zone.full}
                                            className="w-full min-w-full shrink-0 snap-start"
                                        >
                                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                                {/* สรุปข้อมูลเขต */}
                                                <div className="bg-emerald-700 p-4 text-white">
                                                    <h4 className="text-xl font-bold">
                                                        {zone.name}
                                                    </h4>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 p-4">
                                                    <div className="rounded-xl bg-amber-50 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            ขึ้นบัญชี (เก่า)
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-gray-700">
                                                            {Number(zone.total_listed || 0).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-amber-100 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            ขึ้นบัญชี (ใหม่)
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-gray-700">
                                                            {Number(zone.total_listed_new || 0).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-rose-100 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            ส่วนต่าง
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-rose-700">
                                                            {Number(zone.total_listed - zone.total_listed_new || 0).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-emerald-100 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            เรียกบรรจุแล้ว
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-emerald-700">
                                                            {Number(zone.total_called || 0).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-blue-50 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            ความคืบหน้า
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-blue-700">
                                                            {progress} %
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-amber-50 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            คงเหลือ
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-amber-600">
                                                            {Number(zone.total_remain || 0).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* ชั้นที่ 3: รายการรอบ เลื่อนแนวตั้ง */}
                                                <div className="border-t border-gray-100 p-4">
                                                    <h5 className="mb-3 font-bold text-gray-700">
                                                        สถิติการเรียกบรรจุรายรอบ
                                                    </h5>

                                                    <div className="max-h-[50vh] space-y-2 overflow-y-auto overscroll-y-contain pr-1">
                                                        {rounds.length > 0 ? (
                                                            rounds.map(([round, info]) => (
                                                                <div
                                                                    key={round}
                                                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                                                                >
                                                                    <span className="text-base text-gray-600">
                                                                        รอบที่ {round}
                                                                    </span>
                                                                    <span className="font-bold text-base text-emerald-700 ml-auto">
                                                                        {Number(info.total_called || 0).toLocaleString()}
                                                                    </span>
                                                                    <span className="text-base text-gray-600 ml-2">คน</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="py-4 text-center text-sm text-gray-400">
                                                                ยังไม่มีข้อมูลรอบเรียกบรรจุ
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <p className="text-center text-xs text-gray-400">
                                เลื่อนซ้าย–ขวาเพื่อเปลี่ยนเขต
                            </p>

                        </section>
                    );
                })}
            </div>

            <p className="text-center text-xs text-gray-400">
                เลื่อนซ้าย–ขวาเพื่อเปลี่ยนภาค
            </p>
        </div>
    );
}
