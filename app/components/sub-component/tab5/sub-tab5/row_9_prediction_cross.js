
import { useState } from 'react';
import { UserSearch } from 'lucide-react';
import { Waiting } from '../../../Waiting';
import { Completed } from '../../../Completed';
import CountUp from 'react-countup';
import Swal from 'sweetalert2';

export default function Row7ChanceforEmpty({ region, zone, position, data }) {
    const status_work = data?.status_work || {};

    const summary = data?.summary || {};
    const sim_state = data?.sim_state || {};

    const max_round = data?.max_round || {};
    const round_columns = Array.from({ length: max_round }, (_, i) => i + 1);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [hoveredColIndex, setHoveredColIndex] = useState(null);

    const getProbabilityStatus = (cross, prob) => {
        if (prob === null || prob === undefined || cross === null || cross === undefined || cross === false) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'classes': 'bg-gray-100 border-gray-500 text-gray-600' };
        }
        const statusMap = [
            { min: 0, max: 20, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', 'classes': 'bg-rose-100 border-rose-500 text-rose-600' },
            { min: 20.1, max: 40, bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700', 'classes': 'bg-orange-100 border-orange-500 text-orange-600' },
            { min: 40.1, max: 60, bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700', 'classes': 'bg-amber-100 border-amber-500 text-amber-600' },
            { min: 60.1, max: 80, bg: 'bg-sky-100 border-sky-800', tx: 'text-sky-700', 'classes': 'bg-sky-100 border-sky-500 text-sky-600' },
            { min: 80.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', 'classes': 'bg-emerald-100 border-emerald-500 text-emerald-600' }
        ];
        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status || { 'bg': 'bg-rose-100 border-rose-800', 'tx': 'text-rose-700' };
    };

    const getCrossColor = (percent) => {
        if (!percent || percent <= 0) {
            return { bg: "bg-gray-100", text: "text-gray-600", bd: "border-gray-300" };
        }
        const level = Math.min(Math.max(Math.floor((percent - 1) / 10), 0), 9);
        const hueMap = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270];
        const hue = hueMap[level];
        const bgLightness = 90 - (level * 2);
        const textLightness = 30 - (level * 1);
        return {
            style: {
                backgroundColor: `hsl(${hue}, 70%, ${bgLightness}%)`,
                color: `hsl(${hue}, 80%, ${textLightness}%)`,
                borderColor: `hsl(${hue}, 60%, ${bgLightness - 10}%)`
            }
        };
    };

    const [mode, setMode] = useState(() => {
        if (typeof window === 'undefined') {
            return 'chance';
        }

        return localStorage.getItem('tab5_display_mode') || 'chance';
    });

    const switchMode = (newMode) => {
        setMode(newMode);
        localStorage.setItem('tab5_display_mode', newMode);
    };

    if (!summary && !max_round && !sim_state) return null;
    return (
        <div className="col-span-12 lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm">

            <div className="flex justify-center items-center">
                <div className="text-center mb-4 text-gray-700">
                    <div className="flex items-center">
                        <UserSearch />
                        <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                            สรุปวิเคราะห์แนวโน้มการเรียกบรรจุรายเขตและรอบการเรียก
                            {region && zone && position ? " " + position + " " + region + " " + zone : null}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center ml-auto">
                    <span className="text-gray-600 font-bold mr-3">แสดงค่า :</span>
                    <div className="flex p-1 bg-gray-200 rounded-lg w-fit my-4">
                        {['chance', 'impact'].map((m) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${mode === m ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-blue-500'
                                    }`}
                            >
                                {m === 'chance' ? 'โอกาสบรรจุ' : 'ผลกระทบข้ามเขต'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className={`flex-1 flex flex-col justify-center p-4 rounded-xl border-l-4  ${getProbabilityStatus(true, summary?.owner_probability)['bg']} my-2 shadow-xs`}>
                    <p className="text-gray-700 text-lg md:text-base lg:text-sm font-bold">โอกาสการได้รับการบรรจุของเขตตนเอง :</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className={`text-lg md:text-base lg:text-2xl font-bold ${getProbabilityStatus(true, summary?.owner_probability)['tx']}`}>
                            {
                                data ?
                                    (
                                        <div className="text-lg md:text-base lg:text-5xl">
                                            <CountUp
                                                end={summary?.owner_probability}
                                                duration={3}
                                                separator=","
                                                decimals={2}
                                                useEasing={true}
                                                suffix={'%'}
                                            />
                                        </div>
                                    )
                                    : '\u00A0\u00A0'
                            }
                        </span>
                    </div>
                </div>
                <div className={`flex-1 flex flex-col justify-center p-4 rounded-xl border-l-4  ${getProbabilityStatus(summary?.highest_other_probability?.status, summary?.highest_other_probability?.probability)['bg']} my-2 shadow-xs`}>
                    <p className="text-gray-700 text-lg md:text-base lg:text-sm font-bold">โอกาสการได้รับการบรรจุข้ามเขต :</p>
                    <div className="items-baseline gap-2 text-right">
                        <span className={`text-lg md:text-base lg:text-2xl font-bold ${getProbabilityStatus(summary?.highest_other_probability?.status, summary?.highest_other_probability?.probability)['tx']}`}>
                            {
                                data ?
                                    (
                                        <div className="text-lg md:text-base lg:text-5xl">
                                            <span className={`px-5 text-lg md:text-base lg:text-2xl font-bold ${getProbabilityStatus(summary?.highest_other_probability?.status, summary?.highest_other_probability?.probability)['tx']}`}>
                                                [
                                                <span className="mx-2">{summary?.highest_other_probability?.region || null}</span>
                                                ]
                                            </span>
                                            <CountUp
                                                end={summary?.highest_other_probability?.probability}
                                                duration={3}
                                                separator=","
                                                decimals={2}
                                                useEasing={true}
                                                suffix={'%'}
                                            />
                                        </div>
                                    )
                                    : '\u00A0\u00A0'
                            }
                        </span>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
                <div className="flex-1 min-h-[400px] max-h-[800px] overflow-x-auto">
                    {
                        !data ? (<Waiting />) : (
                            status_work === 'completed'
                                ? (
                                    <Completed />
                                )
                                : (
                                    <table className="w-full h-full overflow-y-auto text-left border-collapse whitespace-nowrap">
                                        <thead className="text-gray-600 text-sm">
                                            <tr className="border-b-2 border-gray-600">
                                                <th className="sticky top-0 left-[0] z-40 bg-gray-100 !w-[15%] px-6 py-4 text-sm md:text-base lg:text-ls font-semibold">รายเขต \ ระยะการเรียก</th>
                                                <th className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">สถานะเปิดสอบ</th>
                                                <th className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">ขึ้นบัญชี</th>
                                                <th className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">เรียกแล้ว</th>
                                                <th className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">คงเหลือ</th>
                                                <th className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">จำนวนรอบ</th>
                                                <th className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">เฉลี่ยต่อรอบ</th>
                                                <th className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">โอกาสบรรจุ</th>
                                                {round_columns.map(item => {
                                                    return (
                                                        <th key={item} className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">{item}</th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(sim_state).map(region => {
                                                return (
                                                    Object.values(region).map((zone) => {
                                                        const rowId = `${zone.main_id}-${zone.sub_id}`;
                                                        const data_round = zone?.data_round || {};
                                                        return (
                                                            <tr key={rowId} className="text-gray-600">
                                                                <td className={`sticky left-[0] z-40 bg-gray-50 px-3 py-4 text-sm md:text-base lg:text-ls font-semibold`}>
                                                                    {zone?.full_name}
                                                                </td>
                                                                <td className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 ${zone?.status_open === true ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'} `}>
                                                                    {zone?.status_open === true ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}
                                                                </td>
                                                                <td className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 ${zone?.status_open === true ? 'bg-amber-50 text-amber-600' : 'bg-rose-100 text-rose-600'} `}>
                                                                    {zone?.total_listed.toLocaleString()}
                                                                </td>
                                                                <td className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 ${zone?.status_open === true ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-100 text-rose-600'} `}>
                                                                    {zone?.total_called.toLocaleString()}
                                                                </td>
                                                                <td className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 ${zone?.status_open === true ? 'text-gray-600' : 'bg-rose-100 text-rose-600'} `}>
                                                                    {zone?.total_remain.toLocaleString()}
                                                                </td>
                                                                <td className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 ${zone?.status_open === true ? 'bg-green-50 text-green-600' : 'bg-rose-100 text-rose-600'} `}>
                                                                    {zone?.round.toLocaleString()}
                                                                </td>
                                                                <td className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 ${zone?.status_open === true ? 'bg-slate-50 text-slate-600' : 'bg-rose-100 text-rose-600'} `}>
                                                                    {zone?.avg.toLocaleString()}
                                                                </td>
                                                                <td className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 ${getProbabilityStatus(true, zone?.probability)['classes']}`}>
                                                                    {zone?.probability.toFixed(2) + "%"}
                                                                </td>
                                                                {Object.values(data_round).map((round, index) => {
                                                                    console.log(round);
                                                                    const isHoveredCell = hoveredRowId === rowId && hoveredColIndex === index;
                                                                    const colorStyle = getCrossColor(mode === 'chance' ? round.reach_probability : round.cross_zone_effect);
                                                                    const handleCellClick = (data) => {
                                                                        let text_title = `รอบที่คาดการณ์ ${data.round}`;
                                                                        let text_content = `
                                                                            <table class="w-full text-left border-collapse">
                                                                                <tr class="border-b">
                                                                                    <th class="w-[60%] py-3 font-bold text-gray-500">จำนวนที่คาดว่าจะเรียก :</th>
                                                                                    <td class="w-[40%] py-3 font-bold">${data.called.toLocaleString()}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-3 font-bold text-gray-500">จำนวนคงเหลือโดยประมาณ :</th>
                                                                                    <td class="py-3 font-bold">${data.remain.toLocaleString()}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-3 font-bold text-gray-500">สถานะการยืมบัญชี (จำลอง) :</th>
                                                                                    <td class="py-3 font-bold">${data.is_borrowed ? 'ยืมบัญชี' : 'ไม่ยืมบัญชี'}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-3 font-bold text-gray-500">ความน่าจะเป็นในการเรียกถึง :</th>
                                                                                    <td class="py-3 font-bold">${data.reach_probability.toFixed(2) + "%"}</td>
                                                                                </tr>
                                                                                <tr class="border-b">
                                                                                    <th class="py-3 font-bold text-gray-500">ค่าผลกระทบข้ามเขต :</th>
                                                                                    <td class="py-3 font-bold">${data.cross_zone_effect.toFixed(2) + "%"}</td>
                                                                                </tr>
                                                                            </table>
                                                                        `.trim();
                                                                        Swal.fire({
                                                                            title: text_title,
                                                                            html: text_content,
                                                                            icon: 'info',
                                                                            confirmButtonText: 'ตกลง',
                                                                            confirmButtonColor: '#10b981'
                                                                        });
                                                                    };
                                                                    return (
                                                                        <td
                                                                            onMouseEnter={() => { setHoveredRowId(rowId); setHoveredColIndex(index); }}
                                                                            onMouseLeave={() => { setHoveredRowId(null); setHoveredColIndex(null); }}
                                                                            key={`${zone.main_id}-${zone.sub_id}-${index}-${round.round}`}
                                                                            onClick={() => handleCellClick(round)}
                                                                            className={`z-30 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200 cursor-pointer
                                                                                ${isHoveredCell ? '!bg-indigo-50 !text-indigo-600 z-10 shadow-[inset_0_0_0_3px_#4338ca]' : ''}
                                                                                `}
                                                                            style={colorStyle.style}>
                                                                            {(mode === 'chance' ? round?.reach_probability : round?.cross_zone_effect).toFixed(2) + "%"}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )
                        )
                    }
                </div>
            </div>
        </div >
    );
}