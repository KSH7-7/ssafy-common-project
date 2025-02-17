import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const requestBody = await request.json();
    console.log("📌 Received Request Body:", requestBody); // 🔍 요청 데이터 확인

    // ✅ 요청이 배열인지 확인
    if (!Array.isArray(requestBody)) {
      return NextResponse.json({ error: "Invalid request format. Expected an array." }, { status: 400 });
    }

    // ✅ 각 항목이 올바른 구조를 갖추었는지 검증
    for (const task of requestBody) {
      if (
        typeof task.taskQueueId !== "number" ||
        typeof task.lockId !== "number" ||
        (task.requestType !== "Store" && task.requestType !== "Retrieve")
      ) {
        return NextResponse.json({ error: "Invalid task format in request body." }, { status: 400 });
      }
    }

    console.log("✅ Request body is valid. Processing tasks...");

    // 🚀 외부 API에 POST 요청 보내기
    const externalUrl = "http://i12a207.p.ssafy.io:8080/api/robot-tasks/process";

    // POST 요청을 보내고, 응답을 기다리지 않고 계속해서 요청을 보낼 수 있도록 처리
    const externalResponsePromise = fetch(externalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // 요청 본문을 그대로 전달
    });

    // 요청을 보내는 동안 즉시 다른 작업을 할 수 있도록
    externalResponsePromise
      .then(async (externalResponse) => {
        if (!externalResponse.ok) {
          const errorText = await externalResponse.text();
          console.error("❌ Error from external API:", errorText);
          return NextResponse.json({ error: "Failed to process tasks externally." }, { status: 500 });
        }

        const externalData = await externalResponse.json();
        console.log("✅ External API response:", externalData);
        // 작업 완료 후 응답 반환
        return NextResponse.json({ message: "Tasks processed successfully", externalData });
      })
      .catch((error) => {
        console.error("❌ Unexpected error in POST handler:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      });

    // 바로 응답을 반환하여 클라이언트가 다른 요청을 할 수 있게 함
    return NextResponse.json({ message: "Task processing initiated." });

  } catch (error) {
    console.error("❌ Unexpected error in POST handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
