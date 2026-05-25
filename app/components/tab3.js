import T3P8_TableAllType    from './sub-component/tab3/part8_tablealltype';
import { LoadingScreen }    from '../components/LoadingScreen';

export default function Tab3({data}) {
    if ( !data ) return <LoadingScreen />;
    return (
        <div className="animate-fade-in">
            <div className="my-3">

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-4xl font-black text-white drop-shadow-sm">
                            3
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-gray-800 leading-none font-kanit text-center">
                            รายงานสรุปสถิติบัญชีผู้สอบแข่งขันได้แบบแบ่งภาคและเขต
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T3P8_TableAllType data={data}/>
                    </div>
                </div>
            </div>
        </div>
    );
}