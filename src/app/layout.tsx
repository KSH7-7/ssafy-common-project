import "./globals.css";
import type { Metadata } from "next";
import PathCheck from "./PathCheck";
import { LanguageProvider } from "./contexts/LanguageContext"
// use client를 사용한다면 서버 컴포넌트 관련된 에러가 뜸 -> PathCheck를 임포트하여 use client 관련 기능은 분리
export const metadata: Metadata = {
  title: "SMART LockeR",
  description: "Smart locker management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider><PathCheck>{children}</PathCheck></LanguageProvider>
        
      </body>
    </html>
  );
}
