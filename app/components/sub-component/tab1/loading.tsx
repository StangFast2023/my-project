import CountUp from 'react-countup';
export default function LoadingSkeleton() {
    return (
        <div>
            <div className="my-3">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className=" text-lg md:text-base lg:text-4xl font-black text-white drop-shadow-sm">
                            1
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className=" text-sm md:text-base lg:text-3xl font-black text-gray-800 leading-none font-kanit">
                            รายงานสรุปสถิติการเรียกมารายงานตัวเพื่อบรรจุข้าราชการหรือพนักงานส่วนท้องถิ่นประจำปี 2568
                        </h2>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-12">
                    <div className="grid grid-cols-1 grid-cols-2 gap-2 md:grid-cols-6 lg:grid-cols-6 lg:gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xs">
                                <p className="text-white text-sm"> - </p>
                                <div className="items-baseline gap-2 text-right">
                                    <span className="text-sm md:text-base lg:text-3xl font-bold text-white">
                                        <CountUp
                                            end={0}
                                            duration={3}
                                            separator=","
                                            decimals={0}
                                            useEasing={true}
                                        />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="animate-pulse col-span-12 lg:col-span-9 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h3 className="flex text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                            <span className="ml-2 text-white">-</span>
                        </h3>
                        <div className="w-full h-[370px]">
                        </div>
                    </div>
                </div>
                <div className="animate-pulse col-span-12 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h3 className="flex text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                            <span className="ml-2 text-white">-</span>
                        </h3>
                        <div className="w-full h-[370px]">
                        </div>
                    </div>
                </div>
                <div className="animate-pulse col-span-12 lg:col-span-9 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h3 className="flex text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                            <span className="ml-2 text-white">-</span>
                        </h3>
                        <div className="w-full h-[370px]">
                        </div>
                    </div>
                </div>
                <div className="animate-pulse col-span-12 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h3 className="flex text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                            <span className="ml-2 text-white">-</span>
                        </h3>
                        <div className="w-full h-[370px]">
                        </div>
                    </div>
                </div>
                <div className="animate-pulse col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h3 className="flex text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">
                            <span className="ml-2 text-white">-</span>
                        </h3>
                        <div className="w-full h-[600px]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}