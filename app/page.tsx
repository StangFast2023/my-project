"use client";
import { useState, useEffect } from 'react';
import Tab1 from './components/tab1';
import Tab2 from './components/tab2';
import Tab3 from './components/tab3';
import Tab4 from './components/tab4';
import Tab5 from './components/tab5';
import ModalTab2Part6 from './components/sub-component/tab2/modal/modal_of_part6top10pos';
import ModalFilterSelect from './components/sub-component/tab5/modal/modalFilterSelect';
export interface FilterData {
    id_region: number;
    id_sub_regoin: number;
    id_position: number;
    number_rank: number;
}
export default function App() {

    const [activeTab, setActiveTab] = useState('tab1');
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

    const [showDisclaimer, setShowDisclaimer] = useState(() => {
        if (typeof window === 'undefined') return false;
        const lastSeen = localStorage.getItem('lastSeenDisclaimer');
        if (!lastSeen) return true;
        const now = Date.now();
        const HOURS_TO_WAIT = 24;
        const isExpired = (now - parseInt(lastSeen)) > HOURS_TO_WAIT * 60 * 60 * 1000;
        return isExpired;
    });

    const handleAccept = () => {
        localStorage.setItem('lastSeenDisclaimer', Date.now().toString());
        setShowDisclaimer(false);
    };

    return (
        <main className="pb-5">
            {showDisclaimer && (
                <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg text-center max-h-[90vh] overflow-y-auto">
                        <h2 className="text-gray-800 text-xl lg:text-2xl font-bold mb-3">แนะนำการใช้งาน</h2>
                        <p className="mb-6 text-gray-600 text-sm lg:text-lg">
                            เพื่อให้ได้รับประสิทธิภาพสูงสุดในการดูข้อมูล<br></br>แนะนำให้เปิดใช้งานผ่าน
                            <span className="font-bold text-blue-600"> PC หรือ Notebook</span> ครับ
                        </p>
                        <button
                            onClick={handleAccept}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95"
                        >
                            รับทราบและเข้าใช้งาน
                        </button>
                    </div>
                </div>
            )}

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
                            <button onClick={() => { setActiveTab('tab1'); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">สรุปภาพรวม</button>
                            <button onClick={() => { setActiveTab('tab2'); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">ข้อมูลประเภทและตำแหน่ง</button>
                            <button onClick={() => { setActiveTab('tab3'); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">ข้อมูลรายภาคและเขต</button>
                            <button onClick={() => { setActiveTab('tab4'); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">ข้อมูลเจาะลึกรายเขตและตำแหน่ง</button>
                            <button onClick={() => { setActiveTab('tab5'); setIsMenuOpen(false) }} className="p-3 bg-white rounded-lg">วิเคราะห์โอกาสเรียกตัว</button>
                        </div>
                    )}
                </div>

                <div className="hidden md:flex sticky top-0 z-50 gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-full shadow-xl">
                    <button onClick={() => setActiveTab('tab1')} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 'tab1' ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 'tab1' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            สรุปภาพรวม
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('tab2')} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 'tab2' ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 'tab2' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            ข้อมูลประเภทและตำแหน่ง
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('tab3')} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 'tab3' ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 'tab3' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            ข้อมูลรายภาคและเขต
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('tab4')} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 'tab4' ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 'tab4' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            ข้อมูลเจาะลึกรายเขตและตำแหน่ง
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('tab5')} className={`flex-1 px-6 py-2 rounded-lg transition font-bold ${activeTab === 'tab5' ? 'bg-white shadow text-green-600' : null}`} >
                        <span className={`${activeTab === 'tab5' ? 'bg-gradient-to-r from-emerald-200 via-teal-400 to-teal-400 bg-clip-text text-transparent bg-white text-green-600' : 'text-gray-400'}`}>
                            วิเคราะห์โอกาสเรียกตัว
                        </span>
                    </button>
                </div>
                <div className="mt-6">
                    {activeTab === 'tab1' && (<div className="animate-fade-in"> <Tab1 /> </div>)}
                    {activeTab === 'tab2' && (<div className="animate-fade-in"> <Tab2 setIsOpen={setIsOpen2} setDetails={setDetails} /> </div>)}
                    {activeTab === 'tab3' && (<div className="animate-fade-in"> <Tab3 /> </div>)}
                    {activeTab === 'tab4' && (<div className="animate-fade-in"> <Tab4 /> </div>)}
                    {activeTab === 'tab5' && (<div className="animate-fade-in"> <Tab5 setIsOpen={setIsOpen5} details={details5} /> </div>)}
                </div>
            </div>

            {/* for tap2 part6 */}
            <ModalTab2Part6 isOpen={isOpen2} setIsOpen={setIsOpen2} details={details} />

            {/* for tap5 part1 */}
            <ModalFilterSelect isOpen={isOpen5} setIsOpen={setIsOpen5} onSave={handleSave} />
        </main>
    );
}