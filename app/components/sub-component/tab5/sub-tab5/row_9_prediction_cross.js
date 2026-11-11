
import { useState, useRef } from 'react';
import { UserSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { Waiting } from '../../../Waiting';
import { Completed } from '../../../Completed';
import CountUp from 'react-countup';
import Swal from 'sweetalert2';

export default function Row7ChanceforEmpty({ region, zone, position, data }) {
    const status_work = data?.status_work || {};
    const summary = data?.summary || {};
    const sim_state = data?.sim_state || {};
    const max_round = data?.max_round || 0;
    const zoneTouchStart = useRef({ x: 0, y: 0 });
    const roundTouchStart = useRef({ x: 0, y: 0 });
    const round_columns = Array.from(
        { length: max_round },
        (_, i) => i + 1
    );
    const [roundSlide, setRoundSlide] = useState({});
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [hoveredColIndex, setHoveredColIndex] = useState(null);
    const [mobileSlide, setMobileSlide] = useState(0);
    const [mode, setMode] = useState(() => {
        if (typeof window === 'undefined') return 'chance';
        return localStorage.getItem('tab5_display_mode') || 'chance';
    });
    const switchMode = (newMode) => {
        setMode(newMode);
        localStorage.setItem('tab5_display_mode', newMode);
    };
    const getProbabilityStatus = (cross, prob) => {
        if (
            prob === null ||
            prob === undefined ||
            cross === null ||
            cross === undefined ||
            cross === false
        ) {
            return {
                bg: 'bg-gray-100 border-gray-500',
                tx: 'text-gray-600',
                classes: 'bg-gray-100 border-gray-500 text-gray-600'
            };
        }
        const statusMap = [
            { min: 0, max: 20, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', classes: 'bg-rose-100 border-rose-500 text-rose-600' },
            { min: 20.1, max: 40, bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700', classes: 'bg-orange-100 border-orange-500 text-orange-600' },
            { min: 40.1, max: 60, bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700', classes: 'bg-amber-100 border-amber-500 text-amber-600' },
            { min: 60.1, max: 80, bg: 'bg-sky-100 border-sky-800', tx: 'text-sky-700', classes: 'bg-sky-100 border-sky-500 text-sky-600' },
            { min: 80.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', classes: 'bg-emerald-100 border-emerald-500 text-emerald-600' }
        ];
        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status || {
            bg: 'bg-rose-100 border-rose-800',
            tx: 'text-rose-700',
            classes: 'bg-rose-100 border-rose-500 text-rose-600'
        };
    };
    const getCrossColor = (percent) => {
        if (!percent || percent <= 0) {
            return {
                style: {
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    border: '1px solid #d1d5db'
                }
            };
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
                border: `1px solid hsl(${hue}, 60%, ${bgLightness - 10}%)`
            }
        };
    };

    const mobileZones = Object.values(sim_state).flatMap(regionData =>
        Object.values(regionData || {})
    );
    const handleCellClick = (round) => {
        const text_title = `รอบที่คาดการณ์ ${round.round}`;
        const text_content = `
        <div class="w-full overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm sm:text-base">
                <tbody>
                    <tr class="border-b">
                        <th class="w-[65%] py-2 sm:py-3 pr-2 font-semibold text-gray-500 text-xs sm:text-sm">
                            จำนวนที่คาดว่าจะเรียก :
                        </th>
                        <td class="w-[35%] py-2 sm:py-3 font-bold text-gray-800 text-right whitespace-nowrap">
                            ${round.called.toLocaleString()}
                        </td>
                    </tr>
                    <tr class="border-b">
                        <th class="py-2 sm:py-3 pr-2 font-semibold text-gray-500 text-xs sm:text-sm">
                            จำนวนคงเหลือโดยประมาณ :
                        </th>
                        <td class="py-2 sm:py-3 font-bold text-gray-800 text-right whitespace-nowrap">
                            ${round.remain.toLocaleString()}
                        </td>
                    </tr>
                    <tr class="border-b">
                        <th class="py-2 sm:py-3 pr-2 font-semibold text-gray-500 text-xs sm:text-sm">
                            สถานะการยืมบัญชี (จำลอง) :
                        </th>
                        <td class="py-2 sm:py-3 font-bold text-gray-800 text-right whitespace-nowrap text-xs sm:text-sm">
                            ${round.is_borrowed ? 'ยืมบัญชี' : 'ไม่ยืมบัญชี'}
                        </td>
                    </tr>
                    <tr class="border-b">
                        <th class="py-2 sm:py-3 pr-2 font-semibold text-gray-500 text-xs sm:text-sm">
                            ความน่าจะเป็นในการเรียกถึง :
                        </th>
                        <td class="py-2 sm:py-3 font-bold text-gray-800 text-right whitespace-nowrap">
                            ${round.reach_probability.toFixed(2)}%
                        </td>
                    </tr>
                    <tr>
                        <th class="py-2 sm:py-3 pr-2 font-semibold text-gray-500 text-xs sm:text-sm">
                            ค่าผลกระทบข้ามเขต :
                        </th>
                        <td class="py-2 sm:py-3 font-bold text-gray-800 text-right whitespace-nowrap">
                            ${round.cross_zone_effect.toFixed(2)}%
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `.trim();

        Swal.fire({
            title: text_title,
            html: text_content,
            icon: 'info',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#10b981',
            width: 'min(92%, 500px)',
            padding: '1rem',
            customClass: {
                title: 'text-base sm:text-xl',
                htmlContainer: 'text-sm sm:text-base',
                confirmButton: 'text-sm sm:text-base px-6'
            }
        });
    };
    const previousSlide = () => {
        setMobileSlide(prev => Math.max(0, prev - 1));
    };
    const nextSlide = () => {
        setMobileSlide(prev => Math.min(mobileZones.length - 1, prev + 1));
    };
    const handleZoneTouchStart = (e) => {
        zoneTouchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };
    const handleZoneTouchEnd = (e) => {
        const diffX = zoneTouchStart.current.x - e.changedTouches[0].clientX;
        const diffY = zoneTouchStart.current.y - e.changedTouches[0].clientY;

        if (Math.abs(diffX) < 50 || Math.abs(diffY) > Math.abs(diffX)) return;

        if (diffX > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    };
    const handleRoundTouchStart = (e) => {
        e.stopPropagation();

        roundTouchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };
    const handleRoundTouchEnd = (e, rounds, slideKey) => {
        e.stopPropagation();

        const diffX = roundTouchStart.current.x - e.changedTouches[0].clientX;
        const diffY = roundTouchStart.current.y - e.changedTouches[0].clientY;

        if (Math.abs(diffX) < 50 || Math.abs(diffY) > Math.abs(diffX)) return;

        setRoundSlide(prev => {
            const current = prev[slideKey] || 0;

            return {
                ...prev,
                [slideKey]: Math.max(
                    0,
                    Math.min(rounds.length - 1, current + (diffX > 0 ? 1 : -1))
                )
            };
        });
    };
    if (!summary && !max_round && !sim_state) return null;
    return (
        <div className="col-span-12 min-w-0 w-full bg-white p-3 md:p-4 rounded-2xl shadow-sm">


            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                <div className="flex items-start gap-2 text-gray-700">
                    <UserSearch className="shrink-0 mt-0.5" />
                    <h3 className="text-sm md:text-base lg:text-lg font-bold leading-relaxed">
                        สรุปวิเคราะห์แนวโน้มการเรียกบรรจุรายเขตและรอบการเรียก
                        {region && zone && position ? ` ${position} ${region} ${zone}` : null}
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className={`flex flex-col justify-between p-3 sm:p-4 rounded-xl border-l-4 ${getProbabilityStatus(true, summary?.owner_probability).bg} shadow-xs min-w-0`}>
                    <p className="text-gray-700 text-sm md:text-base lg:text-sm font-bold leading-relaxed">
                        โอกาสการได้รับการบรรจุของเขตตนเอง :
                    </p>

                    <div className="text-right mt-2">
                        <span className={`text-2xl sm:text-3xl font-bold ${getProbabilityStatus(true, summary?.owner_probability).tx}`}>
                            {data ? (
                                <CountUp
                                    end={summary?.owner_probability || 0}
                                    duration={3}
                                    separator=","
                                    decimals={2}
                                    useEasing
                                    suffix="%"
                                />
                            ) : '\u00A0\u00A0'}
                        </span>
                    </div>
                </div>

                <div className={`flex flex-col justify-between p-3 sm:p-4 rounded-xl border-l-4 ${getProbabilityStatus(summary?.highest_other_probability?.status, summary?.highest_other_probability?.probability).bg} shadow-xs min-w-0`}>
                    <p className="text-gray-700 text-sm md:text-base lg:text-sm font-bold leading-relaxed">
                        โอกาสการได้รับการบรรจุข้ามเขต :
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-1 sm:gap-2 text-right mt-2 min-w-0">
                        <span className={`text-sm sm:text-base font-bold break-words ${getProbabilityStatus(summary?.highest_other_probability?.status, summary?.highest_other_probability?.probability).tx}`}>
                            {summary?.highest_other_probability?.region || '-'}
                        </span>

                        <span className={`text-2xl sm:text-3xl lg:text-5xl font-bold ${getProbabilityStatus(summary?.highest_other_probability?.status, summary?.highest_other_probability?.probability).tx}`}>
                            {data ? (
                                <CountUp
                                    end={summary?.highest_other_probability?.probability || 0}
                                    duration={3}
                                    separator=","
                                    decimals={2}
                                    useEasing
                                    suffix="%"
                                />
                            ) : '\u00A0\u00A0'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="my-3 flex w-full lg:w-auto lg:items-center lg:justify-end gap-2 lg:gap-3 flex-col lg:flex-row">
                <span className="text-gray-600 text-xs sm:text-sm font-bold hidden md:block lg:block">
                    แสดงค่า :
                </span>

                <div className="flex w-full lg:w-fit p-1 bg-gray-100 border border-gray-200 rounded-xl gap-1">
                    {['chance', 'impact'].map(m => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${mode === m
                                ? 'bg-white shadow-sm text-blue-600 border border-gray-200'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-white/60'
                                }`}
                        >
                            {m === 'chance' ? 'โอกาสบรรจุ' : 'ผลกระทบข้ามเขต'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="hidden lg:block mt-4 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
                <div className="min-w-0 min-h-[400px] max-h-[800px] overflow-auto">

                    {!data ? (
                        <Waiting />
                    ) : status_work === 'completed' ? (
                        <Completed />
                    ) : (
                        <table className="w-full h-full text-left border-collapse whitespace-nowrap">
                            <thead className="text-gray-600 text-sm">
                                <tr className="border-b-2 border-gray-600">
                                    <th className="sticky top-0 left-0 z-40 bg-gray-100 min-w-[180px] px-6 py-4 font-semibold">
                                        รายเขต \ ระยะการเรียก
                                    </th>
                                    {[
                                        'สถานะเปิดสอบ',
                                        'ขึ้นบัญชี',
                                        'เรียกแล้ว',
                                        'คงเหลือ',
                                        'จำนวนรอบ',
                                        'เฉลี่ยต่อรอบ',
                                        'โอกาสบรรจุ'
                                    ].map(title => (
                                        <th key={title} className="sticky top-0 z-30 bg-white px-4 py-4 text-center font-semibold">
                                            {title}
                                        </th>
                                    ))}

                                    {round_columns.map(item => (
                                        <th key={item} className="sticky top-0 z-30 bg-white px-4 py-4 text-center font-semibold">
                                            {item}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {Object.values(sim_state).map(regionData =>
                                    Object.values(regionData || {}).map(zoneData => {
                                        const rowId = `${zoneData.main_id}-${zoneData.sub_id}`;
                                        const data_round = zoneData?.data_round || {};

                                        return (
                                            <tr key={rowId} className="text-gray-600">
                                                <td className="sticky left-0 z-40 bg-gray-50 px-3 py-4 font-semibold">
                                                    {zoneData?.full_name}
                                                </td>

                                                <td className={`px-3 py-4 text-center font-semibold ${zoneData?.status_open === true ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {zoneData?.status_open === true ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}
                                                </td>

                                                <td className={`px-3 py-4 text-center font-semibold ${zoneData?.status_open === true ? 'bg-amber-50 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {zoneData?.total_listed?.toLocaleString()}
                                                </td>

                                                <td className={`px-3 py-4 text-center font-semibold ${zoneData?.status_open === true ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {zoneData?.total_called?.toLocaleString()}
                                                </td>

                                                <td className={`px-3 py-4 text-center font-semibold ${zoneData?.status_open === true ? 'text-gray-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {zoneData?.total_remain?.toLocaleString()}
                                                </td>

                                                <td className={`px-3 py-4 text-center font-semibold ${zoneData?.status_open === true ? 'bg-green-50 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {zoneData?.round?.toLocaleString()}
                                                </td>

                                                <td className={`px-3 py-4 text-center font-semibold ${zoneData?.status_open === true ? 'bg-slate-50 text-slate-600' : 'bg-rose-100 text-rose-600'}`}>
                                                    {zoneData?.avg?.toLocaleString()}
                                                </td>

                                                <td className={`px-3 py-4 text-center font-semibold ${getProbabilityStatus(true, zoneData?.probability).classes}`}>
                                                    {zoneData?.probability?.toFixed(2)}%
                                                </td>

                                                {Object.values(data_round).map((round, index) => {
                                                    const isHoveredCell = hoveredRowId === rowId && hoveredColIndex === index;
                                                    const colorStyle = getCrossColor(
                                                        mode === 'chance'
                                                            ? round.reach_probability
                                                            : round.cross_zone_effect
                                                    );

                                                    return (
                                                        <td
                                                            key={`${zoneData.main_id}-${zoneData.sub_id}-${index}-${round.round}`}
                                                            onMouseEnter={() => {
                                                                setHoveredRowId(rowId);
                                                                setHoveredColIndex(index);
                                                            }}
                                                            onMouseLeave={() => {
                                                                setHoveredRowId(null);
                                                                setHoveredColIndex(null);
                                                            }}
                                                            onClick={() => handleCellClick(round)}
                                                            className={`px-3 py-4 text-center font-semibold cursor-pointer transition-all duration-200 ${isHoveredCell
                                                                ? '!bg-indigo-50 !text-indigo-600 shadow-[inset_0_0_0_3px_#4338ca]'
                                                                : ''
                                                                }`}
                                                            style={colorStyle.style}
                                                        >
                                                            {(mode === 'chance'
                                                                ? round?.reach_probability
                                                                : round?.cross_zone_effect
                                                            )?.toFixed(2)}%
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="lg:hidden mt-4 min-w-0">
                {!data ? (
                    <Waiting />
                ) : status_work === 'completed' ? (
                    <Completed />
                ) : (
                    <>
                        <div className="text-center text-sm font-semibold text-gray-600 mb-3">
                            เขตที่ {mobileZones.length > 0 ? mobileSlide + 1 : 0} / {mobileZones.length}
                        </div>
                        <div
                            className="overflow-hidden min-w-0 touch-pan-y"
                            onTouchStart={handleZoneTouchStart}
                            onTouchEnd={handleZoneTouchEnd}
                        >
                            <div
                                className="flex transition-transform duration-300 ease-out"
                                style={{
                                    transform: `translateX(-${mobileSlide * 100}%)`
                                }}
                            >
                                {mobileZones.map((zoneData, zoneIndex) => {
                                    const data_round = zoneData?.data_round || {};
                                    const probabilityStatus = getProbabilityStatus(true, zoneData?.probability);
                                    return (
                                        <div
                                            key={`${zoneData.main_id}-${zoneData.sub_id}`}
                                            className="w-full min-w-full shrink-0 px-0.5"
                                        >
                                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">


                                                <div className="bg-gray-50 border-b border-gray-200 p-3">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        เขตที่ {zoneIndex + 1}
                                                    </div>
                                                    <h4 className="font-bold text-gray-800 text-base">
                                                        {zoneData?.full_name}
                                                    </h4>
                                                </div>


                                                <div className="p-3 grid grid-cols-2 gap-2">

                                                    <div className={`rounded-lg p-2 border ${zoneData?.status_open === true ? 'bg-sky-50 border-sky-200' : 'bg-rose-50 border-rose-200'}`}>
                                                        <div className="text-xs text-gray-500">สถานะเปิดสอบ</div>
                                                        <div className={`font-bold text-sm ${zoneData?.status_open === true ? 'text-sky-600' : 'text-rose-600'}`}>
                                                            {zoneData?.status_open === true ? 'เปิดสอบ' : 'ไม่เปิดสอบ'}
                                                        </div>
                                                    </div>

                                                    <div className="rounded-lg p-2 bg-amber-50 border border-amber-200">
                                                        <div className="text-xs text-gray-500">ขึ้นบัญชี</div>
                                                        <div className="font-bold text-sm text-amber-600">
                                                            {zoneData?.total_listed?.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="rounded-lg p-2 bg-emerald-50 border border-emerald-200">
                                                        <div className="text-xs text-gray-500">เรียกแล้ว</div>
                                                        <div className="font-bold text-sm text-emerald-600">
                                                            {zoneData?.total_called?.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="rounded-lg p-2 bg-gray-50 border border-gray-200">
                                                        <div className="text-xs text-gray-500">คงเหลือ</div>
                                                        <div className="font-bold text-sm text-gray-700">
                                                            {zoneData?.total_remain?.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="rounded-lg p-2 bg-green-50 border border-green-200">
                                                        <div className="text-xs text-gray-500">จำนวนรอบ</div>
                                                        <div className="font-bold text-sm text-green-600">
                                                            {zoneData?.round?.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="rounded-lg p-2 bg-slate-50 border border-slate-200">
                                                        <div className="text-xs text-gray-500">เฉลี่ยต่อรอบ</div>
                                                        <div className="font-bold text-sm text-slate-600">
                                                            {zoneData?.avg?.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className={`col-span-2 rounded-lg p-3 border ${probabilityStatus.bg}`}>
                                                        <div className="text-xs text-gray-500">โอกาสบรรจุ</div>
                                                        <div className={`text-2xl font-bold ${probabilityStatus.tx}`}>
                                                            {zoneData?.probability?.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="px-3 pb-3">
                                                    <div className="font-bold text-sm text-gray-700 mb-2">
                                                        ผลการคาดการณ์รายรอบ
                                                    </div>
                                                    <div className="relative">
                                                        {(() => {
                                                            const rounds = Object.values(data_round);
                                                            const slideKey = `${zoneData.main_id}-${zoneData.sub_id}`;
                                                            const currentSlide = roundSlide[slideKey] || 0;
                                                            return (
                                                                <>
                                                                    <div
                                                                        className="overflow-hidden min-w-0 touch-pan-y"
                                                                        onTouchStart={handleRoundTouchStart}
                                                                        onTouchEnd={(e) => handleRoundTouchEnd(e, rounds, `${zoneData.main_id}-${zoneData.sub_id}`)}
                                                                    >
                                                                        <div
                                                                            className="flex transition-transform duration-300 ease-out"
                                                                            style={{
                                                                                transform: `translateX(-${currentSlide * 100}%)`
                                                                            }}
                                                                        >

                                                                            {rounds.map((round, index) => {
                                                                                const percent = mode === 'chance'
                                                                                    ? round?.reach_probability
                                                                                    : round?.cross_zone_effect;

                                                                                const colorStyle = getCrossColor(percent);

                                                                                return (
                                                                                    <div
                                                                                        key={`${zoneData.main_id}-${zoneData.sub_id}-${index}-${round.round}`}
                                                                                        className="w-full min-w-full shrink-0 px-1"
                                                                                    >
                                                                                        <div className="w-full rounded-xl border p-3 sm:p-4 min-w-0">
                                                                                            <div className="text-sm text-gray-500 text-center">
                                                                                                รอบที่ {round?.round ?? index + 1}
                                                                                            </div>

                                                                                            <div
                                                                                                style={colorStyle.style}
                                                                                                className="rounded-lg p-3 text-center mt-2 mb-3"
                                                                                            >
                                                                                                <div className="text-2xl sm:text-3xl font-bold">
                                                                                                    {percent?.toFixed(2)}%
                                                                                                </div>
                                                                                                <div className="text-xs opacity-70 mt-1">
                                                                                                    {mode === 'chance' ? 'โอกาสบรรจุ' : 'ผลกระทบข้ามเขต'}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="space-y-4 text-sm text-gray-500">
                                                                                                <div className="flex justify-between items-start gap-2">
                                                                                                    <span className="text-gray-500">จำนวนที่คาดว่าจะเรียก</span>
                                                                                                    <span className="font-semibold text-right">
                                                                                                        {round?.called?.toLocaleString() ?? '-'}
                                                                                                    </span>
                                                                                                </div>

                                                                                                <div className="flex justify-between items-start gap-2">
                                                                                                    <span className="text-gray-500">จำนวนคงเหลือโดยประมาณ</span>
                                                                                                    <span className="font-semibold text-right">
                                                                                                        {round?.remain?.toLocaleString() ?? '-'}
                                                                                                    </span>
                                                                                                </div>

                                                                                                <div className="flex justify-between items-start gap-2">
                                                                                                    <span className="text-gray-500">สถานะการยืมบัญชี</span>
                                                                                                    <span className="font-semibold text-right">
                                                                                                        {round?.is_borrowed ? 'ยืมบัญชี' : 'ไม่ยืมบัญชี'}
                                                                                                    </span>
                                                                                                </div>

                                                                                                <div className="flex justify-between items-start gap-2">
                                                                                                    <span className="text-gray-500">ความน่าจะเป็นในการเรียกถึง</span>
                                                                                                    <span className="font-semibold text-right">
                                                                                                        {round?.reach_probability?.toFixed(2) ?? '-'}%
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}

                                                                        </div>
                                                                    </div>
                                                                    {rounds.length > 1 && (
                                                                        <div className="text-center text-xs text-gray-500 mt-2">
                                                                            รอบที่ {currentSlide + 1} / {rounds.length}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-400 mt-2">
                            ปัดซ้าย–ขวาเพื่อดูข้อมูลเขตและรอบอื่น
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}
