"use client";

import { useEffect, useState } from 'react';

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function QueuePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://i12a207.p.ssafy.io:8080/api/robot-tasks/process');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: ApiResponse = await response.json();
        setData(json);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Unknown error");
      }
    }
    
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* 수령 대기열 Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold">수령 대기열</h2>
        <hr className="my-2" />
        <div className="border border-gray-300 p-4">
          <p>짐이 도착한 고객의 전화번호</p>
        </div>
      </section>

      {/* 작업 대기열 Section */}
      <section>
        <h2 className="text-2xl font-bold">작업 대기열</h2>
        <hr className="my-2" />
        <div className="border border-gray-300 p-4">
          {error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : data ? (
            <p>{data.message}</p>
          ) : (
            <p>Loading data for 작업 대기열...</p>
          )}
        </div>
      </section>
    </div>
  );
}
