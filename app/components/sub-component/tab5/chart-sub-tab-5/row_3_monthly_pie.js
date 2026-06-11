
"use client";
import { Rows3, SquaresExclude } from 'lucide-react';
import Row3Part1Bar from './row_3_part1_bar';
import Row3Part2Pie from './row_3_part2_pie';

export default function Row3StatusRank({ region, zone, position, data }) {
    const ChartData = data || {};
    if (!ChartData) return null;
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex text-gray-700 items-center">
                    <SquaresExclude />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สถิติการเรียกบรรจุรายเดือนและยอดสะสม
                        {region && zone && position ? " " + position + " " + region + " " + zone : null}
                    </h3>
                </div>
                <div className="w-full h-[450px]">
                    <Row3Part1Bar data={ChartData} />
                </div>
            </div>
            <div className="col-span-4 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex text-gray-700 justify-center items-center">
                    <Rows3 />
                    <h3 className="ml-2 text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        สัดส่วนบัญชีผู้สอบแข่งขันได้
                    </h3>
                </div>
                <div className="text-center text-gray-600 font-semibold">
                    {position ? position : null}
                    <br></br>
                    {region && zone ? region + " " + zone : null}
                </div>
                <div className="w-full h-[450px]">
                    <Row3Part2Pie data={ChartData} />
                </div>
            </div>
        </div>
    );
}