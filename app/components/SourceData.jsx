'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sourceDataDismissedAt';
const ONE_HOUR = 60 * 60 * 1000;

export default function SourceData() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const dismissedAt = Number(
            window.sessionStorage.getItem(STORAGE_KEY)
        );
        if (!dismissedAt || Date.now() - dismissedAt >= ONE_HOUR) {
            const frame = requestAnimationFrame(() => {
                setVisible(true);
            });
            return () => cancelAnimationFrame(frame);
        }
    }, []);
    const handleClose = () => {
        window.sessionStorage.setItem(
            STORAGE_KEY,
            Date.now().toString()
        );
        setVisible(false);
    };
    if (!visible) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">

                <div className="bg-amber-50 px-6 py-5 text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        หมายเหตุเกี่ยวกับแหล่งที่มาของข้อมูล
                    </h2>
                </div>

                <div className="max-h-[65vh] overflow-y-auto px-6 py-6 text-sm md:text-base leading-7 text-gray-700">

                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                        <h3 className="font-bold text-gray-800">
                            แหล่งที่มาของข้อมูล
                        </h3>

                        <p className="mt-2">
                            ข้อมูลสถิติการเรียกบรรจุบนเว็บไซต์นี้
                            รวบรวมและบันทึกจากเอกสารประกาศเรียกบรรจุ
                            ของหน่วยงานที่เกี่ยวข้อง โดยไม่ได้ดึงข้อมูลจากระบบ
                            LCR หรือเชื่อมต่อกับระบบดังกล่าวโดยตรง
                        </p>
                    </div>

                    <div className="mt-5">
                        <h3 className="font-bold text-gray-800">
                            ข้อจำกัดในการคำนวณ
                        </h3>

                        <p className="mt-2">
                            ยอดเรียกบรรจุ 3 รอบแรกเป็นยอดที่รวบรวมจากบัญชีเดิม
                            ก่อนการปรับปรุงบัญชี จึงไม่สามารถระบุได้อย่างแน่ชัด
                            ว่าผู้ที่ถูกเรียกทั้งหมดมีจำนวนเท่าใดที่ยังคงอยู่ในบัญชีใหม่
                        </p>

                        <p className="mt-3">
                            การนำยอดเรียกสะสมจากบัญชีเดิมมาเปรียบเทียบกับจำนวน
                            ผู้สอบแข่งขันได้ตามบัญชีใหม่ จึงเป็นเพียงการคำนวณ
                            เพื่อแสดงความคืบหน้าโดยประมาณเท่านั้น
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-center">
                    <button
                        onClick={handleClose}
                        className="w-full sm:w-auto rounded-xl bg-amber-600 px-10 py-3 text-base font-semibold text-white transition hover:bg-amber-700 active:scale-[0.98]"
                    >
                        รับทราบ
                    </button>
                </div>

            </div>
        </div>
    );
}
