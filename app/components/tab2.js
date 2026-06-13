import { useQuery } from '@tanstack/react-query';
import T2P1_TypePostNum from './sub-component/tab2/part1_typepost';
import T2P2_TypePerMonth from './sub-component/tab2/part2_typepermonth';
import T2P3_TypePerRound from './sub-component/tab2/part3_typeperround';
import T2P4_Top10ListPos from './sub-component/tab2/part4_top10pos';
import T2P5_PopularPosEmp from './sub-component/tab2/part5_posiempty';
import T2P6_TypeAllCall from './sub-component/tab2/part6_typeallcall';
import T2P7_TypeAllRemain from './sub-component/tab2/part7_typeremain';
import T2P8_TableAllType from './sub-component/tab2/part8_tablealltype';
import T2P9_PosTypePose from './sub-component/tab2/part9_PosTypePos';
import T2P10_PosTypePeople from './sub-component/tab2/part10_PosTypePeople';
export default function Tab1({ setIsOpen, setDetails }) {
    const { data } = useQuery({
        queryKey: ['tab2Data'],
        queryFn: async () => {
            const res = await fetch(`https://dla-backend-production.up.railway.app/api/recruitment/tab2`);
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
                        <span className=" text-sm md:text-base lg:text-4xl font-black text-white drop-shadow-sm">
                            2
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className=" text-sm md:text-base lg:text-3xl font-black text-gray-800 leading-none font-kanit">
                            รายงานสรุปสถิติบัญชีผู้สอบแข่งขันได้แบบแบ่งประเภทและตำแหน่ง
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className={`${data ? '' : 'bg-white/50 animate-pulse rounded-2xl'} col-span-12 lg:col-span-12`} style={{ height: data ? 'auto' : '180px' }}>
                        <T2P1_TypePostNum data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[370px]'} col-span-12 lg:col-span-6 p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P9_PosTypePose data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[370px]'} col-span-12 lg:col-span-6 p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P10_PosTypePeople data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[370px]'} col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P2_TypePerMonth data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[370px]'} col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P3_TypePerRound data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[400px]'} col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P4_Top10ListPos setIsOpen={setIsOpen} setDetails={setDetails} data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[400px]'} col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P5_PopularPosEmp data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[400px]'} col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P7_TypeAllRemain setIsOpen={setIsOpen} setDetails={setDetails} data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[400px]'} col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P6_TypeAllCall setIsOpen={setIsOpen} setDetails={setDetails} data={data} />
                    </div>
                    <div className={`${data ? 'bg-white' : 'bg-white/50 animate-pulse h-[800px]'} col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100`}>
                        <T2P8_TableAllType data={data} />
                    </div>
                </div>
            </div>
        </div>

    );
}