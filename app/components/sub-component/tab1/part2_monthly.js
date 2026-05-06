"use client";
import { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CallMonthly({ data }) {
    const tab1part2monthly = data?.tab1part2monthly;
    const chartData = useMemo(() => {
        if (!tab1part2monthly) return [];
        const monthNames = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const grouped = tab1part2monthly.reduce((acc, curr) => {
            const m = curr.month;
            const totalValue = Number(curr.total);
            if (!acc[m]) {
                const thaiYearShort = (curr.year + 543).toString().slice(-2);
                acc[m] = { 
                    name: `${monthNames[m]} ${thaiYearShort}`, 
                    monthNum: m,
                    monthlyTotal: 0 
                };
            }
            acc[m][`round${curr.round}`] = totalValue; 
            acc[m].monthlyTotal += totalValue; 
            return acc;
        }, {});
        return Object.values(grouped).sort((a, b) => a.monthNum - b.monthNum);
    }, [tab1part2monthly]);

    const ROUND_COLORS = [
        "#1e40afab", "#fbbe24ab", "#ef4444ab", "#10b981ab", "#8b5cf6ab", 
        "#f59e0bab", "#3b82f6ab", "#ec4899ab", "#06b6d4ab", "#84cc16ab", 
        "#6366f1ab", "#f43f5eab", "#14b8a6ab", "#f97316ab", "#a855f7ab", 
        "#0ea5e9ab", "#d946efab", "#22c55eab", "#eab308ab", "#64748bab", 
        "#475569ab", "#be123cab", "#15803dab", "#1d4ed8ab", "#7c3aedab"  
    ];
    const activeRounds = [...new Set(tab1part2monthly?.map(item => item.round))].sort((a, b) => a - b);
    return (
        <div className="bg-white rounded-3xl font-kanit">
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปจำนวนการเรียกรายงานตัวรายรอบและยอดรวมรายเดือน</h3>
            
            <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 16}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 16}} tickFormatter={(value) => value.toLocaleString()} />
                        <Tooltip 
                            formatter={(value, name) => {
                                if (name === "monthlyTotal") return [value.toLocaleString() + " อัตรา", "ยอดสะสมรวม"];
                                return [value.toLocaleString() + " อัตรา", name];
                            }}
                            labelStyle={{ color: '#353535', fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ fontSize: '16px', fontWeight: '600' }}
                        />
                        <Legend verticalAlign="bottom" align="center" iconType="circle" />
                        {activeRounds.map((r) => (
                            <Bar 
                                key={`round-${r}`}
                                name={`รอบที่ ${r}`} 
                                dataKey={`round${r}`} 
                                fill={ROUND_COLORS[r - 1]} 
                                radius={[4, 4, 0, 0]} 
                            />
                        ))}
                        <Line
                            type="monotone" 
                            dataKey="monthlyTotal"
                            name="ยอดรวมรายเดือน"
                            stroke="#ff0000" 
                            strokeWidth={3}
                            dot={{ r: 6, fill: '#ff0000', strokeWidth: 2, stroke: '#ffffff' }}
                            activeDot={{ r: 8 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
