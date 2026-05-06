"use client";
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function PieListed({ data }) {
     const totalCalled = useMemo(() => {
        return data?.calling?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
    }, [data]);
    const totalListed = useMemo(() => {
        return data?.updatedList?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
    }, [data]); 
    const pieData = useMemo(() => {
        const remaining = Math.max(0, totalListed - totalCalled);
        return [
            { name: 'เรียกบรรจุแล้ว', value: totalCalled, color: '#2563eb' }, 
            { name: 'คงเหลือในบัญชี', value: remaining, color: '#535353' }   
        ];
    }, [totalCalled, totalListed]);
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 font-kanit">
            <h3 className="text-lg font-bold mb-4 text-gray-700">🏛️สัดส่วนการเรียกบรรจุ</h3>
            <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            innerRadius={50}  // ทำเป็นทรงโดนัทเพื่อให้ดูทันสมัย
                            outerRadius={150}
                            paddingAngle={1}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => value.toLocaleString() + " อัตรา"}
                            contentStyle={{ borderRadius: '12px', border: 'none' }}
                            itemStyle={{ fontSize: '16px', fontWeight: '600' }}
                        />
                        <Legend iconType="circle" verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            {/* แสดงเปอร์เซ็นต์ตรงกลางหรือด้านล่าง */}
            <div className="text-center mt-2">
                <p className="text-2xl font-bold text-blue-600">
                    {totalListed > 0 ? ((totalCalled / totalListed) * 100).toFixed(2) : 0}%
                </p>
                <p className="text-xs text-gray-400">จากผู้สอบผ่านทั้งหมด</p>
            </div>
        </div>
    );
}
