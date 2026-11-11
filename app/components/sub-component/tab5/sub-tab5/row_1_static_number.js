
import CountUp from 'react-countup';

export default function Row1StaticNumber({ data }) {
    return (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    ขึ้นบัญชีทั้งหมด :
                </p>

                <div className="mt-2 text-right">
                    <span className="text-xl md:text-base lg:text-3xl font-bold text-gray-600">
                        {data ? (
                            <>
                                <CountUp
                                    end={data?.total_listed_n}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />
                                <span className="text-xs md:text-sm"> คน</span>
                            </>
                        ) : '\u00A0\u00A0'}
                    </span>
                </div>
            </div>


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    เรียกไปแล้ว :
                </p>

                <div className="mt-2 text-right">
                    <span className="text-xl md:text-base lg:text-3xl font-bold text-gray-600">
                        {data ? (
                            <>
                                <CountUp
                                    end={data?.total_called}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />
                                <span className="text-xs md:text-sm"> คน</span>
                            </>
                        ) : '\u00A0\u00A0'}
                    </span>
                </div>
            </div>


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    คงเหลือทั้งหมด :
                </p>

                <div className="mt-2 text-right">
                    <span className={`text-xl md:text-base lg:text-3xl font-bold ${data?.total_remain < 0 ? 'text-rose-600' : 'text-gray-600'
                        }`}>
                        {data ? (
                            <>
                                <CountUp
                                    end={data?.total_remain}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />
                                <span className="text-xs md:text-sm"> คน</span>
                            </>
                        ) : '\u00A0\u00A0'}
                    </span>
                </div>
            </div>


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    เหลืออีกกี่ลำดับก่อนถึงคุณ :
                </p>

                <div className="mt-2 text-right">
                    <span className="text-xl md:text-base lg:text-3xl font-bold text-gray-600">
                        {data ? (
                            <>
                                <CountUp
                                    end={data?.remain_before}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />
                                <span className="text-xs md:text-sm"> ลำดับ</span>
                            </>
                        ) : '\u00A0\u00A0'}
                    </span>
                </div>
            </div>

        </div>
    );
}
