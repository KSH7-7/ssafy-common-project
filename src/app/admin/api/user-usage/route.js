import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://i12a207.p.ssafy.io:8080/api/admin/user-usage");
    if (!res.ok) {
      return NextResponse.json(
        { error: "백엔드 API로부터 데이터를 가져오지 못했습니다." },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API 라우트 오류:", error);
    return NextResponse.json(
      { error: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
