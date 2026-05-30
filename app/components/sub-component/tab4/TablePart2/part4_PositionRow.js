import Swal                 from 'sweetalert2';
import { motion }           from 'framer-motion';
import { useColumnStore }   from '../../../useTableColumns';
export default function Part4_PositionRow({ posData, roundsArray , regoin , zone ,isParentCollapsed , isRegionCollapsed , isCollapsed , isExpanded}) {
    console.log(posData);
    const percent = (posData.total_listed > 0) ? (posData.total_call / posData.total_listed) * 100 : 0;
    const columns = useColumnStore((state) => state.columns);
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
    return (
        <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white hover:bg-gray-50"
        >
                                        <td className=" w-[400px] min-w-[400px] sticky left-0 z-10 p-4 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">[ <span className="font-semibold">{posData.pos_id}</span> ] {posData.pos_name}</td>
            {!columns.all_header && (   <td className={`w-[200px] min-w-[200px] sticky top-0 z-10 p-4 font-semibold text-center bg-gray-50 ${regionColors[regoin.pro_main_id]} `}>{regoin.pro_main_name}</td>)}
            {!columns.all_header && (   <td className={`w-[100px] min-w-[100px] sticky top-0 z-10 p-4 font-semibold text-center bg-gray-50 ${zoneColors[zone.pro_sub_id]} `}>เขต {zone.pro_sub_id}</td>)}
                                        <td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${posData.pos_type_id === "1" ? "bg-blue-50 text-blue-700" : posData.pos_type_id === "2" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{posData.pos_type_name}</td>
            {columns.column_part1 && (  <td className={`w-[100px] min-w-[100px] p-4 text-center font-bold ${posData.status_open ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}>{posData.status_open ? "เปิด" : "ไม่เปิดสอบ"}</td>)}
            {columns.column_part2 && (  <td className={`w-[120px] min-w-[120px] p-4 text-center font-bold ${posData.status_out_of_lits ? ( posData.status_open === false ? "bg-rose-50 text-rose-700" : "bg-green-50 text-green-700" ) : "bg-yellow-50 text-yellow-700"}`}>{posData.status_out_of_lits ? ( posData.status_open === false ? "ไม่มีบัญชี" : "หมดบัญชี" ) : "คงเหลือ"}</td>)}
            {columns.column_part3 && (  <td className={`w-[120px] min-w-[120px] p-4 pr-6 text-right font-bold ${ posData.status_open ? (  percent < 30 ? "text-rose-600 bg-rose-50" : percent < 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50" ) : "text-gray-600 bg-gray-50"}`}> {( posData.status_open ? percent : 0 ).toFixed(2)} %</td>)}
                                        <td className=" w-[100px] min-w-[100px] p-4 text-center font-bold">{posData.total_listed.toLocaleString()}</td>
                                        <td className="w-[120px] min-w-[120px] p-4 text-center bg-clip-padding bg-emerald-50 font-bold text-emerald-700">{posData.total_call.toLocaleString()}</td>
                                        <td className="w-[120px] min-w-[120px] p-4 text-center bg-clip-padding font-bold bg-amber-50 text-amber-500">{posData.total_remain.toLocaleString()}</td>
            {roundsArray.map((_, i) => {
                const status            =   posData.data_call_round?.[i + 1]?.status;
                const text_color        =   ['completed', 'waiting'].includes(status) ? 'text-emerald-600' :status === 'exhaustion' ? 'text-amber-600' :status === 'not-used' ? 'text-red-400' : 'text-slate-900';
                const call_values       =   ['completed', 'waiting'].includes(status) ? posData.data_call_round?.[i + 1]?.total : ( status === 'exhaustion' ? '-' : ( status === 'not-used' ? '0' : null ) ) ;
                const status_list       =   posData.data_call_round?.[i + 1]?.status_list       ?? 'no-data';
                const status_call       =   posData.data_call_round?.[i + 1]?.status_call       ?? 'no-data';
                const has_no_data       =   !(status_call === 'no-data' && status_list === 'no-data');
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
                const formatDateThai = (dateStr) => {
                    if (!dateStr) return "-";
                    const [d, m, y] = dateStr.split("-");
                    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
                    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`; // +543 สำหรับ พ.ศ.
                };
                const handleCellClick = (roundIndex, roundData, status_call, status_list, posData ) => {
                    const status_cross      =   posData.data_call_round?.[i + 1]?.status_cross      ?? 'no-data';
                    const crossed_region    =   posData.data_call_round?.[i + 1]?.crossed_region    ?? 'no-data';
                    const crossed_zone      =   posData.data_call_round?.[i + 1]?.crossed_zone      ?? 'no-data';
                    const swalIcon = (status_call === false && status_list === false) ? 'warning' : (status_call === false && status_list === true) ? 'error' : 'success';
                    const getChangeUI = ( posData ) => {
                        if( roundIndex === 1 ) {
                            return { text: 'รอบเริ่มต้น', color: 'text-green-500' };
                        }
                        if ( status_call === false && status_list === false ) {
                            return { text: 'สิ้นสุดการเรียกบรรจุ', color: 'text-gray-500' };
                        }
                        if (posData.data_call_round[roundIndex].percent_change === null || posData.data_call_round[roundIndex].percent_change === undefined) {
                            return { text: '-', color: 'text-gray-500' };
                        }
                        const val = posData.data_call_round[roundIndex].percent_change;
                        const formatted = Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        if (val > 0) {
                            return { 
                                text: ` ${formatted} %`, 
                                color: 'text-green-500', 
                                icon: 'trending-up'
                            };
                        } else if ( val < 0 ) {
                            return { 
                                text: ` ${formatted} %`, 
                                color: 'text-rose-500', 
                                icon: 'trending-down'
                            };
                        } else if ( val === 0 ) {
                            return { 
                                text: ` ${formatted} %`, 
                                color: 'text-gray-500', 
                                icon: 'minus'
                            };
                        }
                    };
                    const ui = getChangeUI( posData );   
                    const iconSvg = {
                        'trending-up': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
                        'trending-down': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>',
                        'minus': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                    }[ui.icon] || '';
                    let text_title      = `รอบที่  ${roundIndex || 0}`;
                    let text_content    = `
                        <table class="w-full text-left border-collapse">
                            <tr class="border-b">
                                <td class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</td>
                                <td class="w-[40%] py-2 font-bold">${roundData?.total}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">ลำดับที่ :</td>
                                <td class="py-2 font-bold">${roundData?.start_end || 0}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</td>
                                <td class="py-2 font-bold ${ui.color}">${iconSvg}${ui.text}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">วันที่บรรจุ :</td>
                                <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-bold text-gray-500">สถานะ:</td>
                                <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด' )  )}</td>
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
                                        <td class="w-[40%] py-2 font-bold">${status_cross === true ? 'ใช่' : 'ไม่ใช่' }</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="py-2 font-bold text-gray-500">ภาค :</td>
                                        <td class="py-2 font-bold">${ crossed_region !== 'no-data' ? ( crossed_region === 1 ? 'ภาคเหนือ' : ( crossed_region === 2 ? 'ภาคกลาง' : ( crossed_region === 3 ? 'ภาคตะวันออกเฉียงเหนือ' : 'ภาคใต้' ) ) ) : '-' }</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="py-2 font-bold text-gray-500">เขต :</td>
                                        <td class="py-2 font-bold">${ crossed_zone !== 'no-data' ? 'เขต ' + crossed_zone : '-' }</td>
                                    </tr>
                                </table>
                            </div>
                        </details>
                    `.trim();
                    if (status_call === false && status_list === false) {
                        status_call     = 'warning';
                        text_content    = `
                        <table class="w-full text-left border-collapse">
                            <tr class="border-b">
                                <td class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</td>
                                <td class="w-[40%] py-2 font-bold">-</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">ลำดับที่ :</td>
                                <td class="py-2 font-bold">-</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</td>
                                <td class="py-2 font-bold ${ui.color}">${ui.text}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">วันที่บรรจุ :</td>
                                <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                            </tr>
                            <tr>
                                <th class="py-2 font-bold text-gray-500">สถานะ:</th>
                                <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด' )  )}</td>
                            </tr>
                        </table>
                    `.trim();
                    } else if (status_call === false && status_list === true) {
                        status_call     = 'danger';
                        text_content    = `
                        <table class="w-full text-left border-collapse">
                            <tr class="border-b">
                                <td class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</td>
                                <td class="w-[40%] py-2 font-bold">-</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">ลำดับที่ :</td>
                                <td class="py-2 font-bold">-</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</td>
                                <td class="py-2 font-bold text-gray-500">-</td>
                            </tr>
                            <tr class="border-b">
                                <td class="py-2 font-bold text-gray-500">วันที่บรรจุ :</td>
                                <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                            </tr>
                            <tr>
                                <td class="py-2 font-bold text-gray-500">สถานะ:</td>
                                <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด' )  )}</td>
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
                        onClick={has_no_data ? () => handleCellClick(i + 1, posData.data_call_round?.[i + 1], status_call, status_list, posData) : undefined}
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
        </motion.tr>
    );
}