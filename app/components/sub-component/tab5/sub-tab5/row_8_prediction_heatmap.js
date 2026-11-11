
import { useState, useRef } from 'react';
import { UserSearch } from 'lucide-react';
import { Waiting } from '../../../Waiting';
import { Completed } from '../../../Completed';

export default function Row7ChanceforEmpty({ region, zone, position, data }) {
    const status_work = data?.status_work || {};

    const heatmap_matrix = data?.heatmap_matrix || [];
    const rounds_header = data?.rounds_header || [];

    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredCol, setHoveredCol] = useState(null);
    const [mobileMonthSlide, setMobileMonthSlide] = useState(0);

    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const isScrollingRounds = useRef(false);

    const monthDataList = Array.isArray(heatmap_matrix)
        ? heatmap_matrix.filter(Boolean)
        : [];

    const max_rounds = Math.max(
        10,
        Array.isArray(rounds_header) ? rounds_header.length : 0,
        ...monthDataList.map(month => Object.values(month?.round || {}).length)
    );

    const round_columns = Array.from(
        { length: max_rounds },
        (_, i) => i + 1
    );

    const month_rows = Array.from(
        { length: Math.max(10, monthDataList.length) },
        (_, i) => i + 1
    );

    const currentMonthSlide = Math.min(
        mobileMonthSlide,
        Math.max(monthDataList.length - 1, 0)
    );

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {

        if (isScrollingRounds.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const differenceX = touchStartX.current - touchEndX;
        const differenceY = touchStartY.current - touchEndY;

        if (Math.abs(differenceY) > Math.abs(differenceX)) return;

        if (Math.abs(differenceX) < 50) return;

        if (differenceX > 0) {
            setMobileMonthSlide(prev =>
                Math.min(monthDataList.length - 1, prev + 1)
            );
        } else {
            setMobileMonthSlide(prev =>
                Math.max(0, prev - 1)
            );
        }
    };

    const getHeatmapColor = (percent) => {
        if (!percent || percent <= 0) {
            return {
                bg: "bg-gray-100",
                text: "text-gray-600",
                bd: "border-gray-300"
            };
        }

        const level = Math.min(
            Math.max(Math.floor((percent - 1) / 10), 0),
            9
        );

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

    if (!data) return null;

    return (
        <div className="col-span-12 lg:col-span-1 bg-white p-3 sm:p-4 rounded-2xl shadow-sm w-full min-w-0">

            <div className="text-center mb-4 text-gray-700">
                <div className="flex items-start">
                    <UserSearch className="shrink-0 mt-0.5" />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700 text-left">
                        แผนภาพวิเคราะห์โอกาสการได้รับการบรรจุรายเดือนและรายรอบ
                        {region && zone && position
                            ? " " + position + " " + region + " " + zone
                            : null}
                    </h3>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300 min-w-0">

                {status_work === 'completed' ? (
                    <Completed />
                ) : !data ? (
                    <Waiting />
                ) : (
                    <>

                        {/* Desktop */}
                        <div className="hidden lg:block w-full min-w-0 overflow-auto max-h-[800px]">
                            <table className="w-full min-w-max text-left border-collapse whitespace-nowrap">
                                <thead className="bg-gray-50 text-gray-600 text-sm">
                                    <tr className="border-b-2 border-gray-600">
                                        <th className="sticky top-0 left-0 z-40 bg-gray-100 px-6 py-4 text-sm font-semibold">
                                            เดือน \ รอบ
                                        </th>

                                        {round_columns.map(item => {
                                            const round = rounds_header[item - 1] || null;

                                            return (
                                                <th
                                                    key={item}
                                                    className="sticky top-0 z-30 bg-white px-4 py-4 text-sm font-semibold text-center"
                                                >
                                                    {round || null}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>

                                <tbody>
                                    {monthDataList.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={max_rounds + 1}
                                                className="py-12 text-center text-gray-400 text-lg"
                                            >
                                                ไม่มีข้อมูลแสดง
                                            </td>
                                        </tr>
                                    ) : (
                                        month_rows.map(month => {
                                            const month_data = monthDataList[month - 1];

                                            if (!month_data) return null;

                                            return (
                                                <tr key={month} className="text-gray-600">
                                                    <td className="sticky left-0 z-30 bg-gray-50 px-3 py-4 text-sm font-semibold">
                                                        {month_data?.date}
                                                    </td>

                                                    {Object.values(month_data?.round || {}).map((round_per, index) => {
                                                        if (!round_per) return null;

                                                        const isHoveredCell =
                                                            hoveredRow === month && hoveredCol === index;

                                                        const isHoveredRow = hoveredRow === month;
                                                        const isHoveredCol = hoveredCol === index;

                                                        const colorSettings = getHeatmapColor(
                                                            round_per?.percent || 0
                                                        );

                                                        return (
                                                            <td
                                                                key={`${month_data?.date}-${index}`}
                                                                onMouseEnter={() => {
                                                                    setHoveredRow(month);
                                                                    setHoveredCol(index);
                                                                }}
                                                                onMouseLeave={() => {
                                                                    setHoveredRow(null);
                                                                    setHoveredCol(null);
                                                                }}
                                                                style={colorSettings.style}
                                                                className={`px-3 py-4 text-sm text-center font-semibold transition-all duration-200
                                    ${isHoveredCell ? '!bg-indigo-200 !text-indigo-600 shadow-[inset_0_0_0_3px_#4338ca]' : ''}
                                    ${!isHoveredCell && (isHoveredRow || isHoveredCol) ? '!bg-indigo-50' : ''}`}
                                                            >
                                                                {round_per?.percent?.toFixed(2) ?? '-'}%
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="lg:hidden p-3 min-w-0">

                            {monthDataList.length > 0 ? (
                                <>

                                    <div
                                        className="overflow-hidden w-full min-w-0 touch-pan-y"
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        <div
                                            className="flex transition-transform duration-300 ease-out"
                                            style={{
                                                transform: `translateX(-${currentMonthSlide * 100}%)`
                                            }}
                                        >
                                            {monthDataList.map((monthData, monthIndex) => {
                                                const roundData = Object.values(
                                                    monthData?.round || {}
                                                );

                                                return (
                                                    <div
                                                        key={`${monthData?.date}-${monthIndex}`}
                                                        className="w-full min-w-full shrink-0 px-1"
                                                    >
                                                        <div className="rounded-xl border border-gray-200 p-3">

                                                            <div className="text-center mb-3">
                                                                <div className="text-xs text-gray-500">
                                                                    เดือนที่ {monthIndex + 1}
                                                                </div>

                                                                <div className="text-lg font-bold text-gray-800">
                                                                    {monthData?.date}
                                                                </div>
                                                            </div>

                                                            <div
                                                                className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2"
                                                                onTouchStart={() => {
                                                                    isScrollingRounds.current = true;
                                                                }}
                                                                onTouchEnd={() => {
                                                                    setTimeout(() => {
                                                                        isScrollingRounds.current = false;
                                                                    }, 100);
                                                                }}
                                                            >
                                                                {roundData.map((roundPer, roundIndex) => {
                                                                    const colorSettings = getHeatmapColor(
                                                                        roundPer?.percent || 0
                                                                    );

                                                                    return (
                                                                        <div
                                                                            key={`${monthIndex}-${roundIndex}`}
                                                                            style={colorSettings.style}
                                                                            className={`snap-start shrink-0 w-[110px] sm:w-[130px] rounded-xl border p-3 text-center ${!colorSettings.style ? 'bg-gray-100 text-gray-600 border-gray-300' : ''}`}
                                                                        >
                                                                            <div className="text-xs opacity-75 mb-2">
                                                                                {rounds_header[roundIndex] || `รอบที่ ${roundIndex + 1}`}
                                                                            </div>

                                                                            <div className="text-xl sm:text-2xl font-bold">
                                                                                {roundPer?.percent?.toFixed(2) ?? '-'}%
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            <div className="text-center text-xs text-gray-400 mt-1">
                                                                เลื่อนซ้าย–ขวาเพื่อดูรอบอื่น
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {monthDataList.length > 1 && (
                                        <div className="text-center text-sm text-gray-500 font-medium mt-3">
                                            เดือนที่ {currentMonthSlide + 1} / {monthDataList.length}
                                            <div className="text-xs text-gray-400 mt-1">
                                                ปัดซ้าย–ขวาเพื่อเปลี่ยนเดือน
                                            </div>
                                        </div>
                                    )}

                                </>
                            ) : (
                                <div className="text-center text-sm text-gray-500 py-8">
                                    ยังไม่มีข้อมูลแสดงผล
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
