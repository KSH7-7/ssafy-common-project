// 저장된 데이터를 전역 변수에 보관
let storedTasks = [];
let successfulPostCount = 0; // 성공한 POST 요청 횟수
let isFetching = false; // 현재 GET 요청 실행 여부
let retryDelay = 10000; // POST 요청 실패 시 재시도 대기 시간 (10초)

// 일정 간격으로 데이터를 가져오는 함수
async function fetchData() {
  if (isFetching) return; // 중복 요청 방지
  isFetching = true;

  try {
    console.log("📡 GET 요청 실행: /api/current_store?retrieveTasks");
    const response = await fetch("/api/current_store?retrieveTasks", { method: "GET" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newTasks = await response.json();

    if (JSON.stringify(newTasks) !== JSON.stringify(storedTasks)) {
      // ✅ 데이터가 변경되었을 경우에만 업데이트 및 전송
      storedTasks = newTasks;
      postMessage({ type: "getSuccess", data: newTasks });

      if (newTasks.length > 0) {
        sendProcessRequest(newTasks);
      }
    }
  } catch (error) {
    postMessage({ type: "error", error: error.message });
  } finally {
    isFetching = false;
  }
}

// 일정 간격으로 fetchData 실행
setInterval(fetchData, 1000); // 1초마다 GET 요청 실행

self.onmessage = function (event) {
  if (event.data === "startFetching") {
    console.log("▶️ Worker started fetching data...");
    fetchData(); // 즉시 실행
  }
};

/**
 * ✅ tasks 데이터를 받아서 `/api/TaskRequest`로 POST 요청을 보내는 함수
 * @param {Array} tasks - POST 요청할 task 목록
 */
async function sendProcessRequest(tasks) {
  try {
    console.log(`📡 POST 요청 전송`, tasks);

    const response = await fetch("/api/TaskRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tasks),
    });

    if (!response.ok) {
      throw new Error(`POST HTTP error! status: ${response.status}`);
    }

    const processData = await waitForTaskResponse(response); // ✅ 응답이 올 때까지 기다림

    // ✅ Retrieve 요청만 필터링
    const retrieveTasks = processData.filter((task) => task.requestType === "Retrieve");

    postMessage({
      type: "postSuccess",
      data: processData,
      retrieveTasks: retrieveTasks, // 🔥 추가: 수령 대기열 업데이트용
    });

    // ✅ 성공한 POST 요청 횟수 증가
    successfulPostCount++;

    // ✅ 받은 데이터 개수와 POST 성공 횟수 비교
    checkAndSendAdditionalRequests();
  } catch (error) {
    console.error(`❌ POST 요청 실패:`, error.message);
    setTimeout(() => sendProcessRequest(tasks), retryDelay); // 실패 시 2초 후 재시도
  }
}

/**
 * ✅ /api/TaskRequest에서 응답이 올 때까지 기다리는 함수
 * @param {Response} response - API 응답
 * @returns {Promise<Array>} - 처리된 데이터 반환
 */
async function waitForTaskResponse(response) {
  let result;
  const startTime = Date.now();
  const maxWaitTime = 1000000; // 최대 1000초까지 대기

  while (Date.now() - startTime < maxWaitTime) {
    try {
      result = await response.json();
      if (result.length > 0) return result; // 데이터가 있으면 반환
    } catch (error) {
      console.warn("⏳ 응답 대기 중...");
    }
    await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초마다 재확인
  }

  throw new Error("⏳ 응답 시간 초과: /api/TaskRequest에서 데이터 없음");
}

/**
 * ✅ 받은 데이터 개수와 POST 성공 횟수를 비교하여 추가 요청을 보낼지 결정
 */
function checkAndSendAdditionalRequests() {
  const receivedTaskCount = storedTasks.length;

  if (receivedTaskCount > successfulPostCount) {
    // ✅ 받은 데이터 개수가 더 많다면 추가 요청 수행
    const remainingTasks = storedTasks.slice(successfulPostCount);
    console.log(`📡 Sending additional POST requests for remaining tasks`, remainingTasks);
    sendProcessRequest(remainingTasks);
  } else if (receivedTaskCount < successfulPostCount) {
    // ✅ 받은 데이터 개수가 POST 성공 횟수보다 작다면 성공 횟수를 감소시켜 동기화
    successfulPostCount = receivedTaskCount;
    console.log(`🔄 Synchronizing successful post count, new value: ${successfulPostCount}`);
  }
}
