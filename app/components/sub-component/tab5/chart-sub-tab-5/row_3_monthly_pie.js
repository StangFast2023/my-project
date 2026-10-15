
"use client";
import { Rows3, SquaresExclude } from 'lucide-react';
import Row3Part1Bar from './row_3_part1_bar';
import Row3Part2Pie from './row_3_part2_pie';

export default function Row3StatusRank({ region, zone, position, data }) {
    const ChartData = data || {};
    if (!ChartData) return null;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full min-w-0">
            <div className="col-span-1 lg:col-span-8 min-w-0 w-full overflow-hidden bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex min-w-0 items-center text-gray-700">
                    <SquaresExclude className="shrink-0" />
                    <h3 className="ml-2 min-w-0 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สถิติการเรียกบรรจุรายเดือนและยอดสะสม {region && zone && position ? ` ${position} ${region} ${zone}` : null}
                    </h3>
                </div>
                <div className="mt-3 h-[350px] sm:h-[400px] lg:h-[450px] w-full min-w-0 overflow-hidden">
                    <div className="w-full h-full min-w-0">
                        <Row3Part1Bar data={ChartData} />
                    </div>
                </div>
            </div>
            <div className="col-span-1 lg:col-span-4 min-w-0 w-full overflow-hidden bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center items-center min-w-0 text-gray-700">
                    <Rows3 className="shrink-0" />
                    <h3 className="ml-2 min-w-0 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สัดส่วนบัญชีผู้สอบแข่งขันได้
                    </h3>
                </div>
                <div className="mt-2 text-center text-sm md:text-base text-gray-600 font-semibold">
                    {position || null}
                    <br />
                    {region && zone ? `${region} ${zone}` : null}
                </div>
                <div className="mt-3 h-[350px] sm:h-[400px] lg:h-[450px] w-full min-w-0 overflow-hidden">
                    <div className="w-full h-full min-w-0">
                        <Row3Part2Pie data={ChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}