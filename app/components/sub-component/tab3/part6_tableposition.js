
import LoadingScreen from "../../LoadingScreen";
import Select, { components } from "react-select";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Search, OctagonAlert } from "lucide-react";
import RoundDetailModal from '@/app/components/RoundDetailModal';
import useMediaQuery from '@/app/avaliable/useMediaQuery';

const typeStyles = {
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
    3: "bg-yellow-100 text-yellow-700"
};

// แปลงลำดับที่เรียกของแต่ละประเภท
const getMobileCalledRanks = (typeData) => {
    if (Array.isArray(typeData?.start_end)) {
        return typeData.start_end;
    }

    if (Array.isArray(typeData?.rank)) {
        return typeData.rank.map(({ start, end }) =>
            start === end ? `${start}` : `${start}-${end}`
        );
    }

    return [];
};

// แปลงข้อมูลจังหวัดเป็นกลุ่มภาคและเขต
const getMobileProvinceGroups = (provinces) => {
    if (!provinces || typeof provinces !== "object" || Array.isArray(provinces)) {
        return [];
    }

    return Object.entries(provinces)
        .filter(([, region]) =>
            region && typeof region === "object" && !Array.isArray(region)
        )
        .map(([regionId, region]) => {
            const zones = Object.entries(region)
                .filter(([key, zone]) =>
                    key !== "name" &&
                    zone &&
                    typeof zone === "object" &&
                    !Array.isArray(zone)
                )
                .map(([zoneId, zone]) => ({
                    id: zoneId,
                    name: zone.name || `เขต ${zoneId}`,
                    provinces: Array.isArray(zone.list) ? zone.list : [],
                }));

            return {
                id: regionId,
                name: region.name || `ภาค ${regionId}`,
                zones,
            };
        })
        .filter(region => region.zones.length > 0);
};

// แปลงข้อมูลประเภทการเรียก
const getMobileCallTypes = (typeCall) => {
    if (!typeCall || typeof typeCall !== "object" || Array.isArray(typeCall)) {
        return [];
    }

    return Object.entries(typeCall)
        .filter(([, value]) =>
            value && typeof value === "object" && !Array.isArray(value)
        )
        .map(([id, value]) => ({
            id,
            name: value.type_call_name || `ประเภทการเรียก ${id}`,
            total: Number(value.total) || 0,
            ranks: getMobileCalledRanks(value),
            provinceGroups: getMobileProvinceGroups(value.provinces),
        }));
};

const CustomOption = (props) => (
    <components.Option {...props}>
        <div className="flex items-center p-0 md:p-1 lg:p-2">
            <span className="text-sm md:text-base lg:text-lg text-gray-700 font-semibold mr-1">
                ({props.data.pos_id})
            </span>
            <span className="text-xs md:text-base lg:text-lg text-gray-700">
                {props.data.label}
            </span>
            <span className={`ml-auto px-4 py-1 rounded-full font-bold shadow-sm ${typeStyles[props.data.type_id]} hidden md:block lg:block`}>
                {props.data.type_name}
            </span>
        </div>
    </components.Option>
);

