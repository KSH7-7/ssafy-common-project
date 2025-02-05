import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sectors = ['A', 'B', 'C'];
    const data = {};

    for (const sector of sectors) {
      console.log(`Fetching data for sector ${sector}...`); // ✅ 디버깅 로그 추가
      // const response = await fetch(`http://70.12.246.128:8080/api/locker/${sector}/status`); // ❌ 기존 로컬 URL
      const response = await fetch(`http://i12a207.p.ssafy.io:8080/api/locker/${sector}/status`); // ✅ 수정된 배포 URL

      const sectorData = await response.json();
      console.log(`Sector ${sector} data:`, sectorData); // ✅ JSON 응답 확인용 로그 추가

      // 데이터가 정상적으로 들어왔는지 확인
      data[sector] = {
        totalVolume: sectorData.length || 0, // 전체 락커 개수
        currentVolume: sectorData.filter((locker) => locker.lockerStatus.lockerStatus === '사용중').length,
        lockers: sectorData.map((locker) => ({
          lockerId: locker.lockerId,
          lockerStatus: locker.lockerStatus.lockerStatus, // "사용중" 또는 "사용가능"
        })),
      };
    }

    console.log('Final Data:', data); // ✅ 최종 JSON 데이터 확인
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
