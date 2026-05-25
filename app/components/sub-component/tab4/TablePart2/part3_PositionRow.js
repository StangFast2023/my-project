import React            from 'react';
import Swal             from 'sweetalert2';
import { motion }       from 'framer-motion';

export default function Part3_PositionRow({ posData, roundsArray }) {
  const percent = (posData.total_listed > 0) ? (posData.total_call / posData.total_listed) * 100 : 0;

  return (
    <motion.tr
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white hover:bg-gray-50 border-b border-gray-100"
    >
       <td className="w-[400px] min-w-[400px] sticky left-0 z-10 p-4 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r-2 border-gray-600">[ <span className="font-semibold">{posData.pos_id}</span> ] {posData.pos_name}</td>
       <td className={`w-[120px] min-w-[120px] p-4 text-center ${posData.pos_type_id === "1" ? "bg-blue-50 text-blue-700" : posData.pos_type_id === "2" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{posData.pos_type_name}</td>
       <td className={`w-[120px] min-w-[120px] p-4 text-center ${posData.status_open ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"}`}>{posData.status_open ? "เปิด" : "ไม่เปิดสอบ"}</td>
       <td className={`w-[120px] min-w-[120px] p-4 text-center ${posData.status_out_of_lits ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{posData.status_out_of_lits ? "หมดบัญชี" : "คงเหลือ"}</td>
       <td className={`w-[120px] min-w-[120px] p-4 text-center font-bold ${percent < 30 ? "text-rose-600 bg-rose-50" : percent < 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}`}> {percent.toFixed(0)}% </td>
       <td className=" w-[120px] min-w-[120px] p-4 text-center font-bold">{posData.total_listed.toLocaleString()}</td>
       {roundsArray.map((_, i) => {
           const status_list       =   posData.data_call_round?.[i + 1]?.status_list       ?? 'no-data';
           const status_call       =   posData.data_call_round?.[i + 1]?.status_call       ?? 'no-data';
           const status_cross      =   posData.data_call_round?.[i + 1]?.status_cross      ?? 'no-data';
           const crossed_region    =   posData.data_call_round?.[i + 1]?.crossed_region    ?? 'no-data';
           const crossed_zone      =   posData.data_call_round?.[i + 1]?.crossed_zone      ?? 'no-data';
           const has_no_data       =   !(status_call === 'no-data' && status_list === 'no-data');
           const getBagColor = (has_no_data, status_call, status_list) => {
               if (!has_no_data) return 'cursor-default';
               if (status_call === true) {
                   return 'cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 border-b-2 border-b-transparent hover:border-b-emerald-300';
               }
               if (status_call === false && status_list === false) {
                   return 'cursor-pointer hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200 border-b-2 border-b-transparent hover:border-b-amber-300';
               }
               return 'cursor-pointer hover:bg-rose-50 hover:text-rose-700 transition-colors duration-200 border-b-2 border-b-transparent hover:border-b-rose-300';
           };
           const bag_color = getBagColor(has_no_data, status_call, status_list);
           const formatDateThai = (dateStr) => {
               if (!dateStr) return "-";
               const [d, m, y] = dateStr.split("-");
               const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
               return `${parseInt(d)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`; // +543 สำหรับ พ.ศ.
           };
           const handleCellClick = (roundIndex, roundData, status_call, status_list, status_cross , crossed_region, crossed_zone) => {
               const swalIcon = (status_call === false && status_list === false) ? 'warning' : (status_call === false && status_list === true) ? 'error' : 'success';
               let text_title      = `รอบที่  ${roundIndex || 0}`;
               let text_content    = `
                   <table class="w-full text-left border-collapse">
                       <tr class="border-b">
                           <th class="w-[60%] py-2 text-gray-500">จำนวนที่เรียกบรรจุ :</th>
                           <td class="w-[40%] py-2 font-bold">${roundData?.total}</td>
                       </tr>
                       <tr class="border-b">
                           <th class="py-2 text-gray-500">ลำดับที่ :</th>
                           <td class="py-2 font-bold">${roundData?.start_end || 0}</td>
                       </tr>
                       <tr class="border-b">
                           <th class="py-2 text-gray-500">วันที่บรรจุ :</th>
                           <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                       </tr>
                       <tr>
                           <th class="py-2 text-gray-500">สถานะ:</th>
                           <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด' )  )}</td>
                       </tr>
                   </table>
                   <details class="group bg-gray-50 p-3 rounded-lg border border-gray-200">
                       <summary class="list-none font-semibold cursor-pointer flex justify-between items-center">
                           รายละเอียดเพิ่มเติม
                           <span class="group-open:rotate-180 transition-transform">▼</span>
                       </summary>
                       <div class="mt-3 pt-3 border-t border-gray-200 text-sm">
                           <table class="w-full text-lg text-left border-collapse">
                               <tr class="border-b">
                                   <th class="w-[60%] py-2 text-gray-500">เป็นการเรียกใช้บัญชีข้ามเขต :</th>
                                   <td class="w-[40%] py-2 font-bold">${status_cross === true ? 'ใช่' : 'ไม่ใช่' }</td>
                               </tr>
                               <tr class="border-b">
                                   <th class="py-2 text-gray-500">ภาค :</th>
                                   <td class="py-2 font-bold">${ crossed_region ? ( crossed_region === 1 ? 'ภาคเหนือ' : ( crossed_region === 2 ? 'ภาคกลาง' : ( crossed_region === 3 ? 'ภาคตะวันออกเฉียงเหนือ' : 'ภาคใต้' ) ) ) : '-' }</td>
                               </tr>
                               <tr class="border-b">
                                   <th class="py-2 text-gray-500">เขต :</th>
                                   <td class="py-2 font-bold">${ crossed_zone ? 'เขต ' + crossed_zone : '-' }</td>
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
                           <th class="w-[60%] py-2 text-gray-500">จำนวนที่เรียกบรรจุ :</th>
                           <td class="w-[40%] py-2 font-bold">-</td>
                       </tr>
                       <tr class="border-b">
                           <th class="py-2 text-gray-500">ลำดับที่ :</th>
                           <td class="py-2 font-bold">-</td>
                       </tr>
                       <tr class="border-b">
                           <th class="py-2 text-gray-500">วันที่บรรจุ :</th>
                           <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                       </tr>
                       <tr>
                           <th class="py-2 text-gray-500">สถานะ:</th>
                           <td class="py-2 font-bold">${roundData?.status == 'waiting' ? 'รอการบรรจุ' : (roundData?.status == 'completed' ? 'บรรจุแล้ว' : (roundData?.status == 'not-used' ? 'ไม่มีการเรียกใช้บัญชี' : 'บัญชีหมด' )  )}</td>
                       </tr>
                   </table>
               `.trim();
               } else if (status_call === false && status_list === true) {
                   status_call     = 'danger';
                   text_content    = `
                   <table class="w-full text-left border-collapse">
                       <tr class="border-b">
                           <th class="w-[60%] py-2 text-gray-500">จำนวนที่เรียกบรรจุ :</th>
                           <td class="w-[40%] py-2 font-bold">-</td>
                       </tr>
                       <tr class="border-b">
                           <th class="py-2 text-gray-500">ลำดับที่ :</th>
                           <td class="py-2 font-bold">-</td>
                       </tr>
                       <tr class="border-b">
                           <th class="py-2 text-gray-500">วันที่บรรจุ :</th>
                           <td class="py-2 font-bold">${formatDateThai(roundData?.date) || null}</td>
                       </tr>
                       <tr>
                           <th class="py-2 text-gray-500">สถานะ:</th>
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
               <td key={i} 
                   onClick={has_no_data ? () => handleCellClick( i + 1, posData.data_call_round?.[i + 1], status_call, status_list ) : undefined}
                   className={`relative w-[120px] min-w-[120px] p-4 text-center border-l font-bold ${bag_color}`}
               >
                   {posData.data_call_round?.[i+1]?.total || null}
               </td>
           );
       })}
       <td className=" w-[120px] min-w-[120px] sticky right-[120px] z-20 p-4 text-center bg-emerald-50 font-bold text-emerald-700 border-l-2 border-gray-600">{posData.total_call}</td>
       <td className=" w-[120px] min-w-[120px] sticky right-0 z-20 p-4 text-center font-bold bg-rose-50 text-rose-500">{posData.total_remain}</td>
    </motion.tr>
  );
}