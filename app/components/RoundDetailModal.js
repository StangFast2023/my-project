
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const formatNumber = (value, digits = 0) => {
    if (value === null || value === undefined || value === "") return "-";

    const number = Number(value);

    return Number.isFinite(number)
        ? number.toLocaleString("en-US", {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        })
        : "-";
};

const getStatusText = (status) => {
    const statuses = {
        waiting: "รอการเรียกบรรจุ",
        "not-used": "ไม่มีการใช้บัญชี",
        exhaustion: "บัญชีสิ้นสุด",
        completed: "ได้รับการบรรจุแล้ว",
    };

    return statuses[status] || status || "-";
};

const getChangeInfo = (data) => {

    if (data.round === 1) {
        return {
            text: "รอบเริ่มต้น",
            color: "text-emerald-600",
            icon: "−",
        };
    }

    if (data.call_status === false && data.list_status === false) {
        return {
            text: "สิ้นสุดการเรียกบรรจุ",
            color: "text-gray-500",
            icon: "−",
        };
    }

    const value = data.percent_change;

    if (value === null || value === undefined) {
        return {
            text: "-",
            color: "text-gray-500",
            icon: "−",
        };
    }

    if (value > 0) {
        return {
            text: `${formatNumber(Math.abs(value), 2)} %`,
            color: "text-emerald-600",
            icon: "↗",
        };
    }

    if (value < 0) {
        return {
            text: `${formatNumber(Math.abs(value), 2)} %`,
            color: "text-rose-600",
            icon: "↘",
        };
    }

    return {
        text: "0.00 %",
        color: "text-gray-500",
        icon: "−",
    };
};

