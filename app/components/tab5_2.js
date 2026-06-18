import Row2 from '../components/sub-component/tab5/sub-tab5/row_2_status_rank';
import Row7 from '../components/sub-component/tab5/sub-tab5/row_7_prodiction_empty';
import Row8 from '../components/sub-component/tab5/sub-tab5/row_8_prediction_heatmap';
import Row9 from '../components/sub-component/tab5/sub-tab5/row_9_prediction_cross';


export default function Tab5_2({ details, base_data, data }) {
    const dataforChart = data || null;

    const dataShow = base_data?.tab5?.part1 || {};
    const RegSh = dataShow[details?.regionId]?.pro_main_name || null;
    const ZneSh = dataShow[details?.regionId]?.pro_sub[details?.areaId]?.pro_sub_id ? "เขต " + dataShow[details?.regionId]?.pro_sub[details?.areaId]?.pro_sub_id : null;
    const PosSh = dataShow[details?.regionId]?.pro_sub[details?.areaId]?.data_position[details?.positionId]?.pos_name || null;

    return (
        <div>
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                    <span className=" text-lg md:text-base lg:text-3xl font-black text-white drop-shadow-sm">
                        5.2
                    </span>
                </div>
                <div className="flex flex-col justify-center">
                    <h2 className=" text-sm md:text-base lg:text-2xl font-black text-gray-800 leading-none font-kanit">
                        แนวโน้มและโอกาสการบรรจุในอนาคต
                    </h2>
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row2 data={dataforChart} />
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row7 data={dataforChart} />
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2 hidden lg:block">
                <div className="col-span-12 lg:col-span-12">
                    <Row8 region={RegSh} zone={ZneSh} position={PosSh} data={dataforChart} />
                </div>
            </div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row9 region={RegSh} zone={ZneSh} position={PosSh} data={dataforChart} />
                </div>
            </div>
        </div>
    );
}