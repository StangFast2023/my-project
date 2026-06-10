
import { useState } from 'react';
import { UserSearch } from 'lucide-react';
import { Waiting } from '../../../Waiting';
import { Completed } from '../../../Completed';
export default function Row7ChanceforEmpty({ region, zone, position, data }) {
    const status_work = data?.status_work || {};

    const heatmap_matrix = data?.heatmap_matrix || {};
    const rounds_header = data?.rounds_header || {};

    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredCol, setHoveredCol] = useState(null);

    const max_rounds = Math.max(10, data?.rounds_header.length || 0);
    const round_columns = Array.from({ length: max_rounds }, (_, i) => i + 1);

    const max_month = Math.max(10, data?.heatmap_matrix.length || 0);
    const month_rows = Array.from({ length: max_month }, (_, i) => i + 1);

    const getHeatmapColor = (percent) => {
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
    if (!heatmap_matrix && !rounds_header) return null;
    return (
        <div className="col-span-12 lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-center mb-4 text-gray-700">
                <div className="flex items-center">
                    <UserSearch />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        แผนภาพวิเคราะห์โอกาสการได้รับการบรรจุรายเดือนและรายรอบ
                        {region && zone && position ? " " + position + " " + region + " " + zone : null}
                    </h3>
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
                                    <table className="table-fixed w-full h-full overflow-y-auto text-left border-collapse whitespace-nowrap">
                                        <thead className="bg-gray-50 text-gray-600 text-sm">
                                            <tr className="border-b-2 border-gray-600">
                                                <th className="sticky top-0 left-[0] z-40 bg-gray-100 !w-[10%] px-6 py-4 text-sm md:text-base lg:text-ls font-semibold">เดือน \ รอบ</th>
                                                {round_columns.map(item => {
                                                    const round = rounds_header[item - 1] || null;
                                                    return (
                                                        <th key={item} className="sticky top-0 z-30 w-[5%] px-4 py-4 text-sm md:text-base lg:text-ls font-semibold text-center bg-white">{round || null}</th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {month_rows.map(month => {
                                                const month_data = heatmap_matrix[month - 1] || null;
                                                if (status_work === 'completed') return null;
                                                if (!month_data) return null;
                                                return (
                                                    <tr key={month} className={`text-gray-600`}>
                                                        <td className="sticky left-[0] z-30 bg-gray-50 px-3 py-4 text-sm md:text-base lg:text-ls font-semibold">{month_data?.date}</td>
                                                        {Object.values(month_data?.round).map((round_per, index) => {
                                                            const isHoveredCell = hoveredRow === month && hoveredCol === index;
                                                            const isHoveredRow = hoveredRow === month;
                                                            const isHoveredCol = hoveredCol === index;
                                                            const colorSettings = getHeatmapColor(round_per?.percent || 0);
                                                            if (!round_per) return null;
                                                            return (
                                                                <td
                                                                    onMouseEnter={() => { setHoveredRow(month); setHoveredCol(index); }}
                                                                    onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}
                                                                    key={`${month_data?.date}-${round_per?.percent}`}
                                                                    style={colorSettings.style}
                                                                    className={`z-30 bg-gray-50 px-3 py-4 text-sm md:text-base lg:text-ls text-center font-semibold transition-all duration-200
                                                    ${isHoveredCell ? '!bg-indigo-200 !text-indigo-600 z-10 shadow-[inset_0_0_0_3px_#4338ca]' : ''}
                                                    ${isHoveredRow || isHoveredCol ? '!bg-indigo-50' : ''}`}>
                                                                    {round_per?.percent.toFixed(2)}%
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )
                        )
                    }


                </div>
            </div>

        </div>
    );
}