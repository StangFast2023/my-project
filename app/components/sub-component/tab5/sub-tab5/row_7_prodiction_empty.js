import CountUp from 'react-countup';

export default function Row7ChanceforEmpty({ data }) {
    const getProbabilityStatus = (prob) => {
        if (prob === null || prob === undefined) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'label': 'รอดำเนินการ' };
        }
        const statusMap = [
            { min: 0, max: 20, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'รอลุ้นอัตราเรียกเพิ่ม' },
            { min: 20.1, max: 40, bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700', label: 'ต้องอาศัยปัจจัยเสริม' },
            { min: 40.1, max: 60, bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700', label: 'อยู่ในเกณฑ์ลุ้นผล' },
            { min: 60.1, max: 80, bg: 'bg-sky-100 border-sky-800', tx: 'text-sky-700', label: 'มีโอกาสเรียกถึง' },
            { min: 80.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'แนวโน้มการเรียกสูง' }
        ];
        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status || { 'bg': 'bg-rose-100 border-rose-800', 'tx': 'text-rose-700', 'label': 'โอกาสต่ำมาก' };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-0 lg:gap-4">

            <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs">
                <p className="text-gray-700 font-bold text-lg md:text-base lg:text-sm">ประมาณการอัตราเรียกบรรจุรอบถัดไป : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-lg md:text-base lg:text-3xl font-bold text-gray-600">

                        {
                            data
                                ?
                                (
                                    <div>
                                        <CountUp
                                            end={data?.next_round_count}
                                            duration={3}
                                            separator=","
                                            decimals={0}
                                            useEasing={true}
                                        />
                                        <span className={`ml-2 mr-2 text-lg md:text-base lg:text-xl`}>
                                            อัตรา
                                        </span>
                                        <span className={`mr-2 text-lg md:text-base lg:text-xl`}>
                                            {
                                                data?.next_round_count
                                                    ? (
                                                        data?.next_round_count === 1
                                                            ? ("( ลำดับที่ " + data?.next_round_start + " )")
                                                            : ("( ลำดับที่ " + data?.next_round_start + "-" + data?.next_round_end + " )")
                                                    )
                                                    : '\u00A0\u00A0'
                                            }
                                        </span>
                                    </div>
                                )
                                : '\u00A0\u00A0'
                        }
                    </span>
                </div>
            </div>
            <div className={`flex-1 flex flex-col justify-center p-4 rounded-xl border-l-4 ${getProbabilityStatus(data?.probability_percent)['bg']} my-2 shadow-xs`}>
                <p className="text-gray-700 font-bold text-lg md:text-base lg:text-sm">ความน่าจะเป็นในการเรียกบรรจุจนครบบัญชี : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-lg md:text-base lg:text-2xl font-bold ${getProbabilityStatus(data?.probability_percent)['tx']}`}>

                        {
                            data
                                ?
                                (
                                    <div>
                                        <span className={`mr-2 text-lg md:text-base lg:text-3xl ${getProbabilityStatus(data?.probability_percent)['tx']}`}>{getProbabilityStatus(data?.probability_percent)['label']}</span>
                                        <CountUp
                                            end={data?.probability_percent}
                                            duration={3}
                                            separator=","
                                            decimals={2}
                                            useEasing={true}
                                            prefix={'( '}
                                            suffix={' %)'}
                                        />
                                    </div>
                                )
                                : '\u00A0\u00A0'
                        }
                    </span>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs">
                <p className="text-gray-700 font-bold text-lg md:text-base lg:text-sm">แนวโน้มการเรียกบรรจุภายใน 2 ปี : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-lg md:text-base lg:text-3xl font-bold text-gray-600">

                        {
                            data
                                ?
                                (
                                    <div>
                                        <span className={`mr-2 text-lg md:text-base lg:text-xl`}>
                                            ลำดับที่
                                        </span>
                                        <CountUp
                                            end={data?.start_rank_2y}
                                            duration={3}
                                            separator=","
                                            decimals={0}
                                            useEasing={true}
                                        />
                                        <span className={`mx-2 text-lg md:text-base lg:text-xl`}>
                                            ถึง
                                        </span>
                                        <CountUp
                                            end={data?.end_rank_2y}
                                            duration={3}
                                            separator=","
                                            decimals={0}
                                            useEasing={true}
                                        />
                                    </div>
                                )
                                : '\u00A0\u00A0'
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}