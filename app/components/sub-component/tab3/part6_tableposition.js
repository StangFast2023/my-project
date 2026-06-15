import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Zap, Search, OctagonAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingScreen from '../../LoadingScreen';
import Select, { components } from 'react-select';
const typeStyles = {
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
    3: "bg-yellow-100 text-yellow-700"
};

const CustomOption = (props) => (
    <components.Option {...props}>
        <div className="flex items-center">
            <span className="font-bold mr-2 text-gray-700">[ {props.data.pos_id} ]</span>
            <span className="text-gray-700">{props.data.label}</span>
            <span className={`ml-auto px-4 py-1 rounded-full font-bold shadow-sm ${typeStyles[props.data.type_id]}`}>
                {props.data.type_name}
            </span>
        </div>
    </components.Option>
);

export default function T2P7_TableAllType({ data }) {
    const data_select = useMemo(() => {
        return data?.tab3?.part6 || {};
    }, [data?.tab3?.part6]);


    const options = Object.values(data_select).map(item => ({
        value: item.pos_id,
        label: `${item.pre_name || ''}${item.pos_name || ''}${item.suf_name || ''}`,
        pos_id: item.pos_id,
        type_id: item.type_id,
        type_name: item.type_name,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedOption, setSelectedOption] = useState(() => {
        const savedOption = localStorage.getItem('selectedPos');
        if (!savedOption) return null;
        try {
            const parsed = JSON.parse(savedOption);
            setSearchTerm(parsed ? parsed.label : '');
            return parsed;
        } catch (e) {
            console.error("Error parsing localStorage:", e);
            return null;
        }
    });

    useEffect(() => {
        if (!selectedOption) return;
        const controller = new AbortController();
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://dla-backend-production.up.railway.app/api/updating-tab3-part6/${selectedOption.value}`, {
                    signal: controller.signal
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                setTableData(result);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
        return () => controller.abort();
    }, [selectedOption]);
    const handleSelect = (option) => {
        setSelectedOption(option);
        if (option) {
            localStorage.setItem('selectedPos', JSON.stringify(option));
        } else {
            localStorage.removeItem('selectedPos');
        }
    };
    const filteredData = selectedOption
        ? Object.values(data_select).filter(item => item.pos_id === selectedOption.value)
        : [];
    const displayData = selectedOption ? tableData : [];

    const max_rounds_all_zones = Math.max(...Object.values(displayData).map(zone => zone.total_round));
    const max_rounds = Math.max(10, max_rounds_all_zones);
    const round_columns = Array.from({ length: max_rounds }, (_, i) => i + 1);

    let summary = { total_listed: 0, total_called: 0, total_remain: 0, rounds: {} };
    if (displayData && Object.keys(displayData).length > 0) {
        summary = Object.values(displayData).reduce((acc, curr) => {
            acc.total_listed += (Number(curr.total_listed) || 0);
            acc.total_called += (Number(curr.total_called) || 0);
            acc.total_remain += (Number(curr.total_remain) || 0);

            if (curr.data_round) {
                Object.values(curr.data_round).forEach(roundly => {
                    const r = roundly.round;
                    acc.rounds[r] = (acc.rounds[r] || 0) + (Number(roundly.total) || 0);
                });
            }
            return acc;
        }, { total_listed: 0, total_called: 0, total_remain: 0, rounds: {} });
    }
    const percent = (summary?.total_listed > 0) ? (summary.total_called / summary.total_listed) * 100 : 0;
    if (!data) return <LoadingScreen />;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center mb-5">
                <div className="text-center mb-2">
                    <h3 className="flex text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        <Zap />
                        <span className="ml-2">วิเคราะห์ตำแหน่งเชิงพื้นที่</span>
                    </h3>
                </div>
                <div className="flex gap-4 ml-auto">
                    <div className="w-[600px]">
                        <Select
                            options={options}
                            components={{ Option: CustomOption }}
                            value={filteredData}
                            onChange={handleSelect}
                            placeholder="ค้นหาตำแหน่ง..."
                            isSearchable
                            isClearable
                            className="w-full"
                            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            formatOptionLabel={(item) => (
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-700">[{item.pos_id}]</span>
                                    <span className="text-gray-700">{`${item.pre_name || ''}${item.pos_name || ''}${item.suf_name || ''}`}</span>
                                    <span className={`ml-auto px-4 py-1 rounded-full font-bold shadow-sm ${typeStyles[item.type_id]}`}>{item.type_name}</span>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
                <div className="flex-1 min-h-auto max-h-[1000px] overflow-y-hidden overflow-x-auto">
                    {
                        Object.values(displayData).length > 0
                            ? (
                                isLoading === true ? (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-[#FFFFFF]">
                                        <div className="w-25 h-25 border-15 border-gray-200 border-t-sky-600 rounded-full animate-spin"></div>
                                        <p className="mt-10 text-3xl text-600 font-kanit text-gray-800 animate-pulse">กำลังประมวลข้อมูล...</p>
                                    </div>
                                ) : (
                                    <div className="verflow-y-auto">

                                        <table className="min-w-[1400px] w-full border-collapse whitespace-nowrap text-left">
                                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                                <tr>
                                                    <th className="bg-gray-50    px-4 py-4 text-sm md:text-base lg:text-lg font-bold sticky left-[0] z-30">ภาค - เขต</th>
                                                    <th className="bg-amber-50   px-4 py-4 text-sm md:text-base lg:text-lg font-bold text-center">สถานะเปิดสอบ</th>
                                                    <th className="bg-amber-50   px-4 py-4 text-sm md:text-base lg:text-lg font-bold text-center">ขึ้นบัญชี</th>
                                                    <th className="bg-emerald-50 px-4 py-4 text-sm md:text-base lg:text-lg font-bold text-center text-emerald-700">เรียกแล้ว</th>
                                                    <th className="bg-blue-50    px-4 py-4 text-sm md:text-base lg:text-lg font-bold text-center text-blue-700">ความคืบหน้า</th>
                                                    <th className="bg-rose-50    px-4 py-4 text-sm md:text-base lg:text-lg font-bold text-center text-rose-500">คงเหลือ</th>
                                                    {round_columns.map(num => (
                                                        <th key={num} className="bg-amber-50/30 px-4 py-2 text-sm md:text-base lg:text-lg font-bold text-center">รอบ {num}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.values(displayData).map((item, key) => {
                                                    const full_key = item.full_key_province;
                                                    const status_open = item.status_open;
                                                    const full_name_province = item.full_name_province;
                                                    const total_listed = status_open === true ? item.total_listed : '';
                                                    const total_called = status_open === true ? item.total_called : '';
                                                    const total_remain = status_open === true ? item.total_remain : '';
                                                    const total_process = status_open === true ? ((total_called / total_listed) * 100) : '';
                                                    return (
                                                        <tr key={full_key}>
                                                            <td className="bg-gray-50    px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-left   text-gray-700 sticky left-0 z-10">{full_name_province}</td>
                                                            <td className={`px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-gray-700 ${status_open === true ? 'bg-blue-100' : 'bg-rose-100'}`}>{status_open === true ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}</td>
                                                            <td className="bg-amber-50   px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-gray-500">{total_listed.toLocaleString()}</td>
                                                            <td className="bg-emerald-50 px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-emerald-600">{total_called.toLocaleString()}</td>
                                                            <td className="bg-blue-50    px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-blue-600">{total_process ? total_process.toFixed(2) + " %" : ''}</td>
                                                            <td className="bg-rose-50    px-4 py-4 text-sm md:text-base lg:text-lg font-semibold text-center text-rose-500">{total_remain.toLocaleString()}</td>
                                                            {round_columns.map(num => {
                                                                const data_round = item?.data_round[num] || {};
                                                                const has_data = Object.values(data_round).length > 0;
                                                                const call_status = data_round?.call_status;
                                                                const status_list = data_round?.list_status;
                                                                const getBagColor = (has_data, call_status, status_list) => {
                                                                    if (!has_data) return 'cursor-default';
                                                                    if (call_status === true) {
                                                                        return 'cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 hover:border-b-emerald-300';
                                                                    }
                                                                    if (call_status === false && status_list === false) {
                                                                        return 'cursor-pointer hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200 hover:border-b-amber-300';
                                                                    }
                                                                    return 'cursor-pointer hover:bg-rose-50 hover:text-rose-700 transition-colors duration-200 hover:border-b-rose-300';
                                                                };
                                                                const bag_color = getBagColor(has_data, call_status, status_list);

                                                                const getButtonColor = (has_data, call_status, status_list) => {
                                                                    if (!has_data) return 'cursor-default';
                                                                    if (call_status === true) {
                                                                        return 'bg-emerald-50/90 py-1 text-emerald-800';
                                                                    }
                                                                    if (call_status === false && status_list === false) {
                                                                        return 'bg-amber-50/90 py-1 text-amber-800 ';
                                                                    }
                                                                    return 'bg-rose-50/90 py-1 text-rose-800';
                                                                };
                                                                const button_color = getButtonColor(has_data, call_status, status_list);
                                                                const handleCellClick = (each_round_data) => {

                                                                    const call_status = each_round_data.call_status;
                                                                    const list_status = each_round_data.list_status;

                                                                    const total = each_round_data.total;
                                                                    const status_cross = each_round_data.is_cross_region;
                                                                    const crossed_region = status_cross ? each_round_data.crossed_region : '';
                                                                    const crossed_zone = status_cross ? each_round_data.crossed_zone : '';

                                                                    const call_date = call_status ? each_round_data.call_date : '-';
                                                                    const called_rank = call_status ? each_round_data.start_end : '-';
                                                                    const percent_change = call_status ? each_round_data.percent_change : '';
                                                                    const proportion_used = call_status ? each_round_data.proportion_used.toFixed(2) + " %" : '-';
                                                                    const status_work = each_round_data.status_work;
                                                                    const status_work_text = status_work === 'waiting' ? 'รอการเรียกบรรจุ' : (status_work === 'not-used' ? 'ไม่มีการใช้บัญชี' : (status_work === 'exhaustion' ? 'บัญชีสิ้นสุด' : 'ได้รับการบรรจุแล้ว'))


                                                                    const swalIcon = (call_status === false && list_status === false) ? 'warning' : (call_status === false && list_status === true) ? 'error' : 'success';
                                                                    const getChangeUI = (each_round_data) => {
                                                                        if (each_round_data.round === 1) {
                                                                            return { text: 'รอบเริ่มต้น', color: 'text-green-500' };
                                                                        }
                                                                        if (each_round_data.call_status === false && each_round_data.list_status === false) {
                                                                            return { text: 'สิ้นสุดการเรียกบรรจุ', color: 'text-gray-500' };
                                                                        }
                                                                        if (each_round_data.percent_change === null || each_round_data.percent_change === undefined) {
                                                                            return { text: '-', color: 'text-gray-500' };
                                                                        }
                                                                        const val = percent_change;
                                                                        const formatted = Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                                        console.log(percent_change);
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
                                                                    const ui = getChangeUI(each_round_data, item);
                                                                    const iconSvg = {
                                                                        'trending-up': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
                                                                        'trending-down': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>',
                                                                        'minus': '<svg class="w-5 h-5 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                                                                    }[ui?.icon] || '';
                                                                    let text_title = `รอบที่  ${each_round_data.round || 0}`;
                                                                    let text_content = `
                                                                            <table class="w-full text-left border-collapse">
                                                                                <tr class="border-b">
                                                                                    <th class="w-[60%] py-2 font-bold text-gray-500">จำนวนที่เรียกบรรจุ :</th>
                                                                                    <td class="w-[40%] py-2 font-bold">${total.toLocaleString()}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-2 font-bold text-gray-500">ลำดับที่ :</th>
                                                                                    <td class="py-2 font-bold">${called_rank}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-2 font-bold text-gray-500">วันที่บรรจุ :</th>
                                                                                    <td class="py-2 font-bold">${call_date}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-2 font-bold text-gray-500">สถานะ:</th>
                                                                                    <td class="py-2 font-bold">${status_work_text}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-2 font-bold text-gray-500">อัตราการเปลี่ยนแปลง :</th>
                                                                                    <td class="py-2 font-bold ${ui.color}">${iconSvg}${ui.text}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-2 font-bold text-gray-500">สัดส่วนการใช้บัญชี :</th>
                                                                                    <td class="py-2 font-bold">${proportion_used}</td>
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
                                                                                            <td class="py-2 font-bold">${crossed_region ? (crossed_region === 1 ? 'ภาคเหนือ' : (crossed_region === 2 ? 'ภาคกลาง' : (crossed_region === 3 ? 'ภาคตะวันออกเฉียงเหนือ' : 'ภาคใต้'))) : '-'}</td>
                                                                                        </tr>
                                                                                        <tr class="border-b">
                                                                                            <th class="py-2 font-bold text-gray-500">เขต :</th>
                                                                                            <td class="py-2 font-bold">${crossed_zone ? 'เขต ' + crossed_zone : '-'}</td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </div>
                                                                            </details>
                                                                        `.trim();
                                                                    Swal.fire({
                                                                        title: text_title,
                                                                        html: text_content,
                                                                        icon: swalIcon,
                                                                        confirmButtonText: 'ตกลง',
                                                                        confirmButtonColor: '#10b981',
                                                                    });
                                                                };
                                                                return (
                                                                    <td
                                                                        key={num}
                                                                        onClick={has_data ? () => handleCellClick(data_round) : undefined}
                                                                        className={`px-4 py-4 relative group text-center ${Object.values(data_round).length > 0 && status_list === true ? bag_color : 'bg-gray-200/50'} `}
                                                                    >
                                                                        {
                                                                            status_list === true ?
                                                                                (
                                                                                    <>
                                                                                        {has_data ? (
                                                                                            <div className={`transition-transform duration-300 group-hover:-translate-y-2 `}>
                                                                                                <span className={`font-bold ${call_status === true ? 'text-gray-600' : 'text-rose-600'}`}>
                                                                                                    {data_round.total.toLocaleString()}
                                                                                                </span>
                                                                                            </div>
                                                                                        ) : null}
                                                                                        {has_data && (
                                                                                            <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out ${button_color} `}>
                                                                                                <div className="flex items-center gap-1 text-[10px] font-medium">
                                                                                                    <Search size={10} />
                                                                                                    <span>รายละเอียด</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                ) : null
                                                                        }

                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>

                                            <tfoot className="sticky bottom-0 z-20 bg-[#2d3446] text-white">
                                                <tr>
                                                    <td colSpan={2} className="sticky left-0 bottom-0 z-40 py-2 text-center font-semibold">รวมทั้งหมดทุกภาค</td>
                                                    <td className="sticky left-0 bottom-0 z-40 py-2 text-center font-semibold">{summary.total_listed.toLocaleString()}</td>
                                                    <td className="sticky left-0 bottom-0 z-40 py-2 text-center font-semibold">{summary.total_called.toLocaleString()}</td>
                                                    <td className="sticky left-0 bottom-0 z-40 py-2 text-center font-semibold">{percent ? percent.toFixed(2) + " %" : ''}</td>
                                                    <td className="sticky left-0 bottom-0 z-40 py-2 text-center font-semibold">{summary.total_remain.toLocaleString()}</td>
                                                    {Object.values(summary.rounds).map((num, index) => (
                                                        <td key={index} className="sticky left-0 bottom-0 z-40 py-2 text-center font-semibold">{num ? num.toLocaleString() : ''}</td>
                                                    ))}
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        <OctagonAlert size={150} />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-500">กรุณาเลือกตำแหน่งเพื่อแสดงข้อมูล</h3>
                                </div>
                            )
                    }
                </div>
            </div >
        </motion.div >
    );
}