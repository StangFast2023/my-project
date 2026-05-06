import StaticNumber from './sub-component/tab1/part1_statics';

export default function Tab1({ data }) {
    if (!data) {
        return (
            <div className="custom-box-tab flex flex-col justify-center items-center p-20 space-y-4">
                <div className="w-25 h-25 border-8 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                <p className="text-xl font-kanit text-gray-800 animate-pulse">กำลังดึงข้อมูลจากระบบฐานข้อมูลท้องถิ่น...</p>
            </div>
        );
    }
    return (
        <div className="custom-box-tab animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-gray-600 text-center">ข้อมูลสถิติการบรรจุ - เรียกรายงานตัว</h3>
            <StaticNumber data={ data }/>
        </div>
    );
}