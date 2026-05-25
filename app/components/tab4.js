import React, { useState } from 'react';

import T4P1_filterDlaListed     from './sub-component/tab4/part1_filterDlaListed';
import T4P2_showingAllTable     from './sub-component/tab4/part2_showingAllTable';
import { LoadingScreen }        from '../components/LoadingScreen';

export default function Tab4({setIsOpen,setDetails,data}) {
    const initialRegions = Object.keys(data?.tab4?.part1?.region || {});
    const [selectedRegions, setSelectedRegions] = useState(initialRegions);
    const [selectedSubRegions, setSelectedSubRegions] = useState(() => {
            const allSubs = [];
            Object.keys(data?.tab4?.part1?.region || {}).forEach(regId => {
                const subs = Object.keys(data?.tab4?.part1?.region[regId].sub || {});
                subs.forEach(subId => allSubs.push(`${regId}-${subId}`));
            });
            return allSubs;
        });
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);
    if ( !data ) return <LoadingScreen />;
    return (
        <div className="animate-fade-in">
            <div className="my-3">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-4xl font-black text-white drop-shadow-sm">
                            4
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-gray-800 leading-none font-kanit text-center">
                            ระบบสืบค้นและเจาะลึกสถิติการเรียกรายงานตัวรายเขตพื้นที่
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 my-2">
                    <div className="col-span-12 lg:col-span-12">
                        <T4P1_filterDlaListed 
                            setIsOpen={setIsOpen}
                            setDetails={setDetails}
                            data={data}
                            selectedRegions={selectedRegions}
                            setSelectedRegions={setSelectedRegions}
                            selectedSubRegions={selectedSubRegions}
                            setSelectedSubRegions={setSelectedSubRegions}
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                            selectedPositions={selectedPositions}
                            setSelectedPositions={setSelectedPositions}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 my-2">
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T4P2_showingAllTable data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}