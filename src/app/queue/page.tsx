"use client";

import { useEffect, useState, useRef } from 'react';

// Define the type for each task from the API
interface Task {
  taskQueueId: number;
  lockId: number;
  requestType: string;
}

export default function QueuePage() {
  // State to hold tasks currently in 작업 대기열
  const [taskQueue, setTaskQueue] = useState<Task[]>([]);
  // State to hold disappeared lockIds in 수령 대기열 (latest first, up to 5)
  const [receiptQueue, setReceiptQueue] = useState<number[]>([]);
  // State for storing potential fetch errors
  const [error, setError] = useState<string | null>(null);

  // useRef to store the previous fetched tasks so we can compare on each update
  const prevTasksRef = useRef<Task[]>([]);

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
        // We remove any lockId that might have reappeared (if any) from the previous receipt list
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
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Unknown error");
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
      {/* 수령 대기열 Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold">수령 대기열</h2>
        <hr className="my-2" />
        <div className="border border-gray-300 p-4">
          {receiptQueue.length > 0 ? (
            <ul>
              {receiptQueue.map((lockId) => (
                <li key={lockId}>Lock ID: {lockId}</li>
              ))}
            </ul>
          ) : (
            <p>No completed lock IDs.</p>
          )}
        </div>
      </section>

      {/* 작업 대기열 Section */}
      <section>
        <h2 className="text-2xl font-bold">작업 대기열</h2>
        <hr className="my-2" />
        <div className="border border-gray-300 p-4">
          {error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : taskQueue.length > 0 ? (
            <ul>
              {taskQueue.map((task) => (
                <li key={task.taskQueueId}>Lock ID: {task.lockId}</li>
              ))}
            </ul>
          ) : (
            <p>Loading data for 작업 대기열...</p>
          )}
        </div>
      </section>
    </div>
  );
}
