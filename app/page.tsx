"use client";
import { useState, useEffect } from 'react';
import axios                from "axios";
import Tab1                 from './components/tab1'; 
import Tab2                 from './components/tab2';
import Tab3                 from './components/tab3'; 
import Tab4                 from './components/tab4'; 
import Tab5                 from './components/tab5'; 
import LoadingWrapper       from './components/LoadingWrapper'; 
import ModalTab1Part6       from './components/sub-component/tab2/modal/modal_of_part6top10pos'; 
import ModalFilterSelect    from './components/sub-component/tab5/modal/modalFilterSelect'; 
export interface FilterData {
    id_region: number;
    id_sub_regoin: number;
    id_position: number;
    number_rank: number;
}
export default function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tab5');

    const [details, setDetails] = useState(null);
    const [isOpen2, setIsOpen2] = useState(false);

    const [details5, setDetails5] = useState<FilterData | null>(null);;
    const [isOpen5, setIsOpen5] = useState(false);
    const handleSave = (val: FilterData) => {
        console.log("ข้อมูลที่ได้รับจาก Modal:", val);
        setDetails5(val); 
        setIsOpen5(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/data-stats");
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return (
        <LoadingWrapper isLoading={loading}>
            <main className="pb-5" style={{ minHeight: '100vh', background: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(159, 209, 181, 1) 100%)' }}>
                <div className="flex flex-col items-center pt-5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-right text-gray-700">
                            DLA {" "}
                            <span className="bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent [-webkit-text-stroke:_2px_gray]">
                                Dashboard
                            </span>
                            <br></br>
                            สถิติการเรียกบรรจุข้าราชการท้องถิ่น
                        </h1>
                        <div className="text-5xl text-gray-700 shadow-lg bg-white px-4 py-1 rounded-3xl shadow-md border border-emerald-100 text-2xl font-bold bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-600">
                            2568
                        </div>
                    </div>
                    <h2 className="text-gray-600 mt-2 text-2xl font-bold"></h2>
                </div>
                <div className="my-2 p-2">
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-full shadow-xl">
                        <button  onClick={() => setActiveTab('tab1')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab1' ? 'bg-white shadow text-green-600' : null }`} >
                            <span className={`${ activeTab === 'tab1' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400' }`}>
                                สรุปภาพรวมทุกเขต
                            </span>
                        </button>
                        <button  onClick={() => setActiveTab('tab2')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab2' ? 'bg-white shadow text-green-600' : null }`} >
                            <span className={`${ activeTab === 'tab2' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400' }`}>
                                ข้อมูลประเภทและตำแหน่ง
                            </span>
                        </button>
                        <button  onClick={() => setActiveTab('tab3')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab3' ? 'bg-white shadow text-green-600' : null }`} >
                            <span className={`${ activeTab === 'tab3' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400' }`}>
                                ข้อมูลรายภาคและเขต
                            </span>
                        </button>
                        <button  onClick={() => setActiveTab('tab4')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab4' ? 'bg-white shadow text-green-600' : null }`} >
                            <span className={`${ activeTab === 'tab4' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400' }`}>
                                ข้อมูลเจาะลึกรายเขตและตำแหน่ง
                            </span>
                        </button>
                        <button  onClick={() => setActiveTab('tab5')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab5' ? 'bg-white shadow text-green-600' : null }`} >
                            <span className={`${ activeTab === 'tab5' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400' }`}>
                                วิเคราะห์โอกาสเรียกตัว
                            </span>
                        </button>
                    </div>
                    <div className="mt-6">
                        {activeTab === 'tab1' && ( <div className="animate-fade-in"> <Tab1 data={data}/> </div> )}
                        {activeTab === 'tab2' && ( <div className="animate-fade-in"> <Tab2 setIsOpen={setIsOpen2} setDetails={setDetails} data={data}/> </div> )}
                        {activeTab === 'tab3' && ( <div className="animate-fade-in"> <Tab3 data={data}/> </div> )}
                        {activeTab === 'tab4' && ( <div className="animate-fade-in"> <Tab4 data={data}/> </div> )}
                        {activeTab === 'tab5' && ( <div className="animate-fade-in"> <Tab5 setIsOpen={setIsOpen5} details={details5} data={data}/> </div> )}                    </div>
                </div>

                {/* for tap1 part6 */}
                <ModalTab1Part6 isOpen={isOpen2} setIsOpen={setIsOpen2} details={details} loading={loading} />

                {/* for tap5 part1 */}
                <ModalFilterSelect isOpen={isOpen5} setIsOpen={setIsOpen5} details={details5} loading={loading} data={data} onSave={handleSave} />

            </main>
        </LoadingWrapper>
  );
}