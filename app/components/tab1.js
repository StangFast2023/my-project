import T1P1_StaticNumber        from './sub-component/tab1/part1_statics';
import T1P2_CallMonthly         from './sub-component/tab1/part2_monthly';
import T1P3_PieListed           from './sub-component/tab1/part3_listed';
import T1P4_Cumulative          from './sub-component/tab1/part4_cumulative';
import T1P5_PercentageRound     from './sub-component/tab1/part5_percent_round';
import T1P6_TableRoundCall      from './sub-component/tab1/part6_table_round';
import { LoadingScreen }        from '../components/LoadingScreen';
export default function Tab1({ data }) {
    if ( !data ) return <LoadingScreen />;
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
                
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-12">
                        <T1P1_StaticNumber data={ data } />
                    </div>
                    <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T1P2_CallMonthly  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T1P5_PercentageRound  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-9 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T1P4_Cumulative  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T1P3_PieListed  data={ data }/>
                    </div>
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T1P6_TableRoundCall  data={ data }/>
                    </div>
                </div>
            </div>
        </div>
    );
}