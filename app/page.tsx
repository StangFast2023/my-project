"use client";
import { useState, useEffect } from 'react';
import axios from "axios";

import Tab1 from './components/tab1'; 
import Tab2 from './components/tab2';
import Tab3 from './components/tab3'; 

//--- modal
import ModalPart6Top10 from './components/sub-component/tab1/modal/modal_of_part6top10pos'; 

export default function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tab1');

    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState(null);

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

    useEffect(() => {

        if (isOpen) {

            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";

        } else {

            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";

        }

        return () => {

            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = "auto";

        };

    }, [isOpen]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#D3D3D3]">
                <div className="w-60 h-60 border-15 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                <p className="mt-10 text-3xl text-600 font-kanit text-gray-800 animate-pulse">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(159, 209, 181, 1) 100%)' }}>
            <div>
                <h1 className="font-kanit text-3xl font-bold text-center text-black" style={{ padding: '2rem 1rem' }}>
                    ข้อมูลสถิติการเรียกรายงานตัวข้าราชการท้องถิ่นปี <b style={{ padding: '0.5rem', border: '1px solid black', margin: '0.5rem'  ,borderRadius: '1rem', background:' #ffffffab', boxShadow: '2px 2px 10px gray' }}>2568</b>
                </h1>
            </div>
            <hr className="w-full border-t-5 border-gray-500 my-5 shadow-sm" />
            <div className="my-3 p-2">
                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-full shadow-xl">
                    <button  onClick={() => setActiveTab('tab1')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab1' ? 'bg-white shadow text-green-600' : 'text-gray-400'}`} >
                        สรุปภาพรวมทุกเขต
                    </button>
                    <button  onClick={() => setActiveTab('tab2')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab2' ? 'bg-white shadow text-green-600' : 'text-gray-400'}`} >
                        ข้อมูลรายภาคและเขต
                    </button>
                    <button  onClick={() => setActiveTab('tab3')} className={`flex-1 px-6 py-2 text-lg rounded-lg transition font-bold ${activeTab === 'tab3' ? 'bg-white shadow text-green-600' : 'text-gray-400'}`} >
                        ข้อมูลเจาะลึก & คาดการณ์
                    </button>
                </div>
                <div className="mt-6">
                    {activeTab === 'tab1' && ( <div className="animate-fade-in"> <Tab1 setIsOpen={setIsOpen} setDetails={setDetails} data={data}/> </div> )}
                    {activeTab === 'tab2' && ( <div className="animate-fade-in"> <Tab2 setIsOpen={setIsOpen} setDetails={setDetails} data={data}/> </div> )}
                    {activeTab === 'tab3' && ( <div className="animate-fade-in"> <Tab3 setIsOpen={setIsOpen} setDetails={setDetails} data={data}/> </div> )}
                </div>
            </div>

            {/* for part6 top 10 position */}
            <ModalPart6Top10 isOpen={isOpen} setIsOpen={setIsOpen} details={details} loading={loading} />


        </main>
  );
}