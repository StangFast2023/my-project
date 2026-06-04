import React, { useMemo } from 'react';
import Swal from 'sweetalert2';
import { EmptyData } from '../../EmptyData';
import { useColumnStore } from '../../useTableColumns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export default function ShowAllDataTable({ part2, isLoading }) {
    const safePart2 = part2.tab4.part2.data || {};
    const columns = useColumnStore((state) => state.columns);
    const maxRound = Math.max(10, part2?.tab4?.part2?.round || 0);
    const roundsArray = Array.from({ length: maxRound }, (_, i) => i + 1);
    let summary = { total_listed: 0, total_called: 0, total_remain: 0, rounds: {} };

    if (safePart2 && Object.keys(safePart2).length > 0) {
        summary = Object.values(safePart2).reduce((acc, curr) => {
            acc.total_listed += (Number(curr.total_listed) || 0);
            acc.total_called += (Number(curr.total_called) || 0);
            acc.total_remain += (Number(curr.total_remain) || 0);

            if (curr.total_each_round) {
                Object.values(curr.total_each_round).forEach(roundData => {
                    const r = roundData.round;
                    acc.rounds[r] = (acc.rounds[r] || 0) + (Number(roundData.total) || 0);
                });
            }
            return acc;
        }, { total_listed: 0, total_called: 0, total_remain: 0, rounds: {} });
    }
    const percent = (summary?.total_listed > 0)
        ? (summary.total_called / summary.total_listed) * 100
        : 0;

    const statusText = percent === 100 ? 'หมดบัญชี' : (percent > 0 ? 'คงเหลือ' : null);
    const statusColor = percent < 30 ? "text-rose-400" : (percent < 70 ? "text-amber-400" : "text-emerald-400");

    const has_data = Object.keys(part2.tab4.part2.data || {}).length > 0;
    const regionColors = {
        1: "bg-rose-50 text-rose-800 font-bold",
        2: "bg-indigo-50 text-indigo-800 font-bold",
        3: "bg-teal-50 text-teal-800 font-bold",
        4: "bg-amber-50 text-amber-800 font-bold"
    };
    const zoneColors = {
        1: "bg-sky-100 text-sky-800 font-bold",
        2: "bg-slate-100 text-slate-800 font-bold",
        3: "bg-orange-100 text-orange-800 font-bold"
    };
    const formatDateThai = (dateStr) => {
        if (!dateStr) return "-";
        const [d, m, y] = dateStr.split("-");
        const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        return `${parseInt(d)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`; // +543 สำหรับ พ.ศ.
    };
    const getBagColor = (has_no_data, status_call, status_list) => {
        if (!has_no_data) return 'cursor-default';
        if (status_call === true) {
            return 'cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 hover:border-b-emerald-300';
        }
        if (status_call === false && status_list === false) {
            return 'cursor-pointer hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200 hover:border-b-amber-300';
        }
        return 'cursor-pointer hover:bg-rose-50 hover:text-rose-700 transition-colors duration-200 hover:border-b-rose-300';
    };

    const flatTableRows = useMemo(() => {
        const safePart2 = part2?.tab4?.part2?.data || {};
        const rows = [];
        Object.entries(safePart2).forEach(([regionKey, regionData]) => {
            Object.entries(regionData.pro_sub).forEach(([provSubID, provSubData]) => {
                Object.entries(provSubData.data_type_position).forEach(([typeID, typeData]) => {
                    Object.values(typeData.data_position).forEach((posData) => {
                        rows.push({
                            regionKey,
                            regionData,
                            provSubID,
                            provSubData,
                            typeID,
                            typeData,
                            posData,
                            uniqueKey: `${regionKey}-${provSubID}-${typeID}-${posData.pos_id}`,
                            pos_id: posData.pos_id,
                            pos_name: posData.pos_name,
                            pos_type_name: posData.pos_type_name,
                            pos_percent: ((posData.total_call / posData.total_listed) * 100),
                            status_open: posData.status_open,
                            status_out_of_lits: posData.status_out_of_lits,
                            total_listed: posData.total_listed,
                            total_call: posData.total_call,
                            total_remain: posData.total_remain,
                            roundsData: posData.data_call_round || {},
                            pro_main_id: regionData.pro_main_id,
                            pro_main_name: regionData.pro_main_name,
                            pro_sub_id: provSubData.pro_sub_id,
                            pos_type_id: posData.pos_type_id,
                            pro_main_id: regionData.pro_main_id,
                            pro_main_id: regionData.pro_main_id,
                            pro_main_id: regionData.pro_main_id,
                            pro_main_id: regionData.pro_main_id,
                        });
                    });
                });
            });
        });
        return rows;
    }, [part2]);

    if (isLoading) {
        return (
            <div className="h-[600px] flex flex-col items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-30 w-30 border-b-8 border-gray-600 mb-12"></div>
                <p className="text-gray-500 font-bold text-xl">กำลังดึงข้อมูล... กรุณารอสักครู่</p>
            </div>
        );
    }
    if (!has_data) return <EmptyData />;
    return (
        <div className="fade-in">
            <div className="flex flex-col h-full min-h-[100px] max-h-[800px] border border-gray-300">
                <div className="flex-1 overflow-x-auto shadow-sm">
                    <table className="w-full overflow-y-auto table-fixed border-collapse">
                        <colgroup>
                            <col className="w-[400px] min-w-[400px] border-1 border-gray-200 border-r-[2px] border-r-gray-600" />
                            {!columns.all_header && (<col className="w-[200px] min-w-[200px] border-1 border-gray-200" />)}
                            {!columns.all_header && (<col className="w-[100px] min-w-[100px] border-1 border-gray-200" />)}
                            <col className="w-[100px] min-w-[100px] border-1 border-gray-200" />
                            {columns.column_part1 && (<col className="w-[100px] min-w-[100px] border-1 border-gray-200" />)}
                            {columns.column_part2 && (<col className="w-[120px] min-w-[120px] border-1 border-gray-200" />)}
                            {columns.column_part3 && (<col className="w-[120px] min-w-[120px] border-1 border-gray-200" />)}
                            <col className="w-[100px] min-w-[100px] border-1 border-gray-200" />
                            <col className="w-[120px] min-w-[120px] border-1 border-emerald-400" />
                            <col className="w-[120px] min-w-[120px] border-1 border-amber-400" />
                            {roundsArray.map((_, i) => <col key={i} className="w-[100px] min-w-[100px] border-y-[1px] border-l-[1px] border-gray-200" />)}
                        </colgroup>
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="w-[400px] min-w-[400px] sticky left-0 top-0 z-40 p-4 font-semibold bg-gray-50 ">ภาค / เขต / ตำแหน่ง</th>
                                {!columns.all_header && (<th className="w-[200px] min-w-[200px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">ภาค</th>)}
                                {!columns.all_header && (<th className="w-[100px] min-w-[100px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">เขต</th>)}
                                <th className="w-[100px] min-w-[100px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">ประเภท</th>
                                {columns.column_part1 && (<th className="w-[100px] min-w-[100px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">สถานะเปิด</th>)}
                                {columns.column_part2 && (<th className="w-[120px] min-w-[120px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">สถานะบัญชี</th>)}
                                {columns.column_part3 && (<th className="w-[120px] min-w-[120px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">ความคืบหน้า</th>)}
                                <th className="w-[100px] min-w-[100px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">ขึ้นบัญชี</th>
                                <th className="w-[120px] min-w-[120px] sticky top-0 z-30        p-4 font-semibold text-center bg-emerald-50 text-emerald-700">เรียกทั้งหมด</th>
                                <th className="w-[120px] min-w-[120px] sticky top-0 z-30        p-4 font-semibold text-center bg-amber-50 text-amber-500">คงเหลือ</th>
                                {roundsArray.map((_, index) => (<th key={index} className="w-[100px] min-w-[100px] sticky top-0 z-30        p-4 font-semibold text-center bg-gray-50">รอบ {index + 1}</th>))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {flatTableRows.map((item) => (
                                <tr key={`${item.uniqueKey}`} className="bg-white hover:bg-gray-50" >
                                    <td className=" w-[400px] min-w-[400px] sticky left-0 z-20 p-4 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">[ <span className="font-semibold">{item.pos_id}</span> ] {item.pos_name}</td>
                                    {!columns.all_header && (<td className={`w-[200px] min-w-[200px] sticky top-0  z-10 p-4 font-semibold text-center bg-gray-50 ${regionColors[item.pro_main_id]} `}>{item.pro_main_name}</td>)}
                                    {!columns.all_header && (<td className={`w-[100px] min-w-[100px] sticky top-0  z-10 p-4 font-semibold text-center bg-gray-50 ${zoneColors[item.pro_sub_id]} `}>เขต {item.pro_sub_id}</td>)}
                                    <td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${item.pos_type_id === "1" ? "bg-blue-50 text-blue-700" : item.pos_type_id === "2" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.pos_type_name}</td>
                                    {columns.column_part1 && (<td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${item.status_open ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}>{item.status_open ? "เปิด" : "ไม่เปิดสอบ"}</td>)}
                                    {columns.column_part2 && (<td className={`w-[120px] min-w-[120px] p-4 text-center font-bold ${item.status_out_of_lits ? (item.status_open === false ? "bg-rose-50 text-rose-700" : "bg-green-50 text-green-700") : "bg-yellow-50 text-yellow-700"}`}>{item.status_out_of_lits ? (item.status_open === false ? "ไม่มีบัญชี" : "หมดบัญชี") : "คงเหลือ"}</td>)}
                                    {columns.column_part3 && (<td className={`w-[120px] min-w-[120px] p-4 pr-6 text-right font-bold ${item.status_open ? (item.pos_percent < 30 ? "text-rose-600 bg-rose-50" : item.pos_percent < 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50") : "text-gray-600 bg-gray-50"}`}> {(item.status_open ? item.pos_percent : 0).toFixed(2)} %</td>)}
                                    <td className=" w-[100px] min-w-[100px] p-4 text-center font-bold">{item.total_listed.toLocaleString()}</td>
                                    <td className="w-[120px] min-w-[120px] p-4 text-center bg-clip-padding bg-emerald-50 font-bold text-emerald-700">{item.total_call.toLocaleString()}</td>
                                    <td className="w-[120px] min-w-[120px] p-4 text-center bg-clip-padding font-bold bg-amber-50 text-amber-500">{item.total_remain.toLocaleString()}</td>
                                    {roundsArray.map((_, i) => {
                                        const status = item.roundsData?.[i + 1]?.status;
                                        const text_color = ['completed', 'waiting'].includes(status) ? 'text-emerald-600' : status === 'exhaustion' ? 'text-amber-600' : status === 'not-used' ? 'text-red-400' : 'text-slate-900';
                                        const call_values = ['completed', 'waiting'].includes(status) ? item.roundsData?.[i + 1]?.total : (status === 'exhaustion' ? '-' : (status === 'not-used' ? '0' : null));
                                        const status_list = item.roundsData?.[i + 1]?.status_list ?? 'no-data';
                                        const status_call = item.roundsData?.[i + 1]?.status_call ?? 'no-data';
                                        const has_no_data = !(status_call === 'no-data' && status_list === 'no-data');
                                        const bag_color = getBagColor(has_no_data, status_call, status_list);
                                        const getButtonColor = (has_no_data, status_call, status_list) => {
                                            if (!has_no_data) return 'cursor-default';
                                            if (status_call === true) {
                                                return 'bg-emerald-50/90 py-1 text-emerald-800';
                                            }
                                            if (status_call === false && status_list === false) {
                                                return 'bg-amber-50/90 py-1 text-amber-800 ';
                                            }
                                            return 'bg-rose-50/90 py-1 text-rose-800';
                                        };
                                        const button_color = getButtonColor(has_no_data, status_call, status_list);
                                        const handleCellClick = (roundIndex, roundData, status_call, status_list, item, isPopup = false) => {
                                            const status_cross = roundData?.[i + 1]?.status_cross ?? 'no-data';
                                            const crossed_region = roundData?.[i + 1]?.crossed_region ?? 'no-data';
                                            const crossed_zone = roundData?.[i + 1]?.crossed_zone ?? 'no-data';
                                            const swalIcon = (status_call === false && status_list === false) ? 'warning' : (status_call === false && status_list === true) ? 'error' : 'success';
                                            const getChangeUI = (roundData) => {
                                                if (roundIndex === 1) {
                                                    return { text: 'รอบเริ่มต้น', color: 'text-green-500' };
                                                }
                                                if (status_call === false && status_list === false) {
                                                    return { text: 'สิ้นสุดการเรียกบรรจุ', color: 'text-gray-500' };
                                                }
                                                if (roundData.percent_change === null || roundData.percent_change === undefined) {
                                                    return { text: '-', color: 'text-gray-500' };
                                                }
                                                const val = roundData.percent_change;
                                                const formatted = Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                if (val > 0) {
                                                    return {
                                                        text: ` ${formatted} %`,
                                                        color: 'text-green-500',
                                                        icon: 'trending-up'
                                                    };
                                                } else if (val < 0) {
                                                    return {
                                                        text: ` ${formatted} %`,
                                                        color: 'text-rose-500',
                                                        icon: 'trending-down'
                                                    };
                                                } else if (val === 0) {
                                                    return {
                                                        text: ` ${formatted} %`,
                                                        color: 'text-gray-500',
                                                        icon: 'minus'
                                                    };
                                                }
                                            };
                                            const ui = getChangeUI(roundData, item);
                                            const iconSvg = {
                                                'trending-up': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
                                                'trending-down': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>',
                                                'minus': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                                            }[ui.icon] || '';
                                            let text_title = `รอบที่  ${roundIndex || 0}`;
                                            let text_content = `
                                                    <table class="w-full text-left border-collapse">
                                                        <tr class="border-b">
                                                            <th class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</th>
                                                            <td class="w-[40%] py-2 font-bold">${roundData?.total}</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">ลำดับที่ :</th>
                                                            <td class="py-2 font-bold">${roundData?.start_end || 0}</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</th>
                                                            <td class="py-2 font-bold ${ui.color}">${iconSvg}${ui.text}</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">วันที่บรรจุ :</th>
                                                            <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                                                        </tr>
                                                        <tr>
                                                            <th class="py-2 font-bold text-gray-500">สถานะ:</th>
                                                            <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด'))}</td>
                                                        </tr>
                                                    </table>
                                                    <details class="group bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                        <summary class="list-none font-semibold cursor-pointer flex justify-between items-center">
                                                            รายละเอียดเพิ่มเติม ( บรรจุข้ามเขต )
                                                            <span class="group-open:rotate-180 transition-transform">▼</span>
                                                        </summary>
                                                        <div class="mt-3 pt-3 border-t border-gray-200 text-sm">
                                                            <table class="w-full text-lg text-left border-collapse">
                                                                <tr class="border-b">
                                                                    <th class="w-[60%] py-2 font-bold text-gray-500">เป็นการเรียกใช้บัญชีข้ามเขต :</th>
                                                                    <td class="w-[40%] py-2 font-bold">${status_cross === true ? 'ใช่' : 'ไม่ใช่'}</td>
                                                                </tr>
                                                                <tr class="border-b">
                                                                    <th class="py-2 font-bold text-gray-500">ภาค :</th>
                                                                    <td class="py-2 font-bold">${crossed_region !== 'no-data' ? (crossed_region === 1 ? 'ภาคเหนือ' : (crossed_region === 2 ? 'ภาคกลาง' : (crossed_region === 3 ? 'ภาคตะวันออกเฉียงเหนือ' : 'ภาคใต้'))) : '-'}</td>
                                                                </tr>
                                                                <tr class="border-b">
                                                                    <th class="py-2 font-bold text-gray-500">เขต :</th>
                                                                    <td class="py-2 font-bold">${crossed_zone !== 'no-data' ? 'เขต ' + crossed_zone : '-'}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </details>
                                                `.trim();
                                            if (status_call === false && status_list === false) {
                                                status_call = 'warning';
                                                text_content = `
                                                    <table class="w-full text-left border-collapse">
                                                        <tr class="border-b">
                                                            <th class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</th>
                                                            <td class="w-[40%] py-2 font-bold">-</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">ลำดับที่ :</th>
                                                            <td class="py-2 font-bold">-</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</th>
                                                            <td class="py-2 font-bold ${ui.color}">${ui.text}</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">วันที่บรรจุ :</th>
                                                            <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                                                        </tr>
                                                        <tr>
                                                            <th class="py-2 font-bold text-gray-500">สถานะ:</th>
                                                            <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด'))}</td>
                                                        </tr>
                                                    </table>
                                                `.trim();
                                            } else if (status_call === false && status_list === true) {
                                                status_call = 'danger';
                                                text_content = `
                                                    <table class="w-full text-left border-collapse">
                                                        <tr class="border-b">
                                                            <th class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</th>
                                                            <td class="w-[40%] py-2 font-bold">-</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">ลำดับที่ :</th>
                                                            <td class="py-2 font-bold">-</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</th>
                                                            <td class="py-2 font-bold text-gray-500">-</td>
                                                        </tr>
                                                        <tr class="border-b">
                                                            <th class="py-2 font-bold text-gray-500">วันที่บรรจุ :</th>
                                                            <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                                                        </tr>
                                                        <tr>
                                                            <th class="py-2 font-bold text-gray-500">สถานะ:</th>
                                                            <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด'))}</td>
                                                        </tr>
                                                    </table>
                                                `.trim();
                                            }
                                            Swal.fire({
                                                title: text_title,
                                                html: text_content,
                                                icon: swalIcon,
                                                confirmButtonText: 'ตกลง',
                                                confirmButtonColor: '#10b981'
                                            });
                                        };
                                        return (
                                            <td
                                                key={i}
                                                onClick={has_no_data ? () => handleCellClick(i + 1, item.roundsData?.[i + 1], status_call, status_list, item) : undefined}
                                                className={`w-[100px] min-w-[100px] bg-clip-padding relative group p-4 text-center font-bold ${bag_color} ${text_color}`}
                                            >
                                                <div className={`transition-transform duration-300 group-hover:-translate-y-2 `}>
                                                    {call_values ? call_values.toLocaleString() : null}
                                                </div>
                                                {has_no_data && (
                                                    <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out ${button_color} `}>
                                                        <div className="flex items-center gap-1 text-[10px] font-medium">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                            <span>รายละเอียด</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table className="sticky bottom-0 z-20 w-full min-w-[1200px] table-fixed border-collapse">
                        <tfoot className="sticky bottom-0 z-20 bg-[#2d3446] text-white">
                            <tr>
                                <td className="sticky left-0 bottom-0 z-40 bg-[#2d3446] px-6 py-3 w-[400px] min-w-[400px] text-center uppercase tracking-widest text-center">รวมทั้งหมดทุกภาค</td>
                                {!columns.all_header && (<td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[200px] min-w-[200px] p-4 text-center font-bold"></td>)}
                                {!columns.all_header && (<td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>)}
                                <td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>
                                {columns.column_part1 && (<td className=" sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold"></td>)}
                                {columns.column_part2 && (<td className=" sticky left-0 bottom-0 z-30 px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold">{statusText}</td>)}
                                {columns.column_part3 && (<td className={`sticky left-0 bottom-0 z-30 ${statusColor} px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold`}>{summary?.total_listed > 0 ? `${percent.toFixed(2)} %` : 0}</td>)}
                                <td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[100px] min-w-[100px] p-4 text-center font-bold">{summary ? summary.total_listed.toLocaleString() : null}</td>
                                <td className="sticky left-0 bottom-0 z-30 top-0 z-30 px-4 py-3 bg-[#2d3446] w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_called.toLocaleString() : null}</td>
                                <td className="sticky left-0 bottom-0 z-30 top-0 z-30 px-4 py-3 bg-[#2d3446] w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_remain.toLocaleString() : null}</td>
                                {roundsArray.map((_, i) => (<td key={i} className={`sticky left-0 bottom-0 z-30 w-[100px] min-w-[100px] p-4 text-center text-center font-bold`} >{summary && summary !== 0 ? summary.rounds?.[i + 1]?.toLocaleString() : null}</td>))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}