
import T2P1_Top10ListPos     from './sub-component/tab2/part1_top10pos';
import T2P2_PopularPosEmp    from './sub-component/tab2/part2_posiempty';
import T2P3_TypePostPart1    from './sub-component/tab2/part3_typepost';
import T2P4_TypePostPart2    from './sub-component/tab2/part4_typepos2';
import T2P5_TypePostBarPart1 from './sub-component/tab2/part5_typepost';

export default function Tab1({ setIsOpen,setDetails,data }) {
    return (


            <div className="my-3 mt-8">
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-4xl font-black text-white drop-shadow-sm">
                            2
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-gray-800 leading-none font-kanit">
                            รายงานสรุปสถิติบัญชีผู้สอบแข่งขันได้แบบแบ่งประเภทและตำแหน่ง
                        </h2>
                    </div>
                </div>

                <h1 className="text-3xl mb-4 font-bold text-gray-800 text-center"></h1>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T2P5_TypePostBarPart1  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-6 bg-white bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T2P1_Top10ListPos setIsOpen={setIsOpen} setDetails={setDetails} data={data}/>
                    </div>
                    <div className="col-span-12 lg:col-span-6 bg-white bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T2P2_PopularPosEmp setIsOpen={setIsOpen} setDetails={setDetails} data={data}/>
                    </div>
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T2P3_TypePostPart1  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T2P4_TypePostPart2  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    </div>
                    <div className="col-span-12 lg:col-span-6 bg-white bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    </div>
                    <div className="col-span-12 lg:col-span-6 bg-white bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    </div>
                </div>
            </div>
            
    );
}