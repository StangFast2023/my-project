import React , { useState  }                from 'react';
import { LoadingScreen }                    from '../../../LoadingScreen';

export default function T5P1S1_CurrentData({ details }) {
    if ( !details ) return <LoadingScreen />;
    return (
        <div>
            <div className="flex items-center gap-4 mb-8 pl-8">
                <div className="flex items-center justify-center px-2 py-2 ยส bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                    <span className="text-2xl font-black text-white drop-shadow-sm">
                        5.1
                    </span>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-black text-gray-800 leading-none font-kanit text-center">
                        สถานะส่วนบุคคลและรายละเอียดการเรียกบรรจุตำแหน่ง
                    </h2>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6 my-2">
                <div className="col-span-12 lg:col-span-12">

                </div>
            </div>
        </div>
    );
}