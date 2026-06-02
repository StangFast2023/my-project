import CountUp              from 'react-countup';

export default function Row3StatusRank({ data }) {
    const status_work = data?.status_work || false;
    const getRiskStatus = (riskValue) => {
        if (riskValue === null || riskValue === undefined) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'label': 'รอดำเนินการ' };
        }
        const statusMap = [
            { min: 0,    max: 20,  bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'ปลอดภัยสูง' },
            { min: 20.1, max: 40,  bg: 'bg-sky-100 border-sky-800',         tx: 'text-sky-700',      label: 'ค่อนข้างปลอดภัย' },
            { min: 40.1, max: 60,  bg: 'bg-amber-100 border-amber-800',     tx: 'text-amber-700',    label: 'เฝ้าระวัง' },
            { min: 60.1, max: 80,  bg: 'bg-orange-100 border-orange-800',   tx: 'text-orange-700',   label: 'สุ่มเสี่ยง' },
            { min: 80.1, max: 100, bg: 'bg-rose-100 border-rose-800',       tx: 'text-rose-700',     label: 'เสี่ยงสูงมาก' }
        ];
        const status = statusMap.find(s => riskValue >= s.min && riskValue <= s.max);
        return status || { 'bg': 'bg-rose-100 border-rose-800', 'tx': 'text-rose-700', 'label': 'เสี่ยงสูงมาก' };
    };
    const getProbabilityStatus = (prob) => {
        if (prob === null || prob === undefined) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'label': 'รอดำเนินการ' };
        }
        const statusMap = [
            { min: 0,    max: 20,  bg: 'bg-rose-100 border-rose-800',     tx: 'text-rose-700',     label: 'โอกาสต่ำมาก' },
            { min: 20.1, max: 40,  bg: 'bg-orange-100 border-orange-800', tx: 'text-orange-700',   label: 'โอกาสค่อนข้างต่ำ' },
            { min: 40.1, max: 60,  bg: 'bg-amber-100 border-amber-800',   tx: 'text-amber-700',    label: 'โอกาสปานกลาง' },
            { min: 60.1, max: 80,  bg: 'bg-sky-100 border-sky-800',       tx: 'text-sky-700',      label: 'โอกาสค่อนข้างสูง' },
            { min: 80.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'โอกาสสูงมาก' }
        ];
        const status = statusMap.find(s => prob >= s.min && prob <= s.max);
        return status || { 'bg': 'bg-rose-100 border-rose-800', 'tx': 'text-rose-700', 'label': 'โอกาสต่ำมาก' };
    };
    const getNextRound = (prob, status) => {
        if (status === 'completed') {
            return { 'bg': 'bg-emerald-100 border-emerald-800', 'tx': 'text-emerald-700', 'label': 'ได้รับการบรรจุ' };
        }
        if (prob === null || prob === undefined) {
            return { 'bg': 'bg-gray-100 border-gray-500', 'tx': 'text-gray-600', 'label': 'รอดำเนินการ' };
        }
        const statusMap = [
            { min: 0,    max: 10,  bg: 'bg-red-100 border-red-800',     tx: 'text-red-700',     label: 'โอกาสต่ำมาก' },
            { min: 10.1, max: 30,  bg: 'bg-amber-100 border-amber-800', tx: 'text-amber-700',   label: 'รอรอบ' },
            { min: 30.1, max: 60,  bg: 'bg-blue-100 border-blue-800',   tx: 'text-blue-700',    label: 'อยู่ในเกณฑ์' },
            { min: 60.1, max: 90,  bg: 'bg-cyan-100 border-cyan-800',   tx: 'text-cyan-700',    label: 'น่าลุ้น' },
            { min: 90.1, max: 100, bg: 'bg-emerald-100 border-emerald-800', tx: 'text-emerald-700', label: 'ใกล้ถึง' }
        ];
        const foundStatus = statusMap.find(s => prob >= s.min && prob <= s.max);
        return foundStatus || statusMap[0];
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">

            <div className={`flex-1 flex flex-col justify-center p-4 rounded-xl border-l-4  ${getNextRound( data?.next_round , status_work )['bg']} my-2 shadow-xs`}>
                <p className="text-gray-700 text-lg md:text-base lg:text-sm font-bold">โอกาสที่จะถูกเรียกในรอบถัดไป :</p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-lg md:text-base lg:text-2xl font-bold ${getNextRound( data?.next_round )['tx']}`}>
                        {
                            data ?
                                (
                                    <div>
                                        <span className={`mr-2 text-lg md:text-base lg:text-3xl ${getNextRound( data?.next_round , status_work )['tx']}`}>{getNextRound( data?.next_round , status_work )['label']}</span>
                                        <CountUp 
                                            end={data?.next_round} 
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
                <p className="text-gray-700 font-bold text-lg md:text-base lg:text-sm">สถานะความเสี่ยงของลำดับคุณ : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-lg md:text-base lg:text-2xl font-bold ${getRiskStatus( data?.rank_risk )['tx']}`}>
                        {
                            data ?
                                (
                                    <div>
                                        <span className={`mr-2 text-lg md:text-base lg:text-3xl ${getRiskStatus( data?.rank_risk )['tx']}`}>{getRiskStatus( data?.rank_risk )['label']}</span>
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
                <p className="text-gray-700 font-bold text-lg md:text-base lg:text-sm">โอกาสบรรจุก่อนที่บัญชีจะหมดอายุ : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-lg md:text-base lg:text-2xl font-bold ${getProbabilityStatus(data?.probabilitys)['tx']}`}>
                        
                        {
                            data
                            ?
                                (
                                    <div>
                                        <span className={`mr-2 text-lg md:text-base lg:text-3xl ${getProbabilityStatus(data?.probabilitys)['tx']}`}>{getProbabilityStatus(data?.probabilitys)['label']}</span>
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