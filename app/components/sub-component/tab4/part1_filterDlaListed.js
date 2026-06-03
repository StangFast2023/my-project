"use client";
import React, { useMemo, useState } from 'react';
import Swal                         from 'sweetalert2';
import withReactContent             from 'sweetalert2-react-content';
import { motion }                   from 'framer-motion';
import { FilterDropdown }           from './filterDropdown';
import { LoadingScreen }            from '../../../components/LoadingScreen';
import { useColumnStore }           from '../../useTableColumns';
import { RotateCcw , Settings }     from 'lucide-react';
const MySwal = withReactContent(Swal);
export default function T4P1_TableAllListed({ 
    data, 
    filters, 
    setFilters
 }) {
    const filterStructure = data?.tab4?.part1;

    const items = useMemo(() => {
        const regionData = filterStructure?.region || {};
        const regions = Object.values(regionData).map(r => ({
            id: `reg-${r.main}`,
            name: r.main_name,
            isRegion: true
        }));
        const subs = Object.values(regionData).flatMap(r => 
            Object.entries(r.sub || {}).map(([subKey, s]) => ({
                id: `sub-${r.main}-${subKey}`, 
                name: s.sub_name,
                isRegion: false,
                parentId: `reg-${r.main}`
            }))
        );
        return [...regions, ...subs];
    }, [filterStructure?.region]);

    const posItems = useMemo(() => {
        const positionData = data?.tab4?.part1?.positions || {};
        const types = Object.entries(positionData).map(([typeKey, p]) => ({
            id: `type-${typeKey}`,
            name: p.type_name,
            isRegion: true
        }));
        const positions = Object.entries(positionData).flatMap(([typeKey, p]) => 
            Object.entries(p.data_position).map(([posKey, pos]) => ({
                id: `pos-${typeKey}-${posKey}`,
                name: pos.full_pos_name,
                isRegion: false,
                parentId: `type-${typeKey}`
            }))
        );

        return [...types, ...positions];
    }, [data]);    

    const handleReset = () => {
        MySwal.fire({
            title: 'คืนค่าเริ่มต้น?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            if (result.isConfirmed) {
                const allRegionIds = items.map(item => item.id);
                const allPosIds = posItems.map(item => item.id);
                handleRegionChange(allRegionIds);
                handlePositionChange(allPosIds);
                if (typeof handleToggleEmpty === 'function') {
                    handleToggleEmpty(false); 
                }
                const defaultSettings = {
                    all_header: true,
                    column_part1: true,
                    column_part2: true,
                    column_part3: true,
                };
                updateTableVisibility(defaultSettings);
                MySwal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'คืนค่าเริ่มต้นเรียบร้อย',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    const getFilterChips = () => {
        const chips = [];
        const regionData = data?.tab4?.part1?.region || {};
        const regionKeys = Object.keys(regionData);
        
        const allPossibleIds = items.filter(i => !i.isRegion).map(i => i.id);
        const isAllSelected = allPossibleIds.every(id => filters.regions.includes(id));

        if (isAllSelected) {
            return [{ id: 'all', label: "ทุกภาค & ทุกเขต" }];
        }

        regionKeys.forEach(regKey => {
            const r = regionData[regKey];
            const regId = `reg-${r.main}`;
            const subEntries = Object.entries(r.sub || {});
            const selectedSubsInThisRegion = subEntries.filter(([subKey, s]) => 
                filters.regions.includes(`sub-${r.main}-${subKey}`)
            );
            if (filters.regions.includes(regId) || selectedSubsInThisRegion.length === subEntries.length) {
                chips.push({ id: regId, label: `${r.main_name} ทุกเขต` });
            } 
            else if (selectedSubsInThisRegion.length > 0) {
                selectedSubsInThisRegion.forEach(([subKey, s]) => {
                    chips.push({ 
                        id: `sub-${r.main}-${subKey}`, 
                        label: s.sub_name 
                    });
                });
            }
        });

        return chips;
    };

    const handleRemove = (idToRemove) => {
        setFilters(prev => {
            let nextRegions;
            if (idToRemove === 'all') {
                nextRegions = [];
            } else if (idToRemove.startsWith('reg-')) {
                const subPrefix = idToRemove.replace('reg-', 'sub-');
                nextRegions = prev.regions.filter(id => id !== idToRemove && !id.startsWith(subPrefix));
            } else {
                nextRegions = prev.regions.filter(id => id !== idToRemove);
            }
            return { ...prev, regions: nextRegions };
        });
        MySwal.fire({
            toast: true,
            position: 'top-end',
            width: '450px',
            icon: 'success',
            title: `ลบ "${itemName}" เรียบร้อย`,
            showConfirmButton: false,
            timer: 1000
        });
    };

    const getPosFilterChips = () => {
        const chips = [];
        const positionData = data?.tab4?.part1?.positions || {};
        const allPosIds = posItems.filter(i => !i.isRegion).map(i => i.id);
        const isAllPosSelected = allPosIds.every(id => filters.positions.includes(id));
        if (isAllPosSelected) {
            return [{ id: 'all-pos', label: "ทุกประเภท & ทุกตำแหน่ง" }];
        }
        Object.entries(positionData).forEach(([typeKey, p]) => {
            const typeId = `type-${typeKey}`;
            const posEntries = Object.entries(p.data_position || {});
            const selectedPosInThisType = posEntries.filter(([posKey, pos]) => 
                filters.positions.includes(`pos-${typeKey}-${posKey}`)
            );
            if (filters.positions.includes(typeId) || selectedPosInThisType.length === posEntries.length) {
                chips.push({ id: typeId, label: `${p.type_name} ทุกตำแหน่ง` });
            } 
            else if (selectedPosInThisType.length > 0) {
                selectedPosInThisType.forEach(([posKey, pos]) => {
                    chips.push({ 
                        id: `pos-${typeKey}-${posKey}`, 
                        label: pos.full_pos_name 
                    });
                });
            }
        });

        return chips;
    };
    const handleRemovePos = (idToRemove) => {
        const itemToRemove = posItems.find(i => i.id === idToRemove);
        const itemName = itemToRemove ? itemToRemove.name : "รายการนี้";
        setFilters(prev => {
            let nextPositions;
            if (idToRemove === 'all-pos') {
                nextPositions = [];
            } else if (idToRemove.startsWith('type-')) {
                const posPrefix = idToRemove.replace('type-', 'pos-');
                nextPositions = prev.positions.filter(id => 
                    id !== idToRemove && !id.startsWith(posPrefix)
                );
            } else {
                nextPositions = prev.positions.filter(id => id !== idToRemove);
            }
            return {
                ...prev,
                positions: nextPositions
            };
        });
        MySwal.fire({
            toast: true,
            position: 'top-end',
            width: '450px',
            icon: 'success',
            title: `ลบ "${itemName}" เรียบร้อย`,
            showConfirmButton: false,
            timer: 1000
        });
    };

    const handleRegionChange = (newRegions) => {
        setFilters(prev => ({ ...prev, regions: newRegions }));
    };

    const handlePositionChange = (newPositions) => {
        setFilters(prev => ({ ...prev, positions: newPositions }));
    };

    const handleToggleEmpty = (e) => {
        const isChecked = (typeof e === 'boolean') ? e : e.target.checked;
        setFilters(prev => ({ ...prev, showEmpty: isChecked }));
        MySwal.fire({
            toast: true,
            position: 'top-end',
            width: '450px',
            icon: 'success',
            title: (isChecked ? 'ทำการแสดง' : 'ซ่อน') + `ตำแหน่งที่ไม่เปิดสอบเรียบร้อย`,
            showConfirmButton: false,
            timer: 1000
        });
    };
    
    React.useEffect(() => {
        if (filters.regions.length === 0 && items.length > 0) {
            setFilters(prev => ({
                ...prev,
                regions: items.map(i => i.id),
                positions: posItems.map(i => i.id)
            }));
        }
    }, [items, posItems]);
    
    const updateTableVisibility = (newSettings) => {
        const setStoreColumns = useColumnStore.getState().setColumns;
        setStoreColumns(newSettings); 
    };
    const openSettingsModal = () => {
        const currentColumns = useColumnStore.getState().columns;
        Swal.fire({
            title: 'ตั้งค่าการแสดงผลตาราง',
            html: `
                <table class="w-full text-left border-collapse">
                    <tr class="border-b">
                        <td class="w-[100%] py-2 text-gray-500 text-left" colspan="2">
                            <span style="font-size: 1.2rem; font-weight: 600;">
                                โครงสร้างตาราง (แนวตั้ง)
                            </span> 
                        </td>
                    </tr>
                    <tr>
                        <td class="w-[70%] py-2 text-gray-500 text-left">
                            <span style="font-size: 1.2rem; font-weight: 600; padding-left: 2.5rem; display: flex; align-items: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" style="margin-right: 1rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="round lucide lucide-circle-small-icon lucide-circle-small">
                                    <circle cx="12" cy="12" r="6"/>
                                </svg>
                                ระดับภาค , เขต และประเภท
                            </span> 
                        </td>
                        <td class="w-[30%] py-2 text-gray-500 text-center">
                            <label style="display: flex; align-items: center; align-items: center;">
                                <input id="all_header" type="checkbox" style="width: 20px; height: 20px; margin-right: 1rem;" ${currentColumns.all_header ? 'checked' : ''}>
                                <span style="font-size: 1.2rem; font-weight: 600;">แสดง</span>
                            </label>
                        </td>
                    </tr>
                </table>
                <table class="w-full text-left border-collapse">
                    <tr class="border-b">
                        <td class="w-[100%] py-2 text-gray-500 text-left" colspan="2">
                            <span style="font-size: 1.2rem; font-weight: 600;">
                                ข้อมูลคอลัมน์ (แนวนอน)
                            </span> 
                        </td>
                    </tr>
                    <tr>
                        <td class="w-[70%] py-2 text-gray-500 text-left">
                            <span style="font-size: 1.2rem; font-weight: 600; padding-left: 2.5rem; display: flex; align-items: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" style="margin-right: 1rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="round lucide lucide-circle-small-icon lucide-circle-small">
                                    <circle cx="12" cy="12" r="6"/>
                                </svg>
                                สถานะเปิดสอบ
                            </span> 
                        </td>
                        <td class="w-[30%] py-2 text-gray-500 text-center">
                            <label style="display: flex; align-items: center; align-items: center;">
                                <input id="column_part1" type="checkbox" style="width: 20px; height: 20px; margin-right: 1rem;" ${currentColumns.column_part1 ? 'checked' : ''}>
                                <span style="font-size: 1.2rem; font-weight: 600;">แสดง</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="w-[70%] py-2 text-gray-500 text-left">
                            <span style="font-size: 1.2rem; font-weight: 600; padding-left: 2.5rem; display: flex; align-items: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" style="margin-right: 1rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="round lucide lucide-circle-small-icon lucide-circle-small">
                                    <circle cx="12" cy="12" r="6"/>
                                </svg>
                                สถานะบัญชี
                            </span> 
                        </td>
                        <td class="w-[30%] py-2 text-gray-500 text-center">
                            <label style="display: flex; align-items: center; align-items: center;">
                                <input id="column_part2" type="checkbox" style="width: 20px; height: 20px; margin-right: 1rem;" ${currentColumns.column_part2 ? 'checked' : ''}>
                                <span style="font-size: 1.2rem; font-weight: 600;">แสดง</span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="w-[70%] py-2 text-gray-500 text-left">
                            <span style="font-size: 1.2rem; font-weight: 600; padding-left: 2.5rem; display: flex; align-items: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" style="margin-right: 1rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="round lucide lucide-circle-small-icon lucide-circle-small">
                                    <circle cx="12" cy="12" r="6"/>
                                </svg>
                                ความคืบหน้า
                            </span> 
                        </td>
                        <td class="w-[30%] py-2 text-gray-500 text-center">
                            <label style="display: flex; align-items: center; align-items: center;">
                                <input id="column_part3" type="checkbox" style="width: 20px; height: 20px; margin-right: 1rem;" ${currentColumns.column_part3 ? 'checked' : ''}>
                                <span style="font-size: 1.2rem; font-weight: 600;">แสดง</span>
                            </label>
                        </td>
                    </tr>
                </table>
            `,
            confirmButtonText: 'ยืนยัน',
            showCancelButton: true,
            width: '600px',
            preConfirm: () => {
                return {
                    all_header:   document.getElementById('all_header').checked,
                    column_part1: document.getElementById('column_part1').checked,
                    column_part2: document.getElementById('column_part2').checked,
                    column_part3: document.getElementById('column_part3').checked,
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { all_header, column_part1, column_part2, column_part3 } = result.value;
                const isHeaderHidden = !all_header;
                if( all_header || !all_header ) {
                    if (isHeaderHidden) {
                        let text = "";
                        if (!all_header) text = `หากคุณซ่อนหัวแถวและสรุปของระดับ <b>ภาค , เขต และประเภท</b> <br> ระบบจะเพิ่มคอลัมน์ <b>ภาค</b> กับ <b>เขต</b> เข้ามาแทน <br> และ <b>สรุปรวม</b> ของ ภาค , เขต และประเภท จะไม่แสดงผล`;
                        const confirmRes = await Swal.fire({
                            icon: 'warning',
                            title: 'ยืนยันการเปลี่ยนแปลง?',
                            html: `<div style="text-align: center;">${text}</div>`,
                            showCancelButton: true,
                            confirmButtonColor: '#d33'
                        });
                        if (!confirmRes.isConfirmed) {
                            openSettingsModal();
                            return;
                        }
                    }
                    Swal.fire({
                        title: 'กำลังปรับโครงสร้างตาราง...',
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading()
                    });

                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    Swal.close();
                }
                updateTableVisibility(result.value);
                let changes = [];
                if (all_header) changes.push("โครงสร้างตาราง");
                if (column_part1 || column_part2 || column_part3) changes.push("ข้อมูลคอลัมน์");
                MySwal.fire({
                    toast: true,
                    width: '600px',
                    position: 'top-end',
                    icon: 'success',
                    title: `ปรับเปลี่ยน ${changes.join(' และ ')} เรียบร้อยแล้ว`,
                    showConfirmButton: false,
                    timer: 4500
                });
            }
        });
    };
    if(!data) return <LoadingScreen />;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-1 gap-4">
                    <div className="w-1/2">
                        <FilterDropdown 
                            label="ภาค & เขต"
                            items={items}
                            selectedItems={filters.regions}
                            setSelectedItems={handleRegionChange}
                            columns={3}
                        />
                    </div>
                    <div className="w-1/2">
                        <FilterDropdown 
                            label="ประเภท & ตำแหน่ง" 
                            items={posItems} 
                            selectedItems={filters.positions}
                            setSelectedItems={handlePositionChange}
                            columns={4}
                        />
                    </div>
                </div>
                <label className="flex items-center cursor-pointer rounded-lg shadow-sm border border-slate-300 p-2 whitespace-nowrap">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            id="toggle-switch"
                            className="sr-only peer" 
                            checked={filters.showEmpty}
                            onChange={handleToggleEmpty}
                        />
                        <div className="block bg-gray-300 w-10 h-6 rounded-full peer-checked:bg-blue-200 transition"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4 peer-checked:bg-blue-600"></div>
                    </div>
                    <span className="ml-3 text-sm md:text-base lg:text-xm text-gray-700 font-medium">
                        แสดงตำแหน่งที่ไม่เปิดสอบ
                    </span>
                </label>
                <button 
                    onClick={openSettingsModal}
                    className="flex items-center gap-2 px-5 py-2 px-4 bg-blue-100 text-blue-600 rounded-lg shadow-sm border border-blue-200 hover:bg-blue-200 transition-all whitespace-nowrap"
                >
                    <Settings />
                    <span className="font-medium">ตั้งค่าตาราง</span>
                </button>
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-5 py-2 px-4 bg-slate-100 text-slate-600 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-200 transition-all whitespace-nowrap"
                >
                    <RotateCcw />
                    <span className="font-medium">คืนค่าเริ่มต้น</span>
                </button>
            </div>


            <div className="flex items-center gap-4 my-2">
                <span className="text-gray-600 font-medium whitespace-nowrap">
                    แสดงข้อมูลตาม :
                </span>
                <div className="flex flex-wrap gap-2">
                    {getFilterChips().map((chip, index) => (
                        <button
                            key={`pos-${index}`}
                            type="button"
                            onClick={() => handleRemove(chip.id)}
                            className="text-sm md:text-base lg:text-xm flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors cursor-pointer"
                        >
                            {chip.label}
                            <span className="text-lg font-bold leading-none select-none">×</span>
                        </button>
                    ))}
                    {getPosFilterChips().map((chip, index) => (
                        <button
                            key={`pos-${index}`}
                            type="button"
                            onClick={() => handleRemovePos(chip.id)}
                            className="text-sm md:text-base lg:text-xm flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 font-medium rounded-full border border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer"
                        >
                            {chip.label}
                            <span className="text-sm md:text-base lg:text-lg font-bold leading-none select-none">×</span>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}