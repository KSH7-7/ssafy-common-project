"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import RoomPreferencesRoundedIcon from "@mui/icons-material/RoomPreferencesRounded"
import MenuIcon from "@mui/icons-material/Menu"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <LayoutContent>{children}</LayoutContent>
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")

    // ✅ 로그인 정보 없으면 로그인 페이지로 강제 이동
    if (!authToken && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  // 404 페이지 또는 로그인 페이지라면 레이아웃 없이 children만 반환
  const is404Page = pathname === "/404"
  const isLoginPage = pathname === "/admin/login"

  if (is404Page || isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-[#F5F5F5] z-40 flex items-center justify-between px-4 py-2 border-b border-[#222222]">
        <Link href="/admin" className="flex items-center space-x-2">
          <RoomPreferencesRoundedIcon sx={{ fontSize: 28 }} />
          <span className="text-lg font-semibold">KEEPRO</span>
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
            <Link href="/admin/queue" className="text-gray-600 hover:text-gray-900">
              대기열관리
            </Link>
          </div>
        </nav>

        {/* 로그아웃웃 버튼 */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => {
              localStorage.removeItem("authToken") // ✅ 로그아웃 시 로그인 정보 삭제
              router.push("/admin/login") // 로그인 페이지로 이동
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            로그아웃
          </button>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon />
        </button>

        {/* 모바일 네비게이션 메뉴 */}
        {isMenuOpen && (
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
              <Link href="/admin/queue" className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                대기열관리
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("authToken")
                  router.push("/admin/login")
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-left"
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
        <h3>© 2025 KEEPRO. All rights reserved.</h3>
      </footer>
    </div>
  )
}
