import CountUp              from 'react-countup';

export default function Row1StaticNumber({ data }) {
    console.log(data);
    const status_work = data?.status_work || {};
    const status_out_list = data?.status_out_list || {};
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-2">

            <div className={`flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs`}>
                <p className="text-gray-700 text-sm font-bold">ลำดับของคุณ : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-3xl font-bold text-gray-600`}>
                        {
                            data
                            ?
                                (
                                    <div>
                                        <CountUp 
                                            end={ data?.rank } 
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
                <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                    {'\u00A0\u00A0'}
                </div>
            </div>

            <div className={`flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs`}>
                <p className="text-gray-700 text-sm font-bold">สถานะ : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-3xl font-bold ${ data ? ( status_work === 'waiting' ? 'text-sky-600' : 'text-emerald-600' ) : 'text-gray-600' }`}>
                        { data ? ( status_work === 'waiting' ? 'รอเรียกบรรจุ' : 'ได้รับการบรรจุ' ) : '\u00A0\u00A0' }
                    </span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                    {'\u00A0\u00A0'}
                </div>
            </div>
            
            <div className={`flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs`}>
                <p className="text-gray-700 text-sm font-bold">สถานะบัญชีตำแหน่ง : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-3xl font-bold ${ data ? ( status_out_list === true ? 'text-emerald-600' : 'text-amber-600' ) : 'text-gray-600' }`}>
                        { data ? ( status_out_list === true ? 'บัญชีสิ้นสุดแล้ว' : 'บัญชีปกติ' ) : '\u00A0\u00A0' }
                    </span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                    {'\u00A0\u00A0'}
                </div>
            </div>

            <div className={`flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs`}>
                <p className="text-gray-700 text-sm font-bold">ความคืบหน้าในการเรียกใช้บัญชี : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-3xl font-bold text-gray-600">
                        {
                            data
                            ?
                                (
                                    <div>
                                        <CountUp 
                                            end={ data?.process_bars } 
                                            duration={3} 
                                            separator="," 
                                            decimals={2}
                                            useEasing={true}
                                            suffix={'%'}
                                        /> 
                                    </div>
                                )
                            : '\u00A0\u00A0'
                        }
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${ data ? ( data?.process_bars >= 100 ? 'bg-blue-500' : 'bg-green-500' ) : 'bg-white' }`} style={{ width: `${Math.min(data?.process_bars, 100)}%` }} />
                </div>
            </div>

            
            <div className={`flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs`}>
                <p className="text-gray-700 text-sm font-bold">อัตราการเรียกบรรจุเฉลี่ยต่อรอบ : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className={`text-3xl font-bold text-gray-600`}>
                        {
                            data
                            ?
                                (
                                    <div>
                                        <CountUp 
                                            end={ data?.avg_call } 
                                            duration={3} 
                                            separator="," 
                                            decimals={2}
                                            useEasing={true}
                                        /> <span className="text-sm">อัตรา</span>
                                    </div>
                                )
                            : '\u00A0\u00A0'
                        }
                    </span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                    {'\u00A0\u00A0'}
                </div>
            </div>
        </div>
    );
}