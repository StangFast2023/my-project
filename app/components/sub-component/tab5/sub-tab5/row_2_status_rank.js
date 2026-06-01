import CountUp              from 'react-countup';

export default function Row3StatusRank({ data }) {
    const getRiskStatus = (riskValue) => {
        if (riskValue === null || riskValue === undefined) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'label': 'รอดำเนินการ' };
        }
        const statusMap = [
            { min: 0,   max: 30,   bg: 'bg-emerald-100 border-emerald-800' , tx: 'text-emerald-700' , label: 'ปลอดภัย' },
            { min: 30.1, max: 70,  bg: 'bg-amber-100 border-amber-800'   , tx: 'text-amber-700' , label: 'ปานกลาง' },
            { min: 70.1, max: 100, bg: 'bg-rose-100 border-rose-800'    , tx: 'text-rose-700' , label: 'สุ่มเสี่ยง' }
        ];
        const status = statusMap.find(s => riskValue >= s.min && riskValue <= s.max);
        return {
            'bg': status.bg,
            'tx': status.tx,
            'label': status.label
        };
    };
    const getProbabilityStatus = (prob) => {
        if (prob === null || prob === undefined) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'label': 'รอดำเนินการ' };
        }
        const statusMap = [
            { min: 80,   max: 100,  bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'โอกาสสูงมาก' },
            { min: 50,   max: 79.9, bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700',       label: 'โอกาสปานกลาง' },
            { min: 0,    max: 49.9, bg: 'bg-rose-100 border-rose-800', tx: 'text-rose-700',          label: 'โอกาสต่ำ' }
        ];
        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status;
    };
    const getNextRound = (prob) => {
        if (prob === null || prob === undefined) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'label': 'รอดำเนินการ' };
        }
        const statusMap = [
            { min: 2.1  ,   max: 100  ,   bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'ใกล้ถึง' },
            { min: 5.1  ,   max: 20   ,   bg: 'bg-blue-100 border-blue-800', tx: 'text-blue-700', label: 'รอดำเนินการ' },
            { min: 0    ,   max: 5.1  ,   bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700', label: 'รอรอบ' }
        ];
        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status;
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">

            <div className={`flex-1 flex flex-col justify-center p-4 rounded-xl border-l-4  ${getNextRound( data?.next_round )['bg']} my-2 shadow-xs`}>
                <p className="text-gray-700 text-sm font-bold">โอกาสที่จะถูกเรียกในรอบถัดไป :</p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-2xl font-bold ${getNextRound( data?.next_round )['tx']}`}>
                        {
                            data ?
                                (
                                    <div>
                                        <span className={`mr-2 text-3xl ${getNextRound( data?.next_round )['tx']}`}>{getNextRound( data?.next_round )['label']}</span>
                                        <CountUp 
                                            end={data?.rank_risk} 
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

            <div className={`flex-1 flex flex-col justify-center p-4 rounded-xl border-l-4  ${getRiskStatus( data?.rank_risk )['bg']} my-2 shadow-xs`}>
                <p className="text-gray-700 font-bold text-sm">สถานะลำดับของคุณ : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-2xl font-bold ${getRiskStatus( data?.rank_risk )['tx']}`}>
                        {
                            data ?
                                (
                                    <div>
                                        <span className={`mr-2 text-3xl ${getRiskStatus( data?.rank_risk )['tx']}`}>{getRiskStatus( data?.rank_risk )['label']}</span>
                                        <CountUp 
                                            end={data?.rank_risk} 
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
            
            <div className={`flex-1 flex flex-col justify-center p-4 rounded-xl border-l-4 ${getProbabilityStatus(data?.probabilitys)['bg']} my-2 shadow-xs`}>
                <p className="text-gray-700 font-bold text-sm">โอกาสบรรจุก่อนที่บัญชีจะหมดอายุ : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-2xl font-bold ${getProbabilityStatus(data?.probabilitys)['tx']}`}>
                        
                        {
                            data
                            ?
                                (
                                    <div>
                                        <span className={`mr-2 text-3xl ${getProbabilityStatus(data?.probabilitys)['tx']}`}>{getProbabilityStatus(data?.probabilitys)['label']}</span>
                                        <CountUp 
                                            end={ data?.probabilitys } 
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

        </div>
    );
}