import React, { useState } from 'react';
import Row0 from './sub-tab5/row_0_your_status';
import Row1 from './sub-tab5/row_1_static_number';
import Row2 from './sub-tab5/row_2_status_rank';
import Row3 from './chart-sub-tab-5/row_3_monthly_pie';
import Row4 from './sub-tab5/row_4_round_table';
import Row5 from './sub-tab5/row_5_region_monthly';
import Row6 from './sub-tab5/row_6_region_table';
import Row7 from './sub-tab5/row_7_prodiction_empty';


export default function T5P1S1_CurrentData({ details, detailsShow, data }) {
    const dataforChart = data || null;
    const dataShow = detailsShow || {};
    const RegSh = dataShow[details?.regionId]?.pro_main_name || null;
    const ZneSh = dataShow[details?.regionId]?.pro_sub[details?.areaId]?.pro_sub_id ? "เขต " + dataShow[details?.regionId]?.pro_sub[details?.areaId]?.pro_sub_id : null;
    const PosSh = dataShow[details?.regionId]?.pro_sub[details?.areaId]?.data_position[details?.positionId]?.pos_name || null;

    const [frequency, setFrequency] = useState(1);
    const isButtonDisabled = !details?.frequency;
    console.log(isButtonDisabled);
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
                    <Row3 region={RegSh} zone={ZneSh} position={PosSh} data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row4 region={RegSh} zone={ZneSh} position={PosSh} data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row5 position={PosSh} data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row6 position={PosSh} data={dataforChart} />
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
                <div className="flex justify-end items-center gap-4 text-gray-600 ml-auto">
                    <span className="text-sm md:text-base lg:text-xl font-bold text-gray-900">ความถี่ในการเรียกบรรจุ :</span>
                    <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200 shadow-inner">
                        {[1, 2, 3].map((val) => (
                            <button
                                key={val}
                                onClick={() => setFrequency(val)}
                                className={`
                                px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${isButtonDisabled && 'cursor-not-allowed'}
                                ${frequency === val
                                        ? "bg-white text-emerald-600 shadow-md ring-1 ring-black ring-opacity-5"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                                    }
                            `}
                                disabled={isButtonDisabled}
                            >
                                {val} เดือน
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row2 data={dataforChart} />
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row7 data={dataforChart} />
                </div>
            </div>
        </div>
    );
}