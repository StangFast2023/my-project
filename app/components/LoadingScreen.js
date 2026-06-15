export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-[#FFFFFF]">
            <div className="w-25 h-25 border-15 border-gray-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p className="mt-10 text-3xl text-600 font-kanit text-gray-800 animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
    );
}