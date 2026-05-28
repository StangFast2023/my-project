export const EmptyData = () => (
    <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="text-gray-400 text-6xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-alert-icon lucide-badge-alert"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <h3 className="text-3xl font-bold text-gray-500">ไม่พบข้อมูลที่ค้นหา</h3>
        <p className="text-gray-400 text-xl mt-2">ลองเปลี่ยนเงื่อนไขการกรอง หรือกด <span className="font-bold">คืนค่าเริ่มต้น</span> </p>
    </div>
);