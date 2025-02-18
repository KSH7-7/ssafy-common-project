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
  // useRef to hold the worker instance
  const workerRef = useRef<Worker | null>(null);

  // Animated dots state for the label in 작업 대기열
  const dotSequence = [".", "..", "..."]; // . -> .. -> ... -> .
  const [dotIndex, setDotIndex] = useState(0);
  const animatedDots = dotSequence[dotIndex];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotIndex((prevIndex) => (prevIndex + 1) % dotSequence.length);
    }, 500); // update every 500ms
    return () => clearInterval(intervalId);
  }, [dotSequence.length]);

  // Set up the web worker
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Worker' in window) {
      // Create worker instance
      workerRef.current = new Worker('/worker.js');

      // Set up message handler for worker
      workerRef.current.onmessage = (event) => {
        const { type, data, lockIds } = event.data;

        if (type === 'getSuccess' || type === 'retrieveTasks') {
          // Filter only Retrieve tasks for the task queue
          const retrieveTasks = data.filter((task: Task) => task.requestType === 'Retrieve');
          setTaskQueue(retrieveTasks);
          
          // Check for disappeared tasks
          const newLockIds = retrieveTasks.map((task: Task) => task.lockId);
          const prevRetrieveTasks = prevTasksRef.current.filter(task => task.requestType === 'Retrieve');
          const prevLockIds = prevRetrieveTasks.map(task => task.lockId);
          
          const disappeared = prevLockIds.filter(lockId => !newLockIds.includes(lockId));
          
          if (disappeared.length > 0) {
            console.log('Tasks disappeared:', disappeared);
            setReceiptQueue(current => {
              // Filter out any lockIds that may have reappeared
              const filteredCurrent = current.filter(lockId => !newLockIds.includes(lockId));
              // Add new disappeared lockIds, avoiding duplicates
              const newDisappeared = disappeared.filter(lockId => !filteredCurrent.includes(lockId));
              return [...newDisappeared, ...filteredCurrent].slice(0, 5);
            });
          }
          
          // Update the reference for next comparison
          prevTasksRef.current = data;
        } 
        else if (type === 'tasksCompleted' && lockIds && lockIds.length > 0) {
          console.log('Completed tasks with lockIds:', lockIds);
          // Add completed task lockIds to the receipt queue
          setReceiptQueue(current => {
            // Filter out duplicates - added explicit number type to lockId parameter
            const newLockIds = (lockIds as number[]).filter((lockId: number) => !current.includes(lockId));
            return [...newLockIds, ...current].slice(0, 5);
          });
        }
        else if (type === 'error') {
          setError(event.data.error);
        }
      };

      // Start fetching
      workerRef.current.postMessage('startFetching');

      // Clean up on unmount
      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
        }
      };
    }
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
                {receiptQueue.map((lockId, index) => (
                  <li key={`${lockId}-${index}`} className="py-2 border-b border-gray-200 last:border-0">
                    <span className="font-bold text-green-500">
                      사물함 {lockId}번
                    </span>{" "}
                    작업이 완료되었습니다
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                작업 완료된 사물함이 없습니다
              </p>
            )}
          </div>
        </div>

        {/* 작업 대기열 Section */}
        <div className="flex flex-col h-[35vh] md:h-[65vh]">
          <h2 className="text-2xl font-bold">작업 대기열</h2>
          <hr className="my-2" />
          <div className="flex-1 border border-gray-300 p-4 bg-white shadow-lg rounded overflow-y-auto scroll2">
            {error ? (
              <p className="text-red-600">오류: {error}</p>
            ) : taskQueue.length > 0 ? (
              <ul>
                {taskQueue.map((task) => (
                  <li key={task.taskQueueId} className="py-2 border-b border-gray-200 last:border-0">
                    <span className="font-bold text-blue-500 inline-block w-32">
                      사물함 번호: {task.lockId}
                    </span>{" "}
                    을 작업 중입니다 {animatedDots}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                작업 대기열이 비어 있습니다
              </p>
            )}
          </div>
        </div>
      </div>

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