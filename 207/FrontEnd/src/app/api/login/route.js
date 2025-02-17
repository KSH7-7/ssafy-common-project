import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // 외부 백엔드 로그인 API에 요청 전달
    const response = await fetch("http://i12a207.p.ssafy.io:8080/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "로그인 실패" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API 라우트 오류:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}