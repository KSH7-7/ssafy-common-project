import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}

// 로그인 필요 페이지 목록 (여기서 설정한 페이지에만 적용됨)
export const config = {
  matcher: ['/admin/:path*'],
}
