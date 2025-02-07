// app/api/current_store/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const sector = url.searchParams.get("sector");  // URL에서 sector 파라미터 값 받기
    if (!sector) {
      return NextResponse.json({ error: "Sector is required" }, { status: 400 });
    }

    const sectors = ['A', 'B', 'C'];  // 허용된 섹터 목록
    if (!sectors.includes(sector)) {
      return NextResponse.json({ error: "Invalid sector" }, { status: 400 });
    }

    console.log(`Fetching data for sector ${sector}...`); // 디버깅 로그 추가
    const response = await fetch(`http://i12a207.p.ssafy.io:8080/api/locker/${sector}/status`); // 배포된 URL 사용

    const sectorData = await response.json();
    console.log(`Sector ${sector} data:`, sectorData); // JSON 응답 확인용 로그 추가

    const data = {
      totalVolume: sectorData.length || 0,
      currentVolume: sectorData.filter((locker) => locker.lockerStatus.lockerStatus === '사용중').length,
      lockers: sectorData.map((locker) => ({
        lockerId: locker.lockerId,
        lockerStatus: locker.lockerStatus.lockerStatus,// "사용중" 또는 "사용가능" 또는 "수리중"
        lockerStatusId: locker.lockerStatus.lockerStatusId, // 1 또는 2 또는 3
      })),
    };

    console.log('Final Data:', data); // 최종 JSON 데이터 확인
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Request body parsing
    const requestBody = await request.json();
    const { lockerId, phoneNumber } = requestBody;

    // Validate the request data
    if (lockerId === undefined || typeof lockerId !== 'number') {
      return NextResponse.json({ error: "Invalid or missing lockerId" }, { status: 400 });
    }
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json({ error: "Invalid or missing phoneNumber" }, { status: 400 });
    }

    console.log("POST Request received. Data:", { lockerId, phoneNumber });

    // Forward the POST request to the backend endpoint
    const response = await fetch("http://i12a207.p.ssafy.io:8080/api/locker/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lockerId, phoneNumber })
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Received response from store endpoint:", responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("POST API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
