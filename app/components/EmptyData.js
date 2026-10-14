import { OctagonAlert } from 'lucide-react';
import useMediaQuery from '@/app/avaliable/useMediaQuery';
export const EmptyData = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    return (
        <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-gray-400 text-6xl mb-4">
                <OctagonAlert size={isMobile ? 100 : 150} />
            </div>
            <h3 className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-gray-500`}>ไม่พบข้อมูลที่ค้นหา</h3>
            <p className={`${isMobile ? "text-base" : "text-3xl"} text-gray-400 mt-2`}>ลองเปลี่ยนเงื่อนไขการกรอง หรือกด <span className="font-bold">คืนค่าเริ่มต้น</span> </p>
        </div>
    );
}