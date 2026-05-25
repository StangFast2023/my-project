import React                from 'react';
import { LoadingScreen }    from '../components/LoadingScreen';

export default function Tab5({data}) {
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
            </div>
        </div>
    );
}