
import CountUp from 'react-countup';

export default function Row1StaticNumber({ data }) {
    const status_work = data?.status_work || {};
    const status_out_list = data?.status_out_list || {};

    return (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-4">


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    ลำดับของคุณ :
                </p>

                <div className="mt-2 text-right">
                    <span className="text-xl md:text-base lg:text-3xl font-bold text-gray-600">
                        {data ? (
                            <CountUp
                                end={data?.rank}
                                duration={3}
                                separator=","
                                decimals={0}
                                useEasing={true}
                            />
                        ) : '\u00A0\u00A0'}
                    </span>
                </div>

                <div className="mt-2 h-2 md:h-3 w-full overflow-hidden rounded-full bg-gray-50">
                    {'\u00A0\u00A0'}
                </div>
            </div>


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    สถานะ :
                </p>

                <div className="mt-2 text-right">
                    <span className={`text-sm md:text-base lg:text-3xl font-bold ${data
                        ? (status_work === 'waiting' ? 'text-sky-600' : 'text-emerald-600')
                        : 'text-gray-600'
                        }`}>
                        {data
                            ? (status_work === 'waiting' ? 'รอเรียกบรรจุ' : 'ได้รับการบรรจุ')
                            : '\u00A0\u00A0'}
                    </span>
                </div>

                <div className="mt-2 h-2 md:h-3 w-full overflow-hidden rounded-full bg-gray-50">
                    {'\u00A0\u00A0'}
                </div>
            </div>


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    สถานะบัญชีตำแหน่ง :
                </p>

                <div className="mt-2 text-right">
                    <span className={`text-sm md:text-base lg:text-3xl font-bold ${data
                        ? (status_out_list === true
                            ? 'text-emerald-600'
                            : (data?.process_bars <= 100 ? 'text-amber-600' : 'text-rose-600'))
                        : 'text-gray-600'
                        }`}>
                        {data
                            ? (status_out_list === true
                                ? 'บัญชีสิ้นสุดแล้ว'
                                : (data?.process_bars <= 100 ? 'บัญชีปกติ' : 'ขาดแคลน'))
                            : '\u00A0\u00A0'}
                    </span>
                </div>

                <div className="mt-2 h-2 md:h-3 w-full overflow-hidden rounded-full bg-gray-50">
                    {'\u00A0\u00A0'}
                </div>
            </div>


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    ความคืบหน้าในการเรียกใช้บัญชี :
                </p>

                <div className="mt-2 text-right">
                    <span className={`text-xl md:text-base lg:text-3xl font-bold ${data?.process_bars <= 100 ? 'text-gray-600' : 'text-violet-600'
                        }`}>
                        {data ? (
                            <CountUp
                                end={data?.process_bars}
                                duration={3}
                                separator=","
                                decimals={2}
                                useEasing={true}
                                suffix="%"
                            />
                        ) : '\u00A0\u00A0'}
                    </span>
                </div>

                <div className="mt-2 h-2 md:h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${data
                            ? (data?.process_bars <= 100
                                ? 'bg-green-500'
                                : (data?.process_bars === 100 ? 'bg-blue-500' : 'bg-violet-500'))
                            : 'bg-white'
                            }`}
                        style={{
                            width: `${Math.min(Number(data?.process_bars) || 0, 100)}%`
                        }}
                    />
                </div>
            </div>


            <div className="col-span-2 md:col-span-1 flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    อัตราการเรียกบรรจุเฉลี่ยต่อรอบ :
                </p>

                <div className="mt-2 text-right">
                    <span className="text-xl md:text-base lg:text-3xl font-bold text-gray-600">
                        {data ? (
                            <>
                                <CountUp
                                    end={data?.avg_call}
                                    duration={3}
                                    separator=","
                                    decimals={2}
                                    useEasing={true}
                                />
                                <span className="text-xs md:text-sm"> คน/รอบ</span>
                            </>
                        ) : '\u00A0\u00A0'}
                    </span>
                </div>

                <div className="mt-2 h-2 md:h-3 w-full overflow-hidden rounded-full bg-gray-50">
                    {'\u00A0\u00A0'}
                </div>
            </div>

        </div>
    );
}
