
"use client";

import CountUp from 'react-countup';
import { motion } from "framer-motion";

export default function T2P3_TypePostPart1({ data }) {
    const part7 = data?.tab2?.part1;
    if (!part7) return null;

    // เตรียมข้อมูลการ์ดสรุปและประเภทตำแหน่ง
    const cards = [
        {
            key: 'total',
            title: 'จำนวนตำแหน่งทั้งหมด',
            borderColor: 'border-emerald-500',
            titleColor: 'text-gray-500',
            total_count: part7?.t?.total_count,
            total_person_old: part7?.t?.total_person_old,
            total_person_new: part7?.t?.total_person_new,
            diff: part7?.t?.diff,
            summary: true,
        },
        ...Object.entries(part7)
            .filter(([key]) => key !== 't')
            .map(([key, value]) => ({
                key,
                title: value.type_name,
                borderColor:
                    value.pos_type_id == 1
                        ? 'border-blue-500'
                        : value.pos_type_id == 2
                            ? 'border-green-500'
                            : 'border-yellow-500',
                titleColor:
                    value.pos_type_id == 1
                        ? 'text-blue-500'
                        : value.pos_type_id == 2
                            ? 'text-green-500'
                            : 'text-yellow-500',
                total_count: value.total_count,
                total_person_old: value.total_person_old,
                total_person_new: value.total_person_new,
                diff: value.diff,
            }))
    ];

    // รูปแบบการ์ด
    const renderCard = (item) => (
        <div
            key={item.key}
            className={`h-full min-w-0 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 ${item.borderColor} shadow-xs`}
        >
            <p className={`text-lg sm:text-xl font-bold ${item.titleColor}`}>
                {item.title}
            </p>

            <div className="text-right">
                <span className="text-2xl lg:text-3xl font-bold text-gray-600">
                    <CountUp
                        end={item.total_count}
                        duration={3}
                        separator=","
                        decimals={0}
                        useEasing={true}
                    />{' '}
                    <b className="text-sm lg:text-base">ตำแหน่ง</b>
                </span>
            </div>

            <div className="border-t border-gray-400 mb-1"></div>

            <p className="text-gray-500 text-sm">
                {item.summary ? 'ขึ้นบัญชีทั้งหมด' : 'ผู้ขึ้นบัญชี'}
                <b className="ml-1">(เก่า)</b>
            </p>

            <div className="text-right">
                <span className="text-2xl lg:text-3xl font-bold text-gray-600">
                    <CountUp
                        end={item.total_person_old}
                        duration={3}
                        separator=","
                        decimals={0}
                        useEasing={true}
                    />{' '}
                    <b className="text-sm lg:text-base">คน</b>
                </span>
            </div>

            <div className="border-t border-gray-400 mb-1"></div>

            <p className="text-gray-500 text-sm">
                {item.summary ? 'ขึ้นบัญชีทั้งหมด' : 'ผู้ขึ้นบัญชี'}
                <b className="ml-1">(ใหม่)</b>
            </p>

            <div className="text-right">
                <span className="text-2xl lg:text-3xl font-bold text-gray-600">
                    <CountUp
                        end={item.total_person_new}
                        duration={3}
                        separator=","
                        decimals={0}
                        useEasing={true}
                    />{' '}
                    <b className="text-sm lg:text-base">คน</b>
                </span>
            </div>

            <div className="border-t border-gray-400 mb-1"></div>

            <p className="text-gray-500 text-sm">ส่วนต่าง</p>

            <div className="text-right">
                <span className="text-2xl lg:text-3xl font-bold text-gray-600">
                    <CountUp
                        end={item.diff}
                        duration={3}
                        separator=","
                        decimals={0}
                        useEasing={true}
                    />{' '}
                    <b className="text-sm lg:text-base">คน</b>
                </span>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Mobile Slider */}
            <div className="sm:hidden">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3">
                    {cards.map((item) => (
                        <div
                            key={item.key}
                            className="flex-[0_0_100%] min-w-0 snap-center"
                        >
                            {renderCard(item)}
                        </div>
                    ))}
                </div>

                <p className="text-center text-xs text-gray-400">
                    ปัดซ้ายหรือขวาเพื่อดูข้อมูลประเภทอื่น
                </p>
            </div>

            {/* Tablet และ Desktop Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {cards.map((item) => renderCard(item))}
            </div>
        </motion.div>
    );
}
