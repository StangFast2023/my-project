import StaticNumber     from './sub-component/tab1/part1_statics';
import CallMonthly      from './sub-component/tab1/part2_monthly';
import PieListed        from './sub-component/tab1/part3_listed';
import Cumulative       from './sub-component/tab1/part4_cumulative';
import MonthlyNUm       from './sub-component/tab1/part5_monthlynumber';
import Top10ListPos     from './sub-component/tab1/part6_top10pos';
import PopularPosEmp    from './sub-component/tab1/part7_posiempty';

export default function Tab1({ setIsOpen,setDetails,data }) {
    return (
        <div className="animate-fade-in">
            <div className="my-3">
                <h1 className="text-3xl mb-4 font-bold text-gray-800 text-center">ข้อมูลสถิติการเรียกรายงานตัว</h1>
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
            <hr className="w-full border-t-5 border-gray-500 my-5 shadow-sm" />
            <div className="my-3">
                <h1 className="text-3xl mb-4 font-bold text-gray-800 text-center">ประเภท & ตำแหน่ง</h1>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    </div>
                    <div className="col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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