"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import styled from "styled-components";

interface Task {
  taskQueueId: number;
  lockId: number;
  requestType: string;
}

interface TaskResponse {
  success: boolean;
  message: string;
  lockerId: number;
  requestType: string;
}

export default function QueuePage() {
  const router = useRouter();
  const [taskQueue, setTaskQueue] = useState<Task[]>([]);
  const [receiptQueue, setReceiptQueue] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const prevTasksRef = useRef<Task[]>([]);
  const [dotIndex, setDotIndex] = useState(0);
  const dotSequence = [".", "..", "..."];
  const animatedDots = dotSequence[dotIndex];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const worker = new Worker(/* turbopackIgnore: true */ "/worker.js");

    worker.onmessage = (event) => {
      if (event.data.type === "getSuccess") {
        const newTasks: Task[] = event.data.data;
        setTaskQueue(newTasks);
        prevTasksRef.current = newTasks;
        setError(null);
      } else if (event.data.type === "postSuccess") {
        const responseData = event.data.data;

        let newRetrieveLockIds: number[] = [];

        if (Array.isArray(responseData)) {
          // 응답이 배열인 경우
          newRetrieveLockIds = responseData
            .filter((task: TaskResponse) => task.success && task.requestType === "Retrieve")
            .map((task: TaskResponse) => task.lockerId);
        } else if (responseData.success && responseData.requestType === "Retrieve") {
          // 응답이 단일 객체인 경우
          newRetrieveLockIds = [responseData.lockerId];
        }

        if (newRetrieveLockIds.length > 0) {
          setReceiptQueue((prevQueue) => {
            let updatedQueue = [...prevQueue];
            newRetrieveLockIds.forEach((lockId) => {
              if (updatedQueue.length < 5) {
                updatedQueue.push(lockId);
              } else {
                updatedQueue.shift();
                updatedQueue.push(lockId);
              }
            });
            return updatedQueue;
          });
        }
      } else if (event.data.type === "error") {
        console.error("Worker Error:", event.data.error);
        setError(event.data.error);
      }
    };

    worker.postMessage("fetchData");

    return () => {
      worker.terminate();
    };
  }, []);

  const retrieveTaskQueue = taskQueue.filter(
    (task) => task.requestType === "Retrieve"
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ✅ 수령 대기열 */}
        <div className="flex flex-col h-[35vh] md:h-[65vh]">
          <h2 className="text-2xl font-bold">수령 대기열</h2>
          <hr className="my-2" />
          <div className="flex-1 border border-gray-300 p-4 bg-white shadow-lg rounded overflow-y-auto scroll2">
            {receiptQueue.length > 0 ? (
              <ul>
                {receiptQueue.map((lockId, index) => (
                  <li key={index} className="p-2 border-b last:border-none">
                    <span className="font-semibold text-green-600">
                      사물함 번호: {lockId}
                    </span>{" "}
                    가 수령 가능합니다 ✅
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">수령 가능한 사물함이 없습니다.</p>
            )}
          </div>
        </div>

        {/* ✅ 작업 대기열 */}
        <div className="flex flex-col h-[35vh] md:h-[65vh]">
          <h2 className="text-2xl font-bold">작업 대기열</h2>
          <hr className="my-2" />
          <div className="flex-1 border border-gray-300 p-4 bg-white shadow-lg rounded overflow-y-auto scroll2">
            {error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : retrieveTaskQueue.length > 0 ? (
              <ul>
                {retrieveTaskQueue.map((task) => (
                  <li key={task.taskQueueId}>
                    <span className="font-bold text-blue-500 inline-block w-32 sm:w-33 md:w-34 lg:w-35">
                      사물함 번호: {task.lockId}
                    </span>{" "}
                    을 작업 중입니다 {animatedDots}
                  </li>
                ))}
              </ul>
            ) : (
              <p>작업 대기열이 비어있습니다</p>
            )}
          </div>
        </div>
      </div>

      <HomeLinkWrapper onClick={() => router.push("/")}>
        <FaHome size={32} color="#969A9D" />
        <HomeText>홈으로</HomeText>
      </HomeLinkWrapper>

      <style jsx global>{`
        .scroll2::-webkit-scrollbar {
          width: 5px;
        }
        .scroll2::-webkit-scrollbar-thumb {
          background: #666;
        }
        .scroll2::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
      `}</style>
    </div>
  );
}

const HomeLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.2s;
  width: 60px;
`;

const HomeText = styled.span`
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #969A9D;
`;
