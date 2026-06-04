"use client";

import Swal from 'sweetalert2';
import { User } from 'lucide-react';

export default function InfoModal() {
    const showInfo = () => {
        Swal.fire({
            title: 'เกี่ยวกับผู้พัฒนา',
            html: `
                <div class="text-left">
                <p class="mb-2">สถิติข้อมูลการเรียกบรรจุข้าราชการท้องถิ่นปี 2568</p>
                <p><strong>ผู้พัฒนา:</strong> Stang</p>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'ปิด',
            confirmButtonColor: '#059669',
            customClass: {
                confirmButton: 'rounded-lg'
            }
        });
    };

    return (
        <button
            onClick={showInfo}
            className="fixed top-4 right-4 p-4 z-[9999] rounded-full bg-emerald-500 text-white shadow-3xl transition-all duration-500 ease-in-out hover:scale-110 hover:bg-emerald-600 will-change-transform"
        >
            <User size={40} />
        </button>
    );
}