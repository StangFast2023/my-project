"use client";
import { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Cumulatibely({ data }) {
    const part4cumulative = data?.tab1part4cumulative;
    const chartDataPart4 = useMemo(() => {
        if (!part4cumulative) return [];
            const monthNames = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            let runningTotal = 0;
            return part4cumulative.map((item) => {
                const monthlyVal = Number(item.total);
                runningTotal += monthlyVal;
                const thaiYearShort = (item.year + 543).toString().slice(-2);
                return {
                    name: `${monthNames[item.month]} ${thaiYearShort}`,
                    monthlyTotal: monthlyVal,      
                    cumulativeTotal: runningTotal  
                };
        });
    }, [part4cumulative]);
    return (
        <div className="bg-white rounded-3xl font-kanit">
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สถิติเรียกรายงานตัวรายเดือนรวมและยอดสะสม</h3>
            
            <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartDataPart4}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left"  orientation="left"  stroke="#3b82f6" tickFormatter={(value) => value.toLocaleString()} />
                        <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tickFormatter={(value) => value.toLocaleString()} />
                        <Tooltip 
                            formatter={(value, name) => {
                                if (name === "monthlyTotal") return [value.toLocaleString() + " อัตรา", "ยอดสะสมรวม"];
                                return [value.toLocaleString() + " อัตรา", name];
                            }}
                            labelStyle={{ color: '#353535', fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}
                            itemStyle={{ fontSize: '16px', fontWeight: '600' }}
                        />
                        <Legend />
                        <Bar 
                            yAxisId="left" 
                            dataKey="monthlyTotal" 
                            name="ยอดรายงานตัวรายเดือน" 
                            fill="#0062ffa1" 
                            radius={[4, 4, 0, 0]} 
                        />
                        <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="cumulativeTotal" 
                            name="ยอดสะสมรวม" 
                            stroke="#ff0000" 
                            strokeWidth={3} 
                            dot={{ r: 6, fill: '#ff0000' }} 
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
