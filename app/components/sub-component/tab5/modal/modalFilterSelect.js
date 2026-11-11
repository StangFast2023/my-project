
"use client";

import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function ModalFilterSelect({ isOpen, setIsOpen, onSave }) {

    const { data: configData } = useQuery({
        queryKey: ['tab5Config'],
        queryFn: async () => {
            const res = await fetch(`https://dla-backend-production.up.railway.app/api/recruitment/tab5`);
            // const res = await fetch(`http://127.0.0.1:8000/api/recruitment/tab5`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const part1 = configData?.tab5?.part1 || {};

    const [areaKey, setAreaKey] = useState('');
    const [sequence, setSequence] = useState('');
    const [regionKey, setRegionKey] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [positionKey, setPositionKey] = useState('');
    const [dropdownStyle, setDropdownStyle] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);

    const isComplete = regionKey && areaKey && positionKey && sequence;

    const positionButtonRef = useRef(null);
    const modalRef = useRef(null);
    const dropdownRef = useRef(null);

    const Toast = MySwal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', MySwal.stopTimer);
            toast.addEventListener('mouseleave', MySwal.resumeTimer);
        }
    });

    // Position Dropdown Responsive
    useLayoutEffect(() => {
        if (activeDropdown !== 'pos' || !positionButtonRef.current) return;

        const handleUpdate = () => {
            if (!positionButtonRef.current) return;

            const rect = positionButtonRef.current.getBoundingClientRect();

            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                setActiveDropdown(null);
                return;
            }

            const isMobile = window.innerWidth < 768;
            const dropdownWidth = isMobile
                ? Math.min(rect.width, window.innerWidth - 24)
                : Math.max(rect.width, 300);

            const left = Math.max(
                12,
                Math.min(rect.left, window.innerWidth - dropdownWidth - 12)
            );

            setDropdownStyle({
                top: (rect.bottom + 8) + 'px',
                left: left + 'px',
                width: isMobile ? dropdownWidth + 'px' : 'max-content',
                minWidth: isMobile ? dropdownWidth + 'px' : rect.width + 'px',
                maxWidth: 'calc(100vw - 24px)',
            });
        };

        handleUpdate();

        window.addEventListener('scroll', handleUpdate, true);
        window.addEventListener('resize', handleUpdate, true);

        return () => {
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate, true);
        };
    }, [activeDropdown]);

    const regions = Object.entries(part1);
    const selectedRegionObj = part1[regionKey];

    const subAreas = selectedRegionObj
        ? Object.entries(selectedRegionObj.pro_sub)
        : [];

    const selectedAreaObj = selectedRegionObj?.pro_sub[areaKey];

    const allPositions = selectedAreaObj?.data_position
        ? Object.entries(selectedAreaObj.data_position).map(([key, val]) => ({
            key: key,
            ...val
        }))
        : [];

    const filteredPositions = allPositions.filter(p => {
        const search = searchTerm.toLowerCase();
        const nameMatch = p.pos_name.toLowerCase().includes(search);
        const idMatch = p.pos_id.toString().includes(search);

        return nameMatch || idMatch;
    });

    const handleSequenceClick = () => {
        if (!regionKey || !areaKey || !positionKey) {
            MySwal.fire({
                icon: 'warning',
                title: 'ยังเลือกข้อมูลไม่ครบ',
                text: 'กรุณาเลือก ภาค, เขต และ ตำแหน่ง ให้ครบก่อนนะครับ',
            });
            return;
        }

        const selectedPosData = allPositions.find(p => p.key === positionKey);
        const maxLimit = selectedPosData?.total_listed || 0;
        const maxLimitNew = selectedPosData?.total_listed_n || 0;

        MySwal.fire({
            title: 'ระบุลำดับ',
            html: `
                <div style="margin-bottom: 10px;">
                    ตำแหน่งนี้มีผู้ขึ้นบัญชีทั้งหมด <b>${maxLimitNew}</b> คน
                    <br>
                    ( บัญชีเก่ามีผู้ขึ้นบัญชีทั้งหมด <b>${maxLimit}</b> คน )
                </div>
            `,
            input: 'number',
            inputAttributes: {
                min: 1,
                max: maxLimitNew,
                step: 1
            },
            inputPlaceholder: maxLimitNew > 0
                ? (maxLimitNew === 1
                    ? 'กรุณากรอกลำดับ 1'
                    : `กรุณากรอกลำดับ (1 - ${maxLimitNew})`)
                : 'ไม่มีผู้สอบผ่าน',
            inputValue: sequence,
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            inputValidator: (value) => {
                const num = parseInt(value);

                if (!value) return 'กรุณากรอกตัวเลข';
                if (num <= 0) return 'ต้องมากกว่า 0';
                if (maxLimitNew === 0) return 'ไม่มีผู้สอบผ่าน';
                if (num > maxLimitNew) return `ห้ามเกิน ${maxLimitNew} นะครับ!`;
            },
            didOpen: () => {
                const input = Swal.getInput();
                const confirmButton = Swal.getConfirmButton();

                if (maxLimitNew === 0) {
                    input.disabled = true;
                } else {
                    input.disabled = false;
                }

                confirmButton.disabled = (maxLimitNew === 0 || isNaN(maxLimitNew));
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setSequence(result.value);
            }
        });
    };

    const typeStyles = {
        1: "bg-blue-100 text-blue-700",
        2: "bg-green-100 text-green-700",
        3: "bg-yellow-100 text-yellow-700"
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">

            {/* Modal */}
            <div
                ref={modalRef}
                className="bg-white w-full max-w-2xl lg:max-w-[40%] max-h-[94dvh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            >

                {/* Header */}
                <div className="shrink-0 px-4 sm:px-8 py-4 sm:py-5 shadow-sm text-center font-bold text-lg sm:text-2xl text-gray-900 font-kanit">
                    รายละเอียดข้อมูล
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

                    {/* Region */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center dropdown-container">
                        <div className="sm:col-span-3 font-bold text-sm sm:text-base text-gray-800">
                            ภาค
                        </div>

                        <div className="sm:col-span-9 relative">
                            <div
                                onClick={() => setActiveDropdown(activeDropdown === 'region' ? null : 'region')}
                                className="w-full px-3 sm:px-4 py-3 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 cursor-pointer font-medium text-sm sm:text-base text-gray-900"
                            >
                                {regionKey
                                    ? part1[regionKey].pro_main_name
                                    : "กรุณาเลือกภาค"}
                            </div>

                            {activeDropdown === 'region' && (
                                <div className="absolute w-full mt-2 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl z-50 max-h-48 overflow-y-auto">
                                    {regions.map(([k, v]) => (
                                        <div
                                            key={k}
                                            onClick={() => {
                                                setRegionKey(k);
                                                setAreaKey('');
                                                setPositionKey('');
                                                setSequence('');
                                                setActiveDropdown(null);
                                            }}
                                            className="px-3 sm:px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base text-gray-800"
                                        >
                                            {v.pro_main_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Area */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center dropdown-container">
                        <div className="sm:col-span-3 font-bold text-sm sm:text-base text-gray-800">
                            เขต
                        </div>

                        <div className="sm:col-span-9 relative">
                            <div
                                onClick={() => regionKey && setActiveDropdown(activeDropdown === 'area' ? null : 'area')}
                                className={`w-full px-3 sm:px-4 py-3 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 font-medium text-sm sm:text-base ${regionKey
                                        ? 'text-gray-900 cursor-pointer'
                                        : 'text-gray-400 opacity-50'
                                    }`}
                            >
                                {areaKey
                                    ? "เขต " + selectedRegionObj.pro_sub[areaKey].pro_sub_id
                                    : "กรุณาเลือกเขต"}
                            </div>

                            {activeDropdown === 'area' && (
                                <div className="absolute w-full mt-2 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl z-50 max-h-48 overflow-y-auto">
                                    {subAreas.map(([k, v]) => (
                                        <div
                                            key={k}
                                            onClick={() => {
                                                setAreaKey(k);
                                                setPositionKey('');
                                                setSequence('');
                                                setActiveDropdown(null);
                                            }}
                                            className="px-3 sm:px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base text-gray-800"
                                        >
                                            เขต {v.pro_sub_id}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center relative">
                        <div className="sm:col-span-3 font-bold text-sm sm:text-base text-gray-800">
                            ตำแหน่ง
                        </div>

                        <div
                            ref={positionButtonRef}
                            onClick={() => areaKey && setActiveDropdown(activeDropdown === 'pos' ? null : 'pos')}
                            className={`sm:col-span-9 px-3 sm:px-4 py-3 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 font-medium flex justify-between items-center text-sm sm:text-base ${areaKey
                                    ? 'text-gray-900 cursor-pointer'
                                    : 'text-gray-400 opacity-50'
                                }`}
                        >
                            <div className="flex items-center min-w-0 w-full">
                                <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                                    <b className="mr-2">
                                        {positionKey
                                            ? "[ " + allPositions.find(p => p.key === positionKey)?.pos_id + " ]"
                                            : null}
                                    </b>

                                    {positionKey
                                        ? allPositions.find(p => p.key === positionKey)?.pos_name
                                        : "กรุณาเลือกตำแหน่ง"}
                                </div>

                                {positionKey && (
                                    <span
                                        className={`hidden sm:block ml-2 px-3 py-1 text-xs rounded-full shadow-sm shrink-0 ${typeStyles[
                                            allPositions.find(p => p.key === positionKey)?.pos_type_id
                                            ]
                                            }`}
                                    >
                                        {allPositions.find(p => p.key === positionKey)?.pos_type_name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Position Dropdown */}
                        {activeDropdown === 'pos' && (
                            <div
                                ref={dropdownRef}
                                className="fixed bg-white rounded-xl sm:rounded-2xl border border-gray-300 shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                style={dropdownStyle}
                            >
                                <input
                                    autoFocus
                                    placeholder="ค้นหาตำแหน่ง..."
                                    className="w-full p-3 sm:p-4 border-b border-gray-200 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    value={searchTerm}
                                />

                                <div className="max-h-[45dvh] sm:max-h-60 overflow-y-auto custom-scrollbar">
                                    {filteredPositions.length > 0 ? (
                                        filteredPositions.map((pos) => (
                                            <div
                                                key={pos.key}
                                                onClick={() => {
                                                    setPositionKey(pos.key);
                                                    setSequence('');
                                                    setSearchTerm('');
                                                    setActiveDropdown(null);
                                                }}
                                                className="px-3 py-3 sm:px-4 sm:py-3 hover:bg-blue-50 cursor-pointer text-gray-800 text-sm sm:text-base font-medium border-b border-gray-50 sm:flex sm:items-center"
                                            >
                                                <b className="mr-2">
                                                    [ {pos.pos_id} ]
                                                </b>

                                                {pos.pos_name}

                                                <span className={`hidden sm:inline-block ml-2 px-3 py-1 text-xs rounded-full shadow-sm ${typeStyles[pos.pos_type_id]}`}>
                                                    {pos.pos_type_name}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-gray-400 text-center text-sm">
                                            ไม่พบตำแหน่งที่ค้นหา
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sequence */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center dropdown-container">
                        <div className="sm:col-span-3 font-bold text-sm sm:text-base text-gray-800">
                            ลำดับ
                        </div>

                        <div className="sm:col-span-9 relative">
                            <button
                                type="button"
                                onClick={handleSequenceClick}
                                className={`w-full px-3 sm:px-4 py-3 bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 font-medium text-left transition-colors flex justify-between items-center text-sm sm:text-base ${positionKey
                                        ? 'text-gray-900 cursor-pointer hover:border-blue-400'
                                        : 'text-gray-400 opacity-50'
                                    }`}
                            >
                                {sequence
                                    ? `ลำดับที่ ${sequence}`
                                    : "คลิกเพื่อกรอกลำดับ"}

                                {sequence && (
                                    <span className="text-blue-500 font-bold">✓</span>
                                )}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="shrink-0 p-3 sm:p-4 border-t bg-gray-50 rounded-b-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">

                    <div className="grid grid-cols-3 sm:flex sm:justify-end gap-2">

                        <button
                            disabled={!isComplete}
                            onClick={() => {
                                MySwal.fire({
                                    title: 'ยืนยันการเลือกข้อมูล?',
                                    text: "ระบบจะนำข้อมูลที่คุณเลือกไปประมวลผลต่อ",
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#16a34a',
                                    cancelButtonColor: '#e11d48',
                                    confirmButtonText: 'ใช่, ยืนยันข้อมูล!',
                                    cancelButtonText: 'ยกเลิก'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        onSave({
                                            regionId: part1[regionKey]?.pro_main_id,
                                            areaId: selectedRegionObj?.pro_sub[areaKey]?.pro_sub_id,
                                            positionId: allPositions.find(p => p.key === positionKey)?.pos_id,
                                            sequence: sequence,
                                            frequency: 1
                                        });

                                        setIsOpen(false);

                                        Toast.fire({
                                            icon: 'success',
                                            title: 'ยืนยันข้อมูลสำเร็จ!'
                                        });
                                    }
                                });
                            }}
                            className={`px-2 sm:px-6 py-2.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${isComplete
                                    ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            ยืนยันข้อมูล
                        </button>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-2 sm:px-6 py-2.5 sm:py-2 bg-rose-600 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-rose-700 transition-all whitespace-nowrap"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={() => {
                                setRegionKey('');
                                setAreaKey('');
                                setPositionKey('');
                                setSequence('');
                                setSearchTerm('');
                                setActiveDropdown(null);
                            }}
                            className="px-2 sm:px-6 py-2.5 sm:py-2 bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold rounded-lg hover:bg-gray-300 transition-all whitespace-nowrap"
                        >
                            รีเซ็ต
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
