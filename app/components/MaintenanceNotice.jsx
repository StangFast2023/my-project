'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'maintenance_notice_dismissed';
const ONE_HOUR = 60 * 60 * 1000;

// แจ้ง React เมื่อสถานะเปลี่ยน
const subscribe = (callback) => {
    window.addEventListener('storage', callback);
    window.addEventListener('maintenance-notice-change', callback);

    return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('maintenance-notice-change', callback);
    };
};

// อ่านสถานะจาก sessionStorage
const getSnapshot = () => {
    const dismissedAt = sessionStorage.getItem(STORAGE_KEY);

    if (!dismissedAt) return true;

    return Date.now() - Number(dismissedAt) >= ONE_HOUR;
};

// สถานะเริ่มต้นฝั่ง Server
const getServerSnapshot = () => false;

export default function MaintenanceNotice() {
    const isOpen = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    const handleClose = () => {
        sessionStorage.setItem(STORAGE_KEY, Date.now().toString());

        // แจ้ง React ให้ตรวจสอบสถานะใหม่
        window.dispatchEvent(new Event('maintenance-notice-change'));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                <div className="bg-amber-50 px-6 py-5 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m0 3.75h.008M10.29 3.86l-8.1 14.02A1.5 1.5 0 003.49 20h17.02a1.5 1.5 0 001.3-2.12l-8.1-14.02a1.5 1.5 0 00-2.6 0z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                        อยู่ระหว่างปรับปรุงข้อมูล
                    </h2>

                    <p className="mt-1 text-xs md:text-sm lg:text-base text-amber-700">
                        Maintenance Notice
                    </p>
                </div>

                <div className="px-6 py-6 text-center">
                    <p className="text-sm md:text-base lg:text-lg leading-7 md:leading-8 text-gray-600">
                        ขณะนี้เว็บไซต์อยู่ระหว่างการปรับปรุงและตรวจสอบข้อมูลสถิติ
                        เพื่อให้ข้อมูลมีความถูกต้องและเป็นปัจจุบันมากยิ่งขึ้น
                    </p>

                    <p className="mt-3 text-sm md:text-base lg:text-lg leading-7 md:leading-8 text-gray-600">
                        ในระหว่างนี้ ข้อมูลบางส่วนอาจมีการเปลี่ยนแปลงหรือยังไม่สมบูรณ์
                        ขออภัยในความไม่สะดวก และขอขอบคุณทุกท่านที่เข้าใจและติดตามเว็บไซต์ของเรา
                    </p>

                    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">

                        <div className="bg-gray-50 px-4 py-3">
                            <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-800">
                                สถานะการปรับปรุงข้อมูล
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm md:text-base">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="px-3 py-3 text-left font-semibold">
                                            แถบข้อมูล
                                        </th>
                                        <th className="px-3 py-3 text-center font-semibold">
                                            สถานะ
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { id: 1, name: '1. สรุปภาพรวม', status: 'done' },
                                        { id: 2, name: '2. ข้อมูลประเภทและตำแหน่ง', status: 'working' },
                                        { id: 3, name: '3. ข้อมูลรายภาคและเขต', status: 'waiting' },
                                        { id: 4, name: '4. ข้อมูลเจาะลึกรายเขตและตำแหน่ง', status: 'waiting' },
                                        { id: 5, name: '5. วิเคราะห์โอกาสเรียกตัว', status: 'waiting' },
                                    ].map((item) => {
                                        const statusConfig = {
                                            done: {
                                                label: 'เสร็จแล้ว',
                                                className: 'bg-emerald-100 text-emerald-700',
                                            },
                                            working: {
                                                label: 'กำลังดำเนินการ',
                                                className: 'bg-amber-100 text-amber-700',
                                            },
                                            waiting: {
                                                label: 'รอคิว',
                                                className: 'bg-gray-100 text-gray-600',
                                            },
                                        };

                                        const status = statusConfig[item.status];

                                        return (
                                            <tr key={item.id} className="bg-white">
                                                <td className="p-2 text-left text-gray-700">
                                                    {item.name}
                                                </td>

                                                <td className="p-2 text-center">
                                                    <span className={`w-full font-semibold inline-block rounded-full px-3 py-1 text-xs md:text-sm font-medium whitespace-nowrap ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button onClick={handleClose} className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3text-sm md:text-base lg:text-lg font-semibold text-whitetransition hover:bg-blue-700 active:scale-[0.98]">
                        รับทราบ
                    </button>
                </div>

            </div>
        </div>
    );
}