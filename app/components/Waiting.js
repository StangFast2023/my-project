import { Activity } from 'lucide-react';
export const Waiting = () => (
    <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="text-gray-600 text-6xl mb-4">
            <Activity size={150} className="animate-pulse mb-2 text-slate-500" />
        </div>
        <h3 className="text-3xl font-bold text-gray-600">กำลังรอท่านกรอกข้อมูล...</h3>
    </div>
);