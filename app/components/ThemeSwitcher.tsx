"use client";

import { useState } from 'react';
import Image from 'next/image';
import { User, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import profilePic from '../../public/images/myProfile.webp';
import QRCodePic from '../../public/images/myQRcode.webp';

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


        "facebook": "facebook_0866FF.svg",
        "line": "line_00C300.svg",
    };
    const getIconData = (key: keyof typeof iconFiles) => {
        const filename = iconFiles[key];
        const [name, color] = filename.replace('.svg', '').split('_');
        return {
            src: `/icons/${filename}`,
            name: name,
            color: `#${color}`
        };
    };
    const currentAmount = 50;
    const targetAmount = 350;
    const percentage = Math.round((currentAmount / targetAmount) * 100);
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 p-4 z-[9999] rounded-full bg-emerald-500 text-white shadow-xl transition-all duration-500 hover:scale-110 hover:bg-emerald-600"
            >
                <div className="flex justify-center items-center">
                    <User size={30} /> สนับสนุนค่าโฮสติ้ง
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-2 md:p-4bg-black/50 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setIsOpen(false)} // ปิดเมื่อคลิกที่พื้นหลัง
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-4 md:p-8 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-400 hover:scale-[1.25] hover:text-gray-600 duration-300 transition-color flex items-center justify-center text-xl text-white font-bold" >
                                <X />
                            </button>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                                <div className="md:col-span-2 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t pt-8">
                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center mb-2">
                                                <motion.div whileHover={{ rotate: 25, scale: 1.25 }} className="relative w-32 h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 mb-4">
                                                    <Image
                                                        src={profilePic}
                                                        alt="Profile"
                                                        fill
                                                        priority={true}
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
                                                        <div className="flex flex-wrap w-full text-sm md:text-base">
                                                            <span className="font-semibold text-gray-700 w-24 shrink-0">{item.label}</span>
                                                            <span className="font-semibold text-gray-700 mx-2">:</span>
                                                            <span className="font-semibold text-gray-700 break-words">{item.value}</span>
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
                                                            <div className="grid grid-cols-1 sm:grid-cols-2">
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
                                <div className="md:col-span-1 space-y-4 flex flex-col">
                                    <span className="bg-gray-100 rounded-xl text-center text-gray-700">
                                        สนับสนุนค่าโฮสติ้ง <br></br> เพื่อความต่อเนื่องของระบบ
                                    </span>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="max-w-xs mx-auto md:max-w-full"
                                    >
                                        <Image
                                            src={QRCodePic}
                                            alt="QR Code"
                                            width={500}
                                            height={500}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <a
                                    href="https://www.facebook.com/kanesorn.kamthawee"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-1 justify-center items-center border border-gray-600 rounded-lg text-center font-semibold transition-all duration-200 hover:brightness-120"
                                    style={{ backgroundColor: getIconData('facebook').color }}
                                >
                                    <div
                                        className="m-2 w-8 h-8"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            maskImage: `url('${getIconData('facebook').src}')`,
                                            WebkitMaskImage: `url('${getIconData('facebook').src}')`,
                                            maskSize: 'contain',
                                            WebkitMaskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskRepeat: 'no-repeat'
                                        }}
                                    />
                                    <span className="font-bold text-white mr-2">Facebook</span>
                                </a>

                                <a
                                    href="https://line.me/ti/p/lYA5G6kG1Q"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-1 justify-center items-center border border-gray-600 rounded-lg text-center font-semibold transition-all duration-200 hover:brightness-105"
                                    style={{ backgroundColor: getIconData('line').color }}
                                >
                                    <div
                                        className={`m-2 w-8 h-8 bg-current text-[${getIconData('line').color}]`}
                                        style={{
                                            backgroundColor: "#ffffff",
                                            maskImage: `url('${getIconData('line').src}')`,
                                            WebkitMaskImage: `url('${getIconData('line').src}')`,
                                            maskSize: 'contain',
                                            WebkitMaskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskRepeat: 'no-repeat'
                                        }}
                                    />
                                    <span className={`font-bold text-white`}> Line </span>
                                </a>
                            </div>
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700">เป้าหมายค่าโฮสติ้ง: {targetAmount} บาท / เดือน</span>
                                </div>
                                <div className="relative w-full mt-8">
                                    <div className="absolute -top-8 -translate-x-1/2" style={{ left: `${percentage}%` }}>
                                        <div className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-sm">
                                            {percentage}% - {currentAmount} / {targetAmount} บาท
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-700 rotate-45"></div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
                                        <div
                                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    เว็บนี้ทำเพื่อเพื่อนๆ ให้ใช้งานฟรี ถ้าข้อมูลมีประโยชน์
                                    ช่วยผมสนับสนุนค่าโฮสติ้งคนละเล็กละน้อยได้นะครับ
                                </p>
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