import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()

    // ✅ 백엔드 로그인 API 호출
    const response = await fetch("http://i12a207.p.ssafy.io:8080/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    // ✅ 서버 응답이 실패한 경우, 프론트에서 바로 에러 처리할 수 있도록 전달
    if (!response.ok || !data.success) {
      return NextResponse.json({ error: data.error || "로그인 실패" }, { status: response.status || 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API 라우트 오류:", error)
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 })
  }
}
