import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // 쿠키를 사용하기 위해 import

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

        // ✅ 서버로부터 받은 sessionId 출력
        console.log("서버 응답 sessionId:", data.sessionId);

        // ✅ 로그인 성공 시, 세션 쿠키 설정
        if (data.success) {
            const sessionCookie = cookies();
            sessionCookie.set({
                name: 'sessionId',
                value: data.sessionId, // ✅ 백엔드에서 발급한 sessionId
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 쿠키 유지 기간 7일
            });
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

export async function GET() {
    const sessionCookie = await cookies();
    const sessionIdCookie = sessionCookie.get('sessionId');

    if (!sessionIdCookie) {
        console.log("쿠키에서 sessionId 없음");
        return NextResponse.json({ isLoggedIn: false });
    }

    const sessionId = sessionIdCookie.value;

    // ✅ 쿠키에 저장된 sessionId 출력
    console.log("쿠키에서 가져온 sessionId:", sessionId);

    try {
        const backendResponse = await fetch(`http://i12a207.p.ssafy.io:8080/api/admin/getSession`, {
            method: 'GET',
        });

        if (!backendResponse.ok) {
            console.error("백엔드 세션 체크 API 호출 실패:", backendResponse.status);
            return NextResponse.json({ isLoggedIn: false });
        }

        if (backendResponse.status === 200) {
            return NextResponse.json({ isLoggedIn: true });
        } else {
            return NextResponse.json({ isLoggedIn: false });
        }

    } catch (error) {
        console.error("세션 체크 API 오류:", error);
        return NextResponse.json({ isLoggedIn: false });
    }
}

export async function DELETE() {
    const sessionCookie = cookies();
    sessionCookie.delete('sessionId');
    console.log("세션 쿠키 삭제 완료");
    return NextResponse.json({ success: true });
}
