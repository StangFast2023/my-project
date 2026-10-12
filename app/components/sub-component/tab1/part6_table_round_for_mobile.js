
"use client";

import React from "react";

export default function T1P3_PieListedMobile({ data }) {
    const part6 = data?.tab1?.part6;

    if (!part6) return null;

    const regions = Object.values(part6);

    return (
        <div className="block md:hidden space-y-4">
            {/* ชั้นที่ 1: ภาค */}
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3">
                {regions.map((region) => {
                    const zones = Object.values(region.data || {});

                    return (
                        <section
                            key={region.name}
                            className="min-w-full w-full shrink-0 snap-start"
                        >
                            <h3 className="mb-3 text-lg font-bold text-emerald-700">
                                ภาค {region.name}
                            </h3>

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
                                                    <p className="mt-1 text-right text-xl text-emerald-100">
                                                        เรียกบรรจุแล้ว <span className="text-2xl font-bold">{Number(zone.total_called || 0).toLocaleString()}</span> คน
                                                    </p>
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
                                                            {Number(
                                                                zone.total_listed_new || 0
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-blue-50 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            ความคืบหน้า
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-blue-700">
                                                            {progress}%
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-rose-50 p-3">
                                                        <p className="text-xs text-gray-500">
                                                            คงเหลือ
                                                        </p>
                                                        <p className="mt-1 font-bold text-xl text-right text-rose-600">
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

                            <p className="mt-2 text-center text-xs text-gray-400">
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
