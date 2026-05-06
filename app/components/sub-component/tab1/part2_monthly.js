"use client";
import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function CallMonthly({ data }) {
    const tab1part2monthly = data?.tab1part2monthly;
    const chartData = useMemo(() => {
        if (!tab1part2monthly) return [];
        const monthNames = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const grouped = tab1part2monthly.reduce((acc, curr) => {
            const m = curr.month; 
            const y = curr.year;
            if (!acc[m]) {
                const thaiYearShort = (y + 543).toString().slice(-2);
                acc[m] = { 
                    name: `${monthNames[m]} ${thaiYearShort}`,
                    monthNum: m 
                };
            }
            acc[m][`round${curr.round}`] = Number(curr.total);
            return acc;
        }, {});
        return Object.values(grouped).sort((a, b) => a.monthNum - b.monthNum);
    }, [tab1part2monthly]);

    const ROUND_COLORS = [
        "#1e40af", "#fbbf24", "#ef4444", "#10b981", "#8b5cf6", 
        "#f59e0b", "#3b82f6", "#ec4899", "#06b6d4", "#84cc16", 
        "#6366f1", "#f43f5e", "#14b8a6", "#f97316", "#a855f7", 
        "#0ea5e9", "#d946ef", "#22c55e", "#eab308", "#64748b", 
        "#475569", "#be123c", "#15803d", "#1d4ed8", "#7c3aed"  
    ];
    const activeRounds = [...new Set(tab1part2monthly?.map(item => item.round))].sort((a, b) => a - b);
    return (
        <div className="bg-white rounded-3xl font-kanit">
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 จำนวนการเรียกรายงานตัวรายเดือน (2569)</h3>
            
            <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{ fill: '#ffffff00' }} 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '4px 4px 10px -1px rgb(0 0 0 / 0.1)' }} 
                            formatter={(value, name) => {
                                return [
                                    "เรียกบรรจุ " + value.toLocaleString() + " อัตรา", 
                                    name,
                                ];
                            }}
                            labelStyle={{ color: '#000000', fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ fontSize: '16px', fontWeight: '600' }}
                        />
                        
                        <Legend iconType="circle" />
                        {activeRounds.map((r) => (
                            <Bar 
                                key={`round-${r}`}
                                name={`รอบที่ ${r}`} 
                                dataKey={`round${r}`} 
                                fill={ROUND_COLORS[r - 1]} 
                                radius={[4, 4, 0, 0]} 
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
