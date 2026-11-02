'use client';

import { useState } from 'react';

const STORAGE_KEY = 'maintenance_notice_dismissed';
const ONE_HOUR = 60 * 60 * 1000;

export default function MaintenanceNotice() {
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window === 'undefined') return false;

        const dismissedAt = sessionStorage.getItem(STORAGE_KEY);

        if (!dismissedAt) return true;

        const elapsed = Date.now() - Number(dismissedAt);

        return elapsed >= ONE_HOUR;
    });

    const handleClose = () => {
        sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
        setIsOpen(false);
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

                    <button onClick={handleClose} className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3text-sm md:text-base lg:text-lg font-semibold text-whitetransition hover:bg-blue-700 active:scale-[0.98]">
                        รับทราบ
                    </button>
                </div>

            </div>
        </div>
    );
}