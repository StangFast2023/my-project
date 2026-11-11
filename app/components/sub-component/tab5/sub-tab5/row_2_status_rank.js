
import CountUp from 'react-countup';

export default function Row3StatusRank({ data }) {
    const status_work = data?.status_work || {};

    const getRiskStatus = (riskValue) => {
        if (riskValue === null || riskValue === undefined) {
            return { bg: 'bg-gray-100 border-gray-500', tx: 'text-gray-600', label: 'รอดำเนินการ' };
        }

        const statusMap = [
            { min: 0, max: 20, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'สถานะปกติ' },
            { min: 20.1, max: 40, bg: 'bg-sky-100 border-sky-800', tx: 'text-sky-700', label: 'อยู่ในเกณฑ์อุ่นใจ' },
            { min: 40.1, max: 60, bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700', label: 'อยู่ในช่วงลุ้นผล' },
            { min: 60.1, max: 80, bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700', label: 'ต้องติดตามสถานการณ์' },
            { min: 80.1, max: 100, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'เฝ้าระวังเป็นพิเศษ' }
        ];

        const status = statusMap.find(s => riskValue >= s.min && riskValue <= s.max);
        return status || { bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'เสี่ยงสูงมาก' };
    };

    const getProbabilityStatus = (prob) => {
        if (prob === null || prob === undefined) {
            return { bg: 'bg-gray-100 border-gray-500', tx: 'text-gray-600', label: 'รอดำเนินการ' };
        }

        const statusMap = [
            { min: 0, max: 20, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'รอลุ้นสถานการณ์เพิ่มเติม' },
            { min: 20.1, max: 40, bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700', label: 'ต้องลุ้นการเรียกเพิ่ม' },
            { min: 40.1, max: 60, bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700', label: 'อยู่ในเกณฑ์ลุ้นบรรจุ' },
            { min: 60.1, max: 80, bg: 'bg-sky-100 border-sky-800', tx: 'text-sky-700', label: 'มีโอกาสเรียกถึง' },
            { min: 80.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'มีลุ้นสูงมาก' }
        ];

        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status || { bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'โอกาสต่ำมาก' };
    };

    const getNextRound = (prob) => {
        if (status_work === 'completed') {
            return { bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'ได้รับการบรรจุ' };
        }

        if (prob === null || prob === undefined) {
            return { bg: 'bg-gray-100 border-gray-500', tx: 'text-gray-600', label: 'รอดำเนินการ' };
        }

        const statusMap = [
            { min: 0, max: 10, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700', label: 'รอลุ้นในรอบถัดไป' },
            { min: 10.1, max: 30, bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700', label: 'รอรอบการเรียก' },
            { min: 30.1, max: 60, bg: 'bg-sky-100 border-sky-800', tx: 'text-sky-700', label: 'เกณฑ์ลุ้นผล' },
            { min: 60.1, max: 90, bg: 'bg-blue-100 border-blue-800', tx: 'text-blue-700', label: 'ลุ้นเรียก' },
            { min: 90.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'ใกล้ถึงคิว' }
        ];

        const foundStatus = statusMap.find(s => prob >= s.min && prob <= s.max);
        return foundStatus || statusMap[0];
    };

    return (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">


            <div className={`flex min-w-0 flex-col justify-center rounded-xl border-l-4 p-3 my-1 shadow-sm md:p-4 ${getNextRound(data?.next_round).bg}`}>
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    สถานะการเรียกบรรจุ :
                </p>

                <div className="mt-2 text-right">
                    <div className={`text-sm md:text-base lg:text-2xl font-bold break-words ${getNextRound(data?.next_round).tx}`}>
                        {data ? (
                            <>
                                <span className={`block mb-1 text-sm md:text-base lg:text-3xl ${getNextRound(data?.next_round).tx}`}>
                                    {getNextRound(data?.next_round).label}
                                </span>
                                <CountUp
                                    end={data?.next_round}
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


            <div className={`flex min-w-0 flex-col justify-center rounded-xl border-l-4 p-3 my-1 shadow-sm md:p-4 ${getRiskStatus(data?.rank_risk).bg}`}>
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    ประเมินสถานะการเรียกตามลำดับของคุณ :
                </p>

                <div className="mt-2 text-right">
                    <div className={`text-sm md:text-base lg:text-2xl font-bold break-words ${getRiskStatus(data?.rank_risk).tx}`}>
                        {data ? (
                            <>
                                <span className={`block mb-1 text-sm md:text-base lg:text-3xl ${getRiskStatus(data?.rank_risk).tx}`}>
                                    {getRiskStatus(data?.rank_risk).label}
                                </span>
                                <CountUp
                                    end={data?.rank_risk}
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


            <div className={`col-span-2 md:col-span-1 flex min-w-0 flex-col justify-center rounded-xl border-l-4 p-3 my-1 shadow-sm md:p-4 ${getProbabilityStatus(data?.probabilitys).bg}`}>
                <p className="text-xs md:text-base lg:text-sm font-bold text-gray-700">
                    โอกาสได้รับการบรรจุก่อนบัญชีหมดอายุ :
                </p>

                <div className="mt-2 text-right">
                    <div className={`text-sm md:text-base lg:text-2xl font-bold break-words ${getProbabilityStatus(data?.probabilitys).tx}`}>
                        {data ? (
                            <>
                                <span className={`block mb-1 text-sm md:text-base lg:text-3xl ${getProbabilityStatus(data?.probabilitys).tx}`}>
                                    {getProbabilityStatus(data?.probabilitys).label}
                                </span>
                                <CountUp
                                    end={data?.probabilitys}
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

        </div>
    );
}
