
import Row0 from './sub-tab5/row_0_your_status';
import Row1 from './sub-tab5/row_1_static_number';
import Row2 from './sub-tab5/row_2_status_rank';
import Row3 from './chart-sub-tab-5/row_3_monthly_pie';
import Row4 from './sub-tab5/row_4_round_table';
import Row5 from './sub-tab5/row_5_region_monthly';
import Row6 from './sub-tab5/row_6_region_table';

export default function T5P1S1_CurrentData({ data }) {
    const dataforChart = data || null;
    return (
        <div>

            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                    <span className=" text-lg md:text-base lg:text-3xl font-black text-white drop-shadow-sm">
                        5.1
                    </span>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className=" text-sm md:text-base lg:text-2xl font-black text-gray-800 leading-none font-kanit">
                        สรุปสถานะการเรียกบรรจุ ณ ปัจจุบัน
                    </h2>
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row0 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row1 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row3 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row4 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row5 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row6 data={dataforChart} />
                </div>
            </div>


            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                    <span className=" text-lg md:text-base lg:text-3xl font-black text-white drop-shadow-sm">
                        5.2
                    </span>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className=" text-sm md:text-base lg:text-2xl font-black text-gray-800 leading-none font-kanit">
                        แนวโน้มและโอกาสการบรรจุในอนาคต
                    </h2>
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row2 data={dataforChart} />
                </div>
            </div>
        </div>
    );
}