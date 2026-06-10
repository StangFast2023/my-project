import { Trophy } from 'lucide-react';
export const Completed = () => (
    <div className="flex flex-col items-center justify-center h-[600px] bg-emerald-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="text-emerald-600 text-6xl mb-4">
            <Trophy size={150} />
        </div>
        <h3 className="text-3xl font-bold text-emerald-600">ยินดีด้วย</h3>
        <p className="text-emerald-600 text-xl mt-2">คุณได้รับการบรรจุเป็นข้าราชการหรือพนักงานส่วนท้องถิ่นแล้วครับ</p>
    </div>
);