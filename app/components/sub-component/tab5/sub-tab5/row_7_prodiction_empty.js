
import CountUp from 'react-countup';

export default function Row7ChanceforEmpty({ data }) {
    const getProbabilityStatus = (prob) => {
        if (prob === null || prob === undefined) {
            return { bg: 'bg-gray-100 border-gray-500', tx: 'text-gray-600', label: 'รอดำเนินการ' };
        }

        const statusMap = [
            { min: 0, max: 20, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'รอลุ้นอัตราเรียกเพิ่ม' },
            { min: 20.1, max: 40, bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700', label: 'ต้องอาศัยปัจจัยเสริม' },
            { min: 40.1, max: 60, bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700', label: 'อยู่ในเกณฑ์ลุ้นผล' },
            { min: 60.1, max: 80, bg: 'bg-sky-100 border-sky-800', tx: 'text-sky-700', label: 'มีโอกาสเรียกถึง' },
            { min: 80.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'แนวโน้มการเรียกสูง' }
        ];

        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status || { bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'โอกาสต่ำมาก' };
    };

    return (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">


            <div className="flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    ประมาณการอัตราเรียกบรรจุรอบถัดไป :
                </p>

                <div className="mt-2 text-right">
                    <div className="text-xl md:text-base lg:text-3xl font-bold text-gray-600 break-words">
                        {data ? (
                            <>
                                <CountUp
                                    end={data?.next_round_count}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />
                                <span className="ml-1 text-xs md:text-base lg:text-xl">
                                    อัตรา
                                </span>
                                <div className="mt-1 text-xs md:text-base lg:text-xl font-medium">
                                    {data?.next_round_count
                                        ? (
                                            data?.next_round_count === 1
                                                ? `( ลำดับที่ ${data?.next_round_start} )`
                                                : `( ลำดับที่ ${data?.next_round_start}-${data?.next_round_end} )`
                                        )
                                        : '\u00A0\u00A0'}
                                </div>
                            </>
                        ) : '\u00A0\u00A0'}
                    </div>
                </div>
            </div>


            <div className={`flex min-w-0 flex-col justify-center rounded-xl border-l-4 p-3 my-1 shadow-sm md:p-4 ${getProbabilityStatus(data?.probability_percent).bg}`}>
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    ความน่าจะเป็นในการเรียกบรรจุจนครบบัญชี :
                </p>

                <div className="mt-2 text-right">
                    <div className={`text-sm md:text-base lg:text-2xl font-bold break-words ${getProbabilityStatus(data?.probability_percent).tx}`}>
                        {data ? (
                            <>
                                <span className={`block mb-1 text-sm md:text-base lg:text-3xl ${getProbabilityStatus(data?.probability_percent).tx}`}>
                                    {getProbabilityStatus(data?.probability_percent).label}
                                </span>
                                <CountUp
                                    end={data?.probability_percent}
                                    duration={3}
                                    separator=","
                                    decimals={2}
                                    useEasing={true}
                                    prefix={'( '}
                                    suffix={' %)'}
                                />
                            </>
                        ) : '\u00A0\u00A0'}
                    </div>
                </div>
            </div>


            <div className="col-span-2 md:col-span-1 flex min-w-0 flex-col justify-center rounded-xl border-l-4 border-gray-500 bg-gray-50 p-3 my-1 shadow-sm md:p-4">
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    แนวโน้มการเรียกบรรจุภายใน 2 ปี :
                </p>

                <div className="mt-2 text-right">
                    <div className="text-xl md:text-base lg:text-3xl font-bold text-gray-600 break-words">
                        {data ? (
                            <>
                                <span className="mr-1 text-xs md:text-base lg:text-xl">
                                    ลำดับที่
                                </span>
                                <CountUp
                                    end={data?.start_rank_2y}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />
                                <span className="mx-1 text-xs md:text-base lg:text-xl">
                                    ถึง
                                </span>
                                <CountUp
                                    end={data?.end_rank_2y}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />
                            </>
                        ) : '\u00A0\u00A0'}
                    </div>
                </div>
            </div>

        </div>
    );
}
