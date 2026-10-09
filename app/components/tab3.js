import { useQuery } from '@tanstack/react-query';
import { OctagonAlert } from 'lucide-react';
import T3P6_TablePositio from './sub-component/tab3/part6_tableposition';
import T3P7_RegoinAnalytics from './sub-component/tab3/part7_regionanalytic';
import T3P8_TableAllType from './sub-component/tab3/part8_tablealltype';
export default function Tab3() {
    const { data } = useQuery({
        queryKey: ['tab3Data'],
        queryFn: async () => {
            const res = await fetch(`https://dla-backend-production.up.railway.app/api/recruitment/tab3`);
            // const res = await fetch(`http://127.0.0.1:8000/api/recruitment/tab3`);
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
                        <span className="text-4xl font-black text-white drop-shadow-sm">
                            3
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-xl font-black text-gray-800">
                            สรุปสถิติการเรียกบรรจุสะสม แยกตามเขตพื้นที่และประเภทตำแหน่ง
                        </span>
                    </div>
                </div>
            </div>
            <div className={`${data ? 'm-6' : 'bg-white/50 animate-pulse rounded-2xl'}`} style={{ height: data ? 'auto' : '800px' }}>
                <div className={`${data ? 'block' : 'hidden'} col-span-12 lg:col-span-12 rounded-2xl shadow-sm border border-gray-100 p-6 bg-white`}>
                    <T3P6_TablePositio data={data} />
                </div>
            </div>
            {/* <div className={`${data ? 'm-6' : 'bg-white/50 animate-pulse rounded-2xl'}`} style={{ height: data ? 'auto' : '800px' }}>
                <div className={`${data ? 'block' : 'hidden'} col-span-12 lg:col-span-12 rounded-2xl shadow-sm border border-gray-100 p-6 bg-white`}>
                    <T3P7_RegoinAnalytics data={data} />
                </div>
            </div> */}
            <div className={`${data ? 'm-6' : 'bg-white/50 animate-pulse rounded-2xl'}`} style={{ height: data ? 'auto' : '800px' }}>
                <div className={`${data ? 'block' : 'hidden'} col-span-12 lg:col-span-12 rounded-2xl shadow-sm border border-gray-100 p-6 bg-white`}>
                    <T3P8_TableAllType data={data} />
                </div>
            </div>
        </div>
    );
}