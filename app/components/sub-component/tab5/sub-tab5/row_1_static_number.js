import CountUp              from 'react-countup';

export default function Row1StaticNumber({ data }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">


            <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs">
                <p className="text-gray-700 text-lg md:text-base lg:text-sm font-bold">ขึ้นบัญชีทั้งหมด : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-lg md:text-base lg:text-3xl font-bold text-gray-600">
                        {
                            data
                            ?
                                (
                                    <div>
                                        <CountUp 
                                            end={ data?.total_listed } 
                                            duration={3} 
                                            separator="," 
                                            decimals={0}
                                            useEasing={true}
                                        /> <span className="text-sm">อัตรา</span>
                                    </div>
                                )
                            : '\u00A0\u00A0'
                        }
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs">
                <p className="text-gray-700 text-lg md:text-base lg:text-sm font-bold">เรียกไปแล้ว : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-lg md:text-base lg:text-3xl font-bold text-gray-600">
                        {
                            data
                            ?
                                (
                                    <div>
                                        <CountUp 
                                            end={ data?.total_called } 
                                            duration={3} 
                                            separator="," 
                                            decimals={0}
                                            useEasing={true}
                                        /> <span className="text-sm">อัตรา</span>
                                    </div>
                                )
                            : '\u00A0\u00A0'
                        }
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs">
                <p className="text-gray-700 text-lg md:text-base lg:text-sm font-bold">คงเหลือทั้งหมด : </p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-lg md:text-base lg:text-lg md:text-base lg:text-3xl font-bold text-gray-600">
                        {
                            data
                            ?
                                (
                                    <div>
                                        <CountUp 
                                            end={ data?.total_remain } 
                                            duration={3} 
                                            separator="," 
                                            decimals={0}
                                            useEasing={true}
                                        />  <span className="text-sm">อัตรา</span>
                                    </div>
                                )
                            : '\u00A0\u00A0'
                        }
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-gray-500 my-2 shadow-xs">
                <p className="text-gray-700 text-lg md:text-base lg:text-sm font-bold">เหลืออีกกี่ลำดับก่อนถึงคุณ :</p>
                <div className="items-baseline gap-2 text-right">
                    <span className="text-lg md:text-base lg:text-3xl font-bold text-gray-600">
                        {
                            data
                            ?
                                (
                                    <div>
                                        <CountUp 
                                            end={ data?.remain_before } 
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