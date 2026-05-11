import type { Metadata } from "next";
import { Kanit } from "next/font/google"; 
import "./globals.css";

const kanit = Kanit({ 
  weight: ['300', '400', '700'], 
  subsets: ["thai", "latin"],    
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