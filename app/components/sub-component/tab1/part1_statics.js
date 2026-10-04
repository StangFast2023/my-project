"use client";
import { useState, useMemo, useEffect } from 'react';
import CountUp from 'react-countup';
import { motion } from "framer-motion";
export default function StaticNumber({ data }) {
    const [accountType, setAccountType] = useState(() => {
        if (typeof window !== "undefined") {
            const savedType = localStorage.getItem("selectedAccountType");
            return savedType !== null ? Number(savedType) : 1;
        }
        return 1;
    });
    useEffect(() => {
        localStorage.setItem("selectedAccountType", accountType.toString());
    }, [accountType]);
    const accounts = useMemo(
        () => [
            {
                region: "8 เขต ยกเว้นภาคใต้ เขต 1 และ 2",
                startDate: "2026-02-19",
                accountType: 1,
            },
            {
                region: "เฉพาะภาคใต้ เขต 1 และ 2",
                startDate: "2026-04-08",
                accountType: 2,
            },
        ],
        []
    );
    const calculatedAccounts = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return accounts.map((item) => {
            const [year, month, day] = item.startDate.split("-").map(Number);
            const startDate = new Date(year, month - 1, day);
            startDate.setHours(0, 0, 0, 0);

            const expireDate = new Date(startDate);
            expireDate.setFullYear(expireDate.getFullYear() + 2);

            const MS_PER_DAY = 1000 * 60 * 60 * 24;
            const totalDays = Math.round((expireDate - startDate) / MS_PER_DAY);

            let daysPassed = Math.floor((today - startDate) / MS_PER_DAY);
            if (daysPassed < 0) daysPassed = 0;
            if (daysPassed > totalDays) daysPassed = totalDays;

            const progress = totalDays > 0 ? (daysPassed / totalDays) * 100 : 0;

            const formattedExpireDate = expireDate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            const formattedStartDate = startDate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            const todayFormatted = new Date().toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            return {
                ...item,
                startDateFormatted: formattedStartDate,
                expireDateFormatted: formattedExpireDate,
                todayDateFormatted: todayFormatted,
                totalDays,
                daysPassed,
                progress: Number(progress.toFixed(2)),
            };
        });
    }, [accounts]);

    const activeAccount = calculatedAccounts.find(
        (acc) => acc.accountType === accountType
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`${data ? 'block' : 'opacity-0'} lg:gap-2 p-2 rounded-xl`}>
                <div className="flex flex-wrap sm:flex-nowrap justify-end items-center gap-2">
                    <div className="flex p-0.5 rounded-sm bg-gray-100 border border-gray-200 w-full sm:w-auto">
                        {calculatedAccounts.map((acc) => {
                            const isActive = acc.accountType === accountType;
                            return (
                                <button
                                    key={acc.accountType}
                                    onClick={() => setAccountType(acc.accountType)}
                                    className={`lg:w-100 px-3 py-1.5 rounded-sm text-sm transition-all duration-300 ease-in-out whitespace-nowrap
                                            ${isActive
                                            ? "bg-blue-200 text-blue-600 font-bold shadow-sm"
                                            : "bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300"
                                        }`}
                                >
                                    {acc.accountType === 1
                                        ? "8 เขต (ยกเว้นภาคใต้เขต 1 & 2)"
                                        : "เฉพาะภาคใต้ เขต 1 & 2"}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-4">
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">วันประกาศขึ้นบัญชี</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                {activeAccount.startDateFormatted}
                            </span>
                        </div>
                        <div className="w-full rounded-full h-3 overflow-hidden">
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">วันสิ้นสุดอายุบัญชี</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                {activeAccount.expireDateFormatted}
                            </span>
                        </div>
                        <div className="w-full rounded-full h-3 overflow-hidden">
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">อายุบัญชี (วัน) </p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={activeAccount.daysPassed}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl"> / {activeAccount.totalDays} วัน</b>
                            </span>
                        </div>
                        <div className="w-full rounded-full h-3 overflow-hidden">
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">ความคืบหน้าอายุบัญชี</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={activeAccount.progress}
                                    duration={3}
                                    separator=","
                                    decimals={2}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl">  / 100.00 %</b>
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${activeAccount.progress <= 100 ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${Math.min(activeAccount.progress, 100)}%` }} />
                        </div>
                    </div>
                </div>
                <div className="text-gray-600 text-sm font-bold text-right">ข้อมูล ณ วันที่ {activeAccount.todayDateFormatted}</div>
            </div>

            <div className={`${data ? 'block' : 'opacity-0'} p-2 pb-0 rounded-xl`}>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-6 lg:grid-cols-6 lg:gap-2 ">
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">ขึ้นบัญชีทั้งหมด <b>(เก่า)</b></p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={data?.tab1?.part1?.OldTotalList}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl">  คน</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">ขึ้นบัญชีทั้งหมด <b>(ใหม่)</b></p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={data?.tab1?.part1?.NewTotalList}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl">  คน</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">ส่วนต่างของบัญชีเก่าและใหม่</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={data?.tab1?.part1?.DiffTotalList}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl">  คน</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">เรียกไปแล้ว {data?.tab1?.part1?.CurRound} รอบ</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={data?.tab1?.part1?.TotalCall}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl">  คน</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">คงเหลือตามบัญชีใหม่</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={data?.tab1?.part1?.NewTotalList - data?.tab1?.part1?.TotalCall}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl">  คน</b>
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center p-4 bg-gray-50 rounded-xl border-l-4 border-emerald-500 my-2 shadow-xl">
                        <p className="text-gray-500 text-sm">เรียกเฉลี่ยรอบละ</p>
                        <div className="items-baseline gap-2 text-right">
                            <span className="text-sm md:text-base lg:text-3xl font-bold text-gray-600">
                                <CountUp
                                    end={data?.tab1?.part1?.AvgCall}
                                    duration={3}
                                    separator=","
                                    decimals={0}
                                    useEasing={true}
                                />   <b className="text-sm md:text-base lg:text-xl">  คน</b>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
