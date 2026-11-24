import { useMemo, useState } from 'react';
import { EmptyData } from '../../EmptyData';
import { useColumnStore } from '../../useTableColumns';
import RoundDetailModal from '@/app/components/RoundDetailModal';
export default function ShowAllDataTable({ checkData, part2, isLoading }) {
    const safePart2 = part2?.tab4?.part2?.data || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRound, setSelectedRound] = useState(null);
    const handleCellClick = (each_round_data) => {
        setSelectedRound(each_round_data);
        setIsModalOpen(true);
    };
    const columns = useColumnStore((state) => state.columns);
    const maxRound = Math.max(10, part2?.tab4?.part2?.round || 0);
    const roundsArray = Array.from({ length: maxRound }, (_, i) => i + 1);
    let summary = { total_listed: 0, total_listed_n: 0, total_diff: 0, total_called: 0, total_remain: 0, rounds: {} };
    if (safePart2 && Object.keys(safePart2).length > 0) {
        summary = Object.values(safePart2).reduce((acc, curr) => {
            acc.total_listed += (Number(curr.total_listed) || 0);
            acc.total_listed_n += (Number(curr.total_listed_n) || 0);
            acc.total_diff += (Number(curr.total_diff) || 0);
            acc.total_called += (Number(curr.total_called) || 0);
            acc.total_remain += (Number(curr.total_remain) || 0);

            if (curr.total_each_round) {
                Object.values(curr.total_each_round).forEach(roundData => {
                    const r = roundData.round;
                    acc.rounds[r] = (acc.rounds[r] || 0) + (Number(roundData.total) || 0);
                });
            }
            return acc;
        }, { total_listed: 0, total_listed_n: 0, total_diff: 0, total_called: 0, total_remain: 0, rounds: {} });
    }
    const percent = (summary?.total_listed_n > 0) ? (summary.total_called / summary.total_listed_n) * 100 : 0;

    const statusText = percent > 100 ? 'ขาดแคลน' : percent === 100 ? 'หมดบัญชี' : percent > 0 ? 'คงเหลือ' : 'ยังไม่ใช้บัญชี';
    const statusColor = percent < 30 ? "text-rose-400" : (percent < 70 ? "text-amber-400" : (percent < 100 ? "text-emerald-400" : "text-violet-400"));

    const has_data = Object.keys(part2?.tab4?.part2?.data || {}).length > 0;
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
    const getBagColor = (status_call) => {
        if (status_call === 'no-data') return 'cursor-default';
        if (status_call === true) {
            return 'cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 hover:border-b-emerald-300';
        }
        return 'bg-gray-100';
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
                            pos_percent: posData.total_listed_n ? ((posData.total_call / posData.total_listed_n) * 100) : 0,
                            status_open: posData.status_open,
                            status_out_of_lits: posData.status_out_of_lits,
                            total_listed: posData.total_listed,
                            total_listed_n: posData.total_listed_n,
                            total_diff: posData.total_diff,
                            total_call: posData.total_call,
                            total_remain: posData.total_remain,
                            roundsData: posData.data_call_round || {},
                            pro_main_id: regionData.pro_main_id,
                            pro_main_name: regionData.pro_main_name,
                            pro_sub_id: provSubData.pro_sub_id,
                            pro_sub_name: provSubData.pro_sub_name,
                            pos_type_id: posData.pos_type_id,
                            pro_main_id: regionData.pro_main_id,
                        });
                    });
                });
            });
        });
        return rows;
    }, [part2]);
    if (!checkData) return <div className="h-[600px] flex flex-col items-center justify-center h-[400px]"></div>
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
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
                <div className="flex-1 min-h-[400px] max-h-[800px] overflow-x-auto">
                    <table className="w-full h-full overflow-y-auto text-left border-collapse whitespace-nowrap">
                        <colgroup>
                            <col className="w-[400px] min-w-[400px] border-1 border-gray-200 border-r-[2px] border-r-gray-600" />
                            {!columns.all_header && (<col className="w-[200px] min-w-[200px] border-1 border-gray-200" />)}
                            {!columns.all_header && (<col className="w-[100px] min-w-[100px] border-1 border-gray-200" />)}
                            <col className="w-[100px] min-w-[100px] border-1 border-gray-200" />
                            {columns.column_part1 && (<col className="w-[100px] min-w-[100px] border-1 border-gray-200" />)}
                            {columns.column_part2 && (<col className="w-[120px] min-w-[120px] border-1 border-gray-200" />)}
                            {columns.column_part3 && (<col className="w-[120px] min-w-[120px] border-1 border-gray-200" />)}
                            <col className="w-[120px] min-w-[120px] border-1 border-gray-200" />
                            <col className="w-[120px] min-w-[120px] border-1 border-gray-200" />
                            <col className="w-[120px] min-w-[120px] border-1 border-gray-200" />
                            <col className="w-[120px] min-w-[120px] border-1 border-emerald-400" />
                            <col className="w-[120px] min-w-[120px] border-1 border-amber-400" />
                            {roundsArray.map((_, i) => <col key={i} className="w-[100px] min-w-[100px] border-y-[1px] border-l-[1px] border-gray-200" />)}
                        </colgroup>
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="w-[400px] min-w-[400px] sticky left-0 top-0 z-40 p-4 font-semibold bg-gray-50 ">ภาค / เขต / ตำแหน่ง</th>
                                {!columns.all_header && (<th className="w-[200px] min-w-[200px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ภาค</th>)}
                                {!columns.all_header && (<th className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">เขต</th>)}
                                <th className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ประเภท</th>
                                {columns.column_part1 && (<th className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">สถานะเปิด</th>)}
                                {columns.column_part2 && (<th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">สถานะบัญชี</th>)}
                                {columns.column_part3 && (<th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ความคืบหน้า</th>)}
                                <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">ขึ้นบัญชี (เก่า)</th>
                                <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-100">ขึ้นบัญชี (ใหม่)</th>
                                <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-rose-100 text-rose-700">ส่วนต่าง</th>
                                <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-emerald-50 text-emerald-700">เรียกทั้งหมด</th>
                                <th className="w-[120px] min-w-[120px] sticky top-0 z-30 p-4 font-semibold text-center bg-amber-50 text-amber-500">คงเหลือ</th>
                                {roundsArray.map((_, index) => (<th key={index} className="w-[100px] min-w-[100px] sticky top-0 z-30 p-4 font-semibold text-center bg-gray-50">รอบ {index + 1}</th>))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {flatTableRows.map((item) => (
                                <tr key={`${item.uniqueKey}`} className="bg-white hover:bg-gray-50" >
                                    <td className=" w-[400px] min-w-[400px] sticky left-0 z-20 p-4 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">[ <span className="font-semibold">{item.pos_id}</span> ] {item.pos_name}</td>
                                    {!columns.all_header && (<td className={`w-[200px] min-w-[200px] sticky top-0  z-10 p-4 font-semibold text-center bg-gray-50 ${regionColors[item.pro_main_id]} `}>{item.pro_main_name}</td>)}
                                    {!columns.all_header && (<td className={`w-[100px] min-w-[100px] sticky top-0  z-10 p-4 font-semibold text-center bg-gray-50 ${zoneColors[item.pro_sub_id]} `}>{item.pro_sub_name}</td>)}
                                    <td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${item.pos_type_id === 1 ? "bg-blue-50 text-blue-700" : item.pos_type_id === 2 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.pos_type_name}</td>
                                    {columns.column_part1 && (<td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${item.status_open ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}>{item.status_open ? "เปิด" : "ไม่เปิดสอบ"}</td>)}
                                    {columns.column_part2 && (<td className={`w-[150px] min-w-[150px] p-4 text-center font-bold ${item.status_out_of_lits ? (item.status_open === false ? "bg-rose-50 text-rose-700" : "bg-green-50 text-green-700") : item.total_remain < 0 ? "bg-rose-700 text-white" : "bg-yellow-50 text-yellow-700"}`}>{item.status_out_of_lits ? (item.status_open === false ? "ไม่มีบัญชี" : "หมดบัญชี") : item.total_remain < 0 ? "ขาดแคลน" : "คงเหลือ"}</td>)}
                                    {columns.column_part3 && (<td className={`w-[120px] min-w-[120px] p-4 pr-6 text-right font-bold ${item.status_open ? (item.pos_percent < 30 ? "text-rose-600 bg-rose-50" : item.pos_percent < 70 ? "text-amber-600 bg-amber-50" : item.pos_percent <= 100 ? "text-emerald-600 bg-emerald-50" : "text-violet-600 bg-violet-50") : "text-gray-600 bg-gray-50"}`}> {(item.status_open ? item.pos_percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '0%')} </td>)}
                                    <td className="w-[120px] min-w-[120px] p-4 text-center font-bold bg-gray-50  text-gray-700">{item.total_listed.toLocaleString()}</td>
                                    <td className="w-[120px] min-w-[120px] p-4 text-center font-bold bg-gray-100 text-gray-700">{item.total_listed_n.toLocaleString()}</td>
                                    <td className="w-[120px] min-w-[120px] p-4 text-center font-bold bg-rose-100 text-rose-700">{item.total_diff.toLocaleString()}</td>
                                    <td className="w-[120px] min-w-[120px] p-4 text-center bg-clip-padding bg-emerald-50 font-bold text-emerald-700">{item.total_call.toLocaleString()}</td>
                                    <td className={`w-[120px] min-w-[120px] p-4 text-center bg-clip-padding font-bold ${item.total_remain === 0 ? (item.status_open ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-500') : item.total_remain > 0 ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>{item.total_remain.toLocaleString()}</td>
                                    {roundsArray.map((_, i) => {
                                        const status = item.roundsData?.[i + 1]?.status_work;
                                        const call_values = ['completed', 'waiting'].includes(status) ? item.roundsData?.[i + 1]?.total : (status === 'exhaustion' ? '-' : (status === 'not-used' ? '0' : null));
                                        const status_list = item.roundsData?.[i + 1]?.list_status ?? 'no-data';
                                        const status_call = item.roundsData?.[i + 1]?.call_status ?? 'no-data';
                                        const bag_color = getBagColor(status_call);
                                        const getButtonColor = (status_call) => {
                                            if (status_call === 'no-data') return 'cursor-default';
                                            if (status_call === true) {
                                                return 'bg-emerald-50/90 py-1 text-emerald-800';
                                            }
                                            return 'bg-gray-100';
                                        };
                                        const button_color = getButtonColor(status_call);
                                        return (
                                            <td
                                                key={i}
                                                onClick={status_call === true ? () => handleCellClick(item.roundsData?.[i + 1]) : undefined}
                                                className={`w-[100px] min-w-[100px] bg-clip-padding relative group p-4 text-center font-bold ${bag_color} ${status_call === true ? 'text-emerald-600' : 'bg-gray-100'}`}>
                                                {status_call === true ? (
                                                    <div className={`transition-transform duration-300 group-hover:-translate-y-2 `}>
                                                        {call_values !== undefined && call_values !== null ? (
                                                            status_call === true ? call_values.toLocaleString() : (!status_list ? '-' : 0)
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                                {status_call === true ? (
                                                    <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out ${button_color}`}>
                                                        <div className="flex items-center gap-1 text-xs font-medium">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                            <span>รายละเอียด</span>
                                                        </div>
                                                    </div>
                                                ) : null}
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
                                {columns.column_part2 && (<td className=" sticky left-0 bottom-0 z-30 px-4 py-3 w-[150px] min-w-[150px] p-4 text-center font-bold">{statusText}</td>)}
                                {columns.column_part3 && (<td className={`sticky left-0 bottom-0 z-30 ${statusColor} px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold`}>{summary?.total_listed > 0 ? `${percent.toFixed(2)} %` : 0}</td>)}
                                <td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_listed.toLocaleString() : null}</td>
                                <td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_listed_n.toLocaleString() : null}</td>
                                <td className="sticky left-0 bottom-0 z-30 px-4 py-3 w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_diff.toLocaleString() : null}</td>
                                <td className="sticky left-0 bottom-0 z-30 top-0 z-30 px-4 py-3 bg-[#2d3446] w-[120px] min-w-[120px] p-4 text-center font-bold">{summary ? summary.total_called.toLocaleString() : null}</td>
                                <td className={`sticky left-0 bottom-0 z-30 top-0 z-30 px-4 py-3 bg-[#2d3446] w-[120px] min-w-[120px] p-4 text-center font-bold ${summary ? (summary.total_remain === 100 ? 'text-blue-400' : summary.total_remain > 0 ? 'text-amber-400' : 'text-rose-400') : null}`}>{summary ? summary.total_remain.toLocaleString() : null}</td>
                                {roundsArray.map((_, i) => (<td key={i} className={`sticky left-0 bottom-0 z-30 w-[100px] min-w-[100px] p-4 text-center text-center font-bold`} >{summary && summary !== 0 ? summary.rounds?.[i + 1]?.toLocaleString() : null}</td>))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <RoundDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedRound}
            />

        </div >
    );
}