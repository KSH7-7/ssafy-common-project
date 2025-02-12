"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import styled from 'styled-components';

// Define the type for each task from the API
interface Task {
  taskQueueId: number;
  lockId: number;
  requestType: string;
}

export default function QueuePage() {
  const router = useRouter();

  // State to hold tasks currently in 작업 대기열
  const [taskQueue, setTaskQueue] = useState<Task[]>([]);
  // State to hold disappeared lockIds in 수령 대기열 (latest first, up to 5)
  const [receiptQueue, setReceiptQueue] = useState<number[]>([]);
  // State for storing potential fetch errors
  const [error, setError] = useState<string | null>(null);

  // useRef to store the previous fetched tasks so we can compare on each update
  const prevTasksRef = useRef<Task[]>([]);

  // Animated dots state for the label in 작업 대기열
  // The dotSequence creates an animation effect: 
  // first a single dot, then three dots (with an extra step to hold that state), then back to a single dot.
  const dotSequence = [".", "..", "..."]; // . -> .. -> ... -> .
  const [dotIndex, setDotIndex] = useState(0);
  const animatedDots = dotSequence[dotIndex];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotIndex((prevIndex) => (prevIndex + 1) % dotSequence.length);
    }, 500); // update every 500ms
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data via our local Next.js API route rather than fetching directly from the backend.
        const response = await fetch("/api/current_store?retrieveTasks");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTasks: Task[] = await response.json();
        // Get the lockIds from the current fetch result
        const newLockIds = newTasks.map((task) => task.lockId);

        // Retrieve the previous tasks and extract their lockIds
        const prevTasks = prevTasksRef.current;
        const prevLockIds = prevTasks.map((task) => task.lockId);

        // Determine which lockIds have disappeared from the 작업 대기열
        const disappeared = prevLockIds.filter(
          (lockId) => !newLockIds.includes(lockId)
        );

        // If any tasks disappeared, update the 수령 대기열 state.
        // We remove any lockId that might have reappeared (if any) from the previous receipt list,
        // then prepend the new ones. Finally, we slice the array to show at most 5 items.
        if (disappeared.length > 0) {
          setReceiptQueue((current) => {
            const filteredCurrent = current.filter(
              (lockId) => !newLockIds.includes(lockId)
            );
            // Only add new disappeared items if they're not already in the receipt list
            const newDisappeared = disappeared.filter(
              (lockId) => !filteredCurrent.includes(lockId)
            );
            const updated = [...newDisappeared, ...filteredCurrent];
            return updated.slice(0, 5);
          });
        }

        // Update the 작업 대기열 state and store the current tasks in our ref for the next comparison.
        setTaskQueue(newTasks);
        prevTasksRef.current = newTasks;
        // Clear any previous error if fetch is successful.
        setError(null);
      } catch (err: unknown) {
        let errorMsg = "Unknown error";
        if (err instanceof Error) {
          errorMsg = err.message;
        }
        console.error("Error fetching data:", err);
        setError(errorMsg);
      }
    }

    // Perform the initial fetch immediately…
    fetchData();
    // …and then set up an interval to refresh every 5 seconds.
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Cleanup the interval on component unmount.
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Responsive grid for the two sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 수령 대기열 Section */}
        <div className="flex flex-col h-[35vh] md:h-[65vh]">
          <h2 className="text-2xl font-bold">수령 대기열</h2>
          <hr className="my-2" />
          <div className="flex-1 border border-gray-300 p-4 bg-white shadow-lg rounded overflow-y-auto scroll2">
            {receiptQueue.length > 0 ? (
              <ul>
                {receiptQueue.map((lockId) => (
                  <li key={lockId}>Lock ID: {lockId}</li>
                ))}
              </ul>
            ) : (
              <p>작업 완료된 사물함이 없습니다</p>
            )}
          </div>
        </div>

        {/* 작업 대기열 Section */}
        <div className="flex flex-col h-[35vh] md:h-[65vh]">
          <h2 className="text-2xl font-bold">작업 대기열</h2>
          <hr className="my-2" />
          <div className="flex-1 border border-gray-300 p-4 bg-white shadow-lg rounded overflow-y-auto scroll2">
            {error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : taskQueue.length > 0 ? (
              <ul>
                {taskQueue.map((task) => (
                  <li key={task.taskQueueId}>
                    <span className="font-bold text-blue-500 inline-block w-32 sm:w-33 md:w-34 lg:w-35">
                      사물함 번호: {task.lockId}
                    </span>{" "}
                    을 작업 중입니다 {animatedDots}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading data for 작업 대기열...</p>
            )}
          </div>
        </div>
      </div>

      {/* Home button at the bottom */}
      <HomeLinkWrapper onClick={() => router.push("/")}>
        <FaHome size={32} color="#969A9D" />
        <HomeText>홈으로</HomeText>
      </HomeLinkWrapper>

      {/* Updated scrollbar styling using the new scroll2 design */}
      <style jsx global>{`
        .scroll2::-webkit-scrollbar {
          width: 5px;
        }
        
        .scroll2::-webkit-scrollbar-thumb {
          background: #666;
        }
        
        /* Optional: customize the scrollbar track if desired */
        .scroll2::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
      `}</style>
    </div>
  );
}

// Styled components for the Home button
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
