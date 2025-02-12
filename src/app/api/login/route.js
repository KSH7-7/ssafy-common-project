import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // 쿠키를 사용하기 위해 import

// ⚠️⚠️⚠️ 중요: 백엔드 세션 체크 API 엔드포인트 주소를 여기에 입력하세요! ⚠️⚠️⚠️
const BACKEND_SESSION_CHECK_API_URL = "http://i12a207.p.ssafy.io:8080/api/admin/login";

export async function POST(request) {
    try {
        const body = await request.json();

        // 외부 백엔드 로그인 API에 요청 전달 (기존 코드와 동일)
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

        // ✅ 로그인 성공 시, 세션 쿠키 설정 (기존 코드와 동일)
        if (data.success) {
            const sessionCookie = cookies();
            sessionCookie.set({
                name: 'sessionId',
                value: data.sessionId, // ✅ 백엔드에서 발급한 sessionId 문자열 값을 그대로 쿠키에 저장!
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 쿠키 자체는 7일 유지 (의미 없음 - 세션은 서버에서 60초 타임아웃 관리)
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

export async function GET(request) {
    // ✅✅✅ 수정된 세션 체크 API (백엔드 세션 유효성 검증) ✅✅✅
    const sessionCookie = cookies();
    const sessionIdCookie = sessionCookie.get('sessionId'); // 변수명 변경 (sessionIdCookie 로 명확하게)

    if (!sessionIdCookie) {
        // 쿠키가 없는 경우: 명확하게 로그아웃 상태로 판단 (기존 코드와 동일)
        return NextResponse.json({ isLoggedIn: false });
    }

    const sessionId = sessionIdCookie.value; // ✅ sessionIdCookie 에서 value 추출

    try {
        // ⚠️⚠️⚠️ 백엔드 세션 체크 API 호출 (sessionId 쿠키 값을 쿼리 파라미터 또는 헤더로 전달 - 백엔드 방식에 맞춰 선택) ⚠️⚠️⚠️
        const backendResponse = await fetch(`${BACKEND_SESSION_CHECK_API_URL}?sessionId=${sessionId}`, { // ✅ 쿼리 파라미터 방식으로 sessionId 전달 (예시)
        // 또는 headers: { 'Authorization': `Bearer ${sessionId}` } 와 같이 헤더에 전달할 수도 있습니다.
        // 백엔드 API에서 어떤 방식으로 sessionId를 받는지 확인 후 수정하세요!
            method: 'GET',
            // headers: {  // 쿼리 파라미터 방식에서는 headers 불필요
            //     'Cookie': `sessionId=${sessionId}` // 👈 Cookie 헤더 방식은 제거 (쿼리 파라미터 방식으로 변경)
            // },
        });

        if (!backendResponse.ok) {
            // 백엔드 API 호출 실패 (404, 500 에러 또는 401, 403 권한 에러 - 세션 무효로 판단)
            console.error("백엔드 세션 체크 API 호출 실패:", backendResponse.status);
            return NextResponse.json({ isLoggedIn: false }); //API 호출 실패 시 로그아웃 처리 (안전하게)
        }


        // ✅✅✅ 백엔드 API 응답 상태 코드를 기반으로 세션 유효성 판단 ✅✅✅
        if (backendResponse.status === 200) { // 백엔드 API가 200 OK 를 반환하면 세션 유효로 판단
            return NextResponse.json({ isLoggedIn: true }); // ✅ 세션 유효
        } else {
            return NextResponse.json({ isLoggedIn: false }); // ❌ 그 외 모든 경우 (200 OK 가 아니면) 세션 무효로 판단 (예: 401, 403 등)
        }


    } catch (error) {
        console.error("세션 체크 API 오류:", error);
        return NextResponse.json({ isLoggedIn: false }); // 오류 발생 시 로그아웃 처리 (안전하게)
    }
}


export async function DELETE() {
    // ✅ 로그아웃 API (세션 쿠키 삭제) - 기존 코드와 동일
    const sessionCookie = cookies();
    sessionCookie.delete('sessionId');
    return NextResponse.json({ success: true });
}