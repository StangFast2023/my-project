"use client";

import { useState } from 'react';
import Image from 'next/image'; // 1. นำเข้า Image component
import { User, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfoModal() {
    const [isOpen, setIsOpen] = useState(false);
    const iconFiles = {

        "nextdotjs": "nextdotjs_000000.svg",
        "tailwindcss": "tailwindcss_06B6D4.svg",

        "laravel": "laravel_FF2D20.svg",
        "prisma": "prisma_2D3748.svg",

        "postgresql": "postgresql_4169E1.svg",

        "vercel": "vercel_000000.svg",
        "railway": "railway_0B0D0E.svg",
        "neon": "neon_34D59A.svg",
    };
    const getIconData = (key: keyof typeof iconFiles) => {
        // 1. ดึงชื่อไฟล์จาก object ตาม key ที่ส่งเข้ามา
        const filename = iconFiles[key];
        const [name, color] = filename.replace('.svg', '').split('_');

        return {
            src: `/icons/${filename}`,
            name: name,
            color: `#${color}`
        };
    };
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 p-4 z-[9999] rounded-full bg-emerald-500 text-white shadow-xl transition-all duration-500 hover:scale-110 hover:bg-emerald-600"
            >
                <User size={40} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)} // ปิดเมื่อคลิกที่พื้นหลัง
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-3xl w-full max-w-6xl p-8 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="md:col-span-2 space-y-8">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t pt-8">

                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center mb-2">
                                                <motion.div whileHover={{ rotate: 25, scale: 1.25 }} className="relative w-50 h-50 mb-4">
                                                    <Image
                                                        src="https://scontent.fbkk12-6.fna.fbcdn.net/v/t39.30808-6/474109992_29035552372698722_123024478912346313_n.jpg?stp=dst-jpg_tt6&cstp=mx1080x1920&ctp=s1080x1920&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gBPChkRIlbQQ7kNvwEDfzmX&_nc_oc=AdqWkovWz2ZkBkSLrwD1nYhBB_uBNUDomi8HPn7aHmgrkoO3iHd8oTYG71qQOOqQW4w&_nc_zt=23&_nc_ht=scontent.fbkk12-6.fna&_nc_gid=VvAe537UMlnSQTlTVjEwiA&_nc_ss=7b2a8&oh=00_Af9t5mMAEE8YBRpkasOtxNgxGka-YD27sz1qvYVbRopQxg&oe=6A2D9196"
                                                        alt="Profile"
                                                        fill
                                                        sizes="250px"
                                                        className="rounded-full object-cover border-4 border-emerald-500"
                                                    />
                                                </motion.div>
                                                <h2 className="text-xl font-bold text-gray-800">เกี่ยวกับผู้พัฒนา</h2>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                {[
                                                    { label: 'ผู้พัฒนา', value: 'นายเคณศร คำทวี (สตางค์)' },
                                                    { label: 'ตำแหน่ง', value: 'นักวิชาการคอมพิวเตอร์' },
                                                    { label: 'ภาค', value: 'ภาคตะวันออกเฉียงเหนือ' },
                                                    { label: 'เขต', value: '2' },
                                                    { label: 'ลำดับ', value: '32' },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-all">
                                                        <Circle size={10} className="text-emerald-500 shrink-0" fill="currentColor" />
                                                        <div className="flex w-full text-sm md:text-base">
                                                            <span className="font-semibold text-gray-700 w-24 shrink-0">{item.label}</span>
                                                            <span className="font-semibold text-gray-700 mx-2">:</span>
                                                            <span className="font-semibold text-gray-700 truncate">{item.value}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-xl text-center font-bold text-gray-800 mb-6">กลุ่มเทคโนโลยีที่ใช้พัฒนา</h2>
                                            <div>
                                                {[
                                                    { head: 'Front-end', data: { 0: { value: 'Next.js', logo: "nextdotjs" }, 1: { value: 'Tailwind Css', logo: "tailwindcss" } } },
                                                    { head: 'Back-end', data: { 0: { value: 'Laravel', logo: "laravel" }, 1: { value: 'Prisma', logo: "prisma" } } },
                                                    { head: 'Database', data: { 0: { value: 'PostgreSql', logo: "postgresql" } } },
                                                    { head: 'Infrastructure & Services', data: { 0: { value: 'Vercel', logo: "vercel" }, 1: { value: 'Railway', logo: "railway" }, 2: { value: 'Neon', logo: "neon" } } },
                                                ].map((item, idx) => {
                                                    const subTech = item.data || {};
                                                    return (
                                                        <div key={idx}>
                                                            <div className="border-b-2 border-b-gray-200 my-2">
                                                                <h3 className="text-lg md:text-base lg:text-lg font-bold text-left text-gray-700 flex gap-3">
                                                                    <Circle size={10} className="my-auto text-emerald-500 shrink-0" fill="currentColor" />
                                                                    {item.head}
                                                                </h3>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-2">
                                                                {Object.values(subTech).map((tech_data, index) => (
                                                                    <div key={index} className={`flex items-center gap-2`}>
                                                                        <div
                                                                            className={`m-2 w-8 h-8 bg-current text-[${getIconData(tech_data.logo).color}]`}
                                                                            style={{
                                                                                backgroundColor: getIconData(tech_data.logo).color,
                                                                                maskImage: `url('${getIconData(tech_data.logo).src}')`,
                                                                                WebkitMaskImage: `url('${getIconData(tech_data.logo).src}')`,
                                                                                maskSize: 'contain',
                                                                                WebkitMaskSize: 'contain',
                                                                                maskRepeat: 'no-repeat',
                                                                                WebkitMaskRepeat: 'no-repeat'
                                                                            }}
                                                                        />
                                                                        <span className={`font-bold`} style={{ color: getIconData(tech_data.logo).color }}>{tech_data.value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-1 space-y-2 flex flex-col h-full">
                                    <motion.div whileHover={{ scale: 1.05 }} className="p-2 border-2 border-emerald-500 rounded-xl bg-white items-center">
                                        <Image
                                            src="https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/719150799_37233442249576319_302443961188702046_n.jpg?stp=dst-jpg_tt6&cstp=mx1029x1336&ctp=s1029x1336&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=JKgKIVYVePgQ7kNvwEiJc2H&_nc_oc=AdoIX5itqpf-vXxgbm43fMgFK3_x41f_-DFFazEzbXETt2nR9xFuKlrnSj3b5P-LtaQ&_nc_zt=23&_nc_ht=scontent.fbkk12-1.fna&_nc_gid=J6GgbVStvMMXTiU130siVw&_nc_ss=7b2a8&oh=00_Af-M6wIBH3qNoBdXm5IhU6ZrExHgOzT--Q99Zz7FeiELgA&oe=6A2C19CE"
                                            alt="QR Code"
                                            width={500}
                                            height={500}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </motion.div>
                                    <div className="flex-1 mt-4 flex items-center justify-center bg-gray-200 rounded-lg p-4 font-semibold text-center text-gray-700">
                                        สนับสนุนค่าโฮสติ้ง <br></br> เพื่อความต่อเนื่องของระบบ
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-8 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                ปิด
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}