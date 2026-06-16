import { useQuery } from '@tanstack/react-query';
import { OctagonAlert } from 'lucide-react';
import T3P6_TablePositio from './sub-component/tab3/part6_tableposition';
import T3P8_TableAllType from './sub-component/tab3/part8_tablealltype';
export default function Tab3() {
    const { data } = useQuery({
        queryKey: ['tab3Data'],
        queryFn: async () => {
            const res = await fetch(`https://dla-backend-production.up.railway.app/api/recruitment/tab3`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    return (
        <div className="animate-fade-in">
            <div className="my-3">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-sm md:text-base lg:text-4xl font-black text-white drop-shadow-sm">
                            3
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-sm md:text-base lg:text-3xl font-black text-gray-800 leading-none font-kanit text-center">
                            สรุปสถิติการเรียกบรรจุสะสม แยกตามเขตพื้นที่และประเภทตำแหน่ง
                        </h2>
                    </div>
                </div>

                <div className={`${data ? 'block p-6' : 'hidden'}`}>
                    <div className="flex flex-col items-center justify-center min-h-[250px] md:h-[350px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-6 md:p-8 text-center">
                        <div className="text-gray-400 my-4">
                            <OctagonAlert className=" w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32" />
                        </div>
                        <h3 className="font-bold text-gray-500 leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl">
                            แถบที่ 3 ข้อมูลรายภาคและเขต
                            <br />
                            ยังไม่เสร็จสมบูรณ์
                        </h3>
                        <p className="text-gray-400 mt-3 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl">
                            กำลังทำการอัปเดตเพิ่มเติมภายใน 4-5 วัน
                            <br className="hidden sm:block" />
                            ขออภัยในความไม่สะดวกด้วยนะครับ
                        </p>
                    </div>
                </div>
            </div>
            <div className={`${data ? 'm-6' : 'bg-white/50 animate-pulse rounded-2xl'}`} style={{ height: data ? 'auto' : '800px' }}>
                <div className={`${data ? 'block' : 'hidden'} col-span-12 lg:col-span-12 rounded-2xl shadow-sm border border-gray-100 p-6 bg-white`}>
                    <T3P6_TablePositio data={data} />
                </div>
            </div>
            <div className={`${data ? 'm-6' : 'bg-white/50 animate-pulse rounded-2xl'}`} style={{ height: data ? 'auto' : '800px' }}>
                <div className={`${data ? 'block' : 'hidden'} col-span-12 lg:col-span-12 rounded-2xl shadow-sm border border-gray-100 p-6 bg-white`}>
                    <T3P8_TableAllType data={data} />
                </div>
            </div>
        </div>
    );
}