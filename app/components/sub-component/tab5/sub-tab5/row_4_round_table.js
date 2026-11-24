
"use client";
import useMediaQuery from '@/app/avaliable/useMediaQuery';
import { AppWindow, TrendingUp, TrendingDown, Equal, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Row4RoundTable({ region, zone, position, data }) {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const TableData = data?.chart_2_round || {};
    if (!TableData) return null;
    const max_rounds = Math.max(10, Object.keys(TableData || {}).length || 0);
    const round_columns = Array.from({ length: max_rounds }, (_, i) => i + 1);
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
        const subs = zone ? ` เขต ${zone}` : '';
        return `${main}${subs}`;
    };
    const getChangeColor = (round_data) => {
        if (round_data?.change === 'first') return 'text-amber-600';
        if (round_data?.list_status !== true) return 'text-gray-600';
        if (round_data?.change > 0) return 'text-emerald-600';
        if (round_data?.change === 0) return 'text-gray-600';
        return 'text-rose-600';
    };
    const formatNumber = (value) => value != null && value !== '' ? Number(value).toLocaleString('en-US') : '-';
    const formatPercent = (value) => value != null ? `${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, })} %` : '-';
    const getRoundStatus = (round_data) => {
        if (!round_data?.list_status) return '-';
        return round_data?.call_status === true ? 'มีการใช้บัญชี' : 'ไม่มีการเรียกใช้บัญชี';
    };
    const getProcessStatus = (round_data) => {
        if (!round_data?.list_status) return '-';
        if (round_data?.call_status !== true) return '-';
        return round_data?.status === 'completed' ? 'ได้รับการบรรจุ' : 'รอการเรียกบรรจุ';
    };
    const getProcessColor = (round_data) => {
        if (round_data?.list_status === true && round_data?.call_status === true) {
            return round_data?.status === 'completed' ? 'text-emerald-700' : 'text-sky-700';
        }
        return 'text-gray-600';
    };
    const roundCards = round_columns
        .filter((key) => TableData[key] != null)
        .map((key) => {
            const round_data = TableData[key];
            const total_listed = data?.total_listed_n || 0;
            cumulative_total += parseInt(round_data?.call_status === true && round_data?.list_status === true ? round_data?.total : 0);
            cumulative_total_call += parseInt(round_data?.call_status === true && round_data?.list_status === true ? round_data?.total : 0);
            total_remain = total_listed - cumulative_total;

            return {
                key,
                round_data,
                total_remain,
            };
        });
    const totalCalled = cumulative_total_call;
    const renderChange = (round_data) => (
        <div className={`flex items-center justify-center gap-1.5 ${getChangeColor(round_data)}`}>
            {round_data?.change != null && round_data?.change !== 'first' ? (
                round_data?.change > 0 ? (
                    <TrendingUp className="w-4 h-4 shrink-0" />
                ) : round_data?.change === 0 ? (
                    <Equal className="w-4 h-4 shrink-0" />
                ) : (
                    <TrendingDown className="w-4 h-4 shrink-0" />
                )
            ) : null}

            <span>
                {round_data?.change != null ? round_data?.change === 'first' ? 'รอบเริ่มต้น' : formatPercent(round_data.change) : '-'}
            </span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full min-w-0">
            <div className="col-span-1 lg:col-span-12 min-w-0 w-full overflow-hidden bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-4 flex min-w-0 items-center text-gray-700">
                    <AppWindow className="w-5 h-5 shrink-0" />
                    <h3 className="ml-2 min-w-0 text-sm md:text-base lg:text-lg font-bold">
                        ตารางการบรรจุรายรอบ
                        {region && zone && position ? ` ${position} ${region} ${zone}` : null}
                    </h3>
                </div>
                {isMobile ? (
                    <div className="min-w-0">
                        <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <ChevronLeft className="w-4 h-4" />
                                เลื่อนดูแต่ละรอบ
                                <ChevronRight className="w-4 h-4" />
                            </span>
                            <span className="shrink-0">
                                {roundCards.length} รอบ
                            </span>
                        </div>
                        <div className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3">
                            {roundCards.map(({ key, round_data, total_remain }) => {
                                const typeCallRows =
                                    round_data?.type_call &&
                                        typeof round_data.type_call === 'object' &&
                                        Object.keys(round_data.type_call).length > 0
                                        ? Object.values(round_data.type_call)
                                        : [round_data];

                                return (
                                    <article
                                        key={key}
                                        className="w-[100%] min-w-[100%] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                                    >
                                        <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
                                            <div>
                                                <p className="text-xs text-gray-500">รอบที่</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {round_data?.round ?? key}
                                                </p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${round_data?.list_status === true ? round_data?.call_status === true ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {getRoundStatus(round_data)}
                                            </span>
                                        </div>
                                        <div className="space-y-3 p-4 text-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="shrink-0 text-gray-500">วันเดือนปีที่รายงานตัว</span>
                                                <span className="text-right font-medium text-gray-800">
                                                    {round_data?.list_status ? round_data?.report_date ?? '-' : '-'}
                                                </span>
                                            </div>
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="shrink-0 text-gray-500">วันเดือนปีที่บรรจุ</span>
                                                <span className="text-right font-medium text-gray-800">
                                                    {round_data?.list_status ? round_data?.date ?? '-' : '-'}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-semibold text-gray-700">
                                                        ประเภทการเรียก
                                                    </p>
                                                    {typeCallRows.length > 1 && (
                                                        <span className="shrink-0 text-xs text-gray-400">
                                                            {typeCallRows.length} ประเภท
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-2">
                                                    {typeCallRows.map((typeData, index) => (
                                                        <div
                                                            key={typeData?.type_call_id ?? index}
                                                            className="w-[100%] min-w-[100%] shrink-0 snap-start space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span className="text-xs text-gray-500">
                                                                    ประเภทที่ {index + 1}
                                                                </span>
                                                                <span className="text-right text-sm font-semibold text-gray-800">
                                                                    {typeData?.type_call_name || 'ข้อมูลการเรียกรวม'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between gap-3">
                                                                <span className="text-gray-500">จำนวนที่เรียก</span>
                                                                <span className="font-bold text-emerald-700">
                                                                    {typeData?.total
                                                                        ? `${formatNumber(typeData.total)} คน`
                                                                        : '-'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start justify-between gap-3">
                                                                <span className="shrink-0 text-gray-500">ลำดับที่</span>
                                                                <div className="flex max-w-[75%] gap-1 overflow-x-auto whitespace-nowrap pb-1">
                                                                    {typeData?.call_status === true &&
                                                                        Array.isArray(typeData?.start_end) &&
                                                                        typeData.start_end.length > 0 ? (
                                                                        typeData.start_end.map((item, rankIndex) => (
                                                                            <span
                                                                                key={rankIndex}
                                                                                className="inline-flex shrink-0 items-center justify-center min-w-7 h-7 px-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md"
                                                                            >
                                                                                {item}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-gray-400">-</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between gap-3">
                                                                <span className="text-gray-500">บัญชีที่ใช้เรียก</span>
                                                                <span className={`font-semibold ${typeData?.list_new_status
                                                                    ? 'text-emerald-700'
                                                                    : 'text-rose-700'
                                                                    }`}>
                                                                    {typeData?.list_new_status ? 'บัญชีใหม่' : 'บัญชีเก่า'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between gap-3">
                                                                <span className="text-gray-500">เรียกบรรจุข้ามเขต</span>
                                                                <span className="text-right font-medium text-gray-700">
                                                                    {typeData?.is_cross_region === true ? 'ใช่' : 'ไม่ใช่'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {typeCallRows.length > 1 && (
                                                    <p className="text-center text-xs text-gray-400">
                                                        ปัดซ้ายหรือขวาเพื่อดูประเภทการเรียกอื่น
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                        <p className="mt-1 text-center text-xs text-gray-400">
                            ปัดหน้าจอไปทางซ้ายหรือขวาเพื่อดูข้อมูลรอบอื่น
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse whitespace-nowrap text-left">
                                <thead className="bg-gray-50 text-sm text-gray-600">
                                    <tr>
                                        <th className="border-b-2 border-gray-700 bg-gray-50 p-3 text-center font-semibold text-gray-700">รอบที่</th>
                                        <th className="border-b-2 border-gray-700 bg-green-50 p-3 text-center font-semibold text-green-700">สถานะการเรียกบรรจุ</th>
                                        <th className="border-b-2 border-gray-700 bg-gray-50 p-3 text-center font-semibold text-gray-700">วันเดือนปีที่บรรจุ</th>
                                        <th className="border-b-2 border-gray-700 bg-emerald-50 p-3 text-center font-semibold text-emerald-700">จำนวนที่เรียก (คน)</th>
                                        <th className="border-b-2 border-gray-700 bg-gray-50 p-3 text-center font-semibold text-gray-700">ลำดับที่</th>
                                        <th className="border-b-2 border-gray-700 bg-amber-50 p-3 text-center font-semibold text-amber-700">อัตราการเปลี่ยนแปลง (%)</th>
                                        <th className="border-b-2 border-gray-700 bg-sky-50 p-3 text-center font-semibold text-sky-700">สัดส่วนการใช้บัญชี (%)</th>
                                        <th className="border-b-2 border-gray-700 bg-gray-50 p-3 text-center font-semibold text-gray-700">บัญชีที่ใช้เรียก</th>
                                        <th className="border-b-2 border-gray-700 bg-blue-50 p-3 text-center font-semibold text-blue-700">สถานะดำเนินการ</th>
                                        <th className="border-b-2 border-gray-700 bg-gray-50 p-3 text-center font-semibold text-gray-700">สถานะการเรียกบรรจุข้ามเขต</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {roundCards.map(({ key, round_data }) => {
                                        const typeCallRows =
                                            round_data?.type_call && typeof round_data.type_call === 'object'
                                                ? Object.values(round_data.type_call)
                                                : [round_data];

                                        return typeCallRows.map((typeData, index) => (
                                            <tr
                                                key={`${key}-${typeData?.type_call_id ?? index}`}
                                                className={`bg-emerald-50/20 border-l border-gray-400 ${index > 0
                                                    ? 'border-t-2 border-gray-400'
                                                    : 'border-t-2 border-gray-400'
                                                    } [&>td]:border-r [&>td]:border-gray-400`}
                                            >
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={typeCallRows.length}
                                                        className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-600"
                                                    >
                                                        {round_data?.round}
                                                    </td>
                                                )}

                                                {/* สถานะ */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={typeCallRows.length}
                                                        className={`bg-gray-50 p-3 text-center text-sm font-semibold ${round_data?.list_status === true
                                                            ? round_data?.call_status === true
                                                                ? 'text-emerald-600'
                                                                : 'text-rose-600'
                                                            : 'text-amber-600'
                                                            }`}
                                                    >
                                                        {round_data?.list_status && getRoundStatus(round_data)}
                                                    </td>
                                                )}

                                                {/* วันที่ */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={typeCallRows.length}
                                                        className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-600"
                                                    >
                                                        {round_data?.list_status ? round_data?.date ?? '-' : '-'}
                                                    </td>
                                                )}

                                                {/* จำนวนเรียกของแต่ละประเภท */}
                                                <td
                                                    className={`bg-gray-50 p-3 text-center text-sm font-semibold ${round_data?.list_status === true
                                                        ? typeData?.call_status === true
                                                            ? 'text-emerald-600'
                                                            : 'text-rose-600'
                                                        : 'text-gray-600'
                                                        }`}
                                                >
                                                    {round_data?.list_status
                                                        ? typeData?.total
                                                            ? formatNumber(typeData.total)
                                                            : '-'
                                                        : '-'}
                                                </td>

                                                {/* ลำดับที่เรียกของแต่ละประเภท */}
                                                <td className="bg-gray-50 p-3 text-center text-sm font-semibold whitespace-nowrap text-gray-700">
                                                    {round_data?.list_status && typeData?.call_status === true
                                                        ? Array.isArray(typeData?.start_end)
                                                            ? (
                                                                <div className="flex flex-wrap gap-1 p-1">
                                                                    {typeData.start_end.map((item, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="inline-flex items-center justify-center px-1 text-sm border border-gray-400 rounded"
                                                                        >
                                                                            {item}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )
                                                            : '-'
                                                        : '-'}
                                                </td>

                                                {/* เปลี่ยนแปลง */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={typeCallRows.length}
                                                        className="bg-amber-50 p-3 text-center text-sm font-semibold"
                                                    >
                                                        {renderChange(round_data)}
                                                    </td>
                                                )}

                                                {/* สัดส่วน */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={typeCallRows.length}
                                                        className="bg-sky-50 p-3 text-center text-sm font-semibold text-sky-700"
                                                    >
                                                        {formatPercent(round_data?.proportion)}
                                                    </td>
                                                )}

                                                {/* ประเภทบัญชี */}
                                                <td
                                                    className={`bg-gray-100 p-3 text-center text-sm font-semibold ${typeData?.list_new_status
                                                        ? 'text-emerald-600'
                                                        : 'text-rose-600'
                                                        }`}
                                                >
                                                    {typeData?.list_new_status ? 'บัญชีใหม่' : 'บัญชีเก่า'}
                                                </td>

                                                {/* สถานะดำเนินการ */}
                                                {index === 0 && (
                                                    <td
                                                        rowSpan={typeCallRows.length}
                                                        className={`bg-blue-50 p-3 text-center text-sm font-semibold ${getProcessColor(round_data)}`}
                                                    >
                                                        {getProcessStatus(round_data)}
                                                    </td>
                                                )}

                                                {/* การเรียกข้ามภาค */}
                                                <td className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-600">
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        {typeData.type_call_name}
                                                    </div>
                                                </td>
                                            </tr>
                                        ));
                                    })}


                                    {TableData && (
                                        <tr className="bg-gray-700 text-sm font-bold text-white">
                                            <td colSpan={3} className="bg-gray-700 p-3 text-center uppercase tracking-wider">
                                                รวมทั้งหมด
                                            </td>
                                            <td className="bg-gray-700 p-3 text-center">
                                                {totalCalled ? formatNumber(totalCalled) : '-'}
                                            </td>
                                            <td className="bg-gray-700 p-3 text-center"></td>
                                            <td className="bg-gray-700 p-3 text-center"></td>
                                            <td className="bg-gray-700 p-3 text-center"></td>
                                            <td className="bg-gray-700 p-3 text-center"></td>
                                            <td className="bg-gray-700 p-3 text-center"></td>
                                            <td className="bg-gray-700 p-3 text-center"></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
