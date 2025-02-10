"use client";

import { useSession, signOut, SessionProvider } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import RoomPreferencesRoundedIcon from "@mui/icons-material/RoomPreferencesRounded";
import MenuIcon from "@mui/icons-material/Menu";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 404 페이지와 로그인 페이지 여부를 변수로 미리 설정
  const is404Page = pathname === "/404";
  const isLoginPage = pathname === "/admin/login";

  // 모든 훅은 조건과 상관없이 항상 호출되어야 합니다.
  useEffect(() => {
    if (!isLoginPage && status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [isLoginPage, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // 404 페이지 또는 로그인 페이지라면 레이아웃 래핑 없이 children만 반환
  if (is404Page || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-[#F5F5F5] z-50 flex items-center justify-between px-4 py-2 border-b border-[#222222]">
        <Link href="/" className="flex items-center space-x-2">
          <RoomPreferencesRoundedIcon sx={{ fontSize: 28 }} />
          <span className="text-lg font-semibold">스마트 사물함</span>
        </Link>
        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex flex-1 justify-center items-center">
          <div className="space-x-8 md:space-x-16 lg:space-x-24">
            <Link href="/admin/robot" className="text-gray-600 hover:text-gray-900">
              로봇관리
            </Link>
            <Link href="/admin/storage" className="text-gray-600 hover:text-gray-900">
              창고관리
            </Link>
            <Link href="/admin/customer" className="text-gray-600 hover:text-gray-900">
              고객관리
            </Link>
          </div>
        </nav>
        {/* 로그인 여부에 따른 UI */}
        <div className="hidden md:flex items-center space-x-6">
          {session ? (
            <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-900">
              로그아웃
            </button>
          ) : (
            <Link href="/admin/login" className="text-gray-600 hover:text-gray-900">
              로그인
            </Link>
          )}
        </div>
        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon />
        </button>
        {/* 모바일 네비게이션 메뉴 */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#F2F2F2] border-b md:hidden">
            <div className="flex flex-col py-2">
              <Link
                href="/admin/robot"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                로봇관리
              </Link>
              <Link
                href="/admin/storage"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                창고관리
              </Link>
              <Link
                href="/admin/customer"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                고객관리
              </Link>
              {session ? (
                <button onClick={() => signOut()} className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                  로그아웃
                </button>
              ) : (
                <Link href="/admin/login" className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      {/* 본문 */}
      <div className="pt-12">
        <main>{children}</main>
      </div>
      {/* 푸터 */}
      <footer className="border-t px-4 py-4 text-center">
        <h3>© 2025 스마트 사물함. All rights reserved.</h3>
      </footer>
    </div>
  );
}
