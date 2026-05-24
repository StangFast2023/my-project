"use client";
import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { motion } from 'framer-motion';
import { FilterDropdown } from './filterDropdown';
const MySwal = withReactContent(Swal);

export default function T4P1_TableAllListed({ data }) {
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
    
    const [selectedItems, setSelectedItems] = useState(items.map(i => i.id));
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
    const [selectedPos, setSelectedPos] = useState(posItems.map(i => i.id));
    const handleReset = () => {
        MySwal.fire({
            title: 'ต้องการล้างค่าที่เลือกทั้งหมด?',
            text: "ข้อมูลที่คุณเลือกไว้จะถูกล้างออกทั้งหมด",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'ใช่, ล้างข้อมูล',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedItems(items.map(i => i.id));
                setSelectedPos(posItems.map(i => i.id));
                MySwal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'ล้างข้อมูลเรียบร้อย',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };
    if (!filterStructure) return <div className="p-4 text-slate-900">กำลังโหลดข้อมูล...</div>;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
                <div className="col-span-4">
                    <FilterDropdown 
                        label="ภาค & เขต"
                        items={items}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        columns={3}
                    />
                </div>
                <div className="col-span-4">
                    <FilterDropdown 
                        label="ประเภท & ตำแหน่ง" 
                        items={posItems} 
                        selectedItems={selectedPos} 
                        setSelectedItems={setSelectedPos}
                        columns={4}
                    />
                </div>
                <button 
                    onClick={handleReset}
                    className="col-span-2 px-2 py-2 bg-slate-200 text-slate-700 rounded-lg text-xm font-medium hover:bg-slate-300 transition-all"
                >
                    รีเซ็ต
                </button>
                <button 
                    onClick={() => { /* เปิด modal คาดการณ์ */ }}
                    className="col-span-2 px-2 py-2 bg-blue-600 text-white rounded-lg text-xm font-medium hover:bg-blue-700 transition-all"
                >
                    คาดการณ์เรียกบรรจุ
                </button>
            </div>
        </motion.div>
    );
}