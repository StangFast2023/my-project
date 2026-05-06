"use client";
import { useMemo } from 'react';

export default function StatChart({ data }) {
    const totalCalled = useMemo(() => {
        return data?.calling?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
    }, [data]);

    const totalListed = useMemo(() => {
        return data?.updatedList?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
    }, [data]);

    const currentRound = useMemo(() => {
        if (!data?.calling || data.calling.length === 0) return 0;
        return Math.max(...data.calling.map(item => item.round || 0));
    }, [data]);

    const totalRound = 25;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 font-kanit">
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">รอบที่</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-800">{currentRound.toLocaleString()} / {totalRound.toLocaleString()}</span>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">ขึ้นบัญชีทั้งหมด</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-800">{totalListed.toLocaleString()}</span>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">เรียกไปแล้ว</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-800">{totalCalled.toLocaleString()}</span>
                    <span className="text-xl font-bold text-blue-600 ml-2">
                        ( {totalListed > 0 ? ((totalCalled / totalListed) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0 } % )
                    </span>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">คงเหลือ</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-800">{( totalListed - totalCalled ).toLocaleString()}</span>
                    <span className="text-xl font-bold text-blue-600 ml-2">
                        ( {totalListed > 0 ? (( (totalListed - totalCalled) / totalListed) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0 } % )
                    </span>
                </div>
            </div>
        </div>
    );
}
