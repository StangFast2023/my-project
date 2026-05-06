"use client";
import { useState, useEffect } from 'react';
import Tab1 from './components/tab1'; 
import Tab2 from './components/tab2';
import Tab3 from './components/tab3'; 
import Tab4 from './components/tab4';

export default function App() {

    const [dbData, setDbData] = useState(null);
    const [activeTab, setActiveTab] = useState('tab1');

    useEffect(() => {
        console.log("--- เริ่มต้นการทำงานของ useEffect ---"); // <--- ใส่บรรทัดนี้
        fetch('/api/data')
            .then(res => {
                console.log("ได้รับ Response จาก API แล้ว");
                return res.json();
            })
            .then(data => {
                console.log("Data checking:", data);
                setDbData(data);
            })
            .catch(err => console.error("เกิดข้อผิดพลาด:", err));
    }, []);


    return (

        <main style={{ minHeight: '100vh', background: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(159, 209, 181, 1) 100%)' }}>
            <div>
                <h1 className="font-kanit text-3xl font-bold text-center text-black" style={{ padding: '2rem 1rem' }}>
                    ข้อมูลสถิติการเรียกบรรจุข้าราชการท้องถิ่นปี <b style={{ padding: '0.5rem', border: '1px solid black', margin: '0.5rem'  ,borderRadius: '1rem', background:' #ffffffab', boxShadow: '2px 2px 10px gray' }}>2568</b>
                </h1>
            </div>
            <hr style={{ borderWidth: '0.15rem', color: '#00000091' }}></hr>


            <div className="p-6">
                {/* เมนูแท็บ */}
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
                    {activeTab === 'tab1' && ( <div className="animate-fade-in"> <Tab1 data={dbData}/> </div> )}
                    {activeTab === 'tab2' && ( <div className="animate-fade-in"> <Tab2 /> </div> )}
                    {activeTab === 'tab3' && ( <div className="animate-fade-in"> <Tab3 /> </div> )}
                </div>
            </div>

        </main>
  );
}