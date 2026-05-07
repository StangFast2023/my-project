import StaticNumber from './sub-component/tab1/part1_statics';
import CallMonthly  from './sub-component/tab1/part2_monthly';
import PieListed    from './sub-component/tab1/part3_listed';
import Cumulative   from './sub-component/tab1/part4_cumulative';
import MonthlyNUm   from './sub-component/tab1/part5_monthlynumber';



export default function Tab1({ data }) {
    return (
        <div className="animate-fade-in">
            <div className="custom-box-tab my-3">
                <h1 className="text-3xl mb-4 font-bold text-gray-800 text-center">ข้อมูลสถิติการเรียกรายงานตัว</h1>
                <StaticNumber data={ data }/>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-3xl shadow-sm">
                        <CallMonthly  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-3 space-y-4">
                        <PieListed  data={ data }/>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-4 mb-4">
                    <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-3xl shadow-sm">
                        <Cumulative  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-3 space-y-4">
                        <MonthlyNUm  data={ data }/>
                    </div>
                </div>
            </div>
            <div className="custom-box-tab my-3">
                <h1 className="text-3xl mb-4 font-bold text-gray-800 text-center">จำแนกประเภท & ตำแหน่ง</h1>
            </div>
        </div>
    );
}