// แปลงข้อมูลช่วงลำดับที่เรียก
const getCalledRanks = (typeData) => {
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

// แปลงรายละเอียดภาค เขต และจังหวัด
const getProvinceGroups = (provinces) => {
    if (!provinces || typeof provinces !== "object") {
        return [];
    }

    return Object.entries(provinces)
        .filter(([, region]) =>
            region &&
            typeof region === "object" &&
            !Array.isArray(region)
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

// แปลงประเภทการเรียกจาก type_call
const getCallTypes = (typeCall) => {
    if (!typeCall || typeof typeCall !== "object") {
        return [];
    }

    return Object.entries(typeCall)
        .filter(([, value]) =>
            value &&
            typeof value === "object" &&
            !Array.isArray(value)
        )
        .map(([id, value]) => ({
            id,
            name: value.type_call_name || `ประเภทการเรียก ${id}`,
            total: value.total,
            ranks: getCalledRanks(value),
            provinceGroups: getProvinceGroups(value.provinces),
        }));
};

const InfoRow = ({ label, children }) => (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 py-4 border-b last:border-b-0">
        <div className="font-semibold text-gray-500">
            {label}
        </div>

        <div className="font-semibold text-gray-800 break-words">
            {children ?? "-"}
        </div>
    </div>
);

// ปุ่มควบคุมการเลื่อนการ์ดแต่ละระดับ
const CarouselControls = ({ index, total, onChange }) => {
    if (total <= 1) return null;

    return (
        <div className="flex shrink-0 items-center gap-2">
            <button
                type="button"
                onClick={() => onChange(Math.max(0, index - 1))}
                disabled={index === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xl text-gray-700 shadow-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="รายการก่อนหน้า"
            >
                ‹
            </button>

            <span className="min-w-[48px] text-center text-xs font-semibold text-gray-500">
                {index + 1} / {total}
            </span>

            <button
                type="button"
                onClick={() => onChange(Math.min(total - 1, index + 1))}
                disabled={index === total - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xl text-gray-700 shadow-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="รายการถัดไป"
            >
                ›
            </button>
        </div>
    );
};

function RoundDetailModalContent({
    isOpen,
    onClose,
    data,
}) {
    const callTypes = getCallTypes(data?.type_call);

    // ตำแหน่งการ์ดแต่ละระดับ
    const [typeIndex, setTypeIndex] = useState(0);
    const [regionIndex, setRegionIndex] = useState(0);
    const [zoneIndex, setZoneIndex] = useState(0);

    const [slideDirections, setSlideDirections] = useState({
        type: "right",
        region: "right",
        zone: "right",
    });

    // ข้อมูลตามลำดับชั้น
    const selectedType = callTypes[typeIndex];
    const regions = selectedType?.provinceGroups || [];
    const selectedRegion = regions[regionIndex];
    const zones = selectedRegion?.zones || [];
    const selectedZone = zones[zoneIndex];
    // เลือก Animation ตามทิศทางการเลื่อน
    const getAnimationClass = (direction) =>
        direction === "left"
            ? "animate-slide-in-left"
            : "animate-slide-in-right";

    // เมื่อเปลี่ยนประเภทการเรียก ให้เริ่มภาคและเขตใหม่
    const handleTypeChange = (nextIndex) => {
        setSlideDirections((prev) => ({
            ...prev,
            type: nextIndex > typeIndex ? "right" : "left",
            region: "right",
            zone: "right",
        }));

        setTypeIndex(nextIndex);
        setRegionIndex(0);
        setZoneIndex(0);
    };

    // เมื่อเปลี่ยนภาค ให้เริ่มเขตใหม่
    const handleRegionChange = (nextIndex) => {
        setSlideDirections((prev) => ({
            ...prev,
            region: nextIndex > regionIndex ? "right" : "left",
            zone: "right",
        }));

        setRegionIndex(nextIndex);
        setZoneIndex(0);
    };

    // เมื่อเปลี่ยนเขต
    const handleZoneChange = (nextIndex) => {
        setSlideDirections((prev) => ({
            ...prev,
            zone: nextIndex > zoneIndex ? "right" : "left",
        }));

        setZoneIndex(nextIndex);
    };

    // จัดการ Escape และ Scroll ของหน้าเว็บ
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        const previousOverflow = document.body.style.overflow;

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    const changeInfo = getChangeInfo(data);

    const reportDate =
        data.st_report_thai_short || data.ed_report_thai_short
            ? `${data.st_report_thai_short || "-"} - ${data.ed_report_thai_short || "-"}`
            : data.report_date || "-";

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                className="flex h-[80vh] w-[80vw] max-w-[1400px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            >
                <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            รายละเอียดรอบที่ {data.round || 0}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            ข้อมูลการเรียกบรรจุและรายละเอียดพื้นที่
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid min-h-0 flex-1 grid-cols-2">

                    {/* ฝั่งซ้าย: รายละเอียดการเรียกบรรจุ */}
                    <section className="flex min-h-0 min-w-0 flex-col overflow-y-auto p-6">
                        <h3 className="mb-5 text-lg font-bold text-gray-800">
                            ข้อมูลการเรียกบรรจุ
                        </h3>

                        <div className="rounded-xl border px-5">
                            <InfoRow label="จำนวนที่เรียกบรรจุ">
                                <span className="text-2xl font-bold">
                                    {formatNumber(data.total)}
                                </span>
                            </InfoRow>

                            <InfoRow label="บัญชีที่ใช้เรียก">
                                {data.call_status
                                    ? data.list_new_status === true
                                        ? "บัญชีใหม่"
                                        : data.list_new_status === false
                                            ? "บัญชีเก่า"
                                            : "-"
                                    : "-"}
                            </InfoRow>

                            <InfoRow label="วันที่รายงานตัว">
                                {reportDate}
                            </InfoRow>

                            <InfoRow label="วันที่บรรจุ">
                                {data.call_status ? data.call_date || "-" : "-"}
                            </InfoRow>

                            <InfoRow label="สถานะ">
                                {getStatusText(data.status_work)}
                            </InfoRow>

                            <InfoRow label="อัตราการเปลี่ยนแปลง">
                                <span className={changeInfo.color}>
                                    {changeInfo.icon} {changeInfo.text}
                                </span>
                            </InfoRow>

                            <InfoRow label="สัดส่วนการใช้บัญชี">
                                {data.call_status
                                    ? `${formatNumber(data.proportion_used, 2)} %`
                                    : "-"}
                            </InfoRow>
                        </div>
                    </section>

                    <section className="flex min-h-0 min-w-0 flex-col overflow-y-auto p-6">
                        {callTypes.length > 0 ? (
                            <div
                                key={selectedType?.id}
                                className={`space-y-4 ${getAnimationClass(slideDirections.type)}`}
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center">
                                        <h4 className="font-bold text-gray-800">
                                            ประเภทการเรียก :
                                        </h4>
                                        <h4 className="ml-2 px-2 py-1 border-1 border-gray-700 rounded-lg font-bold text-gray-800">
                                            {selectedType?.name || "-"}
                                        </h4>
                                    </div>
                                    <CarouselControls
                                        index={typeIndex}
                                        total={callTypes.length}
                                        onChange={handleTypeChange}
                                    />
                                </div>

                                <div className="flex flex-col border-1 border-gray-400 rounded-lg bg-gray-50 p-3">
                                    <div className="flex justify-end items-center rounded-lg ">
                                        <span className="px-3 py-2 text-sm font-semibold text-gray-600">
                                            เรียกทั้งหมด
                                        </span>
                                        <span className="rounded-md border border-gray-300 bg-white px-4 py-1 text-lg font-semibold text-gray-600">
                                            {formatNumber(selectedType?.total)}
                                        </span>
                                        <span className="px-3 py-2 text-sm font-semibold text-gray-600">
                                            อัตรา
                                        </span>
                                    </div>
                                    <div className="rounded-lg">
                                        <span className="text-sm font-semibold text-gray-600">
                                            ช่วงลำดับ
                                        </span>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {selectedType?.ranks.length > 0 ? (
                                                selectedType.ranks.map((rank, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-600"
                                                    >
                                                        {rank}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-500">ไม่มีข้อมูล</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    key={selectedRegion?.id}
                                    className={`mt-4 rounded-xl border border-gray-300 bg-gray-50 p-2 ${getAnimationClass(slideDirections.region)}`}
                                >
                                    {selectedRegion ? (
                                        <div className="rounded-lg p-3">
                                            <div className="flex justify-between items-center">
                                                <h6 className="font-bold text-gray-800">
                                                    {selectedRegion.name}
                                                </h6>
                                                <CarouselControls
                                                    index={regionIndex}
                                                    total={regions.length}
                                                    onChange={handleRegionChange}
                                                />
                                            </div>
                                            <div
                                                key={selectedZone?.id}
                                                className={`mt-4 rounded-xl border bg-white border-gray-200 p-3 ${getAnimationClass(slideDirections.zone)}`}
                                            >

                                                {selectedZone ? (
                                                    <div className="rounded-lg bg-white p-4">
                                                        <div className="flex justify-between items-center">
                                                            <h6 className="font-bold text-gray-800">
                                                                {selectedRegion.name} {selectedZone.name}
                                                            </h6>
                                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                                <CarouselControls
                                                                    index={zoneIndex}
                                                                    total={zones.length}
                                                                    onChange={handleZoneChange}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="my-3 border-t border-gray-200" />

                                                        <p className="mb-3 text-sm font-bold text-gray-700">
                                                            รายชื่อจังหวัด
                                                            <span className="ml-2 font-normal text-gray-500">
                                                                ( {selectedZone.provinces.length} จังหวัด )
                                                            </span>
                                                        </p>

                                                        {selectedZone.provinces.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {selectedZone.provinces.map((province, index) => (
                                                                    <span
                                                                        key={`${selectedZone.id}-${index}`}
                                                                        className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-600"
                                                                    >
                                                                        {province}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">
                                                                ไม่มีรายชื่อจังหวัด
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                                                        ไม่มีข้อมูลเขตในภาคนี้
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="rounded-lg bg-white p-4 text-sm text-gray-500">
                                            ไม่มีข้อมูลภาคในประเภทการเรียกนี้
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed text-gray-500">
                                ไม่มีรายละเอียดภาค เขต และจังหวัดในรอบนี้
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 justify-end border-t bg-white px-6 py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white hover:bg-emerald-700"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function RoundDetailModal(props) {
    if (
        typeof document === "undefined" ||
        !props.isOpen ||
        !props.data
    ) {
        return null;
    }

    return <RoundDetailModalContent {...props} />;
}
