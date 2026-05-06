import type { Metadata } from "next";
import { Kanit } from "next/font/google"; // นำเข้า Kanit
import "./globals.css";

// ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({ 
  weight: ['300', '400', '700'], // เลือกความหนาที่ต้องการ (ปกติ, หนา)
  subsets: ["thai", "latin"],    // ต้องใส่ thai เพื่อให้รองรับภาษาไทย
  display: 'swap',
});

export const metadata: Metadata = {
  title: "สถิติข้อมูลการเรียกบรรจุข้าราชการท้องถิ่นปี 2568",
  description: "Built with Next.js by Stang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={kanit.className}>
        {children}
      </body>
    </html>
  );
}