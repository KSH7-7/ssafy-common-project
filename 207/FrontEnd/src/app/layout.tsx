'use client';

import './globals.css';
import Link from 'next/link';
import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded';

// Emotion 캐시 생성
const cache = createCache({ key: 'css', prepend: true });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 서버에서 스타일 추가가 필요하다면 여기 처리 */}
      </head>
      <body>
        <CacheProvider value={cache}>
          {/* 헤더 */}
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <RoomPreferencesRoundedIcon fontSize="large" />
              <span className="text-xl font-semibold">스마트 사물함</span>
            </Link>
            <nav className="flex-1 flex justify-center items-center space-x-6">
              <Link href="/robot" className="text-gray-600 hover:text-gray-900">
                로봇제어
              </Link>
              <Link href="/stats" className="text-gray-600 hover:text-gray-900">
                창고관리
              </Link>
              <Link href="/customer" className="text-gray-600 hover:text-gray-900">
                고객관리
              </Link>
            </nav>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/mypage" className="text-gray-600 hover:text-gray-900">
                마이페이지
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                로그아웃
              </Link>
            </div>
          </header>
          <main>{children}</main> {/* 메인 컨텐츠 */}
          <footer className="border-t px-4 py-4 text-center"> {/* 푸터 */}
            <h3>© 2025 스마트 사물함. All rights reserved.</h3>
          </footer>
        </CacheProvider>
      </body>
    </html>
  );
}
