
"use client";
import React from 'react';
import { AppWindow, TrendingUp, TrendingDown, Equal } from 'lucide-react';

export default function Row3StatusRank({ data }) {
    const TableData = data?.chart_2_round || {};
    if (!TableData) return null;
    let cumulative_total = 0;
    let cumulative_total_call = 0;
    let total_remain = 0;
    const regionText = {
        '1': 'ภาคเหนือ',
        '2': 'ภาคเหนือ',
        '3': 'ภาคตะวันออกเฉียงเหนือ',
        '4': 'ภาคใต้',
    };
    const getStatusLabel = (region, zone) => {
        const main = regionText[region] || '';
        const subs = zone ? ` เขต-${zone}` : '';
        const full = `${main}${subs}`;
        return full;
    };
    console.log(TableData);
    return (
        <div className="col-span-12 lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

            <div className="text-center mb-4 text-gray-700">
                <div className="flex items-center">
                    <AppWindow />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        ตารางการบรรจุรายรอบ
                    </h3>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full min-h-[300px] overflow-y-auto text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="bg-gray-50    border-b-2 border-gray-700 px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-700">รอบที่</th>
                                <th className="bg-green-50   border-b-2 border-gray-700 px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-green-700">สถานะการเรียกบรรจุ</th>
                                <th className="bg-gray-50    border-b-2 border-gray-700 px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-700">วันเดือนปีที่บรรจุ</th>
                                <th className="bg-emerald-50 border-b-2 border-gray-700 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-emerald-700">จำนวนที่เรียก (คน)</th>
                                <th className="bg-gray-50    border-b-2 border-gray-700 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-700">ลำดับที่</th>
                                <th className="bg-amber-50   border-b-2 border-gray-700 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-amber-700">อัตราการเติบโต (%)</th>
                                <th className="bg-sky-50     border-b-2 border-gray-700 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-sky-700">สัดส่วนการใช้บัญชี (%)</th>
                                <th className="bg-blue-50    border-b-2 border-gray-700 px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-blue-700">สถานะดำเนินการ</th>
                                <th className="bg-gray-50    border-b-2 border-gray-700 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-700">สถานะการเรียกบรรจุข้ามเขต</th>
                                <th className="bg-rose-50    border-b-2 border-gray-700 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-rose-700">ยอดคงเหลือ (คน)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(TableData).map((round) => {
                                console.log(round);
                                const total_listed = data?.total_listed || 0;
                                cumulative_total += parseInt(round.call_status === 1 && round.list_status === 1 ? round.total : 0);
                                cumulative_total_call += parseInt(round.call_status === 1 && round.list_status === 1 ? round.total : 0);
                                total_remain = total_listed - cumulative_total;
                                return (
                                    <React.Fragment key={round.round}>
                                        <tr className="bg-emerald-50/20">
                                            <td className={`bg-gray-50  px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-600`}>{round.round}</td>
                                            <td className={`bg-gray-50  px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center ${round.list_status === 1 ? (round.call_status === 1 ? 'text-emerald-600' : 'text-rose-600') : 'text-amber-600'}`}>{round.list_status === 1 ? (round.call_status === 1 ? 'มีการใช้บัญชี' : 'ไม่มีการเรียกใช้บัญชี') : 'บัญชีสิ้นสุดแล้ว'}</td>
                                            <td className={`bg-gray-50  px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-600`}>{round.list_status === 1 ? round.date : '-'}</td>
                                            <td className={`bg-gray-50  px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center ${round.list_status === 1 ? (round.call_status === 1 ? 'text-emerald-600' : 'text-rose-600') : 'text-gray-600'}`}>{round.total.toLocaleString()}</td>
                                            <td className={`bg-gray-50  px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center ${round.list_status === 1 ? (round.call_status === 1 ? 'text-emerald-600' : 'text-rose-600') : 'text-gray-600'}`}>{round.list_status === 1 && round.call_status === 1 ? round.start_end : '-'}</td>
                                            <td className={`bg-amber-50 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center ${round.change !== 'first' ? round.list_status === 1 ? (round.change > 0 ? 'text-emerald-600' : (round.change === 0 ? 'text-gray-600' : 'text-rose-600')) : 'text-gray-600' : 'text-amber-600'}`}>
                                                <div className="flex justify-center items-center gap-2">
                                                    {round.change !== 'first' ? (round.change > 0 ? <TrendingUp /> : (round.change === 0 ? <Equal /> : <TrendingDown />)) : null}
                                                    {round.change === 'first' ? 'รอบเริ่มต้น' : round.change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %"}
                                                </div>
                                            </td>
                                            <td className={`bg-sky-50   px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-sky-700`}>{round.proportion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %"}</td>
                                            <td className={`bg-gray-50  px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center ${round.list_status === 1 && round.call_status ? (round.status === 'completed' ? 'text-emerald-700' : 'text-sky-700') : 'text-gray-700'}`}>{round.list_status === 1 && round.call_status === 1 ? (round.status === 'completed' ? 'ได้รับการบรรจุ' : 'รอการเรียกบรรจุ') : '-'}</td>
                                            <td className={`bg-gray-50  px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-600`}>
                                                {round.list_status === 1 ? (round.is_cross_region === 1 ? 'ใช่' : 'ไม่ใช่') : '-'}
                                                {
                                                    round.list_status === 1 && round.call_status === 1 && round.is_cross_region === 1
                                                        ?
                                                        (
                                                            <div className="mt-2 text-sm text-gray-600">
                                                                {getStatusLabel(3, 2)}
                                                            </div>
                                                        )
                                                        : null
                                                }
                                            </td>
                                            <td className={`bg-rose-50    w-[10%]  px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center ${round.list_status ? 'text-rose-600' : 'text-gray-600'}`}>{round.list_status === 1 ? total_remain.toLocaleString() : '-'}</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            <tr className="bg-gray-700 text-white text-sm md:text-base lg:text-sm font-bold">
                                <td colSpan={3} className="bg-gray-700 px-6 py-4 text-center uppercase tracking-wider sticky left-[0] z-30">รวมทั้งหมด</td>
                                <td className="bg-gray-700 px-4 py-4 text-center">{cumulative_total_call.toLocaleString()}</td>
                                <td className="bg-gray-700 px-4 py-4 text-center"></td>
                                <td className="bg-gray-700 px-4 py-4 text-center"></td>
                                <td className="bg-gray-700 px-4 py-4 text-center"></td>
                                <td className="bg-gray-700 px-4 py-4 text-center"></td>
                                <td className="bg-gray-700 px-4 py-4 text-center"></td>
                                <td className="bg-gray-700 px-4 py-4 text-center">{total_remain.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
}