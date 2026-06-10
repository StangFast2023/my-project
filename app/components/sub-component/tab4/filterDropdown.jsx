import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createRoot } from 'react-dom/client';
const MySwal = withReactContent(Swal);
export const FilterDropdown = ({ items, selectedItems, setSelectedItems, label, columns = 2, onSelectionChange }) => {
    const showModal = () => {
        let tempSelected = [...new Set([...selectedItems])];
        const container = document.createElement('div');
        const root = createRoot(container);
        MySwal.fire({
            title: label,
            width: '1500px',
            html: container,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'อัปเดตข้อมูล',
            cancelButtonText: 'ปิดหน้าต่าง',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            preConfirm: () => {
                setSelectedItems(tempSelected);
                if (onSelectionChange) onSelectionChange(tempSelected);
            },
            didOpen: () => {
                renderContent(tempSelected);
            },
            willClose: () => root.unmount()
        });
        const renderContent = (currentSelected) => {
            root.render(
                <ModalBody
                    items={items}
                    selectedItems={currentSelected}
                    onSelectChange={(newVal) => {
                        tempSelected = newVal;
                        renderContent(newVal);
                    }}
                    columns={columns}
                />
            );
        };
    };
    return (
        <button onClick={showModal} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-xm text-gray-600 font-medium text-left hover:border-blue-400">
            {label} ({selectedItems.filter(id => !items.find(i => i.id === id)?.isRegion).length})
        </button>
    );
};

const ModalBody = ({ items, selectedItems, onSelectChange, columns = 3 }) => {
    const [toast, setToast] = React.useState({ show: false, msg: "", color: "" });
    const toastTimer = React.useRef(null);
    const showToast = (msg, color = "bg-green-500") => {
        if (toastTimer.current) clearTimeout(toastTimer.current);

        setToast({ show: true, msg, color });

        toastTimer.current = setTimeout(() => {
            setToast({ show: false, msg: "", color: "" });
        }, 2000);
    };
    const [search, setSearch] = React.useState("");
    const s = search.toLowerCase();

    const toggleRegion = (regionId) => {
        const subIds = items.filter(i => i.parentId === regionId).map(i => i.id);
        const regionName = items.find(i => i.id === regionId)?.name || "กลุ่มนี้";
        const isAlreadySelected = selectedItems.includes(regionId);

        if (isAlreadySelected) {
            const next = selectedItems.filter(i => i !== regionId && !subIds.includes(i));
            onSelectChange(next);
            showToast(`ล้าง ${regionName} ทั้งหมดแล้ว`, "bg-red-500");
        } else {
            const next = [...new Set([...selectedItems, regionId, ...subIds])];
            onSelectChange(next);
            showToast(`เลือก ${regionName} ทั้งหมดแล้ว`, "bg-green-500");
        }
    };

    const handleToggle = (id, isRegion, parentId = null) => {
        const isSelected = selectedItems.includes(id);
        let next;

        if (isRegion) {
            const subIds = items.filter(i => i.parentId === id).map(i => i.id);
            next = isSelected
                ? selectedItems.filter(i => i !== id && !subIds.includes(i))
                : [...new Set([...selectedItems, id, ...subIds])];
            const regionName = items.find(i => i.id === id)?.name || "กลุ่มนี้";
            const actionText = isSelected ? "ล้าง" : "เลือก";
            showToast(`${actionText} ${regionName} ทั้งหมดแล้ว`, isSelected ? "bg-red-500" : "bg-green-500");
        } else {
            let tempNext = isSelected ? selectedItems.filter(i => i !== id) : [...selectedItems, id];
            if (!isSelected && parentId) {
                const subsInRegion = items.filter(i => i.parentId === parentId).map(i => i.id);
                if (subsInRegion.every(subId => tempNext.includes(subId))) {
                    tempNext.push(parentId);
                    const regionName = items.find(i => i.id === parentId)?.name || "กลุ่มนี้";
                    showToast(`เพิ่ม : ${regionName} (ทั้งหมด) แล้ว`, "bg-green-500");
                } else {
                    showToast(`เพิ่ม : ${items.find(i => i.id === id)?.name || "รายการ"}`, "bg-green-500");
                }
            } else if (isSelected && parentId) {
                const wasRegionSelected = selectedItems.includes(parentId);
                tempNext = tempNext.filter(i => i !== parentId);
                if (wasRegionSelected) {
                    const regionName = items.find(i => i.id === parentId)?.name || "กลุ่มนี้";
                    showToast(`นำออก : ${regionName} ออกแล้ว`, "bg-red-500");
                } else {
                    showToast(`นำออก : ${items.find(i => i.id === id)?.name || "รายการ"}`, "bg-red-500");
                }
            } else {
                showToast(`${isSelected ? "นำออก" : "เพิ่ม"}: ${items.find(i => i.id === id)?.name || "รายการ"}`, isSelected ? "bg-red-500" : "bg-green-500");
            }
            next = tempNext;
        }

        onSelectChange([...new Set(next)]);
    };

    const filteredRegions = items.filter(i => i.isRegion && (
        i.name.toLowerCase().includes(s) ||
        items.some(child => child.parentId === i.id && child.name.toLowerCase().includes(s))
    ));

    return (
        <div className="text-left">

            {selectedItems.length === 0 && (
                <button
                    type="button"
                    onClick={() => {
                        const allIds = items.map(i => i.id);
                        onSelectChange(allIds);
                        showToast("เลือกรายการทั้งหมดแล้ว", "bg-green-600");
                    }}
                    className="absolute px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow hover:bg-blue-700 transition-all cursor-pointer"
                    style={{ right: '2%', top: '5%' }}
                >
                    เลือกทั้งหมด
                </button>
            )}

            {toast.show && (
                <div className={`absolute top-0 right-0 z-[100] ${toast.color} text-white px-4 py-2 rounded-lg shadow-lg animate-bounce`}>
                    {toast.msg}
                </div>
            )}

            <input
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="ค้นหา..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
                {filteredRegions.map(r => {
                    const subIds = items.filter(i => i.parentId === r.id).map(i => i.id);
                    const isAllSelected = subIds.length > 0 && subIds.every(id => selectedItems.includes(id));
                    return (
                        <div key={r.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <label className="font-bold text-slate-800 flex items-center cursor-pointer">
                                    {r.name}
                                    {isAllSelected && (
                                        <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                            (เลือกทั้งหมดแล้ว)
                                        </span>
                                    )}
                                </label>
                                <button
                                    onClick={() => toggleRegion(r.id)}
                                    className={`text-[11px] font-medium px-3 py-1 rounded-full border transition-colors ${selectedItems.includes(r.id)
                                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                        }`}
                                >
                                    {selectedItems.includes(r.id) ? "ล้างกลุ่มนี้" : "เลือกกลุ่มนี้"}
                                </button>
                            </div>
                            <div
                                className="p-4 grid gap-3"
                                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                            >
                                {items
                                    .filter(i => i.parentId === r.id && (i.name.toLowerCase().includes(s) || r.name.toLowerCase().includes(s)))
                                    .map(s => (
                                        <label key={s.id} className="flex items-center text-sm text-slate-600 hover:text-slate-900 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            <input type="checkbox" checked={selectedItems.includes(s.id)} onChange={() => handleToggle(s.id, false, r.id)} className="mr-2 w-4 h-4 shrink-0" />
                                            {s.name}
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};