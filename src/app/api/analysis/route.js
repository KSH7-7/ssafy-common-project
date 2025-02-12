import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Request body 파싱
    const body = await request.json();
    const { startDate, endDate } = body;

    // 날짜 데이터 유효성 검사
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "시작 날짜와 종료 날짜가 필요합니다." },
        { status: 400 }
      );
    }

    // API 요청
    const response = await fetch('http://i12a207.p.ssafy.io:8080/api/admin/usage-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // CORS 관련 헤더 추가
        'Access-Control-Allow-Origin': '*',
        // 인증 토큰이 필요한 경우 추가
        // 'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // 쿠키를 포함시키기 위해
      body: JSON.stringify({
        startDate,
        endDate
      })
    });

    // 상세한 응답 정보 로깅
    console.log('Request URL:', response.url);
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Request body:', { startDate, endDate });

    const responseText = await response.text();
    console.log('Raw response body:', responseText);

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
      return NextResponse.json(data);
    } catch (error) {
      console.error('JSON parsing error:', error);
      console.error('Failed to parse response:', responseText);
      return NextResponse.json(
        { error: '서버 응답을 처리하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
