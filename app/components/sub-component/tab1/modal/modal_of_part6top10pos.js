"use client";

export default function PositionDetailModal({  isOpen, setIsOpen, details , loading }) {

    if (!isOpen) return null;

    return (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 " onClick={() => setIsOpen(false)} >
            <div className=" bg-white w-full max-w-6xl h-[90vh] rounded-2xl overflow-y-auto p-6 " onClick={(e) => e.stopPropagation()}>
                {
                    loading && (
                        <div className="flex flex-col items-center justify-center min-h-screen w-full">
                            <div className="w-20 h-20 border-10 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                            <p className="mt-10 text-3xl text-600 font-kanit text-gray-800 animate-pulse">กำลังโหลดข้อมูล...</p>
                        </div>
                    )
                }
                {
                    !loading && details && (
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl text-gray-400"> รายละเอียดตำแหน่ง <span className="text-2xl text-gray-600 font-bold">{details.name}</span>  </h2>
                            <button onClick={() => setIsOpen(false)} className=" px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition " > ปิด </button>
                        </div>
                    )
                }
                {
                    Object.entries(details.data).map(([key, zone]) => (

                        <div key={key}>
                            <h3 className="text-xl text-white-950 p-4 my-2 bg-gray-600 rounded-xl font-bold">
                                {zone.pro_main_name}
                            </h3>
                            {
                                Object.entries(zone)
                                    .filter(([k, v]) => typeof v === "object")
                                    .map(([subKey, item]) => (
                                        <div key={subKey} className="p-2 mb-3 border rounded-xl bg-white shadow-sm " >
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 mb-4 font-kanit">
                                                <div className="bg-white p-2 border-l-4">
                                                    <p className="text-gray-500 text-sm">เขต</p>
                                                    <div className="items-baseline gap-2 text-right">
                                                        <span className="text-xl font-bold text-gray-600">
                                                            {item.pro_sub_id}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-2 border-l-4">
                                                    <p className="text-gray-500 text-sm">สถานะเปิดสอบ :</p>
                                                    <div className="items-baseline gap-2 text-right">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ item.status_listed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                            { item.status_listed ? "เปิดสอบ" : "ไม่เปิดสอบ" }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-2 border-l-4">
                                                    <p className="text-gray-500 text-sm">ขึ้นบัญชี :</p>
                                                    <div className="items-baseline gap-2 text-right">
                                                        <span className="text-xl font-bold text-gray-600">
                                                            {item.total_listed.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-2 border-l-4">
                                                    <p className="text-gray-500 text-sm">เรียกแล้ว :</p>
                                                    <div className="items-baseline gap-2 text-right">
                                                        <span className="text-xl font-bold text-gray-600">
                                                            {item.total_called.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-2 border-l-4">
                                                    <p className="text-gray-500 text-sm">คงเหลือ :</p>
                                                    <div className="items-baseline gap-2 text-right">
                                                        <span className="text-xl font-bold text-gray-600">
                                                            {item.total_remain.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-2 border-l-4">
                                                <p className="text-gray-500 text-sm">ความคืบหน้าการเรียกใช้บัญชี :</p>
                                                <div className="items-baseline gap-2 text-right">
                                                    <span className="text-xl font-bold text-gray-600">
                                                        {item.total_process.toFixed(2)} %
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                    <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(item.total_process, 100)}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                    ))
                            }

                        </div>

                    ))
                }
            </div>
        </div>
    );
}