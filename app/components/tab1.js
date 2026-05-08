import StaticNumber     from './sub-component/tab1/part1_statics';
import CallMonthly      from './sub-component/tab1/part2_monthly';
import PieListed        from './sub-component/tab1/part3_listed';
import Cumulative       from './sub-component/tab1/part4_cumulative';
import MonthlyNUm       from './sub-component/tab1/part5_monthlynumber';
import Top10ListPos     from './sub-component/tab1/part6_top10pos';
import PopularPosEmp    from './sub-component/tab1/part7_posiempty';
import TypePostPart1    from './sub-component/tab1/part8_typepost';
import TypePostPart2    from './sub-component/tab1/part9_typepos2';



export default function Tab1({ setIsOpen,setDetails,data }) {
    return (
        <div className="animate-fade-in">
            <div className="my-3">

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-4xl font-black text-white drop-shadow-sm">
                            1
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-gray-800 leading-none font-kanit">
                            รายงานสรุปสถิติการเรียกมารายงานตัวเพื่อบรรจุข้าราชการหรือพนักงานส่วนท้องถิ่นประจำปี 2568
                        </h2>
                    </div>
                </div>

                <StaticNumber data={ data }/>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <CallMonthly  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <PieListed  data={ data }/>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Cumulative  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <MonthlyNUm  data={ data }/>
                    </div>
                </div>
            </div>
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
                    <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        
                    </div>
                    <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <TypePostPart1  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <TypePostPart2  data={ data }/>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-6 bg-white bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Top10ListPos setIsOpen={setIsOpen} setDetails={setDetails} data={data}/>
                    </div>
                    <div className="col-span-12 lg:col-span-6 bg-white bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <PopularPosEmp setIsOpen={setIsOpen} setDetails={setDetails} data={data}/>
                    </div>
                </div>
            </div>
        </div>
    );
}