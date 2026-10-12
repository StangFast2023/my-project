
import { Clock } from "lucide-react";

export default function LastUpdated() {
    const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;

    if (!buildTime) return null;

    const formattedDate = new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Bangkok",
    }).format(new Date(buildTime));

    return (
        <div className="flex items-center justify-center gap-2 text-base text-gray-600">
            <Clock size={14} />
            <span>
                เว็บไซต์ปรับปรุงล่าสุด: {formattedDate} น.
            </span>
        </div>
    );
}
