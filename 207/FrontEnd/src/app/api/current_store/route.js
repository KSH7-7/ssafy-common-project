// app/api/current_store/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    
    // Check for the 'sector' query parameter.
    const sector = url.searchParams.get("sector");
    // Check for the 'retrieveTasks' query parameter.
    const retrieveTasksParam = url.searchParams.get("retrieveTasks");

    if (sector) {
      // 기존 섹터 관련 로직 처리
      const sectors = ['A', 'B', 'C'];  // 허용된 섹터 목록
      if (!sectors.includes(sector)) {
        return NextResponse.json({ error: "Invalid sector" }, { status: 400 });
      }

      console.log(`Fetching data for sector ${sector}...`);
      const response = await fetch(`http://i12a207.p.ssafy.io:8080/api/locker/${sector}/status`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sector data with status ${response.status}`);
      }
      const sectorData = await response.json();
      console.log(`Sector ${sector} data:`, sectorData);

      const data = {
        totalVolume: sectorData.length || 0,
        currentVolume: sectorData.filter(
          (locker) => locker.lockerStatus.lockerStatus === '사용중'
        ).length,
        lockers: sectorData.map((locker) => ({
          lockerId: locker.lockerId,
          lockerStatus: locker.lockerStatus.lockerStatus, // "사용중" 또는 "사용가능" 또는 "수리중"
          lockerStatusId: locker.lockerStatus.lockerStatusId, // 1 또는 2 또는 3
        })),
      };

      console.log('Final Data:', data);
      return NextResponse.json(data);
    } else if (retrieveTasksParam !== null) {
      // 새로 추가된 로직: getRetrieveTasks 엔드포인트 호출
      console.log("Fetching retrieve tasks...");
      const response = await fetch("http://i12a207.p.ssafy.io:8080/api/locker/getRetrieveTasks");
      if (!response.ok) {
        throw new Error(`Failed to fetch retrieve tasks with status ${response.status}`);
      }
      const tasksData = await response.json();
      console.log("Retrieve tasks data:", tasksData);
      return NextResponse.json(tasksData);
    } else {
      // 두 가지 파라미터 모두 제공되지 않은 경우
      return NextResponse.json(
        { error: "Invalid query parameter. Must include either 'sector' or 'retrieveTasks'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const requestBody = await request.json();

    // phoneNumber가 있으면 store 처리, tokenValue가 있으면 retrieve 처리
    if ('phoneNumber' in requestBody) {
      // store endpoint 처리
      const { lockerId, phoneNumber } = requestBody;

      if (lockerId === undefined || typeof lockerId !== 'number') {
        return NextResponse.json({ error: "Invalid or missing lockerId" }, { status: 400 });
      }
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        return NextResponse.json({ error: "Invalid or missing phoneNumber" }, { status: 400 });
      }

      console.log("POST Request for store endpoint received. Data:", { lockerId, phoneNumber });

      // POST 요청을 backend의 store 엔드포인트로 전달
      const response = await fetch("http://i12a207.p.ssafy.io:8080/api/locker/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lockerId, phoneNumber }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Error response from store endpoint:", errorBody);
        throw new Error(`Store request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Received response from store endpoint:", responseData);

      // 제거된 로봇 태스크 관련 POST 요청 코드

      return NextResponse.json(responseData);
    } else if ('tokenValue' in requestBody) {
      // retrieve endpoint 처리
      const { lockerId, tokenValue } = requestBody;

      if (lockerId === undefined || typeof lockerId !== 'number') {
        return NextResponse.json({ error: "Invalid or missing lockerId" }, { status: 400 });
      }
      if (tokenValue === undefined || typeof tokenValue !== 'number') {
        return NextResponse.json({ error: "Invalid or missing tokenValue" }, { status: 400 });
      }

      console.log("POST Request for retrieve endpoint received. Data:", { lockerId, tokenValue });

      // POST 요청을 backend의 retrieve 엔드포인트로 전달
      const response = await fetch("http://i12a207.p.ssafy.io:8080/api/locker/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lockerId, tokenValue }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Error response from retrieve endpoint:", errorBody);
        return NextResponse.json(errorBody, { status: response.status });
      }

      const responseData = await response.json();
      console.log("Received response from retrieve endpoint:", responseData);

      // 제거된 로봇 태스크 관련 POST 요청 코드

      return NextResponse.json(responseData);
    } else {
      return NextResponse.json(
        { error: "Invalid request body. Must include either phoneNumber or tokenValue." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("POST API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}