export default function T2P7_TableAllType({ data }) {

    const isMobile = useMediaQuery("(max-width: 767px)");

    const data_select = useMemo(() => {
        return data?.tab3?.part6 || {};
    }, [data?.tab3?.part6]);

    const options = Object.values(data_select).map(item => ({
        value: item.pos_id,
        label: `${item.pre_name || ""}${item.pos_name || ""}${item.suf_name || ""}`,
        pos_id: item.pos_id,
        type_id: item.type_id,
        type_name: item.type_name,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRound, setSelectedRound] = useState(null);

    const [selectedZone, setSelectedZone] = useState(null);

    const handleCellClick = (each_round_data) => {
        setSelectedRound(each_round_data);
        setIsModalOpen(true);
    };

    const [selectedOption, setSelectedOption] = useState(() => {
        if (typeof window === "undefined") {
            return null;
        }

        const savedOption = localStorage.getItem("selectedPos");
        if (!savedOption) return null;

        try {
            return JSON.parse(savedOption);
        } catch (e) {
            console.error("Error parsing localStorage:", e);
            return null;
        }
    });

    const displayData = selectedOption ? tableData : [];

    useEffect(() => {
        if (!selectedOption) return;

        const controller = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`https://dla-backend-production.up.railway.app/api/updating-tab3-part6/${selectedOption.value}`, {
                    signal: controller.signal
                });

                // const response = await fetch(
                //     `http://127.0.0.1:8000/api/updating-tab3-part6/${selectedOption.value}`,
                //     { signal: controller.signal }
                // );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                setTableData(result);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Fetch error:", error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [selectedOption]);

    const handleSelect = (option) => {
        setSelectedOption(option);

        if (option) {
            localStorage.setItem("selectedPos", JSON.stringify(option));
        } else {
            localStorage.removeItem("selectedPos");
            setTableData([]);
        }
    };

    const max_rounds_all_zones = Math.max(
        ...Object.values(displayData).map(zone => Number(zone.total_round) || 0),
        0
    );

    const max_rounds = Math.max(10, max_rounds_all_zones);
    const round_columns = Array.from({ length: max_rounds }, (_, i) => i + 1);

    let summary = {
        total_listed: 0,
        total_listed_new: 0,
        total_diff: 0,
        total_called: 0,
        total_remain: 0,
        rounds: {}
    };

    if (displayData && Object.keys(displayData).length > 0) {
        summary = Object.values(displayData).reduce((acc, curr) => {
            acc.total_listed += Number(curr.total_listed) || 0;
            acc.total_listed_new += Number(curr.total_listed_new) || 0;
            acc.total_diff += Number(curr.total_diff) || 0;
            acc.total_called += Number(curr.total_called) || 0;
            acc.total_remain += Number(curr.total_remain) || 0;

            if (curr.data_round) {
                Object.values(curr.data_round).forEach(roundly => {
                    if (!roundly) return;

                    const r = roundly.round;
                    acc.rounds[r] = (acc.rounds[r] || 0) + (Number(roundly.total) || 0);
                });
            }

            return acc;
        }, {
            total_listed: 0,
            total_listed_new: 0,
            total_diff: 0,
            total_called: 0,
            total_remain: 0,
            rounds: {}
        });
    }

    const percent = summary?.total_listed_new > 0
        ? (summary.total_called / summary.total_listed_new) * 100
        : 0;

    if (!data) return <LoadingScreen />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
                <div className="lg:col-span-6 text-center mb-2">
                    <h3 className="flex text-sm md:text-base lg:text-lg font-bold text-gray-700">
                        <Zap />
                        <span className="ml-2">วิเคราะห์ตำแหน่งเชิงพื้นที่</span>
                    </h3>
                </div>

                <div className="lg:col-span-6 flex gap-4 lg:ml-auto">
                    <div className="w-full max-w-[600px] lg:w-[600px]">
                        <Select
                            options={options}
                            components={{ Option: CustomOption }}
                            value={selectedOption}
                            onChange={handleSelect}
                            placeholder="ค้นหาตำแหน่ง..."
                            isSearchable
                            isClearable
                            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 })
                            }}
                            formatOptionLabel={(item) => (
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-gray-700">
                                        ({item.pos_id})
                                    </span>
                                    <span className="text-gray-700">
                                        {`${item.label}`}
                                    </span>
                                    <span className={`ml-auto px-4 py-1 rounded-full font-bold shadow-sm ${typeStyles[item.type_id]}`}>
                                        {item.type_name}
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-300">
                <div className="flex-1 overflow-y-hidden overflow-x-auto">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-[#FFFFFF]">
                                    <div className="w-25 h-25 border-15 border-gray-200 border-t-sky-600 rounded-full animate-spin"></div>
                                    <p className="mt-10 text-3xl text-600 font-kanit text-gray-800 animate-pulse">
                                        กำลังประมวลข้อมูล...
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            Object.values(displayData).length === 0 ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="text-gray-400 mb-4 hidden md:block lg:block">
                                            <OctagonAlert size={100} />
                                        </div>
                                        <div className="text-gray-400 mb-4 block md:hidden lg:hidden">
                                            <OctagonAlert size={60} />
                                        </div>
                                        <h3 className="text-base lg:text-3xl font-bold text-gray-500">
                                            กรุณาเลือกตำแหน่งเพื่อแสดงข้อมูล
                                        </h3>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="w-full h-auto min-h-fit"
                                >
                                    {isMobile ? (
                                        <div className="p-1 w-full h-auto">
                                            <div className="rounded-2xl bg-white p-1">
                                                <h3 className="mb-2 text-base font-bold text-gray-800">
                                                    สรุปยอดรวมทุกภาค
                                                </h3>

                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        {
                                                            label: "ขึ้นบัญชีเก่า",
                                                            value: summary.total_listed,
                                                            color: "bg-amber-50 text-amber-700",
                                                        },
                                                        {
                                                            label: "ขึ้นบัญชีใหม่",
                                                            value: summary.total_listed_new,
                                                            color: "bg-amber-100 text-amber-800",
                                                        },
                                                        {
                                                            label: "ส่วนต่าง",
                                                            value: summary.total_diff,
                                                            color: "bg-rose-50 text-rose-700",
                                                        },
                                                        {
                                                            label: "เรียกแล้ว",
                                                            value: summary.total_called,
                                                            color: "bg-emerald-50 text-emerald-700",
                                                        },
                                                        {
                                                            label: "คงเหลือ",
                                                            value: summary.total_remain,
                                                            color: summary.total_remain === 0
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : summary.total_remain > 0
                                                                    ? "bg-orange-50 text-orange-700"
                                                                    : "bg-rose-50 text-rose-700",
                                                        },
                                                    ].map((stat) => (
                                                        <div
                                                            key={stat.label}
                                                            className={`rounded-xl p-2 ${stat.color}`}
                                                        >
                                                            <p className="text-xs">{stat.label}</p>
                                                            <p className="mt-0.5 text-lg font-bold text-right">
                                                                {(Number(stat.value) || 0).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))}

                                                    <div className={`rounded-xl p-2 ${percent === 100
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : percent < 100
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-violet-50 text-violet-700'
                                                        }`}>
                                                        <p className="text-xs">ความคืบหน้ารวม</p>
                                                        <p className="mt-0.5 text-lg font-bold text-right">
                                                            {Number(percent || 0).toFixed(2)}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <div className="flex flex-col items-center justify-between gap-1 p-1">
                                                    <h3 className="text-base font-bold text-gray-800">
                                                        รายละเอียดรายภาคและเขต
                                                    </h3>
                                                    <span className="shrink-0 text-xs text-gray-400">
                                                        เลื่อนซ้าย–ขวา
                                                    </span>
                                                </div>

                                                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto p-1">
                                                    {Object.values(displayData).map((item) => {
                                                        const statusOpen = item.status_open === true;
                                                        const totalListed = Number(item.total_listed) || 0;
                                                        const totalListedNew = Number(item.total_listed_new) || 0;
                                                        const totalCalled = Number(item.total_called) || 0;
                                                        const totalDiff = Number(item.total_diff) || 0;
                                                        const totalRemain = Number(item.total_remain) || 0;

                                                        const progress = statusOpen && totalListedNew > 0
                                                            ? (totalCalled / totalListedNew) * 100
                                                            : 0;

                                                        const rounds = round_columns
                                                            .map((num) => ({
                                                                num,
                                                                data: item?.data_round?.[num] || {},
                                                            }))
                                                            .filter(({ data }) =>
                                                                Object.keys(data).length > 0 &&
                                                                data.list_status === true
                                                            );

                                                        return (
                                                            <section
                                                                key={item.full_key_province}
                                                                className="h-auto w-full min-w-full snap-start rounded-xl border border-gray-200 bg-white p-1 shadow-sm"
                                                            >
                                                                <div className="flex flex-col items-center border-b border-gray-200 p-2">
                                                                    <h4 className="w-full text-center text-base font-bold text-gray-800">
                                                                        {item.full_name_province}
                                                                    </h4>
                                                                    <span className={`mt-1 w-full rounded-full py-0.5 text-center text-sm font-bold ${statusOpen
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-rose-100 text-rose-700"
                                                                        }`}>
                                                                        {statusOpen ? "เปิดสอบ" : "ไม่เปิดสอบ"}
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-1 p-1">
                                                                    <div className="rounded-xl bg-amber-50 p-2">
                                                                        <p className="text-xs text-gray-500">ขึ้นบัญชีเก่า</p>
                                                                        <p className="mt-0.5 font-bold text-sm text-gray-700 text-right">
                                                                            {statusOpen ? totalListed.toLocaleString() : "-"}
                                                                        </p>
                                                                    </div>

                                                                    <div className="rounded-xl bg-amber-100 p-2">
                                                                        <p className="text-xs text-gray-500">ขึ้นบัญชีใหม่</p>
                                                                        <p className="mt-0.5 font-bold text-sm text-gray-700 text-right">
                                                                            {statusOpen ? totalListedNew.toLocaleString() : "-"}
                                                                        </p>
                                                                    </div>

                                                                    <div className="rounded-xl bg-rose-50 p-2">
                                                                        <p className="text-xs text-gray-500">ส่วนต่าง</p>
                                                                        <p className="mt-0.5 font-bold text-sm text-rose-700 text-right">
                                                                            {statusOpen ? totalDiff.toLocaleString() : "-"}
                                                                        </p>
                                                                    </div>

                                                                    <div className="rounded-xl bg-emerald-50 p-2">
                                                                        <p className="text-xs text-gray-500">เรียกแล้ว</p>
                                                                        <p className="mt-0.5 font-bold text-sm text-emerald-700 text-right">
                                                                            {statusOpen ? totalCalled.toLocaleString() : "-"}
                                                                        </p>
                                                                    </div>

                                                                    <div className={`rounded-xl p-2 ${progress === 100
                                                                        ? "bg-emerald-50"
                                                                        : progress < 100
                                                                            ? "bg-blue-50"
                                                                            : "bg-violet-50"
                                                                        }`}>
                                                                        <p className="text-xs text-gray-500">ความคืบหน้า</p>
                                                                        <p className={`mt-0.5 font-bold text-sm text-right ${progress === 100
                                                                            ? "text-emerald-700"
                                                                            : progress < 100
                                                                                ? "text-blue-700"
                                                                                : "text-violet-700"
                                                                            }`}>
                                                                            {statusOpen ? `${progress.toFixed(2)}%` : "-"}
                                                                        </p>

                                                                        {statusOpen && (
                                                                            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-blue-100 text-right">
                                                                                <div
                                                                                    className={`h-full rounded-full ${progress === 100
                                                                                        ? "bg-emerald-500"
                                                                                        : progress < 100
                                                                                            ? "bg-blue-500"
                                                                                            : "bg-violet-500"
                                                                                        }`}
                                                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className={`rounded-xl p-2 ${totalRemain === 0
                                                                        ? "bg-emerald-50"
                                                                        : totalRemain > 0
                                                                            ? "bg-orange-50"
                                                                            : "bg-rose-50"
                                                                        }`}>
                                                                        <p className="text-xs text-gray-500">คงเหลือ</p>
                                                                        <p className={`mt-0.5 font-bold text-sm text-right ${totalRemain === 0
                                                                            ? "text-emerald-700"
                                                                            : totalRemain > 0
                                                                                ? "text-orange-700"
                                                                                : "text-rose-700"
                                                                            }`}>
                                                                            {statusOpen ? totalRemain.toLocaleString() : "-"}
                                                                        </p>
                                                                    </div>

                                                                    <div className={`rounded-xl p-2 col-span-2 text-center text-sm font-semibold ${totalRemain === 0
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : totalRemain > 0
                                                                            ? "bg-orange-100 text-orange-700"
                                                                            : "bg-rose-100 text-rose-700"
                                                                        }`}>
                                                                        สถานะบัญชี : {statusOpen
                                                                            ? totalRemain === 0
                                                                                ? "หมดบัญชี"
                                                                                : totalRemain > 0
                                                                                    ? "คงเหลือ"
                                                                                    : "ขาดแคลน"
                                                                            : "-"}
                                                                    </div>
                                                                </div>

                                                                <div className="border-t border-gray-200">
                                                                    <div className="flex items-center justify-between gap-2 p-2">
                                                                        <h5 className="text-xs font-bold text-gray-700">
                                                                            รายละเอียดการเรียกบรรจุ
                                                                        </h5>
                                                                        <span className="shrink-0 text-xs text-gray-400">
                                                                            ทั้งหมด {rounds.length} รอบ
                                                                        </span>
                                                                    </div>

                                                                    {rounds.length > 0 ? (
                                                                        <div className="flex w-full min-w-full items-start snap-x snap-mandatory gap-2 overflow-x-auto">
                                                                            {rounds.map(({ num, data: round }) => {
                                                                                const called = round.call_status === true;
                                                                                const listed = round.list_status === true;
                                                                                const change = round.percent_change;
                                                                                const list_new = called ? round.list_new_status : null;

                                                                                const hasChange = change !== null &&
                                                                                    change !== undefined &&
                                                                                    Number.isFinite(Number(change));

                                                                                const datePart = typeof round.datetime === "string"
                                                                                    ? round.datetime.split(" ")[0]
                                                                                    : null;

                                                                                const [year, month, day] = datePart
                                                                                    ? datePart.split("-").map(Number)
                                                                                    : [];

                                                                                const roundDate = year && month && day
                                                                                    ? new Date(year, month - 1, day)
                                                                                    : null;

                                                                                const isReachedDate = roundDate
                                                                                    ? new Date() >= roundDate
                                                                                    : false;

                                                                                const workStatus = called && listed
                                                                                    ? (isReachedDate ? "ได้รับการบรรจุแล้ว" : "รอการเรียกบรรจุ")
                                                                                    : (!called ? "ไม่มีการเรียกใช้บัญชี" : "บัญชีสิ้นสุด");

                                                                                const callTypes = getMobileCallTypes(round.type_call);

                                                                                return (
                                                                                    <div
                                                                                        key={num}
                                                                                        className="h-auto min-h-fit w-[100%] min-w-[100%] shrink-0 snap-start rounded-xl border border-gray-200 bg-white p-1"
                                                                                    >
                                                                                        <div className="space-y-2">
                                                                                            <div className="flex items-center justify-between gap-2">
                                                                                                <span className="m-1 text-base font-bold text-gray-800">
                                                                                                    รอบที่ {round.round || num}
                                                                                                </span>
                                                                                            </div>

                                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                                <div className="p-1.5 border border-gray-100 rounded bg-gray-50/50">
                                                                                                    <p className="text-xs text-gray-400">จำนวนที่เรียกบรรจุ</p>
                                                                                                    <p className="text-right text-sm font-semibold text-gray-800">
                                                                                                        {(Number(round.total) || 0).toLocaleString()}
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="p-1.5 border border-gray-100 rounded bg-gray-50/50">
                                                                                                    <p className="text-xs text-gray-400">บัญชีที่ใช้เรียก</p>
                                                                                                    <p className="text-right text-sm font-semibold text-gray-800">
                                                                                                        {list_new !== null && (
                                                                                                            <span className={`text-sm rounded-sm px-2 ${list_new
                                                                                                                ? "text-emerald-600"
                                                                                                                : "text-rose-600"
                                                                                                                }`}>
                                                                                                                {list_new ? "บัญชีใหม่" : "บัญชีเก่า"}
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                                <div className="col-span-2 p-1.5 border border-gray-100 rounded bg-gray-50/50">
                                                                                                    <p className="text-xs text-gray-400">วันที่รายงานตัว</p>
                                                                                                    <p className="text-right text-sm font-semibold text-gray-800">
                                                                                                        {called ? round.st_report_thai_short || "-" : "-"} - {called ? round.ed_report_thai_short || "-" : "-"}
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="p-1.5 border border-gray-100 rounded bg-gray-50/50">
                                                                                                    <p className="text-xs text-gray-400">วันที่บรรจุ</p>
                                                                                                    <p className="text-right text-sm font-semibold text-gray-800">
                                                                                                        {called ? round.call_date || "-" : "-"}
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="p-1.5 border border-gray-100 rounded bg-gray-50/50">
                                                                                                    <p className="text-xs text-gray-400">สถานะ</p>
                                                                                                    <p className="text-right text-sm font-semibold text-gray-800">
                                                                                                        <span className={`rounded-full text-xs font-semibold ${called && listed
                                                                                                            ? isReachedDate
                                                                                                                ? "text-emerald-600"
                                                                                                                : "text-blue-600"
                                                                                                            : "text-rose-600"
                                                                                                            }`}>
                                                                                                            {workStatus}
                                                                                                        </span>
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="p-1.5 border border-gray-100 rounded bg-gray-50/50">
                                                                                                    <p className="text-xs text-gray-400">อัตราการเปลี่ยนแปลง</p>
                                                                                                    <p className={`text-right text-sm font-semibold ${!hasChange
                                                                                                        ? "text-gray-500"
                                                                                                        : Number(change) > 0
                                                                                                            ? "text-emerald-600"
                                                                                                            : Number(change) < 0
                                                                                                                ? "text-rose-600"
                                                                                                                : "text-gray-600"
                                                                                                        }`}>
                                                                                                        {Number(round.round) === 1
                                                                                                            ? "รอบเริ่มต้น"
                                                                                                            : round.call_status === false && round.list_status === false
                                                                                                                ? "สิ้นสุดการเรียกบรรจุ"
                                                                                                                : hasChange
                                                                                                                    ? `${Number(change) > 0 ? "+" : ""}${Number(change).toFixed(2)}%`
                                                                                                                    : "-"}
                                                                                                    </p>
                                                                                                </div>

                                                                                                <div className="p-1.5 border border-gray-100 rounded bg-gray-50/50">
                                                                                                    <p className="text-xs text-gray-400">สัดส่วนการใช้บัญชี</p>
                                                                                                    <p className="text-right text-sm font-semibold text-gray-800">
                                                                                                        {called && Number.isFinite(Number(round.proportion_used))
                                                                                                            ? `${Number(round.proportion_used).toFixed(2)}%`
                                                                                                            : "-"}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>

                                                                                            {callTypes.length > 0 && (
                                                                                                <div className="border-t border-gray-200 pt-2 space-y-3">
                                                                                                    <div className="flex items-center justify-between">
                                                                                                        <h6 className="text-xs font-bold text-gray-700">
                                                                                                            รายละเอียดประเภทการเรียก
                                                                                                        </h6>
                                                                                                        <span className="text-xs text-gray-400">
                                                                                                            {callTypes.length} ประเภท
                                                                                                        </span>
                                                                                                    </div>

                                                                                                    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">
                                                                                                        {callTypes.map((callType) => (
                                                                                                            <div
                                                                                                                key={callType.id}
                                                                                                                className="w-[95%] min-w-[95%] shrink-0 snap-start rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3"
                                                                                                            >
                                                                                                                <div className="flex items-center justify-between gap-2">
                                                                                                                    <span className="text-sm font-bold text-gray-800">
                                                                                                                        {callType.name}
                                                                                                                    </span>

                                                                                                                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${typeStyles[callType.id] || "bg-slate-100 text-slate-700"
                                                                                                                        }`}>
                                                                                                                        {callType.total.toLocaleString()} อัตรา
                                                                                                                    </span>
                                                                                                                </div>

                                                                                                                <div>
                                                                                                                    <p className="mb-1 text-xs font-semibold text-gray-500">
                                                                                                                        ลำดับบัญชีที่เรียก
                                                                                                                    </p>

                                                                                                                    <div className="flex flex-wrap gap-1">
                                                                                                                        {callType.ranks.length > 0 ? (
                                                                                                                            callType.ranks.map((rankItem, index) => (
                                                                                                                                <span
                                                                                                                                    key={index}
                                                                                                                                    className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700"
                                                                                                                                >
                                                                                                                                    {rankItem}
                                                                                                                                </span>
                                                                                                                            ))
                                                                                                                        ) : (
                                                                                                                            <span className="text-xs text-gray-400">
                                                                                                                                ไม่ระบุลำดับ
                                                                                                                            </span>
                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                {callType.provinceGroups.length > 0 ? (
                                                                                                                    <div className="space-y-2">
                                                                                                                        <p className="text-xs font-semibold text-gray-500">
                                                                                                                            พื้นที่เรียกบรรจุ
                                                                                                                        </p>

                                                                                                                        <div className="space-y-3">
                                                                                                                            <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">
                                                                                                                                {callType.provinceGroups.map((region) => (
                                                                                                                                    <div
                                                                                                                                        key={region.id}
                                                                                                                                        className="w-[95%] min-w-[95%] shrink-0 snap-start rounded-lg border border-blue-200 bg-white p-2 space-y-2"
                                                                                                                                    >
                                                                                                                                        <div className="rounded-md bg-blue-50 px-3 py-2">
                                                                                                                                            <p className="text-sm font-bold text-blue-700">
                                                                                                                                                {region.name}
                                                                                                                                            </p>
                                                                                                                                        </div>

                                                                                                                                        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">
                                                                                                                                            {region.zones.map((zone) => (
                                                                                                                                                <div
                                                                                                                                                    key={zone.id}
                                                                                                                                                    className="w-[90%] min-w-[90%] shrink-0 snap-start rounded-lg border border-gray-200 bg-gray-50 p-2"
                                                                                                                                                >
                                                                                                                                                    <div className="flex items-center justify-between gap-2">
                                                                                                                                                        <p className="text-xs font-bold text-gray-700">
                                                                                                                                                            {zone.name}
                                                                                                                                                        </p>

                                                                                                                                                        <span className="shrink-0 text-xs text-gray-400">
                                                                                                                                                            {zone.provinces.length} จังหวัด
                                                                                                                                                        </span>
                                                                                                                                                    </div>

                                                                                                                                                    <button
                                                                                                                                                        type="button"
                                                                                                                                                        onClick={() => setSelectedZone({
                                                                                                                                                            id: zone.id,
                                                                                                                                                            name: zone.name,
                                                                                                                                                            regionName: region.name,
                                                                                                                                                            provinces: zone.provinces,
                                                                                                                                                        })}
                                                                                                                                                        className="mt-2 w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700"
                                                                                                                                                    >
                                                                                                                                                        ดูรายชื่อจังหวัด
                                                                                                                                                    </button>
                                                                                                                                                </div>
                                                                                                                                            ))}
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                ))}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                ) : (
                                                                                                                    <p className="text-xs text-gray-400">
                                                                                                                        ไม่มีข้อมูลพื้นที่ที่เรียกบรรจุ
                                                                                                                    </p>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}


                                                                                            {/* Modal รายชื่อจังหวัด เฉพาะมือถือ */}
                                                                                            {selectedZone && (
                                                                                                <div className="md:hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                                                                                                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">

                                                                                                        {/* Header */}
                                                                                                        <div className="flex items-center justify-between border-b border-gray-200 p-4">
                                                                                                            <div>
                                                                                                                <h3 className="text-base font-bold text-gray-800">
                                                                                                                    รายชื่อจังหวัด
                                                                                                                </h3>
                                                                                                                <p className="mt-1 text-xs text-gray-500">
                                                                                                                    {selectedZone.regionName} {selectedZone.name}
                                                                                                                </p>
                                                                                                            </div>

                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() => setSelectedZone(null)}
                                                                                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                                                                                                                aria-label="ปิดหน้าต่าง"
                                                                                                            >
                                                                                                                ✕
                                                                                                            </button>
                                                                                                        </div>

                                                                                                        {/* จำนวนจังหวัด */}
                                                                                                        <div className="px-4 pt-3">
                                                                                                            <span className="text-xs font-semibold text-gray-500">
                                                                                                                ทั้งหมด {selectedZone.provinces.length} จังหวัด
                                                                                                            </span>
                                                                                                        </div>

                                                                                                        {/* รายชื่อจังหวัด เลื่อนขึ้น-ลง */}
                                                                                                        <div className="max-h-[60vh] overflow-y-auto p-4">
                                                                                                            {selectedZone.provinces.length > 0 ? (
                                                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                                                    {selectedZone.provinces.map((province, index) => (
                                                                                                                        <div
                                                                                                                            key={`${selectedZone.id}-${index}`}
                                                                                                                            className="rounded-md border border-gray-200 bg-gray-50 px-2 py-2 text-xs font-semibold text-gray-700"
                                                                                                                        >
                                                                                                                            {province}
                                                                                                                        </div>
                                                                                                                    ))}
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                <p className="py-4 text-center text-xs text-gray-400">
                                                                                                                    ไม่ระบุจังหวัด
                                                                                                                </p>
                                                                                                            )}
                                                                                                        </div>

                                                                                                        {/* Footer */}
                                                                                                        <div className="border-t border-gray-200 p-3">
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() => setSelectedZone(null)}
                                                                                                                className="w-full rounded-lg bg-gray-800 py-2.5 text-sm font-semibold text-white"
                                                                                                            >
                                                                                                                ปิดหน้าต่าง
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}

                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-500">
                                                                            ยังไม่มีข้อมูลการเรียกบรรจุ
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </section>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full overflow-x-auto">
                                            <table className="min-w-[1400px] w-full border-collapse whitespace-nowrap text-left">
                                                <thead className="bg-gray-50 text-gray-600 text-sm">
                                                    <tr>
                                                        <th className="bg-gray-50 px-4 py-4 text-base lg:text-sm font-bold sticky left-[0] z-30">
                                                            ภาค - เขต
                                                        </th>
                                                        <th className="bg-gray-100 px-4 py-4 text-base lg:text-sm font-bold text-center">
                                                            สถานะเปิดสอบ
                                                        </th>
                                                        <th className="bg-amber-50 px-4 py-4 text-base lg:text-sm font-bold text-center">
                                                            ขึ้นบัญชี (เก่า)
                                                        </th>
                                                        <th className="bg-amber-100 px-4 py-4 text-base lg:text-sm font-bold text-center">
                                                            ขึ้นบัญชี (ใหม่)
                                                        </th>
                                                        <th className="bg-rose-100 px-4 py-4 text-base lg:text-sm font-bold text-center">
                                                            ส่วนต่าง
                                                        </th>
                                                        <th className="bg-emerald-50 px-4 py-4 text-base lg:text-sm font-bold text-center text-emerald-700">
                                                            เรียกแล้ว
                                                        </th>
                                                        <th className="bg-blue-50 px-4 py-4 text-base lg:text-sm font-bold text-center text-blue-700">
                                                            ความคืบหน้า
                                                        </th>
                                                        <th className="bg-orange-100 px-4 py-4 text-base lg:text-sm font-bold text-center text-orange-500">
                                                            คงเหลือ
                                                        </th>
                                                        {round_columns.map(num => (
                                                            <th
                                                                key={num}
                                                                className="bg-amber-50/30 px-4 py-2 text-base lg:text-sm font-bold text-center"
                                                            >
                                                                รอบ {num}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {Object.values(displayData).map((item) => {
                                                        const full_key = item.full_key_province;
                                                        const status_open = item.status_open;
                                                        const full_name_province = item.full_name_province;
                                                        const total_listed = status_open === true ? item.total_listed : "";
                                                        const total_listed_new = status_open === true ? item.total_listed_new : "";
                                                        const total_diff = status_open === true ? item.total_diff : "";
                                                        const total_called = status_open === true ? item.total_called : "";
                                                        const total_remain = status_open === true ? item.total_remain : "";

                                                        const total_process = status_open === true
                                                            ? (total_listed_new !== 0
                                                                ? ((total_called / total_listed_new) * 100)
                                                                : 0)
                                                            : "";

                                                        return (
                                                            <tr key={full_key}>
                                                                <td className="bg-gray-50 px-4 py-4 text-base lg:text-sm font-semibold text-left text-gray-700 sticky left-0 z-10">
                                                                    {full_name_province}
                                                                </td>

                                                                <td className={`px-4 py-4 text-base lg:text-sm font-semibold text-center text-gray-700 ${status_open === true ? "bg-emerald-100" : "bg-rose-100"}`}>
                                                                    {status_open === true ? "เปิดสอบ" : "ไม่เปิดสอบ"}
                                                                </td>

                                                                <td className="bg-amber-50 px-4 py-4 text-base lg:text-sm font-semibold text-center text-gray-600">
                                                                    {total_listed.toLocaleString()}
                                                                </td>

                                                                <td className="bg-amber-100 px-4 py-4 text-base lg:text-sm font-semibold text-center text-gray-600">
                                                                    {total_listed_new.toLocaleString()}
                                                                </td>

                                                                <td className="bg-rose-50 px-4 py-4 text-base lg:text-sm font-semibold text-center text-gray-600">
                                                                    {total_diff.toLocaleString()}
                                                                </td>

                                                                <td className="bg-emerald-50 px-4 py-4 text-base lg:text-sm font-semibold text-center text-emerald-600">
                                                                    {total_called.toLocaleString()}
                                                                </td>

                                                                <td className={`px-4 py-4 text-base lg:text-sm font-semibold text-center ${status_open
                                                                    ? total_process === 100
                                                                        ? "bg-emerald-50 text-emerald-600"
                                                                        : total_process === 0
                                                                            ? "bg-rose-50 text-rose-600"
                                                                            : total_process >= 100
                                                                                ? "bg-violet-50 text-violet-600"
                                                                                : "bg-blue-50 text-blue-600"
                                                                    : "bg-gray-50 text-gray-600"
                                                                    }`}>
                                                                    {status_open ? total_process.toFixed(2) + " %" : ""}
                                                                </td>

                                                                <td className={`px-4 py-4 text-base lg:text-sm font-semibold text-center ${total_remain === 0
                                                                    ? "bg-blue-50 text-blue-500"
                                                                    : total_remain > 0
                                                                        ? "bg-orange-50 text-orange-500"
                                                                        : "bg-rose-50 text-rose-500"
                                                                    }`}>
                                                                    {total_remain.toLocaleString()}
                                                                </td>

                                                                {round_columns.map(num => {
                                                                    const data_round = item?.data_round?.[num] || {};
                                                                    const has_data = Object.values(data_round).length > 0;
                                                                    const call_status = data_round?.call_status;
                                                                    const status_list = data_round?.list_status;

                                                                    const getBagColor = (has_data, call_status, status_list) => {
                                                                        if (!has_data) return "cursor-default";

                                                                        if (call_status === true) {
                                                                            return "cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 hover:border-b-emerald-300";
                                                                        }

                                                                        if (call_status === false && status_list === false) {
                                                                            return "cursor-pointer hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200 hover:border-b-amber-300";
                                                                        }

                                                                        return "cursor-pointer hover:bg-rose-50 hover:text-rose-700 transition-colors duration-200 hover:border-b-rose-300";
                                                                    };

                                                                    const getButtonColor = (has_data, call_status, status_list) => {
                                                                        if (!has_data) return "cursor-default";

                                                                        if (call_status === true) {
                                                                            return "bg-emerald-50/90 py-1 text-emerald-800";
                                                                        }

                                                                        if (call_status === false && status_list === false) {
                                                                            return "bg-amber-50/90 py-1 text-amber-800";
                                                                        }

                                                                        return "bg-rose-50/90 py-1 text-rose-800";
                                                                    };

                                                                    const bag_color = getBagColor(has_data, call_status, status_list);
                                                                    const button_color = getButtonColor(has_data, call_status, status_list);
                                                                    return (
                                                                        <td
                                                                            key={num}
                                                                            onClick={has_data ? () => handleCellClick(data_round) : undefined}
                                                                            className={`px-4 py-4 relative group text-center ${Object.values(data_round).length > 0 && call_status
                                                                                ? bag_color
                                                                                : "bg-gray-200/50"
                                                                                }`}
                                                                        >
                                                                            <>
                                                                                {call_status ? (
                                                                                    <div className="transition-transform duration-300 group-hover:-translate-y-2 text-base lg:text-sm">
                                                                                        <span className={`font-bold ${call_status === true
                                                                                            ? "text-gray-600"
                                                                                            : status_list
                                                                                                ? "text-rose-600"
                                                                                                : "text-amber-600"
                                                                                            }`}>
                                                                                            {status_list ? data_round.total.toLocaleString() : "-"}
                                                                                        </span>
                                                                                    </div>
                                                                                ) : null}

                                                                                {call_status ? (
                                                                                    <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out ${button_color}`}>
                                                                                        <div className="flex items-center gap-1 text-xs font-medium">
                                                                                            <Search size={10} />
                                                                                            <span>รายละเอียด</span>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : null}
                                                                            </>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>

                                                <tfoot className="sticky bottom-0 bg-[#2d3446] text-white">
                                                    <tr>
                                                        <td colSpan={2} className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-50 py-2 text-center font-semibold">
                                                            รวมทั้งหมดทุกภาค
                                                        </td>
                                                        <td className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-40 py-2 text-center font-semibold">
                                                            {summary.total_listed.toLocaleString()}
                                                        </td>
                                                        <td className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-40 py-2 text-center font-semibold">
                                                            {summary.total_listed_new.toLocaleString()}
                                                        </td>
                                                        <td className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-40 py-2 text-center font-semibold">
                                                            {summary.total_diff.toLocaleString()}
                                                        </td>
                                                        <td className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-40 py-2 text-center font-semibold">
                                                            {summary.total_called.toLocaleString()}
                                                        </td>
                                                        <td className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-40 py-2 text-center font-semibold">
                                                            {percent ? percent.toFixed(2) + " %" : ""}
                                                        </td>
                                                        <td className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-40 py-2 text-center font-semibold">
                                                            {summary.total_remain.toLocaleString()}
                                                        </td>

                                                        {round_columns.map((index) => {
                                                            const roundly = summary?.rounds[index] || "";

                                                            return (
                                                                <td
                                                                    key={index}
                                                                    className="bg-[#2d3446] sticky text-base lg:text-sm left-0 bottom-0 z-40 py-2 text-center font-semibold"
                                                                >
                                                                    {roundly ? roundly.toLocaleString() : ""}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                </tfoot>
                                            </table>

                                            <RoundDetailModal
                                                isOpen={isModalOpen}
                                                onClose={() => setIsModalOpen(false)}
                                                data={selectedRound}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
