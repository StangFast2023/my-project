"use client";
import { useState, useEffect } from 'react';
import Tab1 from './components/tab1';
import Tab2 from './components/tab2';
import Tab3 from './components/tab3';
import Tab4 from './components/tab4';
import Tab5 from './components/tab5';
import ModalTab2Part6 from './components/sub-component/tab2/modal/modal_of_part6top10pos';
import ModalFilterSelect from './components/sub-component/tab5/modal/modalFilterSelect';
import { useSyncExternalStore } from "react";
export interface FilterData {
    id_region: number;
    id_sub_regoin: number;
    id_position: number;
    number_rank: number;
}

export default function App() {

    const subscribe = (callback: () => void) => {
        window.addEventListener("activeMainTabChange", callback);

        return () => {
            window.removeEventListener("activeMainTabChange", callback);
        };
    };

    const getActiveTab = () => {
        const savedTab = sessionStorage.getItem("activeMainTab");
        const parsed = Number(savedTab);

        return parsed >= 1 && parsed <= 5 ? parsed : 1;
    };

    const getServerActiveTab = () => 1;

    const activeTab = useSyncExternalStore(
        subscribe,
        getActiveTab,
        getServerActiveTab
    );

    const handleTabChange = (tabId: number) => {
        sessionStorage.setItem("activeMainTab", String(tabId));

        window.dispatchEvent(new Event("activeMainTabChange"));
    };

    const [stats, setStats] = useState({
        total_views: 0,
        unique_visitors: 0,
        today_views: 0,
    });

    const fetchStats = () => {
        fetch("http://127.0.0.1:8000/api/visitor-stats")
            .then((res) => res.json())
            .then((resData) => {
                if (resData.status === "success" && resData.data) {
                    setStats(resData.data);
                }
            })
            .catch((err) => console.error("Fetch Stats Error:", err));
    };
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/track-view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page_name: `tab${activeTab}_recruitment` }),
        })
            .then(() => {
                fetchStats();
            })
            .catch((err) => console.error("Tracking Error:", err));
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    {/* for tap2 part6 */ }
    const [details, setDetails] = useState(null);
    const [isOpen2, setIsOpen2] = useState(false);

    {/* for tap5 part1 */ }
    const [details5, setDetails5] = useState<FilterData | null>(null);;
    const [isOpen5, setIsOpen5] = useState(false);
    const handleSave = (val: FilterData) => {
        setDetails5(val);
        setIsOpen5(false);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [activeTab]);

    return (
        <main className="pb-10">
            <div className="flex flex-col items-center pt-5">
                <div className="flex items-center gap-3">
                    <h1 className="text-sm md:text-base lg:text-3xl font-black text-right text-gray-700">
                        DLA {" "}
                        <span className="bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent [-webkit-text-stroke:_2px_gray]">
                            Dashboard
                        </span>
                        <br></br>
                        สถิติการเรียกบรรจุข้าราชการท้องถิ่น
                    </h1>
                    <div className="text-sm md:text-base lg:text-5xl text-gray-700 shadow-lg bg-white px-4 py-1 rounded-3xl shadow-md border border-emerald-100 text-2xl font-bold bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-600">
                        2568
                    </div>
                </div>
            </div>
            <div className="my-2 p-2 text-sm md:text-base lg:text-lg">
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-4 bg-gray-100 rounded-xl w-full text-left font-bold text-emerald-600">
                        {isMenuOpen ? "✕ ปิดเมนู" : "☰ เลือกเมนูวิเคราะห์"}
                    </button>
                    {isMenuOpen && (
                        <div className="flex flex-col text-sm text-gray-600 font-semibold gap-2 mt-2 bg-gray-100 p-2 rounded-xl shadow-lg">
                            <button onClick={() => { handleTabChange(1); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">สรุปภาพรวม</button>
                            <button onClick={() => { handleTabChange(2); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">ข้อมูลประเภทและตำแหน่ง</button>
                            <button onClick={() => { handleTabChange(3); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">ข้อมูลรายภาคและเขต</button>
                            <button onClick={() => { handleTabChange(4); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">ข้อมูลเจาะลึกรายเขตและตำแหน่ง</button>
                            <button onClick={() => { handleTabChange(5); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">วิเคราะห์โอกาสเรียกตัว</button>
                        </div>
                    )}
                </div>
                <div className="hidden md:flex sticky top-0 z-50 gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-full shadow-xl">
                    <button onClick={() => handleTabChange(1)} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 1 ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 1 ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            สรุปภาพรวม
                        </span>
                    </button>
                    <button onClick={() => handleTabChange(2)} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 2 ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 2 ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            ข้อมูลประเภทและตำแหน่ง
                        </span>
                    </button>
                    <button onClick={() => handleTabChange(3)} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 3 ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 3 ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            ข้อมูลรายภาคและเขต
                        </span>
                    </button>
                    <button onClick={() => handleTabChange(4)} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 4 ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 4 ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            ข้อมูลเจาะลึกรายเขตและตำแหน่ง
                        </span>
                    </button>
                    <button onClick={() => handleTabChange(5)} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 5 ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 5 ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            วิเคราะห์โอกาสเรียกตัว
                        </span>
                    </button>
                </div>
                <div className="mt-6">
                    {activeTab === 1 && (<div className="animate-fade-in"> <Tab1 /> </div>)}
                    {activeTab === 2 && (<div className="animate-fade-in"> <Tab2 setIsOpen={setIsOpen2} setDetails={setDetails} /> </div>)}
                    {activeTab === 3 && (<div className="animate-fade-in"> <Tab3 /> </div>)}
                    {activeTab === 4 && (<div className="animate-fade-in"> <Tab4 /> </div>)}
                    {activeTab === 5 && (<div className="animate-fade-in"> <Tab5 setIsOpen={setIsOpen5} details={details5} /> </div>)}
                </div>
            </div>

            {/* for tap2 part6 */}
            <ModalTab2Part6 isOpen={isOpen2} setIsOpen={setIsOpen2} details={details} />

            {/* for tap5 part1 */}
            <ModalFilterSelect isOpen={isOpen5} setIsOpen={setIsOpen5} onSave={handleSave} />

            <div className="mb-5">
                <div className="flex item-end gap-4 p-4">
                    <div className="flex-1 bg-white p-5 rounded-xl shadow-md border border-gray-100">
                        <p className="text-gray-500 text-sm font-medium">เข้าชมทั้งหมด</p>
                        <p className="text-3xl font-bold text-gray-800 text-right">
                            {stats.total_views.toLocaleString()} <span className="text-base font-normal text-gray-500">ครั้ง</span>
                        </p>
                    </div>

                    <div className="flex-1 bg-white p-5 rounded-xl shadow-md border border-gray-100">
                        <p className="text-gray-500 text-sm font-medium">ผู้เข้าชมไม่ซ้ำ</p>
                        <p className="text-3xl font-bold text-blue-600 text-right">
                            {stats.unique_visitors.toLocaleString()} <span className="text-base font-normal text-gray-500">คน</span>
                        </p>
                    </div>

                    <div className="flex-1 bg-white p-5 rounded-xl shadow-md border border-gray-100">
                        <p className="text-gray-500 text-sm font-medium">เข้าชมวันนี้</p>
                        <p className="text-3xl font-bold text-green-600 text-right">
                            {stats.today_views.toLocaleString()} <span className="text-base font-normal text-gray-500">ครั้ง</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-xl">
                <div className="mx-auto flex full-max-w items-center gap-4 px-4 py-3 border-2 border-gray-400">
                    <p className="flex-1 leading-6 text-gray-700 text-center">
                        <span className="font-semibold">หมายเหตุ</span>
                        <span className="mx-2">:</span>
                        <span className="text-sm">
                            ยอดเรียกบรรจุ 3 รอบแรกเป็นยอดที่เรียกจากบัญชีเดิม ก่อนการปรับปรุงบัญชี จึงไม่สามารถระบุได้ว่าผู้ที่ถูกเรียกทั้งหมดมีจำนวนเท่าใดที่ยังคงอยู่ในบัญชีใหม่
                            การคำนวณความคืบหน้าเป็นการนำยอดเรียกสะสมจากบัญชีเดิมมาเปรียบเทียบกับจำนวนผู้สอบแข่งขันได้ตามบัญชีใหม่ เพื่อใช้เป็นข้อมูลประกอบเท่านั้น
                        </span>
                    </p>
                </div>
            </div>
        </main>
    );
}