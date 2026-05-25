"use client";

export default function PositionDetailModal({  isOpen, setIsOpen, details , loading }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsOpen(false)}>
            <div className="bg-gray-50 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {!loading && details && (
                    <div className="px-8 py-5 bg-white border-b">
                        <div className=" flex items-center justify-between shrink-0">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400 font-kanit">รายละเอียดข้อมูลรายเขต</span>
                                <h2 className="text-2xl text-gray-800 font-bold font-kanit"> {details.name}</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"> 
                                ปิดหน้าต่าง
                            </button>
                        </div>
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-100 text-center">
                                <span className="text-sm text-gray-400 font-kanit">ขึ้นบัญชีทั้งหมด</span>
                                <h2 className="text-2xl text-gray-800 font-bold font-kanit"> {details.total.listed.toLocaleString()}</h2>
                            </div>
                            <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-100 text-center">
                                <span className="text-sm text-gray-400 font-kanit">เรียกทั้งหมด</span>
                                <h2 className="text-2xl text-gray-800 font-bold font-kanit"> {details.total.called.toLocaleString()}</h2>
                            </div>
                            <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-100 text-center">
                                <span className="text-sm text-gray-400 font-kanit">คงเหลือ</span>
                                <h2 className="text-2xl text-gray-800 font-bold font-kanit"> {details.total.remain.toLocaleString()}</h2>
                            </div>
                        </div>
                        <div className="mt-2 bg-gray-50 p-4 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-500 text-sm font-medium">ความคืบหน้าการเรียกใช้บัญชีทั้งหมด</p>
                                <span className="text-lg font-black text-gray-700">
                                    {( ( details.total.called / details.total.listed ) * 100 ).toFixed(2)} %
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-1000 ${( ( ( details.total.called / details.total.listed ) * 100 ) ) >= 100 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${Math.min( ( ( details.total.called / details.total.listed ) * 100 ) , 100)}%` }} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                            <div className="w-20 h-20 border-8 border-gray-100 border-t-green-600 rounded-full animate-spin"></div>
                            <p className="mt-8 text-2xl font-kanit text-gray-400 animate-pulse">กำลังดึงข้อมูลจากฐานข้อมูล...</p>
                        </div>
                    ) : (
                        <>
                            {details?.data && Object.entries(details.data).map(([key, zone]) => (
                                <div key={key} className="mb-5">
                                    <div className="py-3 bg-gray-50/95 backdrop-blur-sm">
                                        <h3 className="text-xl text-white p-4 bg-gray-800 rounded-2xl font-bold shadow-md">
                                            {zone.pro_main_name}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 lg:pl-4">
                                        {Object.entries(zone)
                                            .filter(([k, v]) => typeof v === "object")
                                            .map(([subKey, item]) => (
                                                <div key={subKey} className="group p-1 border-0 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden" >
                                                    <div className="p-5">
                                                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold text-gray-700 text-lg">เขต</span>
                                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                                                                    {item.pro_sub_id}
                                                                </div>
                                                            </div>
                                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${ item.status_listed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                                { item.status_listed ? "● เปิดสอบ" : "● ไม่เปิดสอบ" }
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                                            <div className="bg-white p-3 border border-gray-50 rounded-2xl shadow-inner">
                                                                <p className="text-gray-400 text-[12px] mb-1">ขึ้นบัญชี</p>
                                                                <p className="text-right text-xl font-bold text-gray-600">
                                                                    {item.status_listed ? item.total_listed.toLocaleString() : "-"}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white p-3 border border-gray-50 rounded-2xl shadow-inner">
                                                                <p className="text-gray-400 text-[12px] mb-1">จำนวนรอบ</p>
                                                                <p className="text-right text-xl font-bold text-blue-600">
                                                                    {item.status_listed ? item.total_round.toLocaleString() : "-"}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white p-3 border border-gray-50 rounded-2xl shadow-inner">
                                                                <p className="text-gray-400 text-[12px] mb-1">เรียกแล้ว</p>
                                                                <p className="text-right text-xl font-bold text-green-600">
                                                                    {item.status_listed ? item.total_called.toLocaleString() : "-"}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white p-3 border border-gray-50 rounded-2xl shadow-inner">
                                                                <p className="text-gray-400 text-[12px] mb-1">คงเหลือ</p>
                                                                <p className="text-right text-xl font-bold text-orange-600">
                                                                    {item.status_listed ? item.total_remain.toLocaleString() : "-"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 bg-gray-50 p-4 rounded-2xl">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <p className="text-gray-500 text-sm font-medium">ความคืบหน้าการเรียกใช้บัญชี</p>
                                                                <span className="text-lg font-black text-gray-700">{item.total_process.toFixed(2)} %</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                                <div className={`h-full rounded-full transition-all duration-1000 ${item.total_process >= 100 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${Math.min(item.total_process, 100)}%` }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}