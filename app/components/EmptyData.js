import { OctagonAlert } from 'lucide-react';
export const EmptyData = () => (
    <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="text-gray-400 text-6xl mb-4">
            <OctagonAlert size={150} />
        </div>
        <h3 className="text-3xl font-bold text-gray-500">ไม่พบข้อมูลที่ค้นหา</h3>
        <p className="text-gray-400 text-xl mt-2">ลองเปลี่ยนเงื่อนไขการกรอง หรือกด <span className="font-bold">คืนค่าเริ่มต้น</span> </p>
    </div>
);