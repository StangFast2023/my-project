import { useState } from 'react';
import Tab5_1 from '../../tab5_1';
import Tab5_2 from '../../tab5_2';

export default function T5P1S1_CurrentData({ details, base_data, data }) {
    const dataforChart = data || null;
    const [activeTab, setActiveTab] = useState('tab5_1');
    return (
        <div className="text-sm md:text-base lg:text-lg">

            <div className="flex flex-col md:flex-row mb-6 bg-gray-100 p-1 rounded-xl w-full shadow-xl text-sm sm:text-base lg:text-2xl gap-1">
                <button
                    onClick={() => setActiveTab('tab5_1')}
                    className={`flex-1 px-3 sm:px-6 py-3 md:py-2 rounded-lg transition font-bold w-full min-w-0 ${activeTab === 'tab5_1' ? 'bg-white shadow text-green-600' : ''
                        }`}
                >
                    <span className={`${activeTab === 'tab5_1'
                            ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent'
                            : 'text-gray-400'
                        }`}>
                        สรุปสถานะการเรียกบรรจุ ณ ปัจจุบัน
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('tab5_2')}
                    className={`flex-1 px-3 sm:px-6 py-3 md:py-2 rounded-lg transition font-bold w-full min-w-0 ${activeTab === 'tab5_2' ? 'bg-white shadow text-green-600' : ''
                        }`}
                >
                    <span className={`${activeTab === 'tab5_2'
                            ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent'
                            : 'text-gray-400'
                        }`}>
                        แนวโน้มและโอกาสการบรรจุในอนาคต
                    </span>
                </button>
            </div>

            <div>
                {activeTab === 'tab5_1' && (<div className="animate-fade-in"> <Tab5_1 details={details} base_data={base_data} data={dataforChart} /> </div>)}
                {activeTab === 'tab5_2' && (<div className="animate-fade-in"> <Tab5_2 details={details} base_data={base_data} data={dataforChart} /> </div>)}
            </div>

        </div>
    );
}