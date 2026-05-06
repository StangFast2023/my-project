"use client";
import { useMemo } from 'react';

export default function StatChart({ data }) {
    const part2callbar = data?.tab1part2monthly;
    const kpiStats = useMemo(() => {
        if (!part2callbar || part2callbar.length === 0) return { maxMonth: '-', maxTotal: 0 };

        const monthNames = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

        // หา Object ที่มีค่า total สูงที่สุด
        const maxEntry = part2callbar.reduce((prev, current) => {
            return (Number(prev.total) > Number(current.total)) ? prev : current;
        });

        return {
            maxMonth: monthNames[maxEntry.month],
            maxTotal: Number(maxEntry.total),
            maxYear: maxEntry.year + 543
        };
    }, [part2callbar]);
    const topRoundWinner = useMemo(() => {
        if (!part2callbar || part2callbar.length === 0) return { round: '-', total: 0 };
        const roundTotals = part2callbar.reduce((acc, curr) => {
            const r = curr.round;
            acc[r] = (acc[r] || 0) + Number(curr.total);
            return acc;
        }, {});
        const winner = Object.keys(roundTotals).reduce((a, b) => 
            roundTotals[a] > roundTotals[b] ? a : b
        );
        return {
            roundNumber: winner,
            totalValue: roundTotals[winner]
        };
    }, [part2callbar]);
    const currentRound = useMemo(() => {
        if (!data?.calling || data.calling.length === 0) return 0;
        return Math.max(...data.calling.map(item => item.round || 0));
    }, [data]);

    const totalRound = 25;
    return (
        <div className="lg:w-1/3 flex flex-col gap-5">
            <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-sky-500 w-100">
                <p className="text-sm font-medium text-slate-500">ความคืบหน้าในการเรียก [ <b>{currentRound} / {totalRound}</b> ]</p>
                <p className="text-3xl font-bold text-slate-800 text-right">
                    {totalRound > 0 ? ((currentRound / totalRound) * 100).toFixed(2) : 0} / <span className="text-lg font-bold text-gray-600">100.00%</span>
                </p>
            </div>
            <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500 w-100">
                <p className="text-sm font-medium text-slate-500">รอบที่มีการรายงานตัวมากที่สุด</p>
                <p className="text-3xl font-bold text-slate-800 text-right">
                    <span className="text-lg font-bold text-gray-600">รอบที่</span> {topRoundWinner.roundNumber}
                </p>
            </div>
            <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 w-100">
                <p className="text-sm font-medium text-slate-500">เดือนที่มีการรายงานตัวมากที่สุด</p>
                <p className="text-3xl font-bold text-slate-800 text-right">{kpiStats.maxMonth} {kpiStats.maxYear}</p>
            </div>
            <div className="flex-1 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 w-100">
                <p className="text-sm font-medium text-slate-500">อัตราที่มีการรายงานตัวมากที่สุด</p>
                <p className="text-3xl font-bold text-slate-800 text-right">{kpiStats.maxTotal.toLocaleString()} <span className="text-lg font-bold text-gray-600">อัตรา</span></p>
            </div>
        </div>
    );
}
