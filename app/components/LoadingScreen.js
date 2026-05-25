export const LoadingScreen = () => (
    <div className="relative flex flex-col items-center justify-center h-full w-full bg-white/50 py-20">
        <div className="w-50 h-50 border-[30px] border-gray-400 border-t-green-600 rounded-full animate-spin"></div>
        <p className="mt-10 text-3xl font-kanit text-gray-800 animate-pulse">กำลังโหลดข้อมูล...</p>
    </div>
);