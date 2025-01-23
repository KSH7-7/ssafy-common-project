"use client"

// 관리자 페이지와 일반 페이지를 구분하기 위한 컴포넌트로 사용됨

import { usePathname } from "next/navigation"

export default function PathCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>
  }

  return (
    <div
      className="min-h-screen max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto"
    >
      {/* Header */}
      <header className="p-4 sm:p-6 md:p-8">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
          <span className="text-blue-500">SMART</span>
          <span className="text-blue-400">LockeR</span>
        </div>
        <div className="h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-blue-600 to-cyan-400 mt-1 sm:mt-2 md:mt-3" />
      </header>
      <main>{children}</main>
    </div>
  )
}


