export default function MaintenancePage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6">

            <div className="text-center">

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lucide lucide-wrench-icon lucide-wrench w-25 h-25 mx-auto my-2 text-gray-600">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
                </svg>

                <h1 className="text-3xl font-bold mb-4 text-gray-600">
                    เว็บไซต์กำลังปรับปรุง
                </h1>

                <p className="text-xl text-gray-600">
                    ขณะนี้เรากำลังปรับปรุงเว็บไซต์ด้วยข้อมูลใหม่
                </p>

                <p className="text-xl text-gray-600">
                    ขออภัยในความไม่สะดวก และขอบคุณที่รอครับ
                </p>
            </div>
        </main>
    );
}