"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function PathCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // /admin 경로인 경우 기본 스타일 적용
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // /admin 경로가 아닌 경우 GmarketSansMedium 폰트 적용
  return (
    <div className="min-h-screen w-full flex flex-col px-4 sm:px-6 md:px-8 font-gmarket">
      {/* Header */}
      <header className="p-4 sm:p-6 md:p-8">
        <Link href="/">
          <div className="cursor-pointer relative w-36 sm:w-42 md:w-40 lg:w-50 xl:w-60 aspect-[4/1]">
            <Image
              src="/keepro.png"
              alt="Keepro Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
        <div className="h-0.5 md:h-1 lg:h-1.5 bg-gradient-to-r from-[#3E3EE2] via-blue-500 to-cyan-400 mt-1 sm:mt-2 md:mt-3" />
      </header>

      <main className="w-full rounded-lg p-4 sm:p-6 md:p-8 flex-1">
        {children}
      </main>
    </div>
  );
}