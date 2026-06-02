
import Row0 from './sub-tab5/row_0_your_status';
import Row1 from './sub-tab5/row_1_static_number';
import Row2 from './sub-tab5/row_2_status_rank';
import Row3 from './sub-tab5/row_3_monthly_pie';

export default function T5P1S1_CurrentData({ data }) {
    const dataforChart = data || null;
    return (
        <div>
            <div className="grid lg:grid-cols-12 gap-2 my-2">
                <div className="col-span-12 lg:col-span-12">
                    <Row0 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row1 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row2 data={dataforChart} />
                </div>
                <div className="col-span-12 lg:col-span-12">
                    <Row3 data={dataforChart} />
                </div>
            </div>
        </div>
    );
}