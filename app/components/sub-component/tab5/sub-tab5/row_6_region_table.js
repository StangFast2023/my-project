
"use client";
import React from 'react';
import Swal from 'sweetalert2';
import { ContactRound } from 'lucide-react';

export default function Row6RegionTable({ position, data }) {
    const TableData = data?.chart_3_region || {};
    if (!TableData) return null;
    const maxRounds = 10;
    const roundColumns = Array.from({ length: maxRounds }, (_, i) => i + 1);
    const getChangeUI = (round, called, listed, change) => {
        if (round === 1) {
            return { text: 'รอบเริ่มต้น', color: 'text-green-500' };
        }
        if (called === false && listed === false) {
            return { text: 'สิ้นสุดการเรียกบรรจุ', color: 'text-gray-500' };
        }
        if (change === null || change === undefined) {
            return { text: '-', color: 'text-gray-500' };
        }
        const val = change;
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
        } else {
            return {
                text: `0.00 %`,
                color: 'text-gray-600',
                icon: ''
            };
        }
    };
    const textColor = (value) => {
        if (!value) return 'text-gray-600';
        if (value > 0) {
            return 'text-emerald-600';
        }
        if (value === '-') {
            return 'text-amber-600 ';
        }
        return 'text-rose-600';
    };
    const getBgHover = (value) => {
        if (!value) return '';
        if (value > 0) {
            return 'hover:bg-emerald-50/90 ';
        }
        if (value === '-') {
            return 'hover:bg-amber-50/90';
        }
        return 'hover:bg-rose-50/90';
    };
    const getButtonColor = (value) => {
        if (!value) return '';
        if (value > 0) {
            return '!bg-emerald-50/90 py-1 text-emerald-800';
        }
        if (value === '-') {
            return '!bg-amber-50/90 py-1 text-amber-800 ';
        }
        return '!bg-rose-50/90 py-1 text-rose-800';
    };
    const handleCellClick = (roundInfo) => {

        const date = roundInfo?.date || {};
        const round = roundInfo?.round || {};

        const called = roundInfo?.called || {};
        const listed = roundInfo?.listed || {};
        const status = roundInfo?.status || {};
        const change = roundInfo?.change || {};
        const proportion = roundInfo?.proportion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %" || {};

        const total = roundInfo?.total || {};
        const start_end = roundInfo?.start_end || null;

        const is_cross_region = roundInfo?.is_cross_region || {};
        const crossed_region = roundInfo?.crossed_region || {};
        const crossed_zone = roundInfo?.crossed_zone || {};
        const ui = getChangeUI(round, called, listed, change);
        const iconSVG = (value) => {
            if (value === 'trending-up') {
                return '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>';
            } else if (value === 'trending-down') {
                return '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>';
            } else if (value === 'minus') {
                return '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
            } else {
                return '';
            }
        }
        let text_title = `รอบที่  ${round || 0}`;
        let text_content = `
                        <table class="w-full text-left border-collapse">
                            <tr class="border-b">
                                <td class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</td>
                                <td class="w-[40%] py-2 font-bold">${total}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">ลำดับที่ :</td>
                                <td class="py-2 font-bold">${start_end ? start_end : '-'}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</td>
                                <td class="py-2 font-bold ${ui.color}">${iconSVG(ui.icon)}${ui.text}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">สัดส่วนของการใช้บัญชี :</td>
                                <td class="py-2 font-bold">${proportion || null}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">วันที่บรรจุ :</td>
                                <td class="py-2 font-bold">${date || null}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-bold text-gray-500">สถานะ:</td>
                                <td class="py-2 font-bold ${total === "0" ? 'text-rose-500' : (total === "-" ? 'text-amber-500' : (status == 'waiting' ? 'text-sky-500' : 'text-emerald-500'))} ">${total === "0" ? 'ไม่มีการเรียกใช้บัญชี' : (total === "-" ? 'บัญชีสิ้นสุดแล้ว' : (status == 'waiting' ? 'รอการบรรจุ' : 'บรรจุแล้ว'))}</td>
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
                                        <td class="w-[60%] py-2 font-bold text-gray-500">เป็นการเรียกใช้บัญชีข้ามเขต :</td>
                                        <td class="w-[40%] py-2 font-bold">${is_cross_region === true ? 'ใช่' : 'ไม่ใช่'}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="py-2 font-bold text-gray-500">ภาค :</td>
                                        <td class="py-2 font-bold">${is_cross_region === true ? (crossed_region === 1 ? 'ภาคเหนือ' : (crossed_region === 2 ? 'ภาคกลาง' : (crossed_region === 3 ? 'ภาคตะวันออกเฉียงเหนือ' : 'ภาคใต้'))) : '-'}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="py-2 font-bold text-gray-500">เขต :</td>
                                        <td class="py-2 font-bold">${is_cross_region === true ? 'เขต ' + crossed_zone : '-'}</td>
                                    </tr>
                                </table>
                            </div>
                        </details>
                    `.trim();
        Swal.fire({
            title: text_title,
            html: text_content,
            icon: (total === "-") ? 'warning' : (total === "0") ? 'error' : 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#10b981'
        });
    };
    let last = { list: 0, call: 0, remain: 0, rounds: roundColumns.map(() => ({ status: '-', total: null })) };
    return (
        <div className="col-span-12 lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm">

            <div className="text-center mb-4 text-gray-700">
                <div className="flex items-center">
                    <ContactRound />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        ตารางการบรรจุรายรอบของแต่ละเขต {position ? " " + position : null}
                    </h3>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
                <div className="flex-1  min-h-[400px] max-h-[800px] overflow-x-auto">
                    <table className="w-full h-full overflow-y-auto text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="sticky top-0 z-30 bg-gray-50    w-[10%] px-6 py-4 text-sm md:text-base lg:text-ls font-semibold sticky left-[0] z-40">ภาค / เขต</th>
                                <th className="sticky top-0 z-30 bg-sky-50     w-[7%]  px-6 py-4 text-sm md:text-base lg:text-ls font-semibold text-center">สถานะเปิดสอบ</th>
                                <th className="sticky top-0 z-30 bg-amber-50   w-[5%]  px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center">ขึ้นบัญชี</th>
                                <th className="sticky top-0 z-30 bg-emerald-50 w-[5%]  px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center text-emerald-700">เรียกแล้ว</th>
                                <th className="sticky top-0 z-30 bg-blue-50    w-[5%]  px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center text-blue-700">ความคืบหน้า</th>
                                <th className="sticky top-0 z-30 bg-rose-50    w-[5%]  px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center text-rose-500">คงเหลือ</th>
                                {roundColumns.map(num => (<th key={num} className="sticky top-0 z-30 bg-rose-50 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-amber-50/30">รอบ {num}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(TableData).map((region) => {
                                let reg = { list: 0, call: 0, remain: 0, rounds: roundColumns.map(() => ({ status: '-', total: null })) };
                                return (
                                    <React.Fragment key={region.name}>
                                        <tr className="bg-emerald-50/20">
                                            <td colSpan={roundColumns.length + 6} className="px-6 py-2 text-emerald-700 font-bold text-sm md:text-base lg:text-lg uppercase tracking-wider">
                                                <span className="sticky left-[30px]">{region.name}</span>
                                            </td>
                                        </tr>
                                        {Object.values(region.sub_province).map((zone) => {
                                            const status_open = zone.status_open || {};
                                            const listed = Number(zone.total_listed) || 0;
                                            const called = Number(zone.total_called) || 0;
                                            const remain = Number(zone.total_remaining) || 0;
                                            [reg, last].forEach(target => {
                                                target.list += listed;
                                                target.call += called;
                                                target.remain += remain;
                                            });

                                            roundColumns.forEach((roundKey, index) => {
                                                const roundData = zone['data_rounds']?.[roundKey];
                                                const totalVal = (roundData?.total !== 'undefined' && roundData?.total !== '-') ? Number(roundData?.total) : 0;
                                                const calledVal = roundData?.called ?? '-';

                                                const currentVal = Number(totalVal) || 0;

                                                reg.rounds[index].status = calledVal;
                                                reg.rounds[index].total += currentVal;

                                                last.rounds[index].status = calledVal;
                                                last.rounds[index].total += currentVal;

                                                if (roundKey === 2) {
                                                    console.log(`${region.name} ${zone.name} รอบ ${roundKey}`, reg);
                                                }

                                            });
                                            return (
                                                <tr key={`${region.name}-${zone.name}`}>
                                                    <td className="bg-gray-50    px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-left   text-gray-700 sticky left-0 z-10">{zone.name}</td>
                                                    <td className={`${status_open === true ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'} px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center`}>{status_open === true ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}</td>
                                                    <td className="bg-amber-50   px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-500">{status_open === true ? zone.total_listed.toLocaleString() : '-'}</td>
                                                    <td className="bg-emerald-50 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-emerald-600">{status_open === true ? zone.total_called.toLocaleString() : '-'}</td>
                                                    <td className="bg-blue-50    px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-blue-600">{status_open === true ? zone.processing.toFixed(2) + " %" : '-'}</td>
                                                    <td className="bg-rose-50    px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-rose-500">{status_open === true ? zone.total_remaining.toLocaleString() : '-'}</td>
                                                    {roundColumns.map(num => {
                                                        const roundInfo = zone['data_rounds'][num];
                                                        const bgClass = roundInfo ? "bg-white" : "bg-gray-100";
                                                        return (
                                                            <td
                                                                key={num}
                                                                onClick={roundInfo ? () => handleCellClick(roundInfo) : undefined}
                                                                className={`bg-clip-padding relative group font-semibold px-4 py-4 text-center ${bgClass} ${roundInfo ? 'cursor-pointer' : ''} ${roundInfo ? getBgHover(roundInfo.total) : ''}`}
                                                            >
                                                                <div className={`transition-transform duration-300 group-hover:-translate-y-2 text-sm md:text-base lg:text-sm !font-kanit ${roundInfo ? textColor(roundInfo.total) : ''}`}>
                                                                    {roundInfo ? roundInfo.total.toLocaleString() : null}
                                                                </div>
                                                                {roundInfo && (
                                                                    <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out ${roundInfo ? getButtonColor(roundInfo.total) : ''} `}>
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
                                            );
                                        })}
                                        <tr key={region.name}>
                                            <td className="bg-white         px-6 py-4 text-sm md:text-base lg:text-sm font-semibold text-left text-gray-600 sticky left-0 z-10"> รวม {region.name}</td>
                                            <td className="bg-amber-50/50   px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-600"></td>
                                            <td className="bg-amber-50/50   px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-gray-600">{reg.list.toLocaleString()}</td>
                                            <td className="bg-emerald-50/50 px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-emerald-600">{reg.call.toLocaleString()}</td>
                                            <td className="bg-blue-50/50    px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-blue-600">{((reg.call / reg.list) * 100).toFixed(2)} %</td>
                                            <td className="bg-rose-50/50    px-4 py-4 text-sm md:text-base lg:text-sm font-semibold text-center text-rose-500">{reg.remain.toLocaleString()}</td>
                                            {reg.rounds.map((v, i) => {
                                                return (
                                                    <td key={i} className={`px-4 py-4 text-sm md:text-base lg:text-sm text-center font-semibold text-gray-700 ${v.total ? 'bg-white' : 'bg-gray-100'}`} >{v.total ? v.total.toLocaleString() : null}</td>
                                                );
                                            })}
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                            {TableData && (
                                <tr className="bg-gray-700 text-white text-sm md:text-base lg:text-sm font-bold">
                                    <td className="sticky bottom-0 z-40 bg-gray-700 px-6 py-4 text-center uppercase tracking-wider sticky left-[0] z-30">รวมทั้งหมด</td>
                                    <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center"></td>
                                    <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{last.list.toLocaleString()}</td>
                                    <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{last.call.toLocaleString()}</td>
                                    <td className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{((last.call / last.list) * 100).toFixed(2)} %</td>
                                    <td className="sticky bottom-0 z-30 bg-gray-700 px-6 py-4 text-center">{last.remain.toLocaleString()}</td>
                                    {last.rounds.map((item, index) => {
                                        return (
                                            <td key={index} className="sticky bottom-0 z-30 bg-gray-700 px-4 py-4 text-center">{item.total ? item.total.toLocaleString() : null}</td>
                                        );
                                    })}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}