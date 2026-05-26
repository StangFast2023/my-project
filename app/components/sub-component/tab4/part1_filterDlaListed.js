"use client";
import React, { useMemo, useState } from 'react';
import Swal                         from 'sweetalert2';
import withReactContent             from 'sweetalert2-react-content';
import { motion }                   from 'framer-motion';
import { FilterDropdown }           from './filterDropdown';
import { LoadingScreen }            from '../../../components/LoadingScreen';
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

                {/* ส่วนของเครื่องมือเสริม (แยกฝั่งขวา) */}
                <div className="flex items-center gap-6 ml-auto border-l pl-6 border-gray-200">
                    <label className="flex items-center cursor-pointer rounded-lg shadow-sm border border-slate-300 p-2">
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
                        <span className="ml-3 text-xm text-gray-700 font-medium">
                            แสดงตำแหน่งที่ไม่เปิดสอบ
                        </span>
                    </label>
                    <button 
                        onClick={handleReset}
                        className="col-span-2 px-2 py-2 bg-slate-200 text-slate-700 rounded-lg text-xm font-medium hover:bg-slate-300 transition-all"
                    >
                        คืนค่าเริ่มต้น
                    </button>
                </div>
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
                            className="text-xm flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors cursor-pointer"
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
                            className="text-xm flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 font-medium rounded-full border border-purple-200 hover:bg-purple-200 transition-colors cursor-pointer"
                        >
                            {chip.label}
                            <span className="text-lg font-bold leading-none select-none">×</span>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}