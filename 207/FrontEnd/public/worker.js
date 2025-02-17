
// 전역 변수 선언
let isFetching = false;
let retryDelay = 5000; // 재시도 대기 시간 (10초)

// Web Worker 메시지 핸들러
self.onmessage = function(event) {
  if (event.data === "startFetching") {
    console.log("▶️ Worker 시작: 데이터 페칭 시작...");
    fetchData(); // 즉시 시작
    setInterval(fetchData, 1000); // 1초마다 반복
  }
};  

// 데이터를 가져오는 함수
async function fetchData() {
  if (isFetching) return; // 중복 요청 방지
  isFetching = true;

  try {
    console.log("📡 GET 요청 실행: /api/current_store?retrieveTasks");
    const response = await fetch("/api/current_store?retrieveTasks", { method: "GET" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasks = await response.json();
    console.log("Retrieve tasks data:", tasks);

    // 메인 스레드에 데이터 전송
    postMessage({ type: "getSuccess", data: tasks });

    // 빈 배열 체크 - 데이터가 있을 때만 POST 요청 수행
    if (tasks.length > 0) {
      sendProcessRequest(tasks);
    } else {
      console.log("🚫 빈 배열을 받았습니다. POST 요청을 실행하지 않습니다.");
    }
  } catch (error) {
    console.error("❌ GET 요청 실패:", error.message);
    postMessage({ type: "error", error: error.message });
  } finally {
    isFetching = false;
  }
}

// POST 요청 함수
async function sendProcessRequest(tasks) {
  const requestId = Date.now().toString();
  console.log(`📡 POST 요청 시작 (ID: ${requestId}):`, tasks);

  try {
    const response = await fetch("/api/TaskRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Request-ID": requestId
      },
      body: JSON.stringify(tasks),
    });

    if (response.ok) {
      // 응답 처리
      handleResponse(response, requestId);
    } else {
      throw new Error(`POST HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ POST 요청 실패 (ID: ${requestId}):`, error.message);
    // 실패 시 재시도
    setTimeout(() => sendProcessRequest(tasks), retryDelay);
  }
}

// 응답 처리 함수 (비동기적으로 실행)
async function handleResponse(response, requestId) {
  try {
    const result = await response.json();
    console.log(`📦 응답 데이터 (ID: ${requestId}):`, result);
    
    // Retrieve 타입만 필터링
    const retrieveTasks = result.filter(task => task.requestType === 'Retrieve');
    
    // 메인 스레드에 결과 전송
    postMessage({
      type: "postSuccess",
      requestId: requestId,
      data: result,
      retrieveTasks: retrieveTasks
    });
  } catch (error) {
    console.error(`❌ 응답 처리 실패 (ID: ${requestId}):`, error.message);
  }
}