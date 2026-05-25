export default function LoadingWrapper({ isLoading, children }) {
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#FFFFFF]">
            <div className="w-50 h-50 border-15 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="mt-10 text-3xl text-600 font-kanit text-gray-800 animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
    );
  }
  return children;
};