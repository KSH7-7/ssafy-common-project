'use client';

import './globals.css';
import Link from 'next/link';
import React, { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded';
import MenuIcon from '@mui/icons-material/Menu';

// Emotion 캐시 생성
const cache = createCache({ key: 'css', prepend: true });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 서버에서 스타일 추가가 필요하다면 여기 처리 */}
      </head>
      <body>
        <CacheProvider value={cache}>
          <div className="min-h-screen">
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
              
              {/* 데스크탑 우측 메뉴 */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/admin/mypage" className="text-gray-600 hover:text-gray-900">
                  마이페이지
                </Link>
                <Link href="/admin/login" className="text-gray-600 hover:text-gray-900">
                  로그아웃
                </Link>
              </div>

              {/* 모바일 메뉴 버튼 */}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MenuIcon />
              </button>

              {/* 모바일 드롭다운 메뉴 */}
              {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-[#F2F2F2] border-b md:hidden">
                  <div className="flex flex-col py-2">
                    <Link 
                      href="/admin/robot" 
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      로봇제어
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
                    <Link 
                      href="/admin/mypage" 
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <Link 
                      href="/admin/login" 
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      로그아웃
                    </Link>
                  </div>
                </div>
              )}
            </header>
            <div className="pt-12">
              <main>{children}</main>
            </div>
            <footer className="border-t px-4 py-4 text-center"> {/* 푸터 */}
              <h3>© 2025 스마트 사물함. All rights reserved.</h3>
            </footer>
          </div>
        </CacheProvider>
      </body>
    </html>
  );
}