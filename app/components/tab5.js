import React , { useState  }                from 'react';
import { LoadingScreen }                    from '../components/LoadingScreen';
import T5P1_filterDlaSearch                 from './sub-component/tab5/part1_filterDropdownSearch';
import T5P1S1_CurrentData                   from './sub-component/tab5/sub-tab5/tab5_1';
import T5P1S2_PredictData                   from './sub-component/tab5/sub-tab5/tab5_2';

export default function Tab5({ setIsOpen,details,data }) {
    if ( !data ) return <LoadingScreen />;
    return (
        <div className="animate-fade-in">
            <div className="my-3">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-4xl font-black text-white drop-shadow-sm">
                            5
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-gray-800 leading-none font-kanit text-center">
                            ข้อมูลเจาะลึก และคาดการณ์เรียกบรรจุ
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 my-2">
                    <div className="col-span-12 lg:col-span-12">
                        <T5P1_filterDlaSearch setIsOpen={setIsOpen} details={details} data={data} />
                    </div>
                </div>
            </div>
            <div className="my-3">
                <T5P1S1_CurrentData details={details} />
            </div>
            <div className="my-3">
                <T5P1S2_PredictData details={details} />
            </div>
        </div>
    );
}