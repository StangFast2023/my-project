export default function LoadingSkeleton() {
    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                    <span className="text-lg md:text-base lg:text-4xl font-black text-white drop-shadow-sm">
                        5
                    </span>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className="text-lg md:text-base lg:text-3xl font-black text-gray-800 leading-none font-kanit text-center">
                        ข้อมูลเจาะลึก และคาดการณ์เรียกบรรจุ
                    </h2>
                </div>
            </div>
            <div className="animate-pulse grid grid-cols-12 gap-6 mb-12">
                <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl min-h-[200px] shadow-sm border border-gray-100">
                </div>
            </div>
            <div className="animate-pulse grid grid-cols-12 gap-6 mb-12">
                <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl min-h-[100px] shadow-sm border border-gray-100">
                </div>
            </div>
            <div className="animate-pulse grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl min-h-[800px] shadow-sm border border-gray-100">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="h-6 bg-white rounded w-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}