"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RoomPreferencesRoundedIcon from "@mui/icons-material/RoomPreferencesRounded";
import MenuIcon from "@mui/icons-material/Menu";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <LayoutContent>{children}</LayoutContent>;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const router = useRouter();

    // 404 페이지와 로그인 페이지 여부를 변수로 미리 설정
    const is404Page = pathname === "/404";
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/login', { // route.js의 GET 요청
                    method: 'GET',
                });
                const data = await response.json();
                setIsLoggedIn(data.isLoggedIn);
                if (!data.isLoggedIn && !isLoginPage && !is404Page && pathname.startsWith('/admin')) {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error("세션 확인 오류:", error);
                setIsLoggedIn(false);
            }
        };

        checkSession(); // 컴포넌트 마운트 시 즉시 세션 체크

        const intervalId = setInterval(checkSession, 60 * 1000); //  ✅ 1분마다 세션 체크 (60초 * 1000ms)

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 clearInterval 호출 (메모리 누수 방지)

    }, [pathname, router, isLoginPage, is404Page]);


    // 404 페이지 또는 로그인 페이지라면 레이아웃 없이 children만 반환
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
                {isLoggedIn && ( // ✅ 로그인 상태에 따라 네비게이션 렌더링
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
                )}


                {/* 로그인/로그아웃 버튼 (세션 상태에 따라 변경) */}
                <div className="hidden md:flex items-center space-x-6">
                    {isLoggedIn ? ( // ✅ 로그인 상태에 따라 로그아웃 버튼 렌더링
                        <button
                            onClick={async () => {
                                await fetch('/api/login', { method: 'DELETE' }); // route.js의 DELETE 요청 (로그아웃)
                                setIsLoggedIn(false); // 로그아웃 후 상태 업데이트
                                router.push('/admin/login'); // 로그아웃 후 로그인 페이지로 이동
                            }}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            로그아웃
                        </button>
                    ) : ( // 비로그인 상태일 때 로그인 링크 렌더링 (현재는 로그인 링크는 layout에 불필요하므로 제거하거나 주석처리)
                        null
                        // <Link href="/admin/login" className="text-gray-600 hover:text-gray-900">
                        //     로그인
                        // </Link>
                    )}
                </div>

                {/* 모바일 메뉴 버튼 */}
                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <MenuIcon />
                </button>

                {/* 모바일 네비게이션 메뉴 */}
                {isMenuOpen && isLoggedIn && ( // ✅ 로그인 상태 및 메뉴 오픈 시 모바일 네비게이션 렌더링
                    <div className="absolute top-full left-0 right-0 bg-[#F2F2F2] border-b md:hidden">
                        <div className="flex flex-col py-2">
                            <Link href="/admin/robot" className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                                로봇관리
                            </Link>
                            <Link href="/admin/storage" className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                                창고관리
                            </Link>
                            <Link href="/admin/customer" className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                                고객관리
                            </Link>
                            <button // 모바일 로그아웃 버튼
                                onClick={async () => {
                                    await fetch('/api/login', { method: 'DELETE' }); // route.js의 DELETE 요청 (로그아웃)
                                    setIsLoggedIn(false); // 로그아웃 후 상태 업데이트
                                    setIsMenuOpen(false); // 메뉴 닫기
                                    router.push('/admin/login'); // 로그아웃 후 로그인 페이지로 이동
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-left w-full" // text-left, w-full 추가하여 링크와 동일하게 스타일 조정
                            >
                                로그아웃
                            </button>